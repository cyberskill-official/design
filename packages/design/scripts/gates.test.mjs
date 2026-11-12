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

function buildTokens(mutate) {
  const dir = mkdtempSync(join(tmpdir(), 'cs-tokens-'));
  const colors = structuredClone(realColors);
  mutate(colors);
  writeFileSync(join(dir, 'color.json'), JSON.stringify(colors));
  copyFileSync(join(pkg, 'tokens', 'foundations.json'), join(dir, 'foundations.json'));
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
];
for (const [name, mutate, message] of cases) {
  test(`fails on ${name}`, () => {
    const r = buildTokens(mutate);
    assert.notEqual(r.status, 0, `expected failure, got:\n${r.stdout}`);
    assert.match(r.stderr, message);
  });
}

test('CSS check fails on raw colors, undefined tokens, !important and tiny text', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cs-css-'));
  mkdirSync(join(dir, 'components'));
  writeFileSync(join(dir, 'base.css'), '');
  writeFileSync(join(dir, 'motion.css'), '');
  writeFileSync(join(dir, 'components', 'bad.css'), [
    '.a { color: #ff0000; }', '.b { background: color-mix(in srgb, rgb(255 0 0) 50%, var(--panel)); }', '.c { color: red; }',
    '.d { font: 500 9px/1 var(--font-sans); }', '.e { font-size: 0.5rem; }', '.f { font-size: 11px; }', '.g { margin: 0 !important; }',
    '.h { border: 1px solid var(--borders); }', '.i { color: var(--app-text, inherit); border-color: var(--panel); }',
    '.j { font: 500 14px/1 var(--font-sans); }', '.k { font-size: 0.875rem; }',
  ].join('\n'));
  const tokens = join(dir, 'tokens.css');
  writeFileSync(tokens, ':root { --panel: #fff; --font-sans: sans-serif; }');
  const r = spawnSync(process.execPath, [join(pkg, 'scripts', 'check-css.mjs')], { env: { ...process.env, CSS_DIR: dir, TOKENS_CSS: tokens }, encoding: 'utf8' });
  assert.notEqual(r.status, 0);
  for (const line of [1, 2, 3, 4, 5, 6, 7, 8]) assert.match(r.stderr, new RegExp(`bad\\.css:${line} `), `line ${line} not flagged`);
  assert.match(r.stderr, /var\(--borders\) is not defined/);
  assert.doesNotMatch(r.stderr, /bad\.css:9 /, 'a var() with a fallback, or a defined token, is fine');
  assert.match(r.stderr, /bad\.css:10 text size in px; use rem \(0\.875rem\)/);
  assert.doesNotMatch(r.stderr, /bad\.css:11 /, 'rem sizes are fine');
});
