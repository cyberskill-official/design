#!/usr/bin/env node
/**
 * Node twin of the doctrine↔source parity rows in _audit/docs-consistency.html
 * (FIND-018 / FIND-003/005/008/009). Browser gate remains the merge-blocker authority
 * for count claims + routing; this catches the static parity layer in `npm run test:unit`.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
function read(rel) { return readFileSync(join(root, rel), 'utf8'); }
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const readme = read('README.md');
const skill = read('SKILL.md');
const consuming = read('docs/consuming.md');
const elementsCss = read('tokens/elements.css');
const elevationCss = read('tokens/elevation.css');
const spacingCss = read('tokens/spacing.css');
const i18nJs = read('components/_i18n/i18n.js');
const tokensJson = JSON.parse(read('tokens/tokens.json'));
const baseCss = read('base/controls.css') + '\n' + read('base/glass.css');

const ROLE_CANON = ['accent', 'strong', 'bright', 'on', 'on-strong', 'tint', 'ink', 'glow', 'grad-a', 'grad-b'];
const roleDecl = [...elementsCss.matchAll(/--cs-accent(?:-([a-z0-9-]+))?\s*:/g)].map((m) => m[1] || 'accent');
const roleSet = [...new Set(roleDecl)];
assert(ROLE_CANON.every((r) => roleSet.includes(r)), 'elements.css missing roles: ' + ROLE_CANON.filter((r) => !roleSet.includes(r)).join(','));
assert(/\bten\b[\s\S]{0,120}--cs-accent-\*[\s\S]{0,160}on-strong/i.test(readme), 'README must list ten roles incl. on-strong');
assert(/10-role pack incl\.\s*`?on-strong`?/i.test(skill) || (/\b10[- ]role\b/i.test(skill) && /on-strong/.test(skill)), 'SKILL must document 10-role pack incl. on-strong');

const DEPTH_CANON = { bg: 0, section: 5, card: 10, nav: 50, dropdown: 60, overlay: 80, modal: 100, toast: 200 };
const depthTok = {};
for (const m of elevationCss.matchAll(/--cs-depth-([a-z]+)\s*:\s*(\d+)\s*;/g)) depthTok[m[1]] = parseInt(m[2], 10);
for (const [k, v] of Object.entries(DEPTH_CANON)) {
  assert(depthTok[k] === v, `elevation.css --cs-depth-${k} expected ${v}, got ${depthTok[k]}`);
}
assert(/bg\s*0\s*→\s*section\s*5\s*→\s*card\s*10\s*→\s*nav\s*50\s*→\s*dropdown\s*60\s*→\s*overlay\s*80\s*→\s*modal\s*100\s*→\s*toast\s*200/.test(readme), 'README depth scale incomplete');

const i18nDefault = ((i18nJs.match(/return\s+l\s*\|\|\s*["'](vi|en)["']/) || [])[1]);
assert(i18nDefault === 'vi', 'i18n.js default must be vi, got ' + i18nDefault);
for (const [src, text] of [['SKILL.md', skill], ['docs/consuming.md', consuming]]) {
  const m = text.match(/light\s*·\s*tho\s*·\s*(vi|en)\s*·\s*liquid-glass/i);
  assert(m, src + ' missing axis defaults line');
  assert(m[1] === 'vi', src + ' Language default must be vi, got ' + m[1]);
}

const bpCss = {};
for (const m of spacingCss.matchAll(/--cs-breakpoint-([a-z0-9]+)\s*:\s*([^;]+);/g)) bpCss[m[1]] = m[2].trim();
const bpJsonRaw = (tokensJson.root && tokensJson.root.breakpoint) || tokensJson.breakpoint || {};
const bpJson = {};
for (const [k, v] of Object.entries(bpJsonRaw)) bpJson[k.replace(/^--cs-breakpoint-/, '')] = String(v);
const BP_KEYS = ['xs', 'phone', 'sm', 'md', 'lg', 'xl', '2xl'];
for (const k of BP_KEYS) {
  assert(bpCss[k] && bpJson[k] && bpCss[k] === bpJson[k], `breakpoint ${k}: css=${bpCss[k]} json=${bpJson[k]}`);
}

// FIND-007 — every width stop in base/ @media / @container ⊆ sanctioned px set
const sanctionedPx = new Set(
  Object.values(bpCss)
    .map((v) => parseInt(String(v), 10))
    .filter((n) => Number.isFinite(n) && n > 0),
);
const widthOff = [];
for (const name of readdirSync(join(root, 'base'))) {
  if (!name.endsWith('.css')) continue;
  const css = read('base/' + name);
  for (const m of css.matchAll(/@media[^{]*\((?:max|min)-width:\s*(\d+)px\)/g)) {
    const px = parseInt(m[1], 10);
    if (!sanctionedPx.has(px)) widthOff.push(`${name} @media ${px}`);
  }
  for (const m of css.matchAll(/@container[^{]*\((?:max|min)-width:\s*(\d+)px\)/g)) {
    const px = parseInt(m[1], 10);
    if (!sanctionedPx.has(px)) widthOff.push(`${name} @container ${px}`);
  }
}
assert(widthOff.length === 0, 'FIND-007 off-scale widths: ' + widthOff.join(' | '));

const fbBad = [];
for (const m of baseCss.matchAll(/var\(--cs-depth-([a-z]+)\s*,\s*(\d+)\s*\)/g)) {
  const name = m[1], fb = parseInt(m[2], 10), expect = DEPTH_CANON[name];
  if (expect === undefined) { fbBad.push(name + ':unknown'); continue; }
  if (fb !== expect) fbBad.push(`${name} fallback ${fb}≠${expect}`);
}
assert(fbBad.length === 0, 'depth fallbacks drift: ' + fbBad.join(' | '));

// Aurora asset budget (same ceilings as asset-weight-budget.html) — FIND-016 / FIND-058 WebP
const AURORA = ['aurora-tho.webp', 'aurora-hoa.webp', 'aurora-thuy.webp', 'aurora-moc.webp', 'aurora-kim.webp'];
const PER_FILE_MAX = 300_000;
const TOTAL_MAX = 1_200_000;
let total = 0;
const assetsDir = join(root, 'assets');
for (const name of AURORA) {
  const st = statSync(join(assetsDir, name));
  assert(st.size > 0 && st.size <= PER_FILE_MAX, `${name} size ${st.size} exceeds ${PER_FILE_MAX}`);
  total += st.size;
}
assert(total <= TOTAL_MAX, `aurora set total ${total} exceeds ${TOTAL_MAX}`);
const extraWebp = readdirSync(assetsDir).filter((f) => /^aurora-.*\.webp$/i.test(f) && !AURORA.includes(f));
assert(extraWebp.length === 0, 'unexpected aurora WebPs: ' + extraWebp.join(', '));
const legacyPng = readdirSync(assetsDir).filter((f) => /^aurora-.*\.png$/i.test(f));
assert(legacyPng.length === 0, 'legacy aurora PNGs must be removed after FIND-016: ' + legacyPng.join(', '));
assert(
  /\.cs-aurora-wash\s*\{[^}]*aurora-tho\.webp/.test(elementsCss),
  '.cs-aurora-wash must use assets/aurora-tho.webp (FIND-058)'
);
assert(
  !/\.cs-aurora-wash\s*\{[^}]*aurora-gold\.jpg/.test(elementsCss),
  '.cs-aurora-wash must not use aurora-gold.jpg (FIND-058)'
);

console.log('PASS test-docs-consistency', {
  roles: ROLE_CANON.length,
  depthTiers: Object.keys(DEPTH_CANON).length,
  defaultLang: i18nDefault,
  auroraBytes: total,
});
