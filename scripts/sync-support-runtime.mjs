#!/usr/bin/env node
/**
 * Sync canonical DC runtime from templates/_vendor/support.js to every
 * templates/<slug>/support.js copy. The support-runtime-identity gate requires
 * all copies to be byte-identical.
 *
 * Usage: node scripts/sync-support-runtime.mjs
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const vendor = join(root, 'templates/_vendor/support.js');
const src = readFileSync(vendor);
const templatesRoot = join(root, 'templates');

let written = 0;
for (const name of readdirSync(templatesRoot)) {
  if (name === '_vendor') continue;
  const dir = join(templatesRoot, name);
  if (!statSync(dir).isDirectory()) continue;
  const dest = join(dir, 'support.js');
  try {
    statSync(dest);
  } catch {
    continue;
  }
  writeFileSync(dest, src);
  written++;
}

const vendorText = src.toString('utf8');
// Strip block + line comments before scanning for forbidden call sites.
const stripped = vendorText
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/(^|[^:])\/\/.*$/gm, '$1');
if (/\bnew\s+Function\b|\beval\s*\(/.test(stripped)) {
  console.error('REFUSE: vendor support.js still contains new Function or eval(');
  process.exit(1);
}

console.log(`synced support.js → ${written} template folders`);
