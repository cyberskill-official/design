import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, lstatSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildComponentCssEntries } from './lib/component-css-entries.mjs';
export function projectComponentCssEntries(root, {
  check = false
} = {}) {
  const result = buildComponentCssEntries(root);
  const directory = join(root, 'styles/components');
  for (const parent of [join(root, 'styles'), directory]) {
    if (existsSync(parent)) assert(lstatSync(parent).isDirectory() && !lstatSync(parent).isSymbolicLink(), 'Unsafe component CSS output directory');
  }
  const expected = [...result.outputs.keys()].map(path => path.split('/').at(-1)).sort();
  if (existsSync(directory)) {
    const existing = readdirSync(directory).sort();
    assert(existing.every(name => expected.includes(name)), 'Unexpected component CSS output member');
    for (const name of existing) assert(lstatSync(join(directory, name)).isFile() && !lstatSync(join(directory, name)).isSymbolicLink(), 'Unsafe component CSS output member');
    if (check) assert.deepEqual(existing, expected, 'Missing component CSS output member');
  } else assert(!check, 'Missing component CSS outputs');
  // Validate every source, member and destination before any projection write.
  if (!check) mkdirSync(directory, {
    recursive: true
  });
  for (const [path, text] of result.outputs) {
    const target = join(root, path);
    if (check) assert.equal(readFileSync(target, 'utf8'), text, 'Stale component CSS entry: ' + path);else writeFileSync(target, text);
  }
  return result;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert(process.argv.slice(2).every(arg => arg === '--check'), 'Only --check is supported');
  const {
    manifest
  } = projectComponentCssEntries(fileURLToPath(new URL('../', import.meta.url)), {
    check: process.argv.includes('--check')
  });
  const components = Object.values(manifest.components);
  console.log('PASS component CSS entries: ' + components.length + ' components, ' + components.filter(row => row.kind === 'full-fallback').length + ' explicit full fallbacks');
}
