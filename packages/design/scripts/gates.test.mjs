// Proves the build gates fail on bad input: run with `node --test scripts/`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..');
const realColors = JSON.parse(readFileSync(join(pkg, 'tokens', 'color.json'), 'utf8'));

function buildTokens(mutate) { // mutate(colors, foundations)
  const dir = mkdtempSync(join(tmpdir(), 'cs-tokens-'));
  const colors = structuredClone(realColors);
  const foundations = JSON.parse(readFileSync(join(pkg, 'tokens', 'foundations.json'), 'utf8'));
  mutate(colors, foundations);
  writeFileSync(join(dir, 'color.json'), JSON.stringify(colors));
  writeFileSync(join(dir, 'foundations.json'), JSON.stringify(foundations));
  return spawnSync(process.execPath, [join(pkg, 'scripts', 'build-tokens.mjs')], { env: { ...process.env, TOKENS_DIR: dir, OUT_DIR: join(dir, 'out') }, encoding: 'utf8', timeout: 20000 });
}

test('the real tokens pass', () => {
  const r = buildTokens(() => {});
  assert.equal(r.status, 0, r.stderr);
});

const cases = [
  ['a low-contrast muted text', c => { c.light.muted.$value = '#9AA3B0'; }, /Secondary text/],
  ['a 3-digit hex', c => { c.light.muted.$value = '#999'; }, /not a #RRGGBB color/],
  ['an oklch() value', c => { c.dark.foreground.$value = 'oklch(0.9 0 0)'; }, /not a #RRGGBB color/],
  ['an 8-digit hex', c => { c.light.border.$value = '#DDE2EA80'; }, /not a #RRGGBB color/],
  ['a white foreground (used to hang the ramp)', c => { c.light.foreground.$value = '#FFFFFF'; }, /Body text/],
  ['warning too close to gold', c => { c.dark.warning.$value = '#F5B04A'; }, /accent vs warning/],
  ['warning vs error indistinct for color-blind readers', c => { c.light.warning.$value = '#965800'; }, /warning vs error too alike for color-blind/],
  ['a chart color too close to a status color', c => { c.chart.light[0] = '#1F5CB8'; }, /chart 1 .* too close to status/],
  ['non-neighbouring chart colors too alike', c => { c.chart.light[4] = c.chart.light[0]; }, /chart 1 vs 5/],
  ['a missing dark chart color', c => { c.chart.dark.pop(); }, /must all have 5 entries/],
  ['a token missing in dark', c => { delete c.dark.info; }, /tokens differ from light/],
  ['a category text role too weak for its tint', c => { c.role.text.category = 1; }, /text role on its soft/],
  ['a tint too heavy for its text role', c => { c.role['soft-hover'].light = 0.5; }, /on its soft-hover tint/],
  ['an ink surface too light for dark text and control edges', c => { c.inverse['ink-deep'].$value = '#3A5A8C'; }, /on the ink surface/],
  ['an easing named like one of Tailwind\'s own', (c, f) => { f.ease.out = f.ease.enter; }, /collides with Tailwind/],
  ['a recipe with no reduced-motion decision', (c, f) => { f.motion.wobble = 'bouncy'; }, /must be in exactly one of instant, fade, keep/],
  ['a slow recipe kept under reduced motion', (c, f) => { f['motion-reduced'].keep.push('sheet-in'); f['motion-reduced'].instant = f['motion-reduced'].instant.filter(k => k !== 'sheet-in'); }, /200ms or less/],
  ['a recipe built on an unknown curve', (c, f) => { f.motion.press = ['instant', 'bounce']; }, /neither a spring name nor a \[duration, ease\] pair/],
  ['a category list shorter than the chart palette', c => { c.category.names.pop(); }, /one per chart color/],
];
for (const [name, mutate, message] of cases) {
  test(`fails on ${name}`, () => {
    const r = buildTokens(mutate);
    assert.notEqual(r.status, 0, `expected failure, got:\n${r.stdout}`);
    assert.match(r.stderr, message);
  });
}

test('CSS check fails on raw colors, undefined tokens, !important, tiny text and motion off the recipes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cs-css-'));
  mkdirSync(join(dir, 'components'));
  writeFileSync(join(dir, 'base.css'), '');
  writeFileSync(join(dir, 'motion.css'), '.z { transition: opacity 1ms linear; animation-duration: 1ms; }'); // the recipes' home: exempt
  writeFileSync(join(dir, 'components', 'bad.css'), [
    '.a { color: #ff0000; }', '.b { background: color-mix(in srgb, rgb(255 0 0) 50%, var(--panel)); }', '.c { color: red; }',
    '.d { font: 500 9px/1 var(--font-sans); }', '.e { font-size: 0.5rem; }', '.f { font-size: 11px; }', '.g { margin: 0 !important; }',
    '.h { border: 1px solid var(--borders); }', '.i { color: var(--app-text, inherit); border-color: var(--panel); }',
    '.j { font: 500 14px/1 var(--font-sans); }', '.k { font-size: 0.875rem; }',
    '.l { transition: opacity var(--duration-fast) var(--ease-standard); }', '.m { transition: color 200ms; }',
    '.n { transition: opacity var(--motion-fade) cubic-bezier(0.2, 0, 0, 1); }', '.o { transition-timing-function: ease-in-out; }',
    '.p { transition: all var(--motion-state); }', '.q { transition: transform var(--motion-state), height var(--motion-fade); }',
    '.r { animation: cs-pop 300ms var(--ease-enter); }', '.s { transition: opacity var(--spring-snappy); }', '.t { animation: cs-pop; }',
    '.u { transition: background-color var(--motion-state), transform var(--motion-release); }',
    '.v { transition: opacity var(--motion-fade), transform var(--motion-pop-in); &[data-instant] { transition-duration: 0ms; } &[data-x] { transition: none; } }',
    '.w { animation: cs-spin 0.7s linear infinite; }', '.x {', '  animation: cs-reveal var(--motion-reveal) both;', '}',
    '.y { transition-duration: calc(var(--swipe-strength, 1) * var(--duration-fast)); }', '.z { transition-duration: calc(2 * var(--duration-fast)); }',
    '.aa { transition: var(--motion-state); }', '.ab { transition: inline-size var(--motion-state); }', '.ac { -webkit-transition: all 2s linear; }',
    '.ad { animation: cs-pulse 2s linear; & .child { animation: cs-spin 1s linear infinite; } }', '.ae { animation: cs-pulse 1.2s linear; animation-iteration-count: infinite; }',
    '.af { transition: width var(--motion-sheet-in); }', '.ag {', '  transition:', '    opacity var(--motion-fade),', '    top 200ms;', '}',
    '.ah { transition: width var(--motion-move), height var(--motion-pop-in), translate var(--motion-move); }', '.ai { animation-delay: calc(var(--_step, 0) * var(--motion-stagger)); }',
  ].join('\n'));
  const tokens = join(dir, 'tokens.css');
  writeFileSync(tokens, ':root { --panel: #fff; --font-sans: sans-serif; --duration-fast: 1ms; --ease-standard: ease; --ease-enter: ease; --spring-snappy: ease; --motion-state: 1ms ease; --motion-fade: 1ms ease; --motion-release: 1ms ease; --motion-pop-in: 1ms ease; --motion-reveal: 1ms ease; --motion-move: 1ms ease; --motion-sheet-in: 1ms ease; --motion-stagger: 1ms; }');
  const r = spawnSync(process.execPath, [join(pkg, 'scripts', 'check-css.mjs')], { env: { ...process.env, CSS_DIR: dir, TOKENS_CSS: tokens }, encoding: 'utf8' });
  assert.notEqual(r.status, 0);
  for (const line of [1, 2, 3, 4, 5, 6, 7, 8]) assert.match(r.stderr, new RegExp(`bad\\.css:${line} `), `line ${line} not flagged`);
  assert.match(r.stderr, /var\(--borders\) is not defined/);
  assert.doesNotMatch(r.stderr, /bad\.css:9 /, 'a var() with a fallback, or a defined token, is fine');
  assert.match(r.stderr, /bad\.css:10 text size in px; use rem \(0\.875rem\)/);
  assert.doesNotMatch(r.stderr, /bad\.css:11 /, 'rem sizes are fine');
  for (const line of [12, 13, 14, 15, 16, 17, 18, 19, 20]) assert.match(r.stderr, new RegExp(`bad\\.css:${line} `), `line ${line} not flagged`);
  assert.match(r.stderr, /bad\.css:12 transition uses var\(--duration-fast\) directly/);
  assert.match(r.stderr, /bad\.css:13 transition has a raw time \(200ms\)/);
  assert.match(r.stderr, /bad\.css:14 transition has a raw curve cubic-bezier\(…\)/);
  assert.match(r.stderr, /bad\.css:15 transition-timing-function has a raw curve \(ease-in-out\)/);
  assert.match(r.stderr, /bad\.css:16 transition: all;/);
  assert.match(r.stderr, /bad\.css:17 transform animates with var\(--motion-state\)/);
  assert.match(r.stderr, /bad\.css:17 height animates with var\(--motion-fade\)/);
  assert.match(r.stderr, /bad\.css:18 animation .*; only an infinite loading loop may use raw timing/);
  assert.match(r.stderr, /bad\.css:19 transition uses var\(--spring-snappy\) directly/);
  assert.match(r.stderr, /bad\.css:20 animation has no --motion-\* recipe/);
  for (const line of [21, 22, 23, 24, 25]) assert.doesNotMatch(r.stderr, new RegExp(`bad\\.css:${line} `), `recipes, 0ms, none and loading loops are fine (line ${line})`);
  assert.doesNotMatch(r.stderr, /bad\.css:27 /, 'a duration token scaled by a runtime value (a swipe) is fine');
  assert.match(r.stderr, /bad\.css:28 transition-duration uses var\(--duration-fast\) directly/, 'scaling by a fixed number is retiming, not a gesture');
  assert.match(r.stderr, /bad\.css:29 transition: var\(--motion-state\) names no property, which means all/);
  assert.match(r.stderr, /bad\.css:30 inline-size animates with var\(--motion-state\); size and position animate only on/);
  assert.match(r.stderr, /bad\.css:31 -webkit-transition: all;/);
  assert.match(r.stderr, /bad\.css:31 -webkit-transition has a raw time \(2s\)/);
  assert.match(r.stderr, /bad\.css:32 animation has a raw time \(2s\)/, 'a nested infinite loop does not exempt its parent');
  assert.doesNotMatch(r.stderr, /bad\.css:33 /, 'an infinite iteration count in the same rule makes a loading loop');
  assert.match(r.stderr, /bad\.css:34 width animates with var\(--motion-sheet-in\)/);
  assert.match(r.stderr, /bad\.css:36 transition has a raw time \(200ms\)/, 'a value wrapped over lines is read whole, at the line it starts');
  for (const line of [40, 41]) assert.doesNotMatch(r.stderr, new RegExp(`bad\\.css:${line} `), `size on move or pop-in, and a stagger delay, are fine (line ${line})`);
  assert.doesNotMatch(r.stderr, /motion\.css:/, 'motion.css is the reduced-motion keyframe blanket and is not checked for motion');
});
