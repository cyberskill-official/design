#!/usr/bin/env node
/**
 * FIND-010 — base/*.css bare hex must be allowlisted (color-mix anchors, var fallbacks,
 * masks, print, intentional on-brand / chrome inks, preference overrides writing tokens).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const HEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** Hex inside var(--x, #hex) fallbacks are tokenized. */
function stripVarFallbacks(css) {
  return css.replace(/var\(\s*--[^,)]+\s*,\s*#[0-9a-fA-F]+\s*\)/g, 'var(--tok)');
}

/** color-mix(..., #hex ...) anchors + linear-gradient masks. */
function stripMixAndMasks(css) {
  return css
    .replace(/color-mix\([^;{}]+\)/g, 'color-mix()')
    .replace(/linear-gradient\([^;{}]+\)/g, 'linear-gradient()')
    .replace(/radial-gradient\([^;{}]+\)/g, 'radial-gradient()')
    .replace(/-webkit-mask:[^;]+;/g, '')
    .replace(/mask:[^;]+;/g, '');
}

const offenders = [];
for (const f of readdirSync(join(root, 'base'))) {
  if (!f.endsWith('.css')) continue;
  let css = readFileSync(join(root, 'base', f), 'utf8');
  css = stripComments(css);
  css = stripVarFallbacks(css);
  css = stripMixAndMasks(css);
  // Token / local custom-prop assignment — allow writing hex into --cs-*
  css = css.replace(/--cs-[a-z0-9-]+:\s*#[0-9a-fA-F]+\s*;/g, '--cs-tok:x;');
  // Print stylesheet may force paper white / grey rules
  css = css.replace(/@media\s+print\s*\{[\s\S]*?\n\}/g, '@media print{}');
  // Intentional fixed on-fill / on-aurora / on-dark-chrome ink (does not follow text-inverse)
  css = css.replace(/color:\s*#fff(?:fff)?\b/gi, 'color: tok');
  HEX.lastIndex = 0;
  let m;
  while ((m = HEX.exec(css))) {
    const i = m.index;
    const ctx = css.slice(Math.max(0, i - 48), i + m[0].length + 24).replace(/\s+/g, ' ');
    offenders.push(`${f}: ${m[0]} … ${ctx}`);
  }
}

if (offenders.length) {
  console.error('FAIL test-base-hex-allowlist — non-allowlisted bare hex in base/:');
  for (const o of offenders.slice(0, 60)) console.error('  ·', o);
  if (offenders.length > 60) console.error('  … +' + (offenders.length - 60) + ' more');
  process.exit(1);
}

console.log('PASS test-base-hex-allowlist', { bareHexOutsideAllowlist: 0 });
