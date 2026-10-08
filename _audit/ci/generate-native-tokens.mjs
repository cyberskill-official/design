// Regenerates tokens/native/{CSTokens.swift,CSTokens.kt,cs_tokens.dart} + tokens/provenance.json
// from tokens/tokens.dtcg.json. Browser-free (Node crypto instead of window.crypto.subtle) — the
// SAME transform algorithm as _audit/token-pipeline-test.html's `expected()` function, so a file
// this script writes is byte-identical to what that gate independently re-derives. Run this
// after any change to tokens/tokens.dtcg.json; CI wires it up in the `regenerate-tokens` job
// (.github/workflows/design-system-gates.yml) via git-auto-commit-action.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { validateDtcgProfile } from '../lib/dtcg-profile.mjs';
import { srgbToRgba, assertCssProjection, valueFromCss } from '../../scripts/lib/dtcg-values.mjs';

const ROOT = new URL('../../', import.meta.url);
const read = (p) => readFile(new URL(p, ROOT), 'utf8');
const write = (p, s) => writeFile(new URL(p, ROOT), s, 'utf8');
const sha256 = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

const camel = (css) => css.replace(/^--cs-/, '').split(/[-_]/).map((p, i) => (i ? p.charAt(0).toUpperCase() + p.slice(1) : p)).join('');
const pascalScope = (key) => key.split(/[.-]/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');

function parseColor(v) {
  v = String(v).trim();
  let m = /^#([0-9a-f]{6})$/i.exec(v);
  if (m) { const n = parseInt(m[1], 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 }; }
  m = /^#([0-9a-f]{3})$/i.exec(v);
  if (m) { const h = m[1]; return { r: parseInt(h[0] + h[0], 16), g: parseInt(h[1] + h[1], 16), b: parseInt(h[2] + h[2], 16), a: 1 }; }
  m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(v);
  if (m) return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
  return null;
}
const hex2 = (n) => n.toString(16).toUpperCase().padStart(2, '0');
const argb = (c) => hex2(Math.round(c.a * 255)) + hex2(c.r) + hex2(c.g) + hex2(c.b);
const px = (v) => { let m = /^(-?[\d.]+)px$/.exec(v); if (m) return +m[1]; m = /^(-?[\d.]+)rem$/.exec(v); if (m) return +m[1] * 16; return null; };
const em = (v) => { const m = /^(-?[\d.]+)em$/.exec(v); return m ? +m[1] : null; };

// Same per-token transform as the gate's `expected()` — keep these two in lockstep by hand if either changes.
// Compatibility contract: nativeFormat=css retains existing alias, shadow and percentage
// String constants; nativeFormat=em retains relative ...Em constants. Other tokens consume
// typed values. Exact CSS extensions alone never force a native String representation.
function expected(name, type, value, cssRaw, nativeFormat) {
  if (nativeFormat === 'em') { type = 'dimension'; value = `${value}em`; }
  if (type === 'dimension' && value && typeof value === 'object') value = `${value.value}${value.unit}`;
  if (type === 'duration' && value && typeof value === 'object') value = `${value.value * (value.unit === 's' ? 1000 : 1)}ms`;
  if (cssRaw !== undefined) {
    const s = JSON.stringify(String(cssRaw));
    return { swift: `let ${name}: String = ${s}`, kt: `val ${name} = ${s}`, dart: `const String ${name} = ${s};` };
  }
  if (type === 'color') {
    const rgba = value && typeof value === 'object' ? srgbToRgba(value) : null;
    const c = rgba ? {r:Math.round(rgba.r*255),g:Math.round(rgba.g*255),b:Math.round(rgba.b*255),a:rgba.a} : parseColor(String(value)); if (!c) return null;
    const hex6 = ((c.r << 16) | (c.g << 8) | c.b).toString(16).toUpperCase().padStart(6, '0');
    return { swift: `let ${name} = color(0x${hex6}${c.a !== 1 ? ', alpha: ' + c.a : ''})`, kt: `val ${name} = Color(0x${argb(c)})`, dart: `const Color ${name} = Color(0x${argb(c)});` };
  }
  if (type === 'dimension') {
    const n = px(String(value));
    if (n !== null) return { swift: `let ${name}: CGFloat = ${n}`, kt: `val ${name} = ${n}.dp`, dart: `const double ${name} = ${n};` };
    const e = em(String(value));
    if (e !== null) return { swift: `let ${name}Em: Double = ${e}`, kt: `val ${name}Em = ${e}${Number.isInteger(e) ? '' : 'f'}`, dart: `const double ${name}Em = ${e};` };
    return null;
  }
  if (type === 'number') {
    const n = +value; if (isNaN(n)) return null;
    return { swift: `let ${name}: Double = ${n}`, kt: `val ${name} = ${n}${Number.isInteger(n) ? '' : 'f'}`, dart: `const double ${name} = ${n};` };
  }
  if (type === 'duration') {
    const m = /^([\d.]+)ms$/.exec(String(value)); if (!m) return null;
    const n = +m[1];
    return { swift: `let ${name}Ms: Double = ${n}`, kt: `val ${name}Ms = ${n}${Number.isInteger(n) ? '' : 'f'}`, dart: `const double ${name}Ms = ${n};` };
  }
  if (type === 'cubicBezier' && Array.isArray(value)) {
    const a = value.join(', ');
    // Kotlin does not widen integer literals in doubleArrayOf arguments.
    const kotlin = value.map(n => Number.isInteger(n) ? n.toFixed(1) : String(n)).join(', ');
    return { swift: `let ${name}: [Double] = [${a}]`, kt: `val ${name} = doubleArrayOf(${kotlin})`, dart: `const List<double> ${name} = [${a}];` };
  }
  if (type === 'fontFamily' && Array.isArray(value)) {
    const s = JSON.stringify(value.join(', '));
    return { swift: `let ${name}: String = ${s}`, kt: `val ${name} = ${s}`, dart: `const String ${name} = ${s};` };
  }
  const s = JSON.stringify(String(value));
  return { swift: `let ${name}: String = ${s}`, kt: `val ${name} = ${s}`, dart: `const String ${name} = ${s};` };
}

const dtcgText = await read('tokens/tokens.dtcg.json');
const dtcg = JSON.parse(dtcgText);
const validation = validateDtcgProfile(dtcg);
if (!validation.pass) throw Error('Unconvertible token values: ' + JSON.stringify(validation.errors));
assertCssProjection(dtcg);
const ext = dtcg.$extensions['com.cyberskill'];
const VERSION = (await read('VERSION')).trim();

// Resolve the new density projection to usable native dimensions. Existing
// non-density CSS-string constants retain their established compatibility shape.
function resolveTokenAlias(value, seen = new Set()) {
  if (typeof value !== 'string' || !/^\{[^{}]+\}$/.test(value)) return value;
  const path = value.slice(1, -1);
  if (seen.has(path)) throw new Error(`Density alias cycle: ${path}`);
  const def = path.split('.').reduce((node, key) => node?.[key], dtcg);
  if (!def || def.$type !== 'dimension') throw new Error(`Invalid density alias: ${path}`);
  return resolveTokenAlias(def.$value, new Set([...seen, path]));
}
const rootCss = Object.fromEntries(Object.entries(dtcg).filter(([g]) => !g.startsWith('$')).flatMap(([, entries]) =>
  Object.entries(entries).filter(([, d]) => d?.$value !== undefined).map(([key, d]) =>
    [key, d.$extensions?.['com.cyberskill']?.css ?? resolveTokenAlias(d.$value)])));
function resolveDensityCss(value, scope, seen = new Set()) {
  const match = /^var\((--cs-[\w-]+)\)$/.exec(value);
  if (!match) return value;
  const key = match[1];
  if (seen.has(key) || scope[key] === undefined) throw new Error(`Invalid density CSS alias: ${key}`);
  return resolveDensityCss(scope[key], scope, new Set([...seen, key]));
}
function densityConstants(name) {
  const declarations = ext.overrides.densities?.[name] || {};
  const scope = { ...rootCss, ...declarations };
  return Object.entries(declarations).map(([css, v]) => ({css,
    name: camel(css) + name[0].toUpperCase() + name.slice(1),
    value: resolveDensityCss(v, scope), type: 'dimension'}));
}

// 1. Base tokens, in DTCG group order.
const base = [];
const byType = {};
for (const [g, entries] of Object.entries(dtcg)) {
  if (g.startsWith('$')) continue;
  for (const [css, def] of Object.entries(entries)) {
    if (css.startsWith('$') || !def || def.$value === undefined) continue;
    const type = def.$type || 'string';
    const metadata = def.$extensions?.['com.cyberskill'] || {};
    const cssRaw = metadata.nativeFormat === 'css' ? metadata.css : undefined;
    base.push({ css, name: camel(css), value: g === 'density' ? resolveTokenAlias(def.$value) : def.$value, type, cssRaw, nativeFormat: metadata.nativeFormat });
    byType[type] = (byType[type] || 0) + 1;
  }
}

// 2. Authored dark overrides. Colors are native values; shadows retain the same
// CSS-string compatibility representation as their base counterparts.
const darkOverrides = Object.entries(ext.overrides.themes.dark || {}).map(([css, value]) => {
  if (parseColor(value)) return {css, name: camel(css) + 'Dark', value, type: 'color'};
  const definition = Object.entries(dtcg).filter(([key]) => !key.startsWith('$')).map(([, entries]) => entries[css]).find(Boolean);
  if (definition?.$type !== 'shadow') throw Error('Unconvertible token dark override ' + css);
  try { valueFromCss('shadow', value); } catch { throw Error('Unconvertible token dark shadow ' + css); }
  return {css, name: camel(css) + 'Dark', value, type: 'shadow', cssRaw: value};
});

// 3. Density Theme attributes, including explicit comfortable reset values.
const densityCompact = densityConstants('compact');
const densityComfortable = densityConstants('comfortable');

// 4. Every light pack and its complete dark counterpart. Dark maps are deltas;
// omitted roles (glow and gradients) retain their light values, as in CSS.
const elementsLight = [], elementsDark = [];
const matchedDark = new Set();
for (const [key, light] of Object.entries(ext.overrides.elements || {})) {
  const darkKey = key.replaceAll('.', '-');
  const dark = ext.overrides.elementsDark?.[darkKey];
  if (!dark) throw Error('Unconvertible token pack: missing dark ' + key);
  matchedDark.add(darkKey);
  if (Object.keys(dark).some(name => !Object.hasOwn(light, name))) throw Error('Unconvertible token pack: unknown dark role ' + key);
  const suffix = pascalScope(key);
  for (const [css, value] of Object.entries(light)) {
    elementsLight.push({css, name: camel(css) + suffix + 'Light', value, type: 'color'});
    elementsDark.push({css, name: camel(css) + suffix + 'Dark', value: dark[css] ?? value, type: 'color'});
  }
}
if (Object.keys(ext.overrides.elementsDark || {}).some(key => !matchedDark.has(key))) throw Error('Unconvertible token pack: unmatched dark scope');

function render(list, lang) {
  const out = [];
  for (const t of list) {
    const e = expected(t.name, t.type, t.value, t.cssRaw, t.nativeFormat);
    if (!e) throw new Error(`Unconvertible token ${t.css} (${t.type}); no native outputs were written`);
    out.push(e[lang]);
  }
  return out;
}

// Deterministic output: never embed wall-clock time in headers or provenance.
// A clock stamp made every CI run "dirty", which race-failed auto-commits on main.
const sourceSha256 = sha256(dtcgText);
const shaShort = sourceSha256.slice(0, 16) + '…';

const HEADER = (lang) => [
  '// CyberSkill Design System — native design tokens.',
  '// GENERATED from tokens/tokens.dtcg.json — do not hand-edit; regenerate on token change.',
  `// release v${VERSION} · source sha256 ${shaShort}`,
  '// conversions: rem→px at 16 · em→…Em relative doubles · rgba alpha→ARGB byte (round(a*255)) · durations in ms',
  '// dark element packs: see $extensions.overrides.elementsDark',
  '// provenance: tokens/provenance.json · parity gate: _audit/token-pipeline-test.html',
  '',
].join('\n');

function buildSwift() {
  const lines = [HEADER('swift'), 'import SwiftUI', '', 'public enum CSTokens {',
    '  /// 0xRRGGBB (+ alpha param) → SwiftUI Color',
    '  public static func color(_ hex: UInt32, alpha: Double = 1) -> Color {',
    '    Color(red: Double((hex >> 16) & 0xFF)/255, green: Double((hex >> 8) & 0xFF)/255, blue: Double(hex & 0xFF)/255, opacity: alpha)',
    '  }', ''];
  for (const l of render(base, 'swift')) lines.push('  public static ' + l);
  lines.push('', '  // MARK: dark-theme color overrides');
  for (const l of render(darkOverrides, 'swift')) lines.push('  public static ' + l);
  for (const [scope, entries] of [['compact', densityCompact], ['comfortable', densityComfortable]]) {
    if (!entries.length) continue;
    lines.push('', '  // ' + scope + '-density Theme metrics');
    for (const l of render(entries, 'swift')) lines.push('  public static ' + l);
  }
  lines.push('', '  // Complete light elemental accent packs');
  for (const l of render(elementsLight, 'swift')) lines.push('  public static ' + l);
  lines.push('', '  // MARK: dark elemental accent packs (APCA-derived, v4.0.0)');
  for (const l of render(elementsDark, 'swift')) lines.push('  public static ' + l);
  lines.push('}', '');
  return lines.join('\n');
}
function buildKt() {
  const lines = [HEADER('kt'), 'package world.cyberskill.tokens', '', 'import androidx.compose.ui.graphics.Color', 'import androidx.compose.ui.unit.dp', '', 'object CSTokens {'];
  for (const l of render(base, 'kt')) lines.push('  ' + l);
  lines.push('', '  // dark-theme color overrides');
  for (const l of render(darkOverrides, 'kt')) lines.push('  ' + l);
  for (const [scope, entries] of [['compact', densityCompact], ['comfortable', densityComfortable]]) {
    if (!entries.length) continue;
    lines.push('', '  // ' + scope + '-density Theme metrics');
    for (const l of render(entries, 'kt')) lines.push('  ' + l);
  }
  lines.push('', '  // Complete light elemental accent packs');
  for (const l of render(elementsLight, 'kt')) lines.push('  ' + l);
  lines.push('', '  // dark elemental accent packs (APCA-derived, v4.0.0)');
  for (const l of render(elementsDark, 'kt')) lines.push('  ' + l);
  lines.push('}', '');
  return lines.join('\n');
}
function buildDart() {
  const lines = [HEADER('dart'), "import 'package:flutter/material.dart';", '', 'class CSTokens {', '  CSTokens._();'];
  for (const l of render(base, 'dart')) lines.push('  static const ' + l.replace(/^const /, ''));
  lines.push('', '  // dark-theme color overrides');
  for (const l of render(darkOverrides, 'dart')) lines.push('  static const ' + l.replace(/^const /, ''));
  for (const [scope, entries] of [['compact', densityCompact], ['comfortable', densityComfortable]]) {
    if (!entries.length) continue;
    lines.push('', '  // ' + scope + '-density Theme metrics');
    for (const l of render(entries, 'dart')) lines.push('  static const ' + l.replace(/^const /, ''));
  }
  lines.push('', '  // Complete light elemental accent packs');
  for (const l of render(elementsLight, 'dart')) lines.push('  static const ' + l.replace(/^const /, ''));
  lines.push('', '  // dark elemental accent packs (APCA-derived, v4.0.0)');
  for (const l of render(elementsDark, 'dart')) lines.push('  static const ' + l.replace(/^const /, ''));
  lines.push('}', '');
  return lines.join('\n');
}

const swift = buildSwift(), kt = buildKt(), dart = buildDart();
await write('tokens/native/CSTokens.swift', swift);
await write('tokens/native/CSTokens.kt', kt);
await write('tokens/native/cs_tokens.dart', dart);

const provenance = {
  system: ext.system,
  release: VERSION,
  source: 'tokens/tokens.dtcg.json',
  sourceSha256,
  dtcgStamp: { version: ext.version, generated: ext.generated },
  conversions: { remBasePx: 16, emSuffix: 'Em (relative)', alphaToArgbByte: 'round(a*255)', durationsUnit: 'ms', densitySuffix: 'Compact / Comfortable (Theme attribute)', lightPackSuffix: '<Scope>Light', darkPackSuffix: '<Scope>Dark (authored dark deltas plus inherited light roles)' },
  counts: { baseTokens: base.length, byType, darkColorOverrides: darkOverrides.filter(t => t.type === 'color').length, darkCssOverrides: darkOverrides.filter(t => t.type !== 'color').length, densityCompactOverrides: densityCompact.length, densityComfortableOverrides: densityComfortable.length, lightPackConstants: elementsLight.length, darkPackConstants: elementsDark.length, skipped: 0 },
  skipped: [],
  targets: [
    { file: 'tokens/native/CSTokens.swift', lang: 'swift', sha256: sha256(swift) },
    { file: 'tokens/native/CSTokens.kt', lang: 'kotlin', sha256: sha256(kt) },
    { file: 'tokens/native/cs_tokens.dart', lang: 'dart', sha256: sha256(dart) },
  ],
};
await write('tokens/provenance.json', JSON.stringify(provenance, null, 2) + '\n');

console.log(`Regenerated tokens/native/* — ${base.length} base + ${darkOverrides.length} dark + ${densityCompact.length} compact + ${densityComfortable.length} comfortable + ${elementsLight.length} light-pack + ${elementsDark.length} dark-pack tokens.`);
