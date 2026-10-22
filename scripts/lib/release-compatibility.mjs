import assert from 'node:assert/strict';
import { readFileSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import {parseReleaseVersion, compareReleaseVersions} from './release-version.mjs';
const policy = {
  versioning: 'semver',
  breakingChangesRequireMajor: true,
  minimumDeprecationMinorReleases: 2,
  minimumDeprecationDays: 90,
  dateBasis: 'UTC calendar dates'
};
const version = text => {
  return parseReleaseVersion(text,{stableOnly:true}).core;
};
const compare = (a, b) => {
  const x = version(a),
    y = version(b);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i] ? 1 : -1;
  return 0;
};
const day = text => {
  assert.equal(typeof text, 'string');
  assert.match(text, /^\d{4}-\d{2}-\d{2}$/, 'UTC date required');
  const instant = Date.parse(text + 'T00:00:00.000Z');
  assert(Number.isFinite(instant) && new Date(instant).toISOString().slice(0, 10) === text, 'Invalid calendar date');
  return instant / 86400000;
};
const keys = (value, allowed) => {
  assert(value && typeof value === 'object' && !Array.isArray(value));
  assert.deepEqual(Object.keys(value).sort(), [...allowed].sort(), 'Unexpected or missing compatibility metadata fields');
};
function verifyEvidence(root, evidence) {
  assert(Array.isArray(evidence) && evidence.length, 'Released version requires source-bound publication evidence');
  for (const entry of evidence) {
    keys(entry, ['path', 'sha256']);
    assert.equal(typeof entry.path, 'string');
    assert(entry.path && !entry.path.includes('\\') && entry.path.split('/').every(p => p && p !== '.' && p !== '..'), 'Unsafe release evidence path');
    assert.match(entry.sha256, /^[a-f0-9]{64}$/);
    let path = root;
    for (const part of entry.path.split('/')) {
      path = join(path, part);
      assert(!lstatSync(path).isSymbolicLink(), 'Release evidence cannot traverse symlinks');
    }
    assert(lstatSync(path).isFile(), 'Release evidence must be a regular file');
    assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), entry.sha256, 'Release evidence bytes changed');
  }
}
export function validateCompatibilityRegistry(registry, root) {
  keys(registry, ['schemaVersion', 'baselineVersion', 'policy', 'releases', 'deprecations', 'pendingChanges']);
  assert.equal(registry.schemaVersion, 1);
  version(registry.baselineVersion);
  assert.deepEqual(registry.policy, policy, 'Compatibility policy differs from the approved contract');
  for (const name of ['releases', 'deprecations', 'pendingChanges']) assert(Array.isArray(registry[name]));
  const releases = new Set(),
    deprecations = new Set(),
    changes = new Set();
  for (const release of registry.releases) {
    keys(release, ['version', 'releasedAt', 'evidence']);
    version(release.version);
    day(release.releasedAt);
    assert(!releases.has(release.version), 'Duplicate release');
    releases.add(release.version);
    verifyEvidence(root, release.evidence);
  }
  for (const notice of registry.deprecations) {
    keys(notice, ['id', 'contract', 'replacement', 'announcedVersion', 'announcedAt']);
    for (const name of ['id', 'contract', 'replacement']) assert.equal(typeof notice[name], 'string');
    assert(notice.id.trim() && notice.contract.trim() && notice.replacement.trim(), 'Deprecation requires a contract and migration path');
    const unannounced = notice.announcedVersion === null && notice.announcedAt === null;
    if (!unannounced) {
      version(notice.announcedVersion);
      day(notice.announcedAt);
    }
    assert(!deprecations.has(notice.id), 'Duplicate deprecation');
    deprecations.add(notice.id);
  }
  for (const change of registry.pendingChanges) {
    assert(['fix', 'additive', 'breaking', 'removal'].includes(change.kind), 'Unknown compatibility change kind');
    keys(change, change.kind === 'removal' ? ['id', 'kind', 'description', 'deprecationId'] : ['id', 'kind', 'description']);
    assert(typeof change.id === 'string' && change.id.trim() && typeof change.description === 'string' && change.description.trim(), 'Change identity/description required');
    assert(!changes.has(change.id), 'Duplicate pending change');
    changes.add(change.id);
    if (change.kind === 'removal') assert(deprecations.has(change.deprecationId), 'Removal requires a recorded dated deprecation');
  }
  return registry;
}
export function compatibilityBlockers(root, currentVersion, proposedVersion, {
  today = new Date().toISOString().slice(0, 10),
  registry
} = {}) {
  registry = validateCompatibilityRegistry(registry ?? JSON.parse(readFileSync(join(root, 'components/release-compatibility.json'), 'utf8')), root);
  const current = version(currentVersion),
    next = parseReleaseVersion(proposedVersion).core,
    now = day(today),
    blockers = [];
  assert.equal(registry.baselineVersion, currentVersion, 'Compatibility baseline must match the pre-candidate release version');
  assert(compareReleaseVersions(proposedVersion, currentVersion) > 0, 'Candidate must be newer than current version');
  for (const release of registry.releases) assert(day(release.releasedAt) <= now, 'Future publication evidence cannot count');
  for (const change of registry.pendingChanges) {
    if (['breaking', 'removal'].includes(change.kind) && next[0] <= current[0]) blockers.push(`${change.id}: breaking changes require a new major version`);
    if (change.kind === 'additive' && next[0] === current[0] && next[1] <= current[1]) blockers.push(`${change.id}: additive public API requires a minor or major version`);
    if (change.kind !== 'removal') continue;
    const notice = registry.deprecations.find(row => row.id === change.deprecationId);
    if (notice.announcedVersion === null) {
      blockers.push(`${change.id}: removal has no recorded announcement; published minor-release and90day notice requirements cannot start from an invented date`);
      continue;
    }
    if (next[0] <= version(notice.announcedVersion)[0]) blockers.push(`${change.id}: removal requires a major after the deprecation announcement`);
    if (now - day(notice.announcedAt) < policy.minimumDeprecationDays) blockers.push(`${change.id}: at least90 UTC calendar days of notice required`);
    const minors = new Set(registry.releases.filter(release => {
      const parts = version(release.version),
        announced = version(notice.announcedVersion);
      return parts[1] > 0n && compare(release.version, notice.announcedVersion) > 0 && compareReleaseVersions(release.version, proposedVersion) < 0 && day(release.releasedAt) >= day(notice.announcedAt) && (parts[0] > announced[0] || parts[1] > announced[1]);
    }).map(release => release.version.split('.').slice(0, 2).join('.')));
    if (minors.size < policy.minimumDeprecationMinorReleases) blockers.push(`${change.id}: at least2 distinct published minor releases after notice required`);
  }
  return blockers;
}
