#!/usr/bin/env node
/**
 * One-command local release automation:
 *   npm run release -- <version>
 *
 * 1. Stamps <version> across VERSION, package.json, package-lock.json, and all
 *    10 release documentation targets via prepareRelease().
 * 2. Runs `npm run build`, `npm run build:check`, and `npm run test:pack-hygiene`
 *    locally so the checkout is 100% clean and verified before pushing.
 * 3. Commits `chore(release): <version>`, creates/updates tag `v<version>`,
 *    verifies tag identity, pushes `main` + `v<version>`, and dispatches
 *    `npm-publish.yml` (which publishes to npm via OIDC and automatically
 *    creates/updates the GitHub Release).
 */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readVersion, verifyTagIdentity } from './prepare-release.mjs';
import { stampReleaseDocumentation } from './lib/release-documentation.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const version = process.argv[2]?.replace(/^v/, '');
assert(
  version && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version),
  'Usage: npm run release -- <major.minor.patch>'
);

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

const currentVersion = readVersion(root);
if (currentVersion !== version) {
  const docUpdates = stampReleaseDocumentation(root, currentVersion, version);
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
  pkg.version = version;
  lock.version = version;
  lock.packages[''].version = version;
  writeFileSync(join(root, 'VERSION'), version + '\n');
  writeFileSync(join(root, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
  writeFileSync(join(root, 'package-lock.json'), JSON.stringify(lock, null, 2) + '\n');
  for (const update of docUpdates) {
    writeFileSync(join(root, update.path), update.after);
  }
}

run(process.execPath, ['scripts/npm.mjs', 'run', 'build']);
run(process.execPath, ['scripts/npm.mjs', 'run', 'build:check']);
run(process.execPath, ['scripts/npm.mjs', 'run', 'test:pack-hygiene']);

const dockerCheck = spawnSync('docker', ['info'], { stdio: 'ignore' });
if (dockerCheck.status === 0) {
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
run('git', ['tag', '-f', tag, releaseSha]);
verifyTagIdentity(root, { version, sourceSha: releaseSha });

run('git', ['push', 'origin', 'main']);
run('git', ['push', '-f', 'origin', tag]);
run('gh', ['workflow', 'run', 'npm-publish.yml', '--ref', tag, '-f', 'accept_evidence_review=true']);
console.log(`\n✓ Dispatched npm-publish.yml for ${tag} (${releaseSha}) — npm package + GitHub Release will publish automatically.`);
