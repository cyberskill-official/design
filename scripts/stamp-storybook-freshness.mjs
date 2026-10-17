#!/usr/bin/env node
/** Called only by the build wrapper after a successful, unchanged-input build. */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { sourceFingerprint, outputFingerprint, toolchainIdentity } from './storybook-fingerprint.mjs';
import { storybookBuildInputs } from './storybook-inputs.mjs';
export function stampStorybook(root, before, origin = {}) {
  const source = sourceFingerprint(root);
  if (source.hash !== before.hash) throw new Error('Storybook inputs changed during build; rebuild before stamping');
  const output = outputFingerprint(root);
  const stamp = {
    schemaVersion: 2, sourceHash: source.hash, outputHash: output.hash,
    sourceEntries: source.entries, outputEntries: output.entries,
    toolchain: toolchainIdentity(), builtAt: new Date().toISOString(), watch: storybookBuildInputs,
    ...origin,
  };
  writeFileSync(join(root, 'storybook-static/.cs-freshness.json'), JSON.stringify(stamp, null, 2) + '\n');
  console.log('storybook freshness stamped', source.hash);
  return stamp;
}
if (process.argv[1]?.endsWith('/stamp-storybook-freshness.mjs')) {
  console.error('Refusing to stamp an existing build. Run npm run build:storybook to build and stamp together.');
  process.exitCode = 1;
}
