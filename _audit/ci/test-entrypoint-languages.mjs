import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { entrypoints, generatedEntrypoints, generateEntrypointLanguages, stripEntryRoute } from '../../scripts/lib/entrypoint-languages.mjs';
const temp = mkdtempSync(join(tmpdir(), 'cs-entry-languages-'));
const hash = text => createHash('sha256').update(text).digest('hex');
const write = (path, text) => {
  mkdirSync(join(temp, path, '..'), {
    recursive: true
  });
  writeFileSync(join(temp, path), text);
};
const originals = new Map();
const entries = entrypoints.map(source => {
  const en = '# ' + source + '\n\nRead [doctrine](docs/doctrine.md), preserve `value`.\n\n```jsx\n<Button>English fixture</Button>\n```\n';
  const vi = '# ' + source + '\n\nĐọc [học thuyết](../../../docs/doctrine.md), giữ `value`.\n\n```jsx\n<Button>English fixture</Button>\n```\n';
  originals.set(source, en);
  write(source, en);
  write('docs/vi/entrypoints/' + source, vi);
  return {
    source,
    mirror: 'docs/vi/entrypoints/' + source,
    sourceSha256: hash(en),
    mirrorSha256: hash(vi)
  };
});
const inventory = {
  schemaVersion: 1,
  entries,
  generatedEntries: generatedEntrypoints
};
const install = value => write('scripts/entrypoint-language-source.json', JSON.stringify(value));
const reset = () => {
  for (const [path, text] of originals) write(path, text);
  install(inventory);
};
try {
  install(inventory);
  assert.equal(generateEntrypointLanguages(temp).changed, 9);
  assert.equal(generateEntrypointLanguages(temp, {
    check: true
  }).changed, 0);
  for (const [path, text] of originals) assert.equal(stripEntryRoute(readFileSync(join(temp, path), 'utf8')), text);
  assert.equal(generateEntrypointLanguages(temp).changed, 0);
  reset();
  assert.throws(() => generateEntrypointLanguages(temp, {
    check: true
  }), /Stale entrance/);
  reset();
  const missing = structuredClone(inventory);
  missing.entries.pop();
  install(missing);
  assert.throws(() => generateEntrypointLanguages(temp), /Complete ordered/);
  reset();
  const missingGenerated = structuredClone(inventory);
  missingGenerated.generatedEntries = [];
  install(missingGenerated);
  assert.throws(() => generateEntrypointLanguages(temp), /Complete generated/);
  reset();
  const wrong = structuredClone(inventory);
  wrong.entries[0].mirror = '../outside.md';
  install(wrong);
  assert.throws(() => generateEntrypointLanguages(temp), /membership/);
  reset();
  write('README.md', originals.get('README.md') + 'New source.');
  assert.throws(() => generateEntrypointLanguages(temp), /source drift/);
  reset();
  const mirror = entries[0].mirror,
    originalVi = readFileSync(join(temp, mirror), 'utf8');
  write(mirror, originalVi + 'Nội dung mới.');
  assert.throws(() => generateEntrypointLanguages(temp), /translation drift/);
  write(mirror, originalVi);
  for (const [label, from, to, pattern] of [['inline', '`value`', '`defaultValue`', /inline-code/], ['fence', 'English fixture', 'Changed fixture', /code-fence/], ['link', '../../../docs/doctrine.md', '../../../docs/other.md', /destination/]]) {
    reset();
    const changed = originalVi.replace(from, to);
    write(mirror, changed);
    const value = structuredClone(inventory);
    value.entries[0].mirrorSha256 = hash(changed);
    install(value);
    assert.throws(() => generateEntrypointLanguages(temp), pattern, label);
    write(mirror, originalVi);
  }
  reset();
  const last = entries.at(-1),
    lastVi = readFileSync(join(temp, last.mirror), 'utf8');
  write(last.mirror, 'Không còn hợp đồng');
  const snapshot = entrypoints.map(p => readFileSync(join(temp, p), 'utf8'));
  assert.throws(() => generateEntrypointLanguages(temp), /translation drift/);
  assert.deepEqual(entrypoints.map(p => readFileSync(join(temp, p), 'utf8')), snapshot, 'Late mirror failure writes no routes');
  write(last.mirror, lastVi);
  reset();
  const outside = join(temp, 'outside.md');
  writeFileSync(outside, 'outside sentinel');
  rmSync(join(temp, mirror));
  symlinkSync(outside, join(temp, mirror));
  assert.throws(() => generateEntrypointLanguages(temp), /Symlink/);
  assert.equal(readFileSync(outside, 'utf8'), 'outside sentinel');
  console.log('PASS nine VI-first entrance routes: exact source/code/metadata/link preservation, freshness, atomicity and eleven membership/drift/symlink counterproofs');
} finally {
  rmSync(temp, {
    recursive: true,
    force: true
  });
}
if (process.argv.includes('--current')) {
  const root = resolve('.');
  console.log(JSON.stringify(generateEntrypointLanguages(root, {
    check: true
  })));
  const policy = JSON.parse(readFileSync(join(root, 'scripts/public-site-policy.json'), 'utf8'));
  const published = new Set(Object.values(policy.audiences).flatMap(group => group.files));
  for (const path of entrypoints) {
    const mirror = 'docs/vi/entrypoints/' + path;
    assert.equal(published.has(mirror), ['README.md', 'SKILL.md', 'CONTRIBUTING.md', 'llms.txt'].includes(path), mirror + ' exact public/private boundary');
  }
  const npm = join(root, '_audit/ci/fixtures/npm-cli/node_modules/npm/bin/npm-cli.js');
  assert.equal(execFileSync(process.execPath, [npm, '--version'], {
    encoding: 'utf8'
  }).trim(), '11.21.1');
  const packed = JSON.parse(execFileSync(process.execPath, [npm, 'pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024
  }))[0];
  const packedPaths = new Set(packed.files.map(file => file.path));
  for (const path of entrypoints) assert.equal(packedPaths.has('docs/vi/entrypoints/' + path), ['README.md', 'SKILL.md', 'CONTRIBUTING.md', 'llms.txt'].includes(path), path + ' actual pinned npm pack scope');
  assert(published.has('docs/vi/entrypoints/DESIGN.md'));
  assert(packedPaths.has('docs/vi/entrypoints/DESIGN.md'));
  const {
    generateDesignMd
  } = await import('../../scripts/generate-design-md.mjs');
  assert.equal(generateDesignMd(root, {
    check: true
  }).entries, 2);
  console.log('PASS actual npm pack: five public entrance mirrors included; five private host/operator mirrors excluded; generated DESIGN pair fresh');
}
