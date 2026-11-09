#!/usr/bin/env node
import assert from 'node:assert/strict';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REQUIRED_CI_CHECKS,
  evaluateCiChecks,
  verifyActFastGatesAttestation,
  verifyActShardAttestation,
} from './lib/ci-check-gate.mjs';
import { selectSuites } from '../_audit/ci/lib/run-unit-suite.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

export function parseVerifyCiArgs(args) {
  const out = {
    mode: null,
    sha: null,
    repo: null,
    shard: null,
    wait: false,
    pollMs: 15000,
    timeoutMs: 55 * 60 * 1000,
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--verify-commit') {
      assert(!out.mode, 'Choose one mode');
      out.mode = 'verify-commit';
    } else if (arg === '--check-act-shard') {
      assert(!out.mode, 'Choose one mode');
      out.mode = 'check-act-shard';
      out.shard = args[++i];
      assert(out.shard && /^[1-9]\d*\/[1-9]\d*$/.test(out.shard), 'Invalid --check-act-shard value');
    } else if (arg === '--check-act-fast-gates') {
      assert(!out.mode, 'Choose one mode');
      out.mode = 'check-act-fast-gates';
    } else if (arg === '--sha') {
      out.sha = args[++i];
      assert(out.sha && /^[a-f0-9]{40}$/.test(out.sha), 'Invalid 40-hex --sha');
    } else if (arg === '--repo') {
      out.repo = args[++i];
      assert(out.repo && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(out.repo), 'Invalid --repo owner/name');
    } else if (arg === '--wait') {
      out.wait = true;
    } else if (arg === '--poll-ms') {
      out.pollMs = Number(args[++i]);
      assert(Number.isFinite(out.pollMs) && out.pollMs >= 100, 'Invalid --poll-ms');
    } else if (arg === '--timeout-ms') {
      out.timeoutMs = Number(args[++i]);
      assert(Number.isFinite(out.timeoutMs) && out.timeoutMs >= 100, 'Invalid --timeout-ms');
    } else {
      throw Error(`Unknown argument: ${arg}`);
    }
  }
  assert(out.mode, 'Specify --verify-commit, --check-act-shard <N/M>, or --check-act-fast-gates');
  assert(out.sha, '--sha <40-hex> is required');
  assert(out.repo, '--repo <owner/name> is required');
  return out;
}

