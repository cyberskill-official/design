import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
export function assertNpmVersion(pkg, version) {
  const match = /^npm@(\d+\.\d+\.\d+)$/.exec(pkg.packageManager ?? '');
  assert(match, 'packageManager must pin an exact npm version');
  assert.equal(version.trim(), match[1], 'Use the pinned npm CLI; run npm ci --prefix _audit/ci/fixtures/npm-cli --ignore-scripts and use its node_modules/.bin on PATH');
  return match[1];
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const cli = process.argv[2] || process.env.npm_execpath;
  assert(cli, 'Invoke through npm or pass the npm CLI path explicitly');
  const result = spawnSync(process.execPath, [cli, '--version'], {encoding:'utf8'});
  assert.equal(result.status, 0, 'npm version query failed: ' + result.stderr);
  console.log('PASS pinned npm ' + assertNpmVersion(pkg, result.stdout));
}
