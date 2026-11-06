#!/usr/bin/env node
/**
 * Local heavy-CI runner & commit-bound attestation producer:
 *   npm run ci:act                                  # Run all 4 unit-test shards locally & write test-results/act-unit-attestation.json
 *   npm run ci:act -- --post-status                 # Post verified ci/act/unit-tests (1/4..4/4) statuses to GitHub for HEAD
 *   npm run ci:act -- --act-job <job-name>          # Run a job from .github/workflows/design-system-gates.yml inside `act`
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { formatActShardStatus } from './lib/ci-check-gate.mjs';
import { selectSuites } from '../_audit/ci/lib/run-unit-suite.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const ATTESTATION_PATH = join(root, 'test-results/act-unit-attestation.json');
const ALL_SHARDS = ['1/4', '2/4', '3/4', '4/4'];

export function parseActCliArgs(args) {
  const out = {
    actJob: null,
    postStatusOnly: false,
    postStatusAfterRun: false,
    sha: null,
    repo: 'cyberskill-official/design',
    shards: [...ALL_SHARDS],
    concurrency: 2,
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--act-job') {
      out.actJob = args[++i];
      assert(out.actJob && /^[a-z0-9-]+$/.test(out.actJob), 'Invalid --act-job name');
    } else if (arg === '--post-status') {
      out.postStatusOnly = true;
    } else if (arg === '--with-status') {
      out.postStatusAfterRun = true;
    } else if (arg === '--sha') {
      out.sha = args[++i];
      assert(out.sha && /^[a-f0-9]{40}$/.test(out.sha), 'Invalid 40-hex --sha');
    } else if (arg === '--repo') {
      out.repo = args[++i];
      assert(out.repo && /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(out.repo), 'Invalid --repo');
    } else if (arg === '--shards') {
      const raw = args[++i];
      assert(raw, 'Missing --shards value');
      out.shards = raw.split(',').map(s => s.trim());
      for (const s of out.shards) assert(ALL_SHARDS.includes(s), `Unsupported shard: ${s}`);
    } else if (arg === '--concurrency') {
      out.concurrency = Number(args[++i]);
      assert(Number.isInteger(out.concurrency) && out.concurrency >= 1 && out.concurrency <= 4, 'Invalid --concurrency (1..4)');
    } else {
      throw Error(`Unknown argument: ${arg}`);
    }
  }
  return out;
}

function gitOut(args) {
  const res = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(res.status, 0, res.stderr);
  return res.stdout.trim();
}

function runActWorkflowJob(jobName) {
  const actCheck = spawnSync('act', ['--version'], { cwd: root, encoding: 'utf8' });
  assert.equal(actCheck.status, 0, 'act is not installed or not on PATH (brew install act)');
  console.log(
    `> act -W .github/workflows/design-system-gates.yml -j ${jobName} -P ubuntu-24.04=-self-hosted -P ubuntu-latest=-self-hosted`
  );
  const res = spawnSync(
    'act',
    [
      '-W',
      '.github/workflows/design-system-gates.yml',
      '-j',
      jobName,
      '-P',
      'ubuntu-24.04=-self-hosted',
      '-P',
      'ubuntu-latest=-self-hosted',
    ],
    { cwd: root, stdio: 'inherit' }
  );
  if (res.status !== 0) process.exit(res.status ?? 1);
}

function runShardWorker(shard) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(
      process.execPath,
      ['_audit/ci/lib/run-unit-suite.mjs'],
      {
        cwd: root,
        stdio: 'inherit',
        env: {
          ...process.env,
          CS_UNIT_SHARD: shard,
          CS_UNIT_PLAN: '_audit/ci/unit-shard-plan.json',
        },
      }
    );
    child.once('error', rejectPromise);
    child.once('exit', (code, sig) => {
      if (code === 0 && !sig) resolvePromise();
      else rejectPromise(new Error(`Unit shard ${shard} failed (exit=${code}, sig=${sig})`));
    });
  });
}

async function runLocalUnitShards({ shards, concurrency }) {
  const treeSha = gitOut(['rev-parse', '--verify', 'HEAD^{tree}']);
  const headSha = gitOut(['rev-parse', '--verify', 'HEAD']);
  const registry = JSON.parse(readFileSync(join(root, '_audit/ci/unit-suites.json'), 'utf8'));
  const planBytes = readFileSync(join(root, '_audit/ci/unit-shard-plan.json'));
  const plan = JSON.parse(planBytes);
  const planSha256 = createHash('sha256').update(planBytes).digest('hex');

  const queue = [...shards];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const shard = queue.shift();
      console.log(`\n[ci:act] Starting local shard ${shard}...`);
      await runShardWorker(shard);
    }
  });
  await Promise.all(workers);

  const shardRecords = {};
  for (const shard of ALL_SHARDS) {
    const reportPath = join(root, 'test-results', `unit-${shard.replace('/', '-')}`, 'unit-results.json');
    assert(existsSync(reportPath), `Missing unit report for shard ${shard} at ${reportPath}`);
    const report = JSON.parse(readFileSync(reportPath, 'utf8'));
    assert.equal(report.pass, true, `Shard ${shard} report did not pass`);
    assert.equal(report.planSha256, planSha256, `Shard ${shard} planSha256 mismatch`);
    const expectedIds = selectSuites(registry, shard, plan).map(s => s.id);
    assert.deepEqual(report.selectedSuiteIds, expectedIds, `Shard ${shard} selectedSuiteIds mismatch`);
    shardRecords[shard] = {
      suiteCount: expectedIds.length,
      pass: true,
    };
  }

  mkdirSync(join(root, 'test-results'), { recursive: true });
  const attestation = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    sourceSha: headSha,
    treeSha,
    planSha256,
    shards: shardRecords,
  };
  writeFileSync(ATTESTATION_PATH, JSON.stringify(attestation, null, 2) + '\n');
  console.log(`\n✓ Wrote commit/tree-bound local act attestation to ${ATTESTATION_PATH} (tree=${treeSha.slice(0, 12)})`);
  return attestation;
}

export function postActShardStatuses({ sha, repo = 'cyberskill-official/design', attestationPath = ATTESTATION_PATH } = {}) {
  assert(existsSync(attestationPath), `No local act attestation found at ${attestationPath}`);
  const attestation = JSON.parse(readFileSync(attestationPath, 'utf8'));
  const targetSha = sha || gitOut(['rev-parse', '--verify', 'HEAD']);
  const targetTree = gitOut(['rev-parse', '--verify', `${targetSha}^{tree}`]);
  const planBytes = readFileSync(join(root, '_audit/ci/unit-shard-plan.json'));
  const currentPlanSha256 = createHash('sha256').update(planBytes).digest('hex');

  assert.equal(
    attestation.treeSha,
    targetTree,
    `Local act attestation tree (${attestation.treeSha}) does not match ${targetSha}^{tree} (${targetTree})`
  );
  assert.equal(
    attestation.planSha256,
    currentPlanSha256,
    'Local act attestation planSha256 is stale against _audit/ci/unit-shard-plan.json'
  );

  for (const shard of ALL_SHARDS) {
    const rec = attestation.shards?.[shard];
    assert(rec && rec.pass === true, `Attestation missing passing record for shard ${shard}`);
    const statusPayload = formatActShardStatus({
      shard,
      treeSha: targetTree,
      planSha256: currentPlanSha256,
      suiteCount: rec.suiteCount,
    });
    const res = spawnSync(
      'gh',
      [
        'api',
        `repos/${repo}/statuses/${targetSha}`,
        '-f',
        `state=${statusPayload.state}`,
        '-f',
        `context=${statusPayload.context}`,
        '-f',
        `description=${statusPayload.description}`,
      ],
      { cwd: root, encoding: 'utf8' }
    );
    assert.equal(res.status, 0, `Failed to post ${statusPayload.context} status: ${res.stderr}`);
    console.log(`✓ Posted ${statusPayload.context} (${statusPayload.description}) on ${targetSha.slice(0, 8)}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const opts = parseActCliArgs(process.argv.slice(2));
  if (opts.actJob) {
    runActWorkflowJob(opts.actJob);
  } else if (opts.postStatusOnly) {
    postActShardStatuses({ sha: opts.sha, repo: opts.repo });
  } else {
    await runLocalUnitShards(opts);
    if (opts.postStatusAfterRun) {
      postActShardStatuses({ sha: opts.sha, repo: opts.repo });
    }
  }
}
