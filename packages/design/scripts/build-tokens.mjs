// Builds dist/tokens.css, dist/tailwind.css, dist/tokens.{js,d.ts,json} from tokens/*.json,
// and fails if any color rule breaks: text contrast, status + chart distinctness (normal and color-blind vision).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// TOKENS_DIR / OUT_DIR let the gate tests run against bad fixtures without touching the real tokens.
const tokensDir = process.env.TOKENS_DIR ?? join(root, 'tokens');
const read = f => JSON.parse(readFileSync(join(tokensDir, f), 'utf8'));
const C = read('color.json'), F = read('foundations.json');
const HEX = /^#[0-9A-F]{6}$/i;
const bad = [];
const hex6 = (v, where) => { if (typeof v !== 'string' || !HEX.test(v)) bad.push(`${where}: "${v}" is not a #RRGGBB color`); return String(v).toUpperCase(); };
const val = (group, where) => Object.fromEntries(Object.entries(group).filter(([k]) => !k.startsWith('$')).map(([k, v]) => [k, hex6(v.$value, `${where}.${k}`)]));

import { rgb, lin, contrast, oklch, deltaE, cvd } from './color-math.mjs';
const toHex = (L, Cc, H) => { // OKLCH -> sRGB hex, shrinking chroma until in gamut
  for (let c = Cc, i = 0; i < 400; c *= 0.97, i++) {
    const a = c * Math.cos((H * Math.PI) / 180), b = c * Math.sin((H * Math.PI) / 180);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const out = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
    if (out.every(v => v >= -1e-4 && v <= 1 + 1e-4) || c < 1e-4)
      return '#' + out.map(v => Math.round(255 * (Math.min(1, Math.max(0, v)) <= 0.0031308 ? 12.92 * Math.min(1, Math.max(0, v)) : 1.055 * Math.min(1, Math.max(0, v)) ** (1 / 2.4) - 0.055)).toString(16).padStart(2, '0')).join('').toUpperCase();
  }
  throw new Error(`could not map oklch(${L} ${Cc} ${H}) into sRGB`);
};
const mix = (a, b, t) => '#' + rgb(a).map((x, i) => Math.round(x * t + rgb(b)[i] * (1 - t)).toString(16).padStart(2, '0')).join('').toUpperCase();
const onColor = (fill, dark) => (contrast('#FFFFFF', fill) >= contrast(dark, fill) ? '#FFFFFF' : dark);

/* ---------- semantic colors + derived tokens ---------- */
const theme = {};
const NAMES = Object.keys(C.light).filter(k => !k.startsWith('$'));
for (const mode of ['light', 'dark']) {
  const c = val(C[mode], mode);
  const missing = NAMES.filter(k => !(k in c)), extra = Object.keys(c).filter(k => !NAMES.includes(k));
  if (missing.length || extra.length) bad.push(`${mode}: tokens differ from light (missing ${missing.join(', ') || 'none'}; extra ${extra.join(', ') || 'none'})`);
  if (missing.length) continue; // derived tokens below need the full set
  c['primary-soft'] = mix(c.primary, c.panel, 0.12);
  for (const k of ['destructive', 'success', 'warning', 'info']) c[`${k}-foreground`] = onColor(c[k], c.background);
  c.ring = c.primary;
  theme[mode] = c;
}
const chart = { light: C.chart.light.map((h, i) => hex6(h, `chart.light[${i}]`)), dark: C.chart.dark.map((h, i) => hex6(h, `chart.dark[${i}]`)) };
if (chart.light.length !== C.chart.names.length || chart.dark.length !== C.chart.names.length) bad.push(`chart: light, dark and names must all have ${C.chart.names.length} entries`);
hex6(C.brand.ink.$value, 'brand.ink'); hex6(C.brand.gold.$value, 'brand.gold');
if (bad.length) { console.error(`✗ invalid tokens:\n  ${bad.join('\n  ')}`); process.exit(1); }

