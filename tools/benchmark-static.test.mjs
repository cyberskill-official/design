import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { newResults } from './benchmark/score.mjs';
import { motionDiscipline, colorRoles } from './benchmark/static.mjs';
import { cssRules } from '../packages/design/bin/motion-rules.mjs';

// A package folder holding only the files the D24 and D25 checks read.
const pkgWith = files => {
  const dir = mkdtempSync(join(tmpdir(), 'cs-bench-'));
  for (const [rel, text] of Object.entries(files)) { mkdirSync(dirname(join(dir, rel)), { recursive: true }); writeFileSync(join(dir, rel), text); }
  return dir;
};
const fails = (results, dim) => [...results[dim].fails].map(([k, d]) => `${k}: ${d}`);

// D24 reads the built tokens (dist/tokens.json and the reduced-motion block of dist/tokens.css) and motion.css's keyframe blanket.
const BUILT = JSON.stringify({
  duration: { instant: '80ms', fast: '120ms', base: '180ms', slow: '280ms' },
  motion: { state: ['fast', 'standard'], fade: ['base', 'enter'], release: 'snappy', move: 'snappy', 'pop-in': ['base', 'enter'], 'modal-in': 'smooth', 'sheet-out': ['slow', 'sheet'] },
  motionReduced: { instant: ['release', 'move', 'pop-in', 'sheet-out'], fade: ['modal-in'], keep: ['state', 'fade'] },
  motionValue: { 'press-scale': '0.97', rise: '8px' },
});
const REDUCED = { '--motion-release': '1ms linear', '--motion-move': '1ms linear', '--motion-pop-in': '1ms linear', '--motion-sheet-out': '1ms linear', '--motion-modal-in': 'var(--duration-base) var(--ease-enter)', '--motion-press-scale': '1', '--motion-rise': '0px' };
const reducedCss = (values = REDUCED, media = '@media (prefers-reduced-motion: reduce)', scope = ':root') => `:root { --motion-state: 1ms; }\n${media} {\n  ${scope} {\n${Object.entries(values).map(([k, v]) => `    ${k}: ${v};`).join('\n')}\n  }\n}\n`;
const BLANKET = '@media (prefers-reduced-motion: reduce) {\n  :where([class^="cs-"], [class*=" cs-"]) { animation-duration: 1ms; animation-delay: 0ms; animation-iteration-count: 1; }\n}\n';
const motionPkg = (components, { tokens = reducedCss(), motion = BLANKET } = {}) => pkgWith({
  'dist/tokens.json': BUILT, 'dist/tokens.css': tokens, 'src/css/motion.css': motion,
  ...Object.fromEntries(Object.entries({ ok: '.ok { transition: none; }', ...components }).map(([n, css]) => [`src/css/components/${n}.css`, css])),
});

test('cssRules reads nested rules, @media chains, wrapped values and declaration lines', () => {
  const rules = cssRules('/* a; b { } */\n.cs-x {\n  color: var(--primary);\n  &[data-on] { background: var(--accent); }\n}\n@media (hover: hover) { .cs-y { opacity: 1 } }\n.cs-z {\n  transition:\n    opacity var(--motion-fade);\n  background: url("data:image/svg+xml;utf8,<svg/>");\n}\n');
  assert.deepEqual(rules.map(r => r.selector), ['.cs-x', '.cs-x &[data-on]', '@media (hover: hover)', '@media (hover: hover) .cs-y', '.cs-z']);
  assert.deepEqual(rules[0].decls, [{ prop: 'color', value: 'var(--primary)', line: 3 }]);
  assert.equal(rules[1].line, 4);
  assert.deepEqual(rules[3].chain, ['@media (hover: hover)', '.cs-y']);
  assert.deepEqual(rules[4].decls.map(d => [d.prop, d.line]), [['transition', 8], ['background', 10]]);
});

