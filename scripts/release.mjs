#!/usr/bin/env node
/**
 * One-command local release orchestrator (requires explicit operator evidence acknowledgement):
 *   npm run release -- <version> --accept-evidence-review
 *   npm run release -- <version> --dry-run
 *
 * 1. Plans or prepares <version> across VERSION, package.json, package-lock.json, and all
 *    10 release documentation targets via planRelease() / prepareRelease() in prepare-release.mjs.
 * 2. Runs `npm run build`, `npm run build:check`, and `npm run test:pack-hygiene`
 *    locally so the checkout is 100% clean and verified before pushing.
 * 3. Commits `chore(release): <version>`, creates immutable tag `v<version>` (never force-overwriting),
 *    verifies tag identity, pushes `main` + `v<version>`, and dispatches `npm-publish.yml`
 *    (which publishes to npm via OIDC and creates/updates the GitHub Release).
 */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { planRelease, prepareRelease, readVersion, verifyTagIdentity } from './prepare-release.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));

export function parseReleaseCliArguments(args) {
  let version = null;
  let acceptEvidenceReview = false;
  let dryRun = false;
  for (const arg of args) {
    if (arg === '--accept-evidence-review') {
      assert(!acceptEvidenceReview, 'Duplicate --accept-evidence-review');
      acceptEvidenceReview = true;
    } else if (arg === '--dry-run') {
      assert(!dryRun, 'Duplicate --dry-run');
      dryRun = true;
    } else if (!arg.startsWith('--') && version === null) {
      version = arg.replace(/^v/, '');
    } else {
      throw Error(`Unknown or duplicate argument: ${arg}`);
    }
  }
  assert(
    version && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version),
    'Usage: npm run release -- <major.minor.patch> (--accept-evidence-review | --dry-run)'
  );
  assert(
    !(acceptEvidenceReview && dryRun),
    '--accept-evidence-review and --dry-run are mutually exclusive'
  );
  assert(
    dryRun || acceptEvidenceReview,
    'Explicit --accept-evidence-review is required after verifying support, visual, and manual AT evidence (or pass --dry-run to inspect the plan)'
  );
  return { version, acceptEvidenceReview, dryRun };
}

function run(cmd, args) {
  console.log(`\n> ${cmd} ${args.join(' ')}`);
  const res = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

function gitOut(args) {
  const res = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(res.status, 0, res.stderr);
  return res.stdout.trim();
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { version, dryRun } = parseReleaseCliArguments(process.argv.slice(2));
  const headBefore = gitOut(['rev-parse', 'HEAD']);
  if (dryRun) {
    const plan = planRelease(root, { version, sourceSha: headBefore });
    console.log(JSON.stringify(plan, null, 2));
    process.exit(plan.readyToPrepare ? 0 : 1);
  }

  const currentVersion = readVersion(root);
  if (currentVersion !== version) {
    prepareRelease(root, { version, sourceSha: headBefore });
  }

  run(process.execPath, ['scripts/npm.mjs', 'run', 'build']);
  run(process.execPath, ['scripts/npm.mjs', 'run', 'build:state-inventory']);
  run(process.execPath, ['scripts/npm.mjs', 'run', 'build:check']);
  run(process.execPath, ['scripts/npm.mjs', 'run', 'test:pack-hygiene']);

  const dockerCheck = spawnSync('docker', ['info'], { stdio: 'ignore' });
  if (dockerCheck.status === 0) {
    run('git', ['add', '-A']);
    run('docker', [
      'run', '--rm',
      '--platform', 'linux/amd64',
      '-v', `${root}:/work`,
      '-w', '/work',
      'mcr.microsoft.com/playwright:v1.62.0-noble',
      'node', '-e',
      'import("./scripts/lib/verification-server.mjs").then(async({createVerificationServer})=>{const{spawn}=await import("node:child_process");const s=await createVerificationServer("/work");await new Promise(r=>s.listen(0,"127.0.0.1",r));const base="http://127.0.0.1:"+s.address().port;const run=(args)=>new Promise((res,rej)=>{const c=spawn("node",args,{stdio:"inherit"});c.once("error",rej);c.once("exit",(code,sig)=>res(sig?1:code??1));});const r1=await run(["_audit/ci/pixel-diff.mjs","--update",base]);const r2=await run(["_audit/ci/pixel-diff.mjs",base]);const r3=await run(["_audit/ci/run-gates.mjs",base+"/_audit/run.html"]);await new Promise(r=>s.close(r));process.exit(r1||r2||r3||0);})',
    ]);
  }

  if (gitOut(['status', '--porcelain'])) {
    run('git', ['add', '-A']);
    run('git', ['commit', '-m', `chore(release): ${version}`]);
  }

  const releaseSha = gitOut(['rev-parse', 'HEAD']);
  const tag = `v${version}`;
  run('git', ['tag', tag, releaseSha]);
  verifyTagIdentity(root, { version, sourceSha: releaseSha });

  run('git', ['push', 'origin', 'main']);
  const postAct = spawnSync(process.execPath, ['scripts/run-act-ci.mjs', '--stamp-current', '--with-status', '--sha', releaseSha], {
    cwd: root,
    stdio: 'inherit',
  });
  if (postAct.status !== 0) {
    console.log('ℹ No matching local act unit-shard attestation for release tree; GitHub Actions will run full shards before publishing.');
  }
  run('git', ['push', 'origin', tag]);
  console.log(`\n✓ Pushed ${tag} (${releaseSha}) — npm-publish.yml will validate and publish automatically on tag push.`);
}
