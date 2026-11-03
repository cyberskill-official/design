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
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { prepareRelease, verifyTagIdentity } from './prepare-release.mjs';

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

const headBefore = gitOut(['rev-parse', 'HEAD']);
prepareRelease(root, { version, sourceSha: headBefore });

run(process.execPath, ['scripts/npm.mjs', 'run', 'build']);
run(process.execPath, ['scripts/npm.mjs', 'run', 'build:check']);
run(process.execPath, ['scripts/npm.mjs', 'run', 'test:pack-hygiene']);

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