test('D24 passes transitions and animations on recipes, motion switched off, loading loops and the drawer flick', () => {
  const r = newResults();
  motionDiscipline(r, motionPkg({
    button: '.cs-button {\n  transition: background-color var(--motion-state), transform var(--motion-release);\n  &[data-swiping] { transition-duration: 0ms; }\n  &[data-instant] { transition: none; }\n}\n',
    drawer: '.cs-drawer[data-ending-style] { transition: transform var(--motion-sheet-out); transition-duration: calc(var(--drawer-swipe-strength, 1) * var(--duration-slow)); }',
    popup: '.cs-popup {\n  transition:\n    opacity var(--motion-fade),\n    transform var(--motion-pop-in),\n    height var(--motion-pop-in);\n}\n',
    spinner: '.cs-spinner { animation: cs-spin 0.8s linear infinite; }\n.cs-reveal { animation: cs-reveal var(--motion-reveal) backwards; animation-delay: calc(var(--_step, 0) * var(--motion-stagger)); }',
  }));
  assert.deepEqual(fails(r, 'D24'), []);
  for (const k of ['reduced motion shortens --motion-release', 'reduced motion shortens --motion-pop-in', 'reduced motion shortens --motion-modal-in', 'reduced motion neutralizes --motion-rise', 'reduced motion ends keyframe animations (motion.css)']) assert.ok(r.D24.seen.has(k), k);
  assert.ok(!r.D24.seen.has('reduced motion shortens --motion-state')); // short and plain: reduced motion keeps it
});

test('D24 fails raw timing, all, a bare recipe, movement or size on the wrong recipe, and a raw animation', () => {
  const r = newResults();
  motionDiscipline(r, motionPkg({
    raw: '.a { transition: opacity 200ms ease-out; }',
    tokens: '.b { transition: color var(--duration-fast) var(--ease-standard); }',
    all: '.c { -webkit-transition: all var(--motion-state); }',
    bare: '.d { transition: var(--motion-state); }',
    moving: '.e {\n  transition: transform var(--motion-state);\n}',
    sized: '.f { transition: inline-size var(--motion-fade), top var(--motion-sheet-in); }',
    longhand: '.g { transition-duration: var(--duration-slow); }',
    animation: '.h { animation: cs-pulse 2s linear; & .child { animation: cs-spin 1s linear infinite; } }',
  }));
  const f = fails(r, 'D24').join('\n');
  assert.match(f, /raw\.css animates on recipes: line 1: transition has a raw time \(200ms\)/);
  assert.match(f, /tokens\.css .*uses var\(--duration-fast\) directly/);
  assert.match(f, /all\.css .*-webkit-transition: all/);
  assert.match(f, /bare\.css .*names no property, which means all/);
  assert.match(f, /moving\.css .*line 2: transform animates with var\(--motion-state\)/);
  assert.match(f, /sized\.css .*inline-size animates with var\(--motion-fade\).*top animates with var\(--motion-sheet-in\)/);
  assert.match(f, /longhand\.css .*transition-duration uses var\(--duration-slow\) directly/);
  assert.match(f, /animation\.css .*animation has a raw time \(2s\)/, 'a nested loading loop does not exempt its parent');
});

test('D24 fails when reduced motion leaves a recipe running, misses a start value, or is negated or scoped', () => {
  const r = newResults();
  const { '--motion-press-scale': _, ...noScale } = REDUCED;
  motionDiscipline(r, motionPkg({}, { tokens: reducedCss({ ...noScale, '--motion-release': 'var(--spring-snappy-duration) var(--spring-snappy)', '--motion-pop-in': 'var(--duration-base) var(--ease-enter)', '--motion-rise': '4px' }), motion: '' }));
  const f = fails(r, 'D24').join('\n');
  assert.match(f, /shortens --motion-release: redefined as .*needs to end at once/);
  assert.match(f, /shortens --motion-pop-in: redefined as var\(--duration-base\).*needs to end at once/, 'size recipes must end at once');
  assert.match(f, /neutralizes --motion-press-scale: tokens\.css does not redefine it/);
  assert.match(f, /neutralizes --motion-rise: redefined as 4px, needs 0/);
  assert.match(f, /ends keyframe animations \(motion\.css\): no rule on cs- classes/);
  for (const tokens of [reducedCss(REDUCED, '@media not (prefers-reduced-motion: reduce)'), reducedCss(REDUCED, '@media (prefers-reduced-motion: reduce)', '.cs-dialog')]) {
    const n = newResults();
    motionDiscipline(n, motionPkg({}, { tokens }));
    assert.match(fails(n, 'D24').join('\n'), /shortens --motion-release: tokens\.css does not redefine it/);
  }
});

