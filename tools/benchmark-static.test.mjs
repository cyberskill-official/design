import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { newResults } from './benchmark/score.mjs';
import { cssRules, motionDiscipline, colorRoles } from './benchmark/static.mjs';

// A package folder holding only the files the D24 and D25 checks read.
const pkgWith = files => {
  const dir = mkdtempSync(join(tmpdir(), 'cs-bench-'));
  for (const [rel, text] of Object.entries(files)) { mkdirSync(dirname(join(dir, rel)), { recursive: true }); writeFileSync(join(dir, rel), text); }
  return dir;
};
const fails = (results, dim) => [...results[dim].fails].map(([k, d]) => `${k}: ${d}`);

const FOUNDATIONS = JSON.stringify({
  duration: { fast: '120ms', base: '180ms', slow: '280ms' },
  motion: { $description: 'x', state: ['fast', 'standard'], fade: ['base', 'out'], release: 'snappy', 'sheet-out': ['slow', 'sheet'] },
  'motion-value': { 'press-scale': '0.97', rise: '8px' },
});
const REDUCED = '@media (prefers-reduced-motion: reduce) {\n  :root {\n    --motion-release: 1ms linear;\n    --motion-sheet-out: var(--duration-base) var(--ease-out);\n    --motion-press-scale: 1;\n    --motion-rise: 0px;\n  }\n}\n';
const motionPkg = (components, motion = REDUCED) => pkgWith({ 'tokens/foundations.json': FOUNDATIONS, 'src/css/motion.css': motion, ...Object.fromEntries(Object.entries(components).map(([n, css]) => [`src/css/components/${n}.css`, css])) });

test('cssRules reads nested rules, @media chains and declaration lines', () => {
  const rules = cssRules('/* a; b { } */\n.cs-x {\n  color: var(--primary);\n  &[data-on] { background: var(--accent); }\n}\n@media (hover: hover) { .cs-y { opacity: 1 } }\n');
  assert.deepEqual(rules.map(r => r.selector), ['.cs-x', '.cs-x &[data-on]', '@media (hover: hover)', '@media (hover: hover) .cs-y']);
  assert.deepEqual(rules[0].decls, [{ prop: 'color', value: 'var(--primary)', line: 3 }]);
  assert.equal(rules[1].line, 4);
  assert.deepEqual(rules[3].decls, [{ prop: 'opacity', value: '1', line: 6 }]);
});

test('D24 passes transitions on recipes, and motion switched off', () => {
  const r = newResults();
  motionDiscipline(r, motionPkg({
    button: '.cs-button {\n  transition: background-color var(--motion-state), transform var(--motion-release);\n  &[data-swiping] { transition-duration: 0ms; }\n  &[data-instant] { transition: none; }\n}\n',
    drawer: '.cs-drawer[data-ending-style] { transition: transform var(--motion-sheet-out); transition-duration: calc(var(--drawer-swipe-strength, 1) * var(--duration-slow)); }',
    popup: '.cs-popup {\n  transition:\n    opacity var(--motion-fade),\n    transform var(--motion-pop-in);\n}\n',
  }));
  assert.deepEqual(fails(r, 'D24'), []);
  assert.ok(r.D24.total >= 6); // two stylesheets, two shortened recipes, two neutral values
});

test('D24 fails raw timing, duration tokens, transition: all and movement on the state recipe', () => {
  const r = newResults();
  motionDiscipline(r, motionPkg({
    raw: '.a { transition: opacity 200ms ease-out; }',
    tokens: '.b { transition: color var(--duration-fast) var(--ease-standard); }',
    all: '.c { transition: all var(--motion-state); }',
    moving: '.d {\n  transition: transform var(--motion-state);\n}',
    longhand: '.e { transition-duration: var(--duration-slow); }',
  }));
  const f = fails(r, 'D24').join('\n');
  assert.match(f, /raw\.css.*"opacity 200ms ease-out" is not one property on a --motion-\* recipe/);
  assert.match(f, /tokens\.css.*is not one property/);
  assert.match(f, /all\.css.*transition: all/);
  assert.match(f, /moving\.css.*line 2: transform on --motion-state, which reduced motion keeps/);
  assert.match(f, /longhand\.css.*transition-duration: var\(--duration-slow\) is not a recipe/);
});

test('D24 fails when reduced motion leaves a spring, a long recipe or a start value as it is', () => {
  const r = newResults();
  motionDiscipline(r, motionPkg({ ok: '.ok { transition: none; }' }, '@media (prefers-reduced-motion: reduce) { :root { --motion-release: var(--spring-snappy-duration) var(--spring-snappy); --motion-rise: 4px; } }'));
  const f = fails(r, 'D24').join('\n');
  assert.match(f, /shortens --motion-release: redefined as .*springs or runs past 200ms/);
  assert.match(f, /shortens --motion-sheet-out: motion\.css does not redefine it/);
  assert.match(f, /neutralizes --motion-press-scale: motion\.css does not redefine it/);
  assert.match(f, /neutralizes --motion-rise: redefined as 4px, needs 0/);
  assert.doesNotMatch(f, /--motion-state|--motion-fade/); // short and plain: reduced motion may keep them
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
  meter: '.cs-meter { --_fill: var(--accent); --_edge: var(--accent-text); }',
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
    tag: '.cs-tag {\n  background: var(--teal-icon);\n  color: var(--on-ink);\n}',
    badge: '.cs-badge[data-variant="solid"] {\n  [data-tone=\'blue\'] & { background: var(--tone); color: var(--tone-on); }\n}',
    switch: '.cs-switch { &[data-checked] { background: var(--accent); border-color: var(--border); } }',
    meter: '.cs-meter { background: var(--primary); }',
  } }));
  const f = fails(r, 'D25').join('\n');
  assert.match(f, /tag\.css puts no text on a solid category color: line 2: text on var\(--teal-icon\)/);
  assert.match(f, /badge\.css puts no text on a solid category color: line 2: text on var\(--tone\)/);
  assert.match(f, /switch\.css ".cs-switch &\[data-checked\]" gold fill has an --accent-text edge/);
  assert.match(f, /meter\.css fills with gold: no rule fills with var\(--accent\)/);
});