async function githubApiGet(path, token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'cyberskill-design-ci-gate',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw Error(`GitHub API ${path} HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  return res.json();
}

export async function waitForRequiredCiChecks({
  repo,
  sha,
  wait = false,
  pollMs = 15000,
  timeoutMs = 55 * 60 * 1000,
  requiredChecks = REQUIRED_CI_CHECKS,
  fetchCheckRuns = async () => {
    const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
    const data = await githubApiGet(`/repos/${repo}/commits/${sha}/check-runs?per_page=100`, token);
    assert(data && Array.isArray(data.check_runs), 'Malformed check-runs API response');
    return data.check_runs;
  },
  sleep = ms => new Promise(r => setTimeout(r, ms)),
  now = () => Date.now(),
} = {}) {
  const deadline = now() + timeoutMs;
  let graceRetries = 8; // Wait up to ~2 minutes if workflow check-runs are still registering on push
  while (true) {
    const checkRuns = await fetchCheckRuns();
    const verdict = evaluateCiChecks({ checkRuns, requiredChecks });
    if (verdict.state === 'failed') {
      throw Error(
        `Required CI checks failed on ${sha}: ${verdict.failed.map(f => `${f.name} (${f.conclusion})`).join(', ')}`
      );
    }
    if (verdict.state === 'passed') {
      return verdict;
    }
    if (!wait) {
      throw Error(
        `Required CI checks incomplete on ${sha}: missing=[${verdict.missing.join(', ')}] pending=[${verdict.pending.map(p => `${p.name}:${p.status}`).join(', ')}]`
      );
    }
    if (verdict.passed.length === 0 && verdict.pending.length === 0 && graceRetries <= 0) {
      throw Error(`No required CI check-runs registered on ${sha} after startup grace window`);
    }
    if (verdict.passed.length === 0 && verdict.pending.length === 0) {
      graceRetries--;
    }
    if (now() + pollMs > deadline) {
      throw Error(
        `Timed out waiting for required CI checks on ${sha}: missing=[${verdict.missing.join(', ')}] pending=[${verdict.pending.map(p => `${p.name}:${p.status}`).join(', ')}]`
      );
    }
    console.log(
      `[ci-gate] Waiting for CI on ${sha.slice(0, 8)}: ${verdict.passed.length}/${verdict.requiredCount} passed, ${verdict.pending.length} pending, ${verdict.missing.length} registering...`
    );
    await sleep(pollMs);
  }
}

async function runCheckActShard({ repo, sha, shard }) {
  try {
    const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
    const treeRes = spawnSync('git', ['rev-parse', '--verify', 'HEAD^{tree}'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(treeRes.status, 0, treeRes.stderr);
    const treeSha = treeRes.stdout.trim();

    const registry = JSON.parse(readFileSync(join(root, '_audit/ci/unit-suites.json'), 'utf8'));
    const planBytes = readFileSync(join(root, '_audit/ci/unit-shard-plan.json'));
    const plan = JSON.parse(planBytes);
    const planSha256 = createHash('sha256').update(planBytes).digest('hex');
    const selected = selectSuites(registry, shard, plan);

    let check = { verified: false, reason: 'uninitialized' };
    // Poll briefly (up to 6 × 4s = 24s) so `git push` followed immediately by
    // `npm run ci:act -- --post-status` does not race the runner's checkout step.
    for (let attempt = 0; attempt < 6; attempt++) {
      const statuses = await githubApiGet(`/repos/${repo}/commits/${sha}/statuses?per_page=100`, token);
      assert(Array.isArray(statuses), 'Malformed statuses response');
      check = verifyActShardAttestation({
        statuses,
        shard,
        treeSha,
        planSha256,
        expectedSuiteIds: selected.map(s => s.id),
      });
      if (check.verified) break;
      if (attempt < 5 && check.reason?.startsWith('No ci/act/')) {
        await new Promise(r => setTimeout(r, 4000));
      } else {
        break;
      }
    }

    if (!check.verified) {
      console.log(`[act-shard] Local act fast-path not active for ${shard}: ${check.reason}`);
      return;
    }

    const tempDir = process.env.RUNNER_TEMP || tmpdir();
    const receiptPath = join(tempDir, `act-shard-receipt-${shard.replace('/', '-')}.json`);
    writeFileSync(receiptPath, JSON.stringify(check.receipt, null, 2) + '\n', { mode: 0o600 });
    if (process.env.GITHUB_ENV) {
      appendFileSync(process.env.GITHUB_ENV, `CS_ACT_SHARD_RECEIPT=${receiptPath}\n`);
    }
    console.log(
      `[act-shard] Verified commit-bound local act attestation for ${shard} (tree=${treeSha.slice(0, 12)}, suites=${selected.length})`
    );
  } catch (err) {
    console.log(`[act-shard] Falling back to full shard execution (${err.message})`);
  }
}

async function runCheckActFastGates({ repo, sha }) {
  try {
    const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
    const treeRes = spawnSync('git', ['rev-parse', '--verify', 'HEAD^{tree}'], {
      cwd: root,
      encoding: 'utf8',
    });
    assert.equal(treeRes.status, 0, treeRes.stderr);
    const treeSha = treeRes.stdout.trim();

    const pixelBytes = readFileSync(join(root, '_audit/ci/pixel-diff-report.json'));
    const pixelReport = JSON.parse(pixelBytes);
    assert.equal(pixelReport.failed, 0, 'pixel-diff-report.json has non-zero failed count');
    const pixelReportSha256 = createHash('sha256').update(pixelBytes).digest('hex');

    let check = { verified: false, reason: 'uninitialized' };
    for (let attempt = 0; attempt < 6; attempt++) {
      const statuses = await githubApiGet(`/repos/${repo}/commits/${sha}/statuses?per_page=100`, token);
      assert(Array.isArray(statuses), 'Malformed statuses response');
      check = verifyActFastGatesAttestation({
        statuses,
        treeSha,
        pixelReportSha256,
      });
      if (check.verified) break;
      if (attempt < 5 && check.reason?.startsWith('No ci/act/')) {
        await new Promise(r => setTimeout(r, 4000));
      } else {
        break;
      }
    }

    if (!check.verified) {
      console.log(`[act-fast-gates] Local act fast-path not active: ${check.reason}`);
      return;
    }

    const tempDir = process.env.RUNNER_TEMP || tmpdir();
    const receiptPath = join(tempDir, 'act-fast-gates-receipt.json');
    writeFileSync(receiptPath, JSON.stringify(check.receipt, null, 2) + '\n', { mode: 0o600 });
    if (process.env.GITHUB_ENV) {
      appendFileSync(process.env.GITHUB_ENV, `CS_ACT_FAST_GATES_RECEIPT=${receiptPath}\n`);
    }
    console.log(
      `[act-fast-gates] Verified commit-bound local act attestation for fast-gates (tree=${treeSha.slice(0, 12)}, pixel=${pixelReportSha256.slice(0, 12)})`
    );
  } catch (err) {
    console.log(`[act-fast-gates] Falling back to full fast-gates execution (${err.message})`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const opts = parseVerifyCiArgs(process.argv.slice(2));
    if (opts.mode === 'verify-commit') {
      const verdict = await waitForRequiredCiChecks(opts);
      console.log(
        JSON.stringify({
          verifiedCommitCi: true,
          sha: opts.sha,
          repo: opts.repo,
          passedCount: verdict.passed.length,
          checks: verdict.passed,
        })
      );
    } else if (opts.mode === 'check-act-shard') {
      await runCheckActShard(opts);
    } else if (opts.mode === 'check-act-fast-gates') {
      await runCheckActFastGates(opts);
    }
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  }
}
