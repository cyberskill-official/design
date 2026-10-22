import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { readCardMetadata, deriveCardMetadata } from '../../scripts/lib/card-metadata.mjs';
const root = new URL('../../', import.meta.url).pathname;
const read = path => readFileSync(join(root, path), 'utf8');
const cards = JSON.parse(read('_ds_manifest.json')).cards;
assert.equal(cards.length, 58);
assert.equal(cards.filter(card => card.path === 'components/i18n/i18n.card.html').length, 1, 'The registered locale card must appear exactly once');
assert.deepEqual(deriveCardMetadata(cards, read), cards);
const header = '<!-- @dsCard group="Components" viewport="700x300" name="Button" subtitle="Composite focus" -->';
const fields = {
  group: 'Components',
  viewport: '700x300',
  name: 'Button',
  subtitle: 'Composite focus'
};
assert.deepEqual(readCardMetadata(header), fields);
assert.deepEqual(readCardMetadata('<script>const fake="@dsCard nope";</script>' + header), fields);
assert.deepEqual(deriveCardMetadata([{
  path: 'card.html',
  ...fields,
  retained: 'yes'
}], () => header)[0], {
  path: 'card.html',
  ...fields,
  retained: 'yes'
});
for (const invalid of ['', header + header, '<script>' + header + '</script>', header.replace(' group="Components"', ''), header.replace(' group="Components"', ' group=""'), header.replace('name="Button"', 'name="Button" name="Duplicate"'), header.replace('name="Button"', 'unknown="Button"'), header.replace('name="Button"', 'name=Button'), header.replace('700x300', '0x300'), header.replace('700x300', '700x-1'), header.replace('700x300', '9007199254740992x300'), header.replace('@dsCard ', 'prefix @dsCard '), header.replace(' -->', ' unexpected -->')]) assert.throws(() => readCardMetadata(invalid));
for (const path of ['/card.html', '../card.html', 'a//card.html', 'a\\card.html']) assert.throws(() => deriveCardMetadata([{
  path
}], () => header));
assert.throws(() => deriveCardMetadata([{
  path: 'card.html'
}, {
  path: 'card.html'
}], () => header));
for (const field of Object.keys(fields)) {
  const stale = structuredClone(cards);
  stale[0][field] = field === 'viewport' ? '1x1' : 'Wrong';
  assert.notDeepEqual(deriveCardMetadata(stale, read), stale, field);
  assert.deepEqual(deriveCardMetadata(stale, read), cards, field);
}
// Isolated actual generator: check must reject field drift; regeneration preserves order and repairs it.
const scratch = mkdtempSync(join(tmpdir(), 'cs-card-catalog-'));
try {
  for (const path of ['scripts', 'components', 'base', 'tokens', '_esm', '_ds_manifest.json', 'VERSION']) cpSync(join(root, path), join(scratch, path), {
    recursive: true
  });
  for (const card of cards) if (!card.path.startsWith('components/')) {
    mkdirSync(resolve(scratch, card.path, '..'), {
      recursive: true
    });
    cpSync(join(root, card.path), join(scratch, card.path));
  }
  // The generator resolves esbuild through its own location.
  const {
    symlinkSync
  } = await import('node:fs');
  symlinkSync(join(root, 'node_modules'), join(scratch, 'node_modules'));
  const run = args => spawnSync(process.execPath, ['scripts/generate-export-catalog.mjs', ...args], {
    cwd: scratch,
    encoding: 'utf8'
  });
  assert.equal(run(['--check']).status, 0);
  const path = join(scratch, '_ds_manifest.json'),
    manifest = JSON.parse(readFileSync(path, 'utf8'));
  manifest.cards[0].subtitle = 'stale subtitle';
  writeFileSync(path, JSON.stringify(manifest, null, 2) + '\n');
  const stale = run(['--check']);
  assert.equal(stale.status, 1);
  assert.match(stale.stderr, /Stale export catalog/);
  assert.equal(run([]).status, 0);
  assert.deepEqual(JSON.parse(readFileSync(path, 'utf8')).cards, cards);
} finally {
  rmSync(scratch, {
    recursive: true,
    force: true
  });
}
if (process.env.CS_CARD_EVIDENCE_PATH) writeFileSync(process.env.CS_CARD_EVIDENCE_PATH, JSON.stringify({
  scope: '58 actual authored card headers and manifest fields. Parser failure paths and isolated actual generator drift/regeneration. No preview raster acceptance.'
}, null, 2) + '\n');
console.log('PASS card metadata: 58 authored headers, malformed/duplicate/missing/path failures, every field drift, actual isolated generator check/regeneration. No visual acceptance.');