/* ---------- rules ---------- */
const PAIRS = [
  ['foreground', 'background', 7, 'Body text'], ['foreground', 'panel', 7, 'Text on cards'],
  ['muted', 'background', 4.5, 'Secondary text'], ['muted', 'panel', 4.5, 'Secondary text on cards'], ['muted', 'raised', 4.5, 'Secondary text on raised'],
  ['primary-foreground', 'primary', 4.5, 'Primary button'], ['accent-foreground', 'accent', 4.5, 'Accent button'],
  ['primary', 'background', 3, 'Primary as UI and focus'], ['accent-text', 'background', 4.5, 'Gold as text'], ['input', 'panel', 3, 'Input border'],
  ['success', 'panel', 4.5, 'Success text'], ['warning', 'panel', 4.5, 'Warning text'], ['destructive', 'panel', 4.5, 'Error text'], ['info', 'panel', 4.5, 'Info text'],
  ['success', 'background', 4.5, 'Success text on page'], ['warning', 'background', 4.5, 'Warning text on page'], ['destructive', 'background', 4.5, 'Error text on page'], ['info', 'background', 4.5, 'Info text on page'],
  ['destructive-foreground', 'destructive', 4.5, 'Destructive button'], ['success-foreground', 'success', 4.5, 'Filled success'],
  ['warning-foreground', 'warning', 4.5, 'Filled warning'], ['info-foreground', 'info', 4.5, 'Filled info'], ['primary', 'primary-soft', 4.5, 'Active nav item'],
  ['success', 'raised', 4.5, 'Success text on raised'], ['warning', 'raised', 4.5, 'Warning text on raised'], ['destructive', 'raised', 4.5, 'Error text on raised'], ['info', 'raised', 4.5, 'Info text on raised'],
  ['input', 'background', 3, 'Input border on page'], ['input', 'raised', 3, 'Input border on raised'], ['foreground', 'raised', 7, 'Text on raised'],
  ['accent-text', 'panel', 4.5, 'Gold as text on cards'], // not on raised: no gold dark enough for that stays 12 ΔE from warning
];
// Soft badges draw the tone's text on an 8% tint of it over --panel (badge.css); keep the two in step.
const TINTED = [['success', 'success'], ['warning', 'warning'], ['destructive', 'destructive'], ['info', 'info'], ['accent-text', 'accent']];
const BAND = { light: [0.43, 0.77], dark: [0.48, 0.67] };
const failures = [], checks = { light: [], dark: [] };
for (const mode of ['light', 'dark']) {
  const t = theme[mode];
  for (const [fg, bg, need, label] of PAIRS) {
    const r = contrast(t[fg], t[bg]); checks[mode].push({ label, fg, bg, ratio: +r.toFixed(2), need });
    if (r < need) failures.push(`${mode}: ${label} ${t[fg]} on ${t[bg]} = ${r.toFixed(2)} < ${need}`);
  }
  for (const [fg, tint] of TINTED) {
    const bg = mix(t[tint], t.panel, 0.08), r = contrast(t[fg], bg); checks[mode].push({ label: `${fg} on its soft tint`, fg, bg: `${tint} 8%`, ratio: +r.toFixed(2), need: 4.5 });
    if (r < 4.5) failures.push(`${mode}: ${fg} text on its soft tint ${bg} = ${r.toFixed(2)} < 4.5`);
  }
  const status = { success: t.success, warning: t.warning, error: t.destructive };
  const names = Object.keys(status);
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
    const a = status[names[i]], b = status[names[j]], n = deltaE(a, b), v = cvd(a, b);
    if (n < 15) failures.push(`${mode}: ${names[i]} vs ${names[j]} too alike for normal vision (ΔE ${n.toFixed(1)} < 15)`);
    if (v < 8) failures.push(`${mode}: ${names[i]} vs ${names[j]} too alike for color-blind readers (ΔE ${v.toFixed(1)} < 8)`);
  }
  for (const k of names) { const n = deltaE(status[k], t.info); if (n < 15) failures.push(`${mode}: ${k} vs info too alike (${n.toFixed(1)})`); }
  // Gold fill vs warning: 15. Gold as text (emphasis only, never a status; warnings always carry an icon): 12,
  // because no gold text dark enough for 4.5:1 on light surfaces gets further from the warning brown.
  for (const [k, needN] of [['accent', 15], ['accent-text', 12]]) {
    const n = deltaE(t[k], t.warning), v = cvd(t[k], t.warning);
    if (n < needN) failures.push(`${mode}: ${k} vs warning too alike for normal vision (ΔE ${n.toFixed(1)} < ${needN})`);
    if (v < 8) failures.push(`${mode}: ${k} vs warning too alike for color-blind readers (ΔE ${v.toFixed(1)} < 8)`);
  }
  const against = [t.success, t.warning, t.destructive, t.info, t.accent];
  chart[mode].forEach((h, i) => {
    const [L, Cc] = oklch(h);
    if (L < BAND[mode][0] || L > BAND[mode][1]) failures.push(`${mode}: chart ${i + 1} ${h} lightness ${L.toFixed(2)} outside ${BAND[mode]}`);
    if (Cc < 0.1) failures.push(`${mode}: chart ${i + 1} ${h} chroma ${Cc.toFixed(3)} reads as gray`);
    if (contrast(h, t.panel) < 3) failures.push(`${mode}: chart ${i + 1} ${h} under 3:1 on ${t.panel}`);
    for (const s of against) if (deltaE(h, s) < 15) failures.push(`${mode}: chart ${i + 1} ${h} too close to status/gold ${s} (${deltaE(h, s).toFixed(1)})`);
    // Every pair: >= 15 for normal vision. Color-blind: >= 8 for neighbours, >= 6 for the rest
    // (the data-viz floor, allowed because every chart also has a legend, direct labels and a table view).
    chart[mode].forEach((o, j) => {
      if (j <= i) return;
      const n = deltaE(h, o), v = cvd(h, o), needC = j === i + 1 ? 8 : 6;
      if (n < 15) failures.push(`${mode}: chart ${i + 1} vs ${j + 1} too alike for normal vision (ΔE ${n.toFixed(1)} < 15)`);
      if (v < needC) failures.push(`${mode}: chart ${i + 1} vs ${j + 1} too alike for color-blind readers (ΔE ${v.toFixed(1)} < ${needC})`);
    });
  });
}
if (failures.length) { console.error(`✗ ${failures.length} token rule(s) failed:\n  ` + failures.join('\n  ')); process.exit(1); }

