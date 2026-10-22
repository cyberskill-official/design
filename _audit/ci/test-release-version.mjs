import assert from 'node:assert/strict';
import { parseReleaseVersion, compareReleaseVersions } from '../../scripts/lib/release-version.mjs';

const order = ['1.7.2', '2.0.0-alpha', '2.0.0-alpha.0', '2.0.0-alpha.2', '2.0.0-alpha.10', '2.0.0-alpha.beta', '2.0.0-beta', '2.0.0-beta.2', '2.0.0-beta.11', '2.0.0-rc.1', '2.0.0', '2.0.1'];
for (let i = 0; i < order.length; i++) {
  assert.equal(compareReleaseVersions(order[i], order[i]), 0);
  for (let j = i + 1; j < order.length; j++) {
    assert.equal(compareReleaseVersions(order[i], order[j]), -1);
    assert.equal(compareReleaseVersions(order[j], order[i]), 1);
  }
}
assert.equal(compareReleaseVersions('2.0.0-alpha.9007199254740993', '2.0.0-alpha.9007199254740992'), 1);
assert.equal(compareReleaseVersions('9007199254740993.0.0', '9007199254740992.0.0'), 1);
for (const value of ['', '1.2', 'v1.2.3', '01.2.3', '1.02.3', '1.2.03', '1.2.3-', '1.2.3-a..b', '1.2.3-01', '1.2.3-a.00', '1.2.3+a', '1.2.3;touch x', '1.2.3\n', null]) assert.throws(() => parseReleaseVersion(value));
assert.throws(() => parseReleaseVersion('2.0.0-alpha.0', { stableOnly: true }));
assert.deepEqual(parseReleaseVersion('2.0.0-alpha.0'), { core: [2n, 0n, 0n], prerelease: ['alpha', '0'] });
console.log('PASS canonical stable/prerelease identities, SemVer precedence, arbitrary precision and malformed identity rejection');
