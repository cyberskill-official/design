#!/usr/bin/env node
/**
 * UX-020 / C2 / FIND-048 / FIND-056 / FIND-059 — built-in UI literal gate.
 * - Hardcoded English aria-label / title / placeholder must use t()/makeT or a
 *   per-literal allowlist (not a whole-file skip).
 * - Every strings.js namespace must be referenced by makeT("Name") somewhere.
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const root = new URL('../..', import.meta.url).pathname;
const ATTR_RE = /\b(?:aria-label|title|placeholder)\s*=\s*\{?\s*["']([^"']{2,})["']/g;
// Brand/product proper nouns and single glyphs used as decorative.
const ALLOW_LITERAL = new Set(['CyberSkill', 'Lumi', '%', '…']);
/** Per-literal exemptions: `Component:literal` (FIND-059). Prefer registering in strings.js. */
const ALLOW_COMPONENT_LITERAL = new Set([
  // none today — Terminal.title is registered
]);

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
const allJsxSrc = [];
for (const { name, path } of walkJsx()) {
  const src = readFileSync(path, 'utf8');
  allJsxSrc.push(src);
  ATTR_RE.lastIndex = 0;
  let m;
  while ((m = ATTR_RE.exec(src))) {
    const lit = m[1].trim();
    if (ALLOW_LITERAL.has(lit)) continue;
    if (ALLOW_COMPONENT_LITERAL.has(`${name}:${lit}`)) continue;
    if (/^\$\{/.test(lit) || lit.includes('+')) continue;
    if (!/[A-Za-z]/.test(lit)) continue;
    // Dynamic / interpolated JSX expressions are out of scope for this regex
    offenders.push(`${name}: "${lit}"`);
  }
}

const wired = new Set();
const blob = allJsxSrc.join('\n');
for (const name of registered) {
  if (new RegExp(`makeT\\(\\s*["']${name}["']`).test(blob)) wired.add(name);
}
const dead = [...registered].filter((n) => !wired.has(n)).sort();

if (offenders.length) {
  console.error('FAIL test-i18n-builtins — hardcoded EN UI literals without registry wiring:');
  for (const o of offenders.slice(0, 40)) console.error('  ·', o);
  if (offenders.length > 40) console.error('  … +' + (offenders.length - 40) + ' more');
  process.exit(1);
}
if (dead.length) {
  console.error('FAIL test-i18n-builtins — registered namespaces never makeT()-wired:');
  for (const n of dead) console.error('  ·', n);
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
  wired: wired.size,
  offenders: 0,
  docHex: 0,
  baseFontPx: 0,
});