/* ---------- ramps (OKLCH, exact brand color pinned) ---------- */
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const LS = [0.975, 0.945, 0.89, 0.81, 0.72, 0.63, 0.54, 0.46, 0.38, 0.3, 0.22];
const CM = [0.12, 0.24, 0.45, 0.68, 0.88, 1, 1, 0.92, 0.8, 0.66, 0.5];
const ramp = (base, flatChroma) => {
  const [L0, C0, H] = oklch(base);
  const out = STEPS.map((s, i) => ({ step: s, hex: toHex(LS[i], flatChroma ?? C0 * CM[i], H) }));
  if (flatChroma === undefined) { const i = LS.reduce((b, l, k) => (Math.abs(l - L0) < Math.abs(LS[b] - L0) ? k : b), 0); out[i] = { step: STEPS[i], hex: base, base: true }; }
  return out;
};
const ramps = { ink: ramp(C.brand.ink.$value.toUpperCase()), gold: ramp(C.brand.gold.$value.toUpperCase()), neutral: ramp(theme.light.foreground, Math.min(0.02, oklch(theme.light.foreground)[1] * 0.5)) };

/* ---------- emit ---------- */
const px = n => (n === 0 ? '0' : `${n}px`);
// Text and control sizes are emitted in rem (16px = 1rem), so they grow with the reader's browser font size.
const rem = n => `${+(n / 16).toFixed(4)}rem`;
const colorVars = t => Object.entries(t).map(([k, v]) => `  --${k}: ${v};`);
const chartVars = list => list.map((h, i) => `  --chart-${i + 1}: ${h};`);
const shadowVars = s => Object.entries(s).map(([k, v]) => `  --shadow-${k}: ${v};`);
const aliases = ['  --card: var(--panel);', '  --card-foreground: var(--foreground);', '  --popover: var(--panel);', '  --popover-foreground: var(--foreground);',
  '  --gold: var(--accent);', '  --on-gold: var(--accent-foreground);', '  --muted-foreground: var(--muted);'];
