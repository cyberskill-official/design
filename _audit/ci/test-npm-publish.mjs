/**
 * Unit tests for npm-publish error classifier + registry presence helper
 * (no network; spawn is stubbed for presence checks).
 */
import {
  classifyNpmPublishError,
  isSoftSkippableNpmError,
  preferOidcPublish,
  isGhaReleasePublish,
  assertRegistryPresence,
} from './npm-publish.mjs';

function assert(c, m) {
  if (!c) throw new Error(m || 'assert failed');
}

// Soft-skip off GHA: expected local no-ops (auth unavailable)
assert(classifyNpmPublishError('npm ERR! code ENEEDAUTH', { ghaRelease: false }).kind === 'soft_skip', 'ENEEDAUTH soft off GHA');
assert(classifyNpmPublishError('npm ERR! need auth', { ghaRelease: false }).reason === 'need_auth', 'need auth soft off GHA');
assert(classifyNpmPublishError('npm ERR! 404 Not Found - PUT', { ghaRelease: false }).kind === 'soft_skip', '404 soft off GHA');
assert(classifyNpmPublishError('npm ERR! 402 Payment Required', { ghaRelease: false }).kind === 'soft_skip', '402 soft off GHA');
assert(isSoftSkippableNpmError('npm ERR! code ENEEDAUTH', { ghaRelease: false }), 'isSoft ENEEDAUTH off GHA');

// Soft-skip always: already published
assert(classifyNpmPublishError('npm ERR! code EPUBLISHCONFLICT', { ghaRelease: true }).kind === 'soft_skip', 'conflict soft on GHA');
assert(classifyNpmPublishError('Cannot publish over existing version', { ghaRelease: false }).reason === 'already_published', 'already published');
assert(isSoftSkippableNpmError('npm ERR! code EPUBLISHCONFLICT', { ghaRelease: true }), 'isSoft conflict on GHA');

// Hard-fail on GHA release: ENEEDAUTH / 404 / 402
assert(classifyNpmPublishError('npm ERR! code ENEEDAUTH', { ghaRelease: true }).kind === 'hard_fail', 'ENEEDAUTH hard on GHA');
assert(classifyNpmPublishError('npm ERR! 404 Not Found - PUT', { ghaRelease: true }).kind === 'hard_fail', '404 hard on GHA');
assert(classifyNpmPublishError('npm ERR! 402 Payment Required', { ghaRelease: true }).kind === 'hard_fail', '402 hard on GHA');
assert(!isSoftSkippableNpmError('npm ERR! code ENEEDAUTH', { ghaRelease: true }), 'isSoft ENEEDAUTH false on GHA');

// Hard-fail always: 403 / EOTP (FIND-020)
assert(classifyNpmPublishError('npm error code EOTP', { ghaRelease: false }).kind === 'hard_fail', 'EOTP hard');
assert(classifyNpmPublishError('npm error code EOTP').reason === 'eotp', 'EOTP reason');
assert(classifyNpmPublishError('This operation requires a one-time password').kind === 'hard_fail', 'OTP text hard');
assert(classifyNpmPublishError('npm ERR! 403 Forbidden - PUT').kind === 'hard_fail', '403 hard');
assert(classifyNpmPublishError('npm ERR! 403 Forbidden - PUT').reason === 'forbidden_403', '403 reason');
assert(!isSoftSkippableNpmError('npm error code EOTP'), 'isSoft EOTP false');
assert(!isSoftSkippableNpmError('npm ERR! 403 Forbidden'), 'isSoft 403 false');

// Unknown → not soft
assert(classifyNpmPublishError('ENOTFOUND weird').kind === 'unknown', 'unknown kind');
assert(!isSoftSkippableNpmError('ENOTFOUND weird'), 'unknown not soft');

// OIDC prefer + GHA release detection
assert(preferOidcPublish({ GITHUB_ACTIONS: 'true' }), 'OIDC when GHA and no token');
assert(!preferOidcPublish({ GITHUB_ACTIONS: 'true', NPM_TOKEN: 'x' }), 'token wins over OIDC prefer');
assert(!preferOidcPublish({}), 'no OIDC locally without GHA');
assert(isGhaReleasePublish({ GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'workflow_dispatch' }), 'dispatch is release');
assert(
  isGhaReleasePublish({ GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'push', GITHUB_REF: 'refs/tags/v1.3.1' }),
  'tag push is release',
);
assert(!isGhaReleasePublish({ GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: 'pull_request' }), 'PR not release');
assert(!isGhaReleasePublish({}), 'local not release');

// Registry presence helper (stubbed spawn) — version + dist-tags.latest (FIND-094)
function makePresenceSpawn(versionOut, latestOut, opts = {}) {
  const { versionStatus = 0, latestStatus = 0, versionErr = '', latestErr = '' } = opts;
  return (cmd, args) => {
    assert(cmd === 'npm', 'spawn npm');
    if (args.includes('dist-tags.latest')) {
      return { status: latestStatus, stdout: latestOut, stderr: latestErr };
    }
    return { status: versionStatus, stdout: versionOut, stderr: versionErr };
  };
}

const presence = assertRegistryPresence({
  name: '@cyberskill/design',
  version: '1.2.3',
  spawn: makePresenceSpawn('"1.2.3"\n', '"1.2.3"\n'),
});
assert(presence.ok && presence.spec === '@cyberskill/design@1.2.3' && presence.latest === '1.2.3', 'presence ok');

let threw = false;
try {
  assertRegistryPresence({
    name: '@cyberskill/design',
    version: '1.2.3',
    spawn: makePresenceSpawn('', '', { versionStatus: 1, versionErr: 'npm ERR! 404 Not Found\n' }),
  });
} catch (e) {
  threw = /post-publish registry check failed/.test(String(e.message || e));
}
assert(threw, 'presence fails on npm view non-zero');

let mismatch = false;
try {
  assertRegistryPresence({
    name: '@cyberskill/design',
    version: '1.2.3',
    spawn: makePresenceSpawn('"9.9.9"\n', '"9.9.9"\n'),
  });
} catch (e) {
  mismatch = /expected @cyberskill\/design@1\.2\.3/.test(String(e.message || e));
}
assert(mismatch, 'presence fails on version mismatch');

let latestMismatch = false;
try {
  assertRegistryPresence({
    name: '@cyberskill/design',
    version: '1.3.1',
    spawn: makePresenceSpawn('"1.3.1"\n', '"1.2.0"\n'),
  });
} catch (e) {
  latestMismatch = /dist-tags\.latest check: expected 1\.3\.1/.test(String(e.message || e));
}
assert(latestMismatch, 'presence fails when latest ≠ VERSION');

console.log('PASS test-npm-publish', {
  soft: ['already_published', 'ENEEDAUTH/404/402 off-GHA'],
  hard: ['EOTP', '403', 'ENEEDAUTH/404/402 on-GHA-release'],
  latest: 'asserted',
});
