#!/usr/bin/env node
/**
 * TASK-IMP-028 / CDS-COV-001 — every public manifest export has a lifecycle status.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const manifest = JSON.parse(readFileSync(join(root, '_ds_manifest.json'), 'utf8'));
const life = JSON.parse(readFileSync(join(root, 'components/lifecycle.json'), 'utf8'));

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const allowed = new Set(life.statuses || ['stable', 'preview', 'deprecated']);
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

console.log('PASS test-component-lifecycle', {
  exports: manifest.components.length,
  statuses: [...allowed],
});
