import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decide } from './release-meta.mjs';

test('prereleases go to their pre tag, stable to latest only from a matching tag', () => {
  assert.deepEqual(decide({ version: '3.0.0-next.1', refType: 'branch', refName: 'next', preTag: 'next' }), { distTag: 'next' });
  assert.deepEqual(decide({ version: '3.0.0-next.1', refType: 'tag', refName: 'v3.0.0-next.1', preTag: 'next' }), { distTag: 'next' });
  assert.deepEqual(decide({ version: '3.0.0', refType: 'tag', refName: 'v3.0.0' }), { distTag: 'latest' });
});

test('refuses unsafe publishes', () => {
  assert.match(decide({ version: '3.0.0-next.1', refType: 'branch', refName: 'next' }).error, /would publish as latest/);
  assert.match(decide({ version: '3.0.0', refType: 'branch', refName: 'main' }).error, /only from its v3.0.0 tag/);
  assert.match(decide({ version: '3.0.0', refType: 'tag', refName: 'v3.0.1' }).error, /does not match/);
  assert.match(decide({ version: '3.0.0', refType: 'tag', refName: 'v3.0.0', preTag: 'next' }).error, /still in pre mode/);
  // A preview can never take latest, even if .changeset/pre.json is edited, and manual runs only ship merged code.
  assert.match(decide({ version: '3.0.0-next.1', refType: 'branch', refName: 'next', preTag: 'latest' }).error, /only under "next"/);
  assert.match(decide({ version: '3.0.0-rc.1', refType: 'tag', refName: 'v3.0.0-rc.1', preTag: 'beta' }).error, /only under "next"/);
  assert.match(decide({ version: '3.0.0-next.2', refType: 'branch', refName: 'feat/x', preTag: 'next' }).error, /only from the next branch/);
});
