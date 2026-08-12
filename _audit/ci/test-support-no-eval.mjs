#!/usr/bin/env node
/**
 * Assert every templates/<slug>/support.js is identical to _vendor/support.js
 * and contains neither Function-constructor nor eval( call sites (CSP-safe).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const vendorPath = join(root, 'templates/_vendor/support.js');
const vendor = readFileSync(vendorPath);
const vendorHash = createHash('sha256').update(vendor).digest('hex');
const vendorText = vendor.toString('utf8');

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assert failed');
}

const stripComments = (t) =>
  t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
const vendorCode = stripComments(vendorText);
assert(!/\bnew\s+Function\b/.test(vendorCode), 'vendor support.js must not contain new Function');
assert(!/\beval\s*\(/.test(vendorCode), 'vendor support.js must not contain eval(');
assert(
  /createElement\(["']script["']\)/.test(vendorText) && /evalDcLogic/.test(vendorText),
  'vendor support.js must use inline-script evalDcLogic',
);

const templatesRoot = join(root, 'templates');
const copies = [];
for (const name of readdirSync(templatesRoot)) {
  if (name === '_vendor') continue;
  const dir = join(templatesRoot, name);
  if (!statSync(dir).isDirectory()) continue;
  const p = join(dir, 'support.js');
  try {
    statSync(p);
  } catch {
    continue;
  }
  copies.push(p);
}

assert(copies.length >= 80, `expected ~85 support.js copies, got ${copies.length}`);

const bad = [];
for (const p of copies) {
  const buf = readFileSync(p);
  const h = createHash('sha256').update(buf).digest('hex');
  const text = buf.toString('utf8');
  const code = stripComments(text);
  if (h !== vendorHash) bad.push(`${p}: hash mismatch`);
  if (/\bnew\s+Function\b/.test(code)) bad.push(`${p}: contains new Function`);
  if (/\beval\s*\(/.test(code)) bad.push(`${p}: contains eval(`);
}

assert(bad.length === 0, bad.slice(0, 10).join('\n') || 'identity/no-eval failed');

console.log('PASS test-support-no-eval', {
  copies: copies.length,
  sha256: vendorHash.slice(0, 16) + '…',
});
