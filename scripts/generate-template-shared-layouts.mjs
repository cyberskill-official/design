import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, lstatSync } from 'node:fs';
import { join } from 'node:path';
import { validateSharedLayouts, projectSharedLayout } from './lib/template-shared-layouts.mjs';
assert(process.argv.slice(2).every(a => a === '--check'));
const check = process.argv.includes('--check'),
  source = validateSharedLayouts(JSON.parse(readFileSync('scripts/template-shared-layouts-source.json'))),
  outputs = [];
for (const e of source.templates) {
  let path = '';
  for (const p of e.path.split('/')) {
    path = join(path, p);
    assert(!lstatSync(path).isSymbolicLink(), 'Symlink output/ancestor forbidden');
  }
  const input = readFileSync(e.path, 'utf8');
  outputs.push({
    path: e.path,
    input,
    ...projectSharedLayout(input, e, source.styles)
  });
}
for (const o of outputs) if (check) assert.equal(o.input, o.html, 'Stale shared native layout ' + o.path);else writeFileSync(o.path, o.html);
console.log('PASS shared native layout ' + outputs.length + ' templates/' + outputs.flatMap(o => o.owners).length + ' exact native owners; no other bytes projected');
