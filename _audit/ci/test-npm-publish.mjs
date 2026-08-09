/**
 * Unit tests for npm-publish error classifier + registry presence helper
 * (no network; spawn is stubbed for presence checks).
 */
import {
  classifyNpmPublishError,
  isSoftSkippableNpmError,
  preferOidcPublish,
  assertRegistryPresence,
} from './npm-publish.mjs';

function assert(c, m) {
  if (!c) throw new Error(m || 'assert failed');
}

// Soft-skip: expected no-ops
assert(classifyNpmPublishError('npm ERR! code ENEEDAUTH').kind === 'soft_skip', 'ENEEDAUTH soft');
assert(classifyNpmPublishError('npm ERR! need auth').reason === 'need_auth', 'need auth soft');
assert(classifyNpmPublishError('npm ERR! code EPUBLISHCONFLICT').kind === 'soft_skip', 'conflict soft');
assert(classifyNpmPublishError('Cannot publish over existing version').reason === 'already_published', 'already published');
assert(classifyNpmPublishError('npm ERR! 404 Not Found - PUT').kind === 'soft_skip', '404 soft');
assert(classifyNpmPublishError('npm ERR! 402 Payment Required').kind === 'soft_skip', '402 soft');
assert(isSoftSkippableNpmError('npm ERR! code ENEEDAUTH'), 'isSoft ENEEDAUTH');
assert(isSoftSkippableNpmError('npm ERR! code EPUBLISHCONFLICT'), 'isSoft conflict');

// Hard-fail: 403 / EOTP (FIND-020)
assert(classifyNpmPublishError('npm error code EOTP').kind === 'hard_fail', 'EOTP hard');
assert(classifyNpmPublishError('npm error code EOTP').reason === 'eotp', 'EOTP reason');
assert(classifyNpmPublishError('This operation requires a one-time password').kind === 'hard_fail', 'OTP text hard');
assert(classifyNpmPublishError('npm ERR! 403 Forbidden - PUT').kind === 'hard_fail', '403 hard');
assert(classifyNpmPublishError('npm ERR! 403 Forbidden - PUT').reason === 'forbidden_403', '403 reason');
assert(!isSoftSkippableNpmError('npm error code EOTP'), 'isSoft EOTP false');
assert(!isSoftSkippableNpmError('npm ERR! 403 Forbidden'), 'isSoft 403 false');

// Unknown → not soft
assert(classifyNpmPublishError('ENOTFOUND weird').kind === 'unknown', 'unknown kind');
assert(!isSoftSkippableNpmError('ENOTFOUND weird'), 'unknown not soft');

// OIDC prefer
assert(preferOidcPublish({ GITHUB_ACTIONS: 'true' }), 'OIDC when GHA and no token');
assert(!preferOidcPublish({ GITHUB_ACTIONS: 'true', NPM_TOKEN: 'x' }), 'token wins over OIDC prefer');
assert(!preferOidcPublish({}), 'no OIDC locally without GHA');

// Registry presence helper (stubbed spawn)
const okSpawn = () => ({ status: 0, stdout: '"1.2.3"\n', stderr: '' });
const presence = assertRegistryPresence({
  name: '@cyberskill/design',
  version: '1.2.3',
  spawn: okSpawn,
});
assert(presence.ok && presence.spec === '@cyberskill/design@1.2.3', 'presence ok');

let threw = false;
try {
  assertRegistryPresence({
    name: '@cyberskill/design',
    version: '1.2.3',
    spawn: () => ({ status: 1, stdout: '', stderr: 'npm ERR! 404 Not Found\n' }),
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
    spawn: () => ({ status: 0, stdout: '"9.9.9"\n', stderr: '' }),
  });
} catch (e) {
  mismatch = /expected @cyberskill\/design@1\.2\.3/.test(String(e.message || e));
}
assert(mismatch, 'presence fails on version mismatch');

console.log('PASS test-npm-publish', {
  soft: ['ENEEDAUTH', 'EPUBLISHCONFLICT', '404', '402'],
  hard: ['EOTP', '403'],
});
