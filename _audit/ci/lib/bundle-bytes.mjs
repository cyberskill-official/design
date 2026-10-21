import assert from 'node:assert/strict';
export function assertBundleBytes(actual, expected) {
  assert.equal(actual, expected, 'Bundle bytes differ from deterministic source build; run npm run build:bundle');
}