const TONE_TS = "export type CategoryTone = 'blue' | 'teal';\nexport type StatusTone = 'success';\nexport type Tone = 'primary' | 'accent' | StatusTone | CategoryTone;\n";
const TOKENS = (dark = '--teal-soft: #000; --teal-icon: #000;') => `:root { --radius-md: 8px; }\n:root, [data-theme="light"], [data-theme="system"] {\n  --primary: #000; --primary-soft: #000; --accent: #000; --accent-text: #000; --accent-soft: #000; --success: #000; --success-soft: #000; --chart-1: #000; --chart-3: #000; --blue-soft: #000; --blue-icon: #000; --teal-soft: #000; --teal-icon: #000;\n}\n[data-theme="dark"] {\n  --primary: #000; --primary-soft: #000; --accent: #000; --accent-text: #000; --accent-soft: #000; --success: #000; --success-soft: #000; --chart-1: #000; --chart-3: #000; --blue-soft: #000; --blue-icon: #000; ${dark}\n}\n@media (prefers-color-scheme: dark) { [data-theme="system"] { --primary: #000; } }\n`;
const TONE_CSS = (teal = '') => `:where(.cs-tone, [data-tone]) {\n  --tone: var(--primary);\n  --tone-on: var(--primary);\n  --tone-soft: var(--primary-soft);\n  --tone-icon: var(--primary);\n}\n[data-tone='accent'] { --tone: var(--accent); --tone-soft: var(--accent-soft); --tone-icon: var(--accent-text); }\n[data-tone='success'] { --tone: var(--success); --tone-soft: var(--success-soft); --tone-icon: var(--success); }\n[data-tone='blue'] { --tone: var(--chart-1); --tone-soft: var(--blue-soft); --tone-icon: var(--blue-icon); }\n[data-tone='teal'] {\n  --tone: var(--chart-3);\n  --tone-soft: var(--teal-soft);\n  --tone-icon: var(--teal-icon);${teal}\n}\n`;
const GOLD = {
  switch: '.cs-switch { &[data-checked] { background: var(--accent); border-color: var(--accent-text); } }',
  checkbox: '.cs-checkbox { &[data-checked] { background: var(--accent); border-color: var(--accent-text); } }',
  radio: '.cs-radio { &[data-checked] { background: var(--accent); border-color: var(--accent-text); } }',
  slider: '.cs-slider-indicator { background: var(--accent); box-shadow: inset 0 0 0 1px var(--accent-text); }',
  progress: '.cs-progress { --_fill: var(--accent); --_edge: var(--accent-text); }\n.cs-progress-indicator { background: var(--_fill); box-shadow: inset 0 0 0 1px var(--_edge); }',
  meter: '.cs-meter { --_fill: var(--accent); --_edge: var(--accent-text); }\n.cs-meter-indicator { background: var(--_fill); box-shadow: inset 0 0 0 1px var(--_edge); }',
  'side-nav': '.cs-side-nav-badge { border: 1px solid var(--accent-text); background: var(--accent); color: var(--accent-foreground); }',
};
const colorPkg = ({ tokens = TOKENS(), tone = TONE_CSS(), components = {} } = {}) => pkgWith({
  'src/react/tone.ts': TONE_TS, 'dist/tokens.css': tokens, 'src/css/components/tone.css': tone,
  ...Object.fromEntries(Object.entries({ ...GOLD, ...components }).map(([n, css]) => [`src/css/components/${n}.css`, css])),
});

