import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { compactApi } from '../../scripts/lib/compact-api.mjs';
const bytes = readFileSync('components/api-index.json', 'utf8');
const api = JSON.parse(bytes);
const result = compactApi(bytes);
assert.equal(result.completeIndex.sha256, createHash('sha256').update(bytes).digest('hex'));
assert.equal(result.exports.length, api.exports.length);
let authored = 0;
for (const [index, item] of api.exports.entries()) {
  const projected = result.exports[index];
  assert.equal(projected.name, item.name);
  assert.equal(projected.sourceSha256, item.sourceSha256);
  const own = item.props.filter(prop => api.propDefinitions[prop.definition].origin === 'authored');
  assert.deepEqual(projected.authoredProps, own, 'Every authored definition is retained, in original order');
  assert.equal(projected.inheritedPropCount, item.props.length - own.length);
  for (const prop of own) assert.deepEqual(result.propDefinitions[prop.definition], api.propDefinitions[prop.definition]);
  authored += own.length;
}
assert(Object.values(result.propDefinitions).every(prop => prop.origin === 'authored'));
assert(Buffer.byteLength(JSON.stringify(result)) < Buffer.byteLength(bytes), 'Projection must actually reduce discovery bytes');
for (const mutate of [
  value => value.exports.push(value.exports[0]),
  value => value.exports[0].sourcePath = '../escape.jsx',
  value => value.exports[0].props.push(value.exports[0].props[0]),
  value => value.exports[0].props[0].definition = 'missing',
  value => value.propDefinitions[value.exports[0].props[0].definition].origin = 'unknown',
]) {
  const bad = structuredClone(api);
  mutate(bad);
  assert.throws(() => compactApi(JSON.stringify(bad)));
}
console.log(`PASS compact discovery: all ${api.exports.length} exports/${authored} authored prop references retained; inherited counts, full-index identity and malformed/duplicate references verified`);
