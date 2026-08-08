#!/usr/bin/env node
/**
 * UX-020 / C2 — built-in UI literal gate.
 * Any hardcoded English aria-label / title / placeholder in components/*.jsx
 * must either come from t()/makeT or live in an allowlisted data-const file.
 * Also asserts strings.js covers every component that still has such literals.
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const root = new URL('../..', import.meta.url).pathname;
const ATTR_RE = /\b(?:aria-label|title|placeholder)\s*=\s*\{?\s*["']([^"']{2,})["']/g;
// Allow brand/product proper nouns and single glyphs used as decorative (still prefer Icon).
const ALLOW_LITERAL = new Set(['CyberSkill', 'Lumi', '%', '…']);

function walkJsx() {
  const out = [];
  for (const dir of readdirSync(join(root, 'components'), { withFileTypes: true })) {
    if (!dir.isDirectory() || dir.name.startsWith('_')) continue;
    for (const f of readdirSync(join(root, 'components', dir.name))) {
      if (!f.endsWith('.jsx')) continue;
      out.push({ name: f.replace(/\.jsx$/, ''), path: join(root, 'components', dir.name, f) });
    }
  }
  return out;
}

const stringsSrc = readFileSync(join(root, 'components/_i18n/strings.js'), 'utf8');
const registered = new Set([...stringsSrc.matchAll(/^\s{2}([A-Z][A-Za-z0-9]+):\s*\{/gm)].map((m) => m[1]));

const offenders = [];
for (const { name, path } of walkJsx()) {
  const src = readFileSync(path, 'utf8');
  // Skip if file clearly uses makeT / t( for labels
  const usesT = /\bmakeT\b|\bt\s*\(/.test(src);
  ATTR_RE.lastIndex = 0;
  let m;
  while ((m = ATTR_RE.exec(src))) {
    const lit = m[1].trim();
    if (ALLOW_LITERAL.has(lit)) continue;
    if (/^\$\{/.test(lit) || lit.includes('+')) continue;
    // Vietnamese-only or pure punctuation
    if (!/[A-Za-z]/.test(lit)) continue;
    if (usesT && registered.has(name)) continue;
    offenders.push(`${name}: "${lit}"`);
  }
}

if (offenders.length) {
  console.error('FAIL test-i18n-builtins — hardcoded EN UI literals without registry wiring:');
  for (const o of offenders.slice(0, 40)) console.error('  ·', o);
  if (offenders.length > 40) console.error('  … +' + (offenders.length - 40) + ' more');
  process.exit(1);
}

// Doc-palette residual + base font-size residual (Phase 2 pack-contract hygiene)
function countIn(globDir, needle) {
  let n = 0;
  const walk = (d) => {
    for (const ent of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (/\.(dc\.html|css)$/.test(ent.name)) {
        const t = readFileSync(p, 'utf8');
        let i = 0;
        while ((i = t.indexOf(needle, i)) !== -1) {
          n++;
          i += needle.length;
        }
      }
    }
  };
  walk(globDir);
  return n;
}
const hexLeft =
  countIn(join(root, 'templates'), '#3F4C55') +
  countIn(join(root, 'templates'), '#FDE68A') +
  countIn(join(root, 'templates'), '#1A1614');
if (hexLeft !== 0) {
  console.error('FAIL doc-palette residual hex in templates:', hexLeft);
  process.exit(1);
}
let fontPx = 0;
for (const f of readdirSync(join(root, 'base'))) {
  if (!f.endsWith('.css')) continue;
  const t = readFileSync(join(root, 'base', f), 'utf8');
  fontPx += (t.match(/font-size:\s*[0-9.]+px/g) || []).length;
}
if (fontPx !== 0) {
  console.error('FAIL raw font-size px in base/:', fontPx);
  process.exit(1);
}

console.log('PASS test-i18n-builtins', {
  registered: registered.size,
  offenders: 0,
  docHex: 0,
  baseFontPx: 0,
});