test('D25 passes a complete tone map, soft category tints and edged gold fills', () => {
  const r = newResults();
  colorRoles(r, colorPkg({ components: { avatar: '.cs-avatar { background: var(--tone-soft); color: var(--tone-text); }', chart: '.cs-chart-bar { background: var(--chart-1); color: var(--foreground); }' } }));
  assert.deepEqual(fails(r, 'D25'), []);
  for (const k of ['tone map has primary', 'tone map has teal', 'tone teal has every role in both themes', 'progress.css fills with gold']) assert.ok(r.D25.seen.has(k), k);
});

test('D25 fails a role token missing from one theme, a missing tone and a category tone with an on-color', () => {
  const r = newResults();
  colorRoles(r, colorPkg({ tokens: TOKENS('--teal-soft: #000;'), tone: TONE_CSS('\n  --tone-on: var(--primary);').replace(/\[data-tone='success'\][^\n]*\n/, '') }));
  const f = fails(r, 'D25').join('\n');
  assert.match(f, /tone teal has every role in both themes: --teal-icon not in both themes of tokens\.css/);
  assert.match(f, /tone map has success: no \[data-tone='success'\] rule/);
  assert.match(f, /tone\.css puts no text on a solid category color: line \d+: a category tone sets --tone-on/);
});

test('D25 fails text on a solid category color and a gold fill without an --accent-text edge', () => {
  const r = newResults();
  colorRoles(r, colorPkg({ components: {
    tag: '.cs-tag {\n  background: var(--teal-icon);\n  color: var(--foreground);\n}',
    badge: '.cs-badge[data-variant="solid"] {\n  [data-tone=\'blue\'] & { background: var(--tone); color: var(--tone-on); }\n}',
    switch: '.cs-switch { &[data-checked] { background: var(--accent); border-color: var(--border); } }',
    meter: '.cs-meter { background: var(--primary); }',
  } }));
  const f = fails(r, 'D25').join('\n');
  assert.match(f, /tag\.css puts no text on a solid category color: line 2: text on var\(--teal-icon\)/);
  assert.match(f, /badge\.css puts no text on a solid category color: line 2: text on var\(--tone\)/);
  assert.match(f, /switch\.css ".cs-switch &\[data-checked\]" gold fill has an --accent-text edge/);
  assert.match(f, /meter\.css fills with gold: no rule paints a background with var\(--accent\)/);
});

test('D25 counts a gold fill only where it is painted, color-mix included, and an edge only where it is painted', () => {
  const r = newResults();
  colorRoles(r, colorPkg({ components: {
    meter: '.cs-meter { --_fill: var(--accent); --_edge: var(--accent-text); }', // assigned, never painted
    progress: '.cs-progress { --_fill: var(--accent); --_edge: var(--accent-text); }\n.cs-progress-indicator { background: var(--_fill); --_ring: var(--_edge); }',
    'side-nav': '.cs-side-nav-badge {\n  border: 1px solid var(--accent-text);\n  background: var(--accent);\n  &:hover { background: color-mix(in srgb, var(--accent) 88%, var(--foreground)); }\n}',
  } }));
  const f = fails(r, 'D25').join('\n');
  assert.match(f, /meter\.css fills with gold: no rule paints a background with var\(--accent\)/);
  assert.match(f, /progress\.css "\.cs-progress-indicator" gold fill has an --accent-text edge/, 'an edge assigned to a variable is not painted');
  assert.match(f, /side-nav\.css "\.cs-side-nav-badge &:hover" gold fill has an --accent-text edge/, 'a color-mix over gold is a gold fill');
  assert.doesNotMatch(f, /side-nav\.css "\.cs-side-nav-badge" /);
});
