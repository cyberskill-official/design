#!/usr/bin/env node
/** Full declared source graph, toolchain and output integrity; absent is explicitly skipped. */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sourceFingerprint, verifyFreshness } from '../../scripts/storybook-fingerprint.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
export function hashStorySources(repoRoot = root) { return sourceFingerprint(repoRoot).hash; }
if (process.argv[1]?.endsWith('/test-storybook-freshness.mjs')) {
  try {
    if (!existsSync(join(root, 'storybook-static'))) {
      if (process.argv.includes('--require')) throw new Error('storybook-static absent (--require)');
      console.log('SKIP test-storybook-freshness: storybook-static absent');
    } else {
      const stamp = JSON.parse(readFileSync(join(root, 'storybook-static/.cs-freshness.json'), 'utf8'));
      verifyFreshness(root, stamp);
      console.log('PASS test-storybook-freshness', stamp.sourceHash);
    }
  } catch (error) {
    console.error('FAIL test-storybook-freshness:', error.message, '— run npm run build:storybook');
    process.exitCode = 1;
  }
}
