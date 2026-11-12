import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { newResults, record, score, scorecard, baselineOf, TOLERANCE } from './benchmark/score.mjs';
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
  const r = fill(); r.D20 = { total: 0, fails: new Map() };
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

test('the same failure is counted once per key', () => {
  const r = newResults();
  record(r, 'D1', { pass: false, key: 'x' }); record(r, 'D1', { pass: false, key: 'x' });
  assert.equal(r.D1.fails.size, 1);
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
