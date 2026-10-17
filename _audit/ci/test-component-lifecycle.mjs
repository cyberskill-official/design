#!/usr/bin/env node
/**
 * TASK-IMP-028 / CDS-COV-001 — every public manifest export has a lifecycle status.
 */
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import nodeAssert from 'node:assert/strict';
import { validateSupport } from '../../scripts/lib/component-support.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const manifest = JSON.parse(readFileSync(join(root, '_ds_manifest.json'), 'utf8'));
const life = JSON.parse(readFileSync(join(root, 'components/lifecycle.json'), 'utf8'));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const allowed = new Set(life.statuses || ['stable', 'preview', 'deprecated']);
assert(life.supportContractVersion === 1, 'support contract version');
assert(allowed.has('stable') && allowed.has('preview') && allowed.has('deprecated'), 'statuses enum');

const missing = [];
const bad = [];
for (const c of manifest.components) {
  const entry = life.components[c.name];
  if (!entry) {
    missing.push(c.name);
    continue;
  }
  if (!allowed.has(entry.status)) bad.push(`${c.name}:${entry.status}`);
  if (entry.kind !== c.kind) bad.push(`${c.name}:kind drift`);
  validateSupport(entry.support, root);
  if (entry.support.reviewState !== 'reviewed' || entry.support.owner !== 'Stephen Cheng' || entry.support.reviewedBy !== 'Stephen Cheng' || !entry.support.limitations.length) {
    bad.push(`${c.name}:support review incomplete`);
  }
  if (entry.status === 'deprecated') assert(entry.support.deprecation, `${c.name}: deprecated export requires migration guidance`);
  if (entry.sourcePath && entry.sourcePath !== c.sourcePath) {
    bad.push(`${c.name}:sourcePath drift`);
  }
}

assert(missing.length === 0, 'missing lifecycle entries: ' + missing.slice(0, 12).join(', '));
assert(bad.length === 0, 'bad lifecycle entries: ' + bad.slice(0, 12).join(', '));

const extras = Object.keys(life.components).filter(
  (n) => !manifest.components.some((c) => c.name === n),
);
assert(extras.length === 0, 'orphan lifecycle entries: ' + extras.slice(0, 12).join(', '));

assert(life.components.Editor?.status === 'preview', 'Editor marked preview (schema wave)');

const temp = mkdtempSync(join(tmpdir(), 'cs-support-contract-'));
try {
  const bytes = 'Scoped fixture review record';
  writeFileSync(join(temp, 'review.txt'), bytes);
  const reviewed = {reviewState:'reviewed', owner:'fixture-owner', reviewedBy:'fixture-reviewer', reviewedAt:'2026-10-07T00:00:00Z', environments:['fixture browser'], axes:['fixture light theme'], limitations:[], deprecation:null,
    evidence:[{path:'review.txt', sha256:createHash('sha256').update(bytes).digest('hex'), scope:'Fixture only', checkedAt:'2026-10-07T00:00:00Z'}]};
  validateSupport(reviewed, temp);
  for (const mutate of [
    value => { value.owner = null; }, value => { value.reviewedBy = null; },
    value => { value.reviewedAt = null; }, value => { value.environments = []; },
    value => { value.axes = []; }, value => { value.evidence = []; },
    value => { value.evidence[0].path = '../review.txt'; },
    value => { value.evidence[0].sha256 = '0'.repeat(64); },
    value => { value.evidence[0].scope = ''; },
    value => { value.evidence[0].checkedAt = 'unknown'; },
    value => { value.deprecation = {reason:'Removed'}; },
  ]) {
    const invalid = structuredClone(reviewed); mutate(invalid);
    nodeAssert.throws(() => validateSupport(invalid, temp));
  }
  const unreviewed = structuredClone(life.components.Editor.support);
  unreviewed.reviewedBy = null;
  nodeAssert.throws(() => validateSupport(unreviewed, root), /owner and reviewer/);
  writeFileSync(join(temp, 'review.txt'), 'changed');
  nodeAssert.throws(() => validateSupport(reviewed, temp), /evidence changed/);
} finally { rmSync(temp, {recursive:true, force:true}); }

console.log('PASS test-component-lifecycle', {
  exports: manifest.components.length,
  statuses: [...allowed],
  support: 'explicit review state; missing/stale/unsafe evidence and unsupported promotion rejected',
});
