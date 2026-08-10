/**
 * Element pack freshness: tokens/elements.css (+ JSON/JS/DTCG mirrors) must
 * byte-equal a regeneration from tokens/element-seeds.json.
 * FIND-007 — also asserts directed Tương sinh cycle in element-seeds.json.
 */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Directed generative cycle: Mộc→Hỏa→Thổ→Kim→Thủy→Mộc
const seeds = JSON.parse(readFileSync(join(root, 'tokens/element-seeds.json'), 'utf8'));
const EXPECTED = { moc: 'hoa', hoa: 'tho', tho: 'kim', kim: 'thuy', thuy: 'moc' };
for (const [k, v] of Object.entries(EXPECTED)) {
  if (seeds.tuongSinh?.[k] !== v) {
    throw new Error(`tuongSinh[${k}] expected ${v}, got ${seeds.tuongSinh?.[k]} (FIND-007)`);
  }
}

const r = spawnSync(process.execPath, ['scripts/generate-element-packs.mjs', '--check'], {
  cwd: root,
  encoding: 'utf8',
});
if (r.status !== 0) {
  process.stderr.write(r.stdout || '');
  process.stderr.write(r.stderr || '');
  throw new Error('element packs stale — run npm run tokens:elements');
}
console.log('PASS test-element-packs', { status: r.status, tuongSinh: 'ok' });
