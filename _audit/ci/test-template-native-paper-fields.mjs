import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, cpSync, symlinkSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
const root = resolve('.'),
  source = JSON.parse(readFileSync('scripts/template-native-paper-fields.json')),
  script = 'scripts/generate-template-native-paper-fields.mjs',
  fixture = '_audit/ci/fixtures/template-content-bindings.json';
assert(source.templates.length >= 3);
assert(source.templates.flatMap(t => t.fields).length >= 11);
const run = (cwd, args = []) => spawnSync(process.execPath, [script, ...args], {
  cwd,
  encoding: 'utf8'
});
let result = run(root, ['--check']);
assert.equal(result.status, 0, result.stderr);
const scratch = mkdtempSync(join(tmpdir(), 'cs-native-paper-guard-'));
const mutations = [];
try {
  const reset = () => {
    for (const path of [script, fixture, ...source.templates.map(t => t.path)]) {
      mkdirSync(dirname(join(scratch, path)), {
        recursive: true
      });
      cpSync(path, join(scratch, path));
    }
    writeFileSync(join(scratch, 'scripts/template-native-paper-fields.json'), JSON.stringify(source));
  };
  symlinkSync(join(root, 'node_modules'), join(scratch, 'node_modules'), 'dir');
  reset();
  result = run(scratch);
  assert.equal(result.status, 0, result.stderr);
  result = run(scratch, ['--check']);
  assert.equal(result.status, 0, result.stderr);
  const reject = (name, mutate, args = []) => {
    reset();
    mutate();
    const before = source.templates.map(t => readFileSync(join(scratch, t.path), 'utf8'));
    result = run(scratch, args);
    assert.notEqual(result.status, 0, name);
    assert.deepEqual(source.templates.map(t => readFileSync(join(scratch, t.path), 'utf8')), before, 'All outputs validated before writes');
    mutations.push(name);
  };
  const editSource = fn => {
    const value = structuredClone(source);
    fn(value);
    writeFileSync(join(scratch, 'scripts/template-native-paper-fields.json'), JSON.stringify(value));
  };
  const editHtml = fn => {
    const path = join(scratch, source.templates[0].path);
    writeFileSync(path, fn(readFileSync(path, 'utf8')));
  };
  reject('source path traversal', () => editSource(s => s.templates[0].path = 'templates/' + s.templates[0].template + '/../../escape.dc.html'));
  reject('unknown semantic anchor', () => editSource(s => s.templates[0].fields[0].anchorLabel = 'Unknown identity'));
  reject('duplicate named field', () => editSource(s => s.templates[0].fields.push(s.templates[0].fields[0])));
  reject('prototype key', () => editSource(s => s.templates[0].fields[0].id = 'constructor'));
  reject('model scope expansion', () => editSource(s => s.templates.push(s.templates[0])));
  reject('default altered', () => editSource(s => s.templates[0].fields[0].default = 'Different identity'));
  reject('unbounded text', () => editSource(s => s.templates[0].fields[0].maxLength = 1000000));
  reject('legal clause drift', () => editHtml(s => s.replace('Article 48.3', 'Article 999')));
  reject('fill label drift', () => editHtml(s => s.replace('Full name', 'Other value')));
  reject('fill style/target drift', () => editHtml(s => s.replace('background:var(--cs-doc-fill);padding:0 3px', 'background:red')));
  reject('binding default drift', () => editHtml(s => s.replace('"employeeName":".............................."', '"employeeName":"changed"')), ['--check']);
  const templateDirectory = dirname(join(scratch, source.templates[0].path)),
    backupDirectory = templateDirectory + '-saved';
  try {
    reject('source directory symlink', () => {
      cpSync(templateDirectory, backupDirectory, {
        recursive: true
      });
      rmSync(templateDirectory, {
        recursive: true
      });
      symlinkSync(backupDirectory, templateDirectory, 'dir');
    });
  } finally {
    rmSync(templateDirectory, {
      recursive: true,
      force: true
    });
    cpSync(backupDirectory, templateDirectory, {
      recursive: true
    });
    rmSync(backupDirectory, {
      recursive: true,
      force: true
    });
  }
  const sidecar = join(templateDirectory, 'content-schema.json'),
    savedSchema = readFileSync(sidecar, 'utf8');
  try {
    reject('dangling output symlink', () => {
      rmSync(sidecar);
      symlinkSync(join(scratch, 'outside-schema.json'), sidecar);
    });
  } finally {
    rmSync(sidecar, {
      force: true
    });
    writeFileSync(sidecar, savedSchema);
  }
  // Cold adoption is source-bound: revert comments/default holes and ensure identical reproduction.
  reset();
  for (const entry of source.templates) {
    const path = join(scratch, entry.path);
    let html = readFileSync(path, 'utf8').replace(/\{\{ ([A-Za-z][A-Za-z0-9]*) \}\}/g, (m, id) => entry.fields.find(f => f.id === id)?.default || m).replace(/\/\* @generated native-paper-content:defaults \*\/[\s\S]*?\/\* @endgenerated native-paper-content:defaults \*\//, '').replace(' data-content-schema="./content-schema.json"', '');
    writeFileSync(path, html);
  }
  result = run(scratch);
  assert.equal(result.status, 0, result.stderr);
  for (const entry of source.templates) assert.equal(readFileSync(join(scratch, entry.path), 'utf8'), readFileSync(entry.path, 'utf8'), 'Cold adoption exact/idempotent');
} catch (error) {
  throw error;
} finally {
  rmSync(scratch, {
    recursive: true,
    force: true
  });
}
console.log('PASS native paper fields:' + source.templates.flatMap(entry => entry.fields).length + ' exact semantic fill anchors, complete original restoration, cold adoption/idempotence and' + mutations.length + ' no-write-on-failure guards');
