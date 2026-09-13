#!/usr/bin/env node
/**
 * Static guard: every AT-01…16 ID appears in docs/audits/at-automation-coverage.md
 * and every listed _audit gate file exists (prevents doc drift).
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const mapPath = join(root, 'docs/audits/at-automation-coverage.md');
const map = readFileSync(mapPath, 'utf8');

const ids = [];
for (let i = 1; i <= 16; i++) ids.push('AT-' + String(i).padStart(2, '0'));

const missingIds = ids.filter((id) => !map.includes('| ' + id + ' |') && !map.includes('| ' + id + ' '));
if (missingIds.length) {
  console.error('FAIL test-at-coverage-map — missing matrix IDs in at-automation-coverage.md:', missingIds.join(', '));
  process.exit(1);
}

const gateFiles = [...map.matchAll(/\[`_audit\/([^`]+)`\]/g)].map((m) => m[1]);
const uniqueGates = [...new Set(gateFiles)];
const missingFiles = uniqueGates.filter((rel) => !existsSync(join(root, '_audit', rel)));
if (missingFiles.length) {
  console.error('FAIL test-at-coverage-map — gate files missing:', missingFiles.join(', '));
  process.exit(1);
}

console.log('PASS test-at-coverage-map { ids: 16, gates: ' + uniqueGates.length + ' }');
