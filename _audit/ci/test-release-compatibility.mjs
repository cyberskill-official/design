import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { compatibilityBlockers, validateCompatibilityRegistry } from '../../scripts/lib/release-compatibility.mjs';
const actual = JSON.parse(readFileSync('components/release-compatibility.json'));
const actualCheck = proposedVersion => compatibilityBlockers('.', '1.7.2', proposedVersion, { registry: actual, today: '2026-10-20' });
const history = JSON.parse(readFileSync('_audit/remediation/segmented-role-removal-proposal-history.json'));
assert.equal(createHash('sha256').update(history.sourceBytes).digest('hex'), history.sourceSha256, 'Archived original registry retains exact bytes');
const previous = JSON.parse(history.sourceBytes);
assert.deepEqual(previous.pendingChanges.find(change => change.id === 'remove-segmented-role-override'), history.archivedProposal);
assert.deepEqual(previous.deprecations.find(notice => notice.id === 'segmented-role-override'), history.originalNotice);
assert.equal(history.originalNotice.announcedAt, null);
assert.equal(history.originalNotice.announcedVersion, null);
assert(!actual.pendingChanges.some(change => change.id === 'remove-segmented-role-override'), 'Retained API is not a current removal');
assert(actual.pendingChanges.some(change => change.id === 'segmented-role-alias-validation' && change.kind === 'breaking'), 'Rejecting arbitrary roles remains conservatively major-gated');
assert.deepEqual(actualCheck('2.0.0'), [], 'Retaining the alias withdraws only the unannounced current removal proposal');
assert.deepEqual(actualCheck('2.0.0-alpha.0'), [], 'Alpha compatibility classification does not grant other support/release gates');
for (const proposedVersion of ['1.8.0', '1.7.3']) {
  const blockers = actualCheck(proposedVersion);
  for (const change of actual.pendingChanges) assert(blockers.some(message => message.startsWith(change.id + ':') && message.includes('major')), 'Every current breaking contract needs a major: ' + change.id);
}
const reintroduced = structuredClone(actual);
reintroduced.pendingChanges.push(history.archivedProposal);
for (const proposedVersion of ['2.0.0', '2.0.0-alpha.0']) {
  assert(compatibilityBlockers('.', '1.7.2', proposedVersion, {registry: reintroduced, today: '2026-10-20'}).some(message => message.includes('remove-segmented-role-override: removal has no recorded announcement')), 'Reintroducing the same unannounced removal remains blocked');
}
const scratch = mkdtempSync(join(tmpdir(), 'cs-release-compatibility-'));
try {
  const bytes = 'Isolated publication evidence; not a real release';
  writeFileSync(join(scratch, 'publication.txt'), bytes);
  const evidence = [{
    path: 'publication.txt',
    sha256: createHash('sha256').update(bytes).digest('hex')
  }];
  const registry = {
    ...structuredClone(actual),
    releases: [{
      version: '1.8.0',
      releasedAt: '2026-02-01',
      evidence
    }, {
      version: '1.9.0',
      releasedAt: '2026-03-01',
      evidence
    }],
    deprecations: [{
      id: 'old-prop',
      contract: 'Fixture.oldProp',
      replacement: 'Fixture.newProp',
      announcedVersion: '1.7.2',
      announcedAt: '2026-01-01'
    }],
    pendingChanges: [{
      id: 'remove-old-prop',
      kind: 'removal',
      description: 'Fixture removal only',
      deprecationId: 'old-prop'
    }]
  };
  const check = (value, proposedVersion = '2.0.0', today = '2026-04-01') => compatibilityBlockers(scratch, '1.7.2', proposedVersion, {
    registry: value,
    today
  });
  assert.deepEqual(check(registry), [], 'Both90days and two published minors are satisfied');
  const draft = structuredClone(registry);
  draft.deprecations[0].announcedVersion = null;
  draft.deprecations[0].announcedAt = null;
  assert(check(draft).some(message => message.includes('no recorded announcement')), 'An unannounced removal stays blocked even with two unrelated published minors');
  const halfNotice = structuredClone(draft);
  halfNotice.deprecations[0].announcedAt = '2026-01-01';
  assert.throws(() => check(halfNotice), 'Both announcement fields must be null or valid');
  assert(check(registry, '2.0.0', '2026-03-31').some(s => s.includes('90')), '89days is insufficient');
  assert(check({
    ...registry,
    releases: registry.releases.slice(0, 1)
  }).some(s => s.includes('2 distinct')));
  const patchOnly = {
    ...registry,
    releases: [{
      version: '1.8.0',
      releasedAt: '2026-02-01',
      evidence
    }, {
      version: '1.8.1',
      releasedAt: '2026-03-01',
      evidence
    }]
  };
  assert(check(patchOnly).some(s => s.includes('2 distinct')), 'Patches cannot stand in for two minor branches');
  const majorOnly = {
    ...registry,
    releases: [{
      version: '2.0.0',
      releasedAt: '2026-02-01',
      evidence
    }, {
      version: '3.0.0',
      releasedAt: '2026-03-01',
      evidence
    }]
  };
  assert(check(majorOnly, '4.0.0').some(s => s.includes('2 distinct')), 'Major releases are not minor-release notice');
  assert(check(registry, '1.10.0').some(s => s.includes('major')));
  const additive = {
    ...registry,
    pendingChanges: [{
      id: 'new-prop',
      kind: 'additive',
      description: 'Fixture additive API'
    }]
  };
  assert(check(additive, '1.7.3').some(s => s.includes('minor')));
  assert.deepEqual(check(additive, '1.8.0'), []);
  assert.deepEqual(check({
    ...registry,
    pendingChanges: [{
      id: 'fix',
      kind: 'fix',
      description: 'Fixture bug fix'
    }]
  }, '1.7.3'), []);
  for (const mutate of [x => x.policy.minimumDeprecationDays = 0, x => x.policy.minimumDeprecationMinorReleases = 1, x => x.policy.breakingChangesRequireMajor = false, x => delete x.deprecations[0].announcedAt, x => x.deprecations[0].announcedAt = '2026-02-30', x => x.deprecations[0].replacement = '', x => x.pendingChanges[0].deprecationId = 'missing', x => x.releases.push(x.releases[0]), x => x.deprecations.push(x.deprecations[0]), x => x.pendingChanges.push(x.pendingChanges[0]), x => x.releases[0].evidence = [], x => x.releases[0].evidence[0].path = '../escape', x => x.releases[0].evidence[0].sha256 = '0'.repeat(64), x => x.releases[0].version = '1.08.0', x => x.pendingChanges[0].kind = 'unknown', x => x.baselineVersion = '1.0.0']) {
    const bad = structuredClone(registry);
    mutate(bad);
    assert.throws(() => check(bad));
  }
  const future = structuredClone(registry);
  future.releases[0].releasedAt = '2027-01-01';
  assert.throws(() => check(future), /Future/);
  symlinkSync(join(scratch, 'publication.txt'), join(scratch, 'linked.txt'));
  const linked = structuredClone(registry);
  linked.releases[0].evidence[0].path = 'linked.txt';
  assert.throws(() => check(linked), /symlink/);
  writeFileSync(join(scratch, 'publication.txt'), bytes + ' changed');
  assert.throws(() => validateCompatibilityRegistry(registry, scratch), /bytes changed/);
} finally {
  rmSync(scratch, {
    recursive: true,
    force: true
  });
}
console.log('PASS release compatibility: current breaking changes, major/minor/patch rules,90day boundary,two distinct published minors, source-bound evidence and malformed/undated/stale policy rejection');
