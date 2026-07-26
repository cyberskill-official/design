/**
 * Element pack freshness: tokens/elements.css (+ JSON/JS/DTCG mirrors) must
 * byte-equal a regeneration from tokens/element-seeds.json.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const r = spawnSync(process.execPath, ['scripts/generate-element-packs.mjs', '--check'], {
  cwd: root,
  encoding: 'utf8',
});
if (r.status !== 0) {
  process.stderr.write(r.stdout || '');
  process.stderr.write(r.stderr || '');
  throw new Error('element packs stale — run npm run tokens:elements');
}
console.log('PASS test-element-packs', { status: r.status });
