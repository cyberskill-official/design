import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { projectSecuritySupport, securitySupportBlock } from '../../scripts/lib/security-support.mjs';
const read = path => readFileSync(path, 'utf8');
const source = JSON.parse(read('scripts/security-support-source.json'));
const actual = read('SECURITY.md');
assert.equal(projectSecuritySupport(actual, source, read), actual);
const block = securitySupportBlock(source, read);
const published = JSON.parse(read(source.snapshotPath)).version;
assert(block.includes(published.split('.').slice(0, 2).join('.') + '.x') && block.includes(published));
const later = securitySupportBlock(source, () => JSON.stringify({
  version: '2.3.4',
  'dist-tags': {
    latest: '2.3.4'
  }
}));
assert(later.includes('2.3.x') && later.includes('2.3.4') && !later.includes('**1.7.x**'), 'The support window follows the explicit publication snapshot, not the source VERSION or a hardcoded line');
assert(block.includes('not a live registry query'));
assert(block.includes('not an SLA'));
assert(block.includes('no backport commitment'));
for (const change of [x => x.supportWindow = 'all-releases', x => x.acknowledgementBusinessDays = 5, x => x.bestEffort = false, x => x.fixDeadline = 'tomorrow', x => x.sla = true, x => x.registry = 'https://unreviewed.example/', x => x.snapshotPath = '../escape', x => x.observedAt = 'invalid']) {
  const invalid = structuredClone(source);
  change(invalid);
  assert.throws(() => securitySupportBlock(invalid, read));
}
for (const snapshot of [{
  version: '1.7.2-rc.1',
  'dist-tags': {
    latest: '1.7.2-rc.1'
  }
}, {
  version: '1.7.2',
  'dist-tags': {
    latest: '2.0.0'
  }
}, {
  version: '01.7.2',
  'dist-tags': {
    latest: '01.7.2'
  }
}]) assert.throws(() => securitySupportBlock(source, () => JSON.stringify(snapshot)));
for (const damaged of [actual.replace('<!-- BEGIN GENERATED SECURITY SUPPORT -->', ''), actual + block, actual.replace('<!-- END GENERATED SECURITY SUPPORT -->', '')]) assert.throws(() => projectSecuritySupport(damaged, source, read));
assert.notEqual(projectSecuritySupport(actual.replace('10 business days', '1 business day'), source, read), actual.replace('10 business days', '1 business day'), 'Unreviewed promise drift must be repaired/rejected by freshness');
console.log('PASS security support policy: approved response/window, publication snapshot identity, no inferred release, promise/source/marker drift rejection');
