#!/usr/bin/env node
import { createRequire } from 'node:module';
import { readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { sourceFingerprint } from './storybook-fingerprint.mjs';
import { stampStorybook } from './stamp-storybook-freshness.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const manifestPath = require.resolve('storybook/package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin.storybook;
rmSync(join(root, 'storybook-static/.cs-freshness.json'), { force: true });
const before = sourceFingerprint(root);
const result = spawnSync(process.execPath, [join(dirname(manifestPath), bin), 'build', '-o', 'storybook-static'], {
  cwd: root, stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(`Storybook build failed (${result.status}); see the build diagnostics above`);
if (sourceFingerprint(root).hash !== before.hash) throw new Error('Storybook inputs changed during build');
stampStorybook(root, before);

