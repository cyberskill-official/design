import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, copyFileSync, unlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { readDocumentationPairs, pairProblems } from './lib/docs-parity.mjs';
import { documentRole } from '../../scripts/generate-reference-catalog.mjs';
const actual = readDocumentationPairs(process.cwd());
const catalog = JSON.parse(readFileSync('_audit/docs-catalog.json'));
const publicGuides = catalog.pages.map(p => p.path).filter(p => /^docs\/[^/]+\.md$/.test(p)).map(p => p.slice(5)).sort();
assert.deepEqual(actual.guides, publicGuides, 'existing catalogued public guide scope');
assert(actual.decisions.includes('decisions/toolchain-reproducibility.md'), 'new maintainer record is in recursive source scope');
for (const pair of actual.pairs) assert.deepEqual(pairProblems(pair.en, pair.vi, {
  label: pair.path
}), []);
const publicPolicy = JSON.parse(readFileSync('scripts/public-site-policy.json'));
const publicFiles = new Set(Object.values(publicPolicy.audiences).flatMap(a => a.files));
for (const path of actual.decisions) {
  assert.equal(documentRole('docs/vi/' + path), 'decision_record', 'mirror retains existing documentary role');
  assert(!publicFiles.has('docs/vi/' + path), 'source parity does not add browser publication');
}
const tracked = JSON.parse(readFileSync('_audit/docs-tracked.json'));
assert.deepEqual(tracked.tracked, actual.guides, 'browser list remains top-level public guides');
assert(!tracked.tracked.some(p => p.includes('/')), 'private/source decision pairs do not leak into browser fetch list');
const fences = s => [...s.matchAll(/^\s*```[^\n]*\n([\s\S]*?)^\s*```\s*$/gm)].map(m => m[1]);
let fenceCount = 0;
for (const pair of actual.pairs.filter(p => p.path.startsWith('decisions/'))) {
  assert.deepEqual(fences(pair.vi), fences(pair.en), pair.path + ' executable/code examples remain byte-identical');
  fenceCount += fences(pair.en).length;
  for (const token of new Set(pair.en.match(/TASK-IMP-\d+|\b20\d{2}-\d\d-\d\d\b|\b[a-f0-9]{64}\b/g) || [])) assert(pair.vi.includes(token), pair.path + ' preserves source task/date/hash ' + token);
}
const fixture = mkdtempSync(join(tmpdir(), 'cs-doc-parity-')),
  en = '# Guide\n\n' + 'Source text with a stable claim. '.repeat(12),
  vi = '# Hướng dẫn\n\n' + 'Nội dung tiếng Việt giữ đúng phạm vi nguồn. '.repeat(12);
try {
  for (const p of ['_audit/ci/lib', 'docs/decisions/deep', 'docs/vi/decisions/deep']) mkdirSync(join(fixture, p), {
    recursive: true
  });
  for (const p of ['_audit/ci/test-docs-lang-parity.mjs', '_audit/ci/lib/docs-parity.mjs']) copyFileSync(p, join(fixture, p));
  const write = (p, s) => writeFileSync(join(fixture, p), s);
  write('docs/guide.md', en);
  write('docs/vi/guide.md', vi);
  write('docs/decisions/deep/record.md', en);
  write('docs/vi/decisions/deep/record.md', vi);
  write('_audit/docs-tracked.json', JSON.stringify({
    generatedBy: '_audit/ci/test-docs-lang-parity.mjs',
    tracked: ['guide.md'],
    enOnly: []
  }, null, 2) + '\n');
  const run = () => spawnSync(process.execPath, [join(fixture, '_audit/ci/test-docs-lang-parity.mjs')], {
    encoding: 'utf8'
  });
  assert.equal(run().status, 0, 'valid recursive source fixture');
  unlinkSync(join(fixture, 'docs/vi/decisions/deep/record.md'));
  let result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /decisions\/deep\/record.md: missing Vietnamese mirror/);
  write('docs/vi/decisions/deep/record.md', vi);
  write('docs/vi/decisions/deep/orphan.md', vi);
  result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /orphan/);
  unlinkSync(join(fixture, 'docs/vi/decisions/deep/orphan.md'));
  write('docs/vi/decisions/deep/record.md', '# Ngắn');
  assert.match(run().stderr, /stub\/too short/);
  write('docs/vi/decisions/deep/record.md', vi + '\nTODO\n');
  assert.match(run().stderr, /stub placeholder/);
  write('docs/vi/decisions/deep/record.md', vi + '\n## Thêm tiêu đề\n');
  assert.match(run().stderr, /heading-count drift/);
  write('docs/vi/decisions/deep/record.md', vi);
  write('docs/vi/guide.md', vi + '\n50 style packs\n');
  assert.match(run().stderr, /stale-phrase/, 'existing guide rule preserved');
  write('docs/vi/guide.md', vi);
  write('_audit/docs-tracked.json', JSON.stringify({
    generatedBy: '_audit/ci/test-docs-lang-parity.mjs',
    tracked: ['guide.md', 'decisions/deep/record.md'],
    enOnly: []
  }, null, 2) + '\n');
  assert.match(run().stderr, /docs-tracked.json stale/, 'source-only records cannot silently extend public browser manifest');
} finally {
  rmSync(fixture, {
    recursive: true,
    force: true
  });
}
console.log('PASS ' + actual.pairs.length + ' source pairs /' + actual.guides.length + ' browser guides /' + actual.decisions.length + ' decision mirrors; ' + fenceCount + ' unchanged code blocks; seven fail-closed recursive/public-boundary fixtures');
