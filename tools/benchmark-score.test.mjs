import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { newResults, record, score, scorecard, baselineOf, TOLERANCE, newAllowed } from './benchmark/score.mjs';
import { DIMENSIONS } from './benchmark/dimensions.mjs';

const fill = (fails = {}) => {
  const r = newResults();
  for (const d of DIMENSIONS) for (let i = 0; i < 10; i++) record(r, d.id, { pass: i >= (fails[d.id] ?? 0), key: `${d.id}-${i}` });
  return r;
};

test('a required failure blocks; a clean run does not', () => {
  assert.equal(score(fill()).blocking, false);
  const s = score(fill({ D1: 1 }));
  assert.equal(s.blocking, true);
  assert.equal(s.rows.find(r => r.id === 'D1').score, 90);
});

test('a required dimension that measured nothing blocks a full run, not a partial one', () => {
  const r = fill(); r.D20 = { total: 0, seen: new Set(), fails: new Map() };
  assert.equal(score(r).blocking, true);
  assert.equal(score(r, undefined, { partial: true }).blocking, false);
});

test('advisory gaps ratchet on the baseline score, with a small tolerance', () => {
  const base = baselineOf(score(fill({ D9: 3 })));
  assert.equal(base.scores.D9, 70);
  assert.equal(score(fill({ D9: 3 }), base).blocking, false); // same gaps
  assert.equal(score(fill({ D9: 2 }), base).rows.find(r => r.id === 'D9').fixed.length, 1); // one fixed
  assert.equal(score(fill({ D9: 4 }), base).blocking, true); // 60 < 70 - tolerance
  assert.ok(TOLERANCE < 10 / 10);
});

test('the same subject is counted once per key, in failures and in the total', () => {
  const r = newResults();
  record(r, 'D1', { pass: false, key: 'x' }); record(r, 'D1', { pass: false, key: 'x' }); record(r, 'D1', { pass: true, key: 'y' });
  assert.equal(r.D1.fails.size, 1);
  assert.equal(r.D1.total, 2);
});

test('an advisory dimension blocks on many new failures even when its score holds, and on measuring nothing', () => {
  const big = n => { const r = fill(); r.D9 = { total: 0, seen: new Set(), fails: new Map() }; for (let i = 0; i < 1000; i++) record(r, 'D9', { pass: i >= n, key: `k${i}` }); return r; };
  const base = baselineOf(score(big(100))); // 90%, keys k0..k99
  const moved = big(0); for (let i = 0; i < 100; i++) record(moved, 'D9', { pass: false, key: `k${900 + i}` }); // still 90%, all new keys
  assert.equal(score(moved, base).rows.find(r => r.id === 'D9').score, 90);
  assert.equal(score(moved, base).blocking, true);
  assert.equal(newAllowed(1000), 5);
  const empty = fill(); empty.D9 = { total: 0, seen: new Set(), fails: new Map() };
  assert.equal(score(empty, base).blocking, true);
});

test('the scorecard lists every dimension, and docs/benchmark.md documents every one', () => {
  const md = scorecard(score(fill({ D2: 1 })));
  const doc = readFileSync(new URL('../docs/benchmark.md', import.meta.url), 'utf8');
  for (const d of DIMENSIONS) {
    assert.match(md, new RegExp(`\\| ${d.id} \\| ${d.name} \\|`));
    assert.ok(doc.includes(`| ${d.id} | ${d.name} |`), `docs/benchmark.md is missing ${d.id} ${d.name}`);
  }
  assert.match(md, /### Blocking/);
});
