import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { syncTemplateRuntimes } from '../../scripts/sync-support-runtime.mjs';

syncTemplateRuntimes(undefined, { check: true });
const root = mkdtempSync(join(tmpdir(), 'cs-runtime-generation-'));
const write = (path, text) => writeFileSync(join(root, path), text);
const read = path => readFileSync(join(root, path), 'utf8');
const support = '/* canonical */\nwindow.runtime = true;\n';
const base = 'window.base = true;\n';
try {
  for (const folder of ['templates/_vendor', 'templates/first', 'templates/second', 'scripts/template-runtime']) mkdirSync(join(root, folder), { recursive: true });
  write('_ds_manifest.json', JSON.stringify({ templates: [{ folder: 'templates/second' }, { folder: 'templates/first' }] }));
  write('templates/_vendor/support.js', support); write('scripts/template-runtime/ds-base.js', base);
  assert.throws(() => syncTemplateRuntimes(root, { check: true }), /Stale or missing/);
  assert.deepEqual(syncTemplateRuntimes(root), { copies: 4, changed: 4 });
  assert.deepEqual(syncTemplateRuntimes(root), { copies: 4, changed: 0 });
  write('templates/first/support.js', 'drift');
  assert.throws(() => syncTemplateRuntimes(root, { check: true }), /Stale or missing/);
  assert.equal(read('templates/first/support.js'), 'drift', 'check must not repair');
  // Invalid canonical input must leave every prior output untouched.
  for (const invalid of ['eval("bad")', 'new Function("bad")', 'function {']) {
    write('templates/_vendor/support.js', invalid);
    assert.throws(() => syncTemplateRuntimes(root));
    assert.equal(read('templates/first/support.js'), 'drift');
    assert.equal(read('templates/second/support.js'), support);
  }
  write('templates/_vendor/support.js', support);
  write('scripts/template-runtime/ds-base.js', 'function {');
  assert.throws(() => syncTemplateRuntimes(root));
  assert.equal(read('templates/first/support.js'), 'drift');
  write('scripts/template-runtime/ds-base.js', base);
  const manifest = read('_ds_manifest.json');
  for (const folders of [['../outside'], ['templates/first', 'templates/first'], []]) {
    write('_ds_manifest.json', JSON.stringify({ templates: folders.map(folder => ({ folder })) }));
    assert.throws(() => syncTemplateRuntimes(root));
    assert.equal(read('templates/first/support.js'), 'drift');
  }
  write('_ds_manifest.json', manifest);
  mkdirSync(join(root, 'templates/extra')); write('templates/extra/support.js', support);
  assert.throws(() => syncTemplateRuntimes(root), /Unregistered/);
  rmSync(join(root, 'templates/extra'), { recursive: true });
  rmSync(join(root, 'templates/second/ds-base.js'));
  symlinkSync(join(root, 'untouched.js'), join(root, 'templates/second/ds-base.js'));
  assert.throws(() => syncTemplateRuntimes(root), /Linked/);
  assert.equal(read('templates/first/support.js'), 'drift', 'preflight every output before any write');
  rmSync(join(root, 'templates/second/ds-base.js'));
  assert.deepEqual(syncTemplateRuntimes(root), { copies: 4, changed: 2 });
  syncTemplateRuntimes(root, { check: true });
  for (const folder of ['first', 'second']) {
    assert.equal(read(`templates/${folder}/support.js`), support);
    assert.equal(read(`templates/${folder}/ds-base.js`), base);
  }
} finally { rmSync(root, { recursive: true, force: true }); }
console.log('PASS template runtimes: 170 current copies, deterministic repair, read-only drift rejection and pre-write source/path validation');