// Aliases live in every theme block: var() resolves where it is declared, so a :root-only alias would stay light inside dark scopes.
const themeBlock = mode => [...colorVars(theme[mode]), ...chartVars(chart[mode]), ...shadowVars(F.shadow[mode]), ...aliases];
const constants = [
  ...Object.entries(F.font).map(([k, v]) => `  --font-${k}: ${v.$value};`),
  ...Object.entries(F.text).flatMap(([k, t]) => [`  --text-${k}-size: ${rem(t.size)};`, `  --text-${k}-line: ${rem(t.line)};`, `  --text-${k}-weight: ${t.weight};`, `  --text-${k}-tracking: ${t.tracking};`, `  --text-${k}-family: var(--font-${t.family});`]),
  ...Object.entries(F.space).map(([k, v]) => `  --space-${k}: ${px(v)};`),
  '  --space-xs: var(--space-1);', '  --space-sm: var(--space-2);', '  --space-md: var(--space-4);', '  --space-lg: var(--space-6);', '  --space-xl: var(--space-8);', '  --space-2xl: var(--space-12);', '  --space-3xl: var(--space-16);',
  ...Object.entries(F.radius).map(([k, v]) => `  --radius-${k}: ${px(v)};`),
  ...Object.entries(F.duration).map(([k, v]) => `  --duration-${k}: ${v};`),
  ...Object.entries(F.ease).map(([k, v]) => `  --ease-${k}: ${v};`),
  ...Object.entries(F.z).map(([k, v]) => `  --z-${k}: ${v};`),
  ...Object.entries(F.control).map(([k, v]) => `  --control-${k}: ${rem(v)};`),
  `  --brand-ink: ${C.brand.ink.$value};`, `  --brand-gold: ${C.brand.gold.$value};`,
  ...Object.entries(ramps).flatMap(([name, r]) => r.map(s => `  --${name}-${s.step}: ${s.hex};`)),
];
const banner = '/* @cyberskill/design tokens. Generated by scripts/build-tokens.mjs from tokens/*.json. Do not edit. */';
const css = [banner,
  '/* Light is the default. Set data-theme="dark" on <html> or any element for dark, or data-theme="system" to follow the OS. */',
  ':root {', ...constants, '}',
  ':root, [data-theme="light"], [data-theme="system"] {', ...themeBlock('light'), '}',
  '[data-theme="dark"] {', ...themeBlock('dark'), '}',
  '@media (prefers-color-scheme: dark) {', '  [data-theme="system"] {', ...themeBlock('dark').map(l => '  ' + l), '  }', '}',
  '/* color-scheme only where a theme is chosen, so apps with their own dark mode keep their scrollbars and form controls */',
  '[data-theme="light"] { color-scheme: light; }', '[data-theme="dark"] { color-scheme: dark; }', '[data-theme="system"] { color-scheme: light dark; }', ''].join('\n');

// No @import of tokens.css here: styles.css already holds the tokens, and importing both would ship them twice.
const tw = [banner, '/* Tailwind v4: @import "tailwindcss"; then this file, then @import "@cyberskill/design/styles.css" (or tokens.css). Only maps names. */', '@theme inline {',
  ...[...Object.keys(theme.light), 'card', 'card-foreground', 'popover', 'popover-foreground', 'gold', 'on-gold'].map(k => `  --color-${k}: var(--${k});`),
  ...chart.light.map((_, i) => `  --color-chart-${i + 1}: var(--chart-${i + 1});`),
  ...Object.keys(F.font).map(k => `  --font-${k}: var(--font-${k});`),
  ...Object.keys(F.radius).filter(k => k !== 'full').map(k => `  --radius-${k}: var(--radius-${k});`),
  ...Object.keys(F.shadow.light).map(k => `  --shadow-${k}: var(--shadow-${k});`),
  ...Object.keys(F.breakpoint).map(k => `  --breakpoint-${k}: ${F.breakpoint[k] / 16}rem;`),
  '}', ''].join('\n');

const data = { color: theme, chart: { names: C.chart.names, ...chart }, brand: { ink: C.brand.ink.$value, gold: C.brand.gold.$value }, ramps,
  font: Object.fromEntries(Object.entries(F.font).map(([k, v]) => [k, v.$value])), text: F.text, space: F.space, radius: F.radius, shadow: F.shadow,
  duration: F.duration, ease: F.ease, z: F.z, breakpoint: F.breakpoint, control: F.control, checks };
const dist = process.env.OUT_DIR ?? join(root, 'dist'); mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, 'tokens.css'), css);
writeFileSync(join(dist, 'tailwind.css'), tw);
writeFileSync(join(dist, 'tokens.json'), JSON.stringify(data, null, 2));
writeFileSync(join(dist, 'tokens.js'), `${banner}\nexport const tokens = ${JSON.stringify(data, null, 2)};\nexport default tokens;\n`);
writeFileSync(join(dist, 'tokens.d.ts'), `${banner}\nexport declare const tokens: ${JSON.stringify(data, null, 2).replace(/"(#[0-9A-F]{6})"/g, '"$1"')};\nexport default tokens;\n`);
const n = checks.light.length + checks.dark.length;
console.log(`✓ tokens built: ${Object.keys(theme.light).length} colors × 2 themes, ${n} contrast checks, status + chart distinctness passed`);
