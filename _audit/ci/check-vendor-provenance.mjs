// Offline integrity of the explicitly pinned runtime distributions and notices.
// Registry tarball matching is recorded at acquisition, not repeated by this check.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {dirname, resolve, relative, isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
let files = 0;
for (const path of ['_vendor/react/provenance.json', '_vendor/babel/provenance.json', '_audit/vendor/axe-provenance.json', '_audit/vendor/jsqr/provenance.json']) {
  const record = JSON.parse(readFileSync(resolve(root, path), 'utf8'));
  // jsQR's acquisition record predates the array-based schema. Preserve its
  // recorded bytes and normalize only the in-memory view used for validation.
  if (path === '_audit/vendor/jsqr/provenance.json') {
    assert(record.files && !Array.isArray(record.files), path);
    record.files = Object.entries(record.files).map(([path, sha256]) => ({path, sha256}));
  } else assert.equal(record.schemaVersion, 1, path);
  for (const distribution of [record, ...(record.embeddedProjectNotices || [])]) {
    assert(distribution.package && distribution.version && distribution.integrity, path);
    assert(distribution.files.length > 0, path);
    for (const file of distribution.files) {
      const base = resolve(root, dirname(path)), target = resolve(base, file.path);
      const rel = relative(base, target);
      assert(rel && !rel.startsWith('..') && !isAbsolute(rel), 'Unsafe provenance path');
      assert.equal(createHash('sha256').update(readFileSync(target)).digest('hex'), file.sha256, target);
      files++;
    }
  }
}
console.log(`PASS vendor provenance: ${files} runtime/notice files; offline hashes only`);
