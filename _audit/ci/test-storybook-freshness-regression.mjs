#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { storybookBuildInputs, storybookGeneratedDependencies } from '../../scripts/storybook-inputs.mjs';
import { fingerprint, sourceFingerprint, outputFingerprint, toolchainIdentity, verifyFreshness } from '../../scripts/storybook-fingerprint.mjs';
import { stampStorybook } from '../../scripts/stamp-storybook-freshness.mjs';
const root = mkdtempSync(join(tmpdir(), 'cs-storybook-freshness-'));
const put = (path, text = 'fixture') => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), text); };
try {
  for (const input of storybookBuildInputs) {
    if (input.includes('.') && input !== '.storybook' || input === 'VERSION') put(input);
    else mkdirSync(join(root, input), { recursive: true });
  }
  const fixtures = [
    'stories/Button.stories.jsx', '.storybook/main.js', 'components/Button.jsx',
    'tokens/colors.css', 'base/a11y.css', 'docs/consuming.md', 'templates/demo/index.html',
    'assets/logo.png', 'fonts/font.woff2', 'guidelines/atomic.html', 'ui_kits/site/index.html',
    '_vendor/react.js', '_esm/react.mjs', '_audit/run.html', 'templates/demo/.thumbnail',
    '_audit/ci/fixtures/npm-cli/package.json', '_audit/ci/fixtures/npm-cli/package-lock.json',
    '_audit/ci/fixtures/style-dictionary/package.json', '_audit/ci/fixtures/style-dictionary/package-lock.json',
    '_audit/ci/test-toolchain-reproducibility.mjs',
  ];
  for (const path of fixtures) put(path);
  put('storybook-static/index.html');
  const source = sourceFingerprint(root);
  const stamp = { schemaVersion: 2, sourceHash: source.hash, outputHash: outputFingerprint(root).hash, toolchain: toolchainIdentity() };
  verifyFreshness(root, stamp);
  for (const path of [...fixtures, 'package-lock.json', 'package.json', 'styles.css', '_ds_bundle.js']) {
    put(path, Buffer.from([0, 1, 2, 255]));
    assert.throws(() => verifyFreshness(root, stamp), /inputs changed/, path);
    put(path);
    verifyFreshness(root, stamp);
  }
  put('components/New.jsx');
  assert.throws(() => verifyFreshness(root, stamp), /inputs changed/);
  rmSync(join(root, 'components/New.jsx'));
  rmSync(join(root, 'assets/logo.png'));
  assert.throws(() => verifyFreshness(root, stamp), /inputs changed/);
  put('assets/logo.png');
  put('unrelated-local-note.txt');
  verifyFreshness(root, stamp);
  put('storybook-static/extra.js');
  assert.throws(() => verifyFreshness(root, stamp), /output changed/);
  rmSync(join(root, 'storybook-static/extra.js'));
  put('storybook-static/index.html', 'tampered');
  assert.throws(() => verifyFreshness(root, stamp), /output changed/);
  put('storybook-static/index.html');
  assert.throws(() => verifyFreshness(root, { ...stamp, schemaVersion: 1 }), /Old or invalid/);
  assert.throws(() => verifyFreshness(root, stamp, { ...toolchainIdentity(), node: 'different' }), /toolchain/);
  put('components/Button.jsx', 'changed during build');
  assert.throws(() => stampStorybook(root, source), /changed during build/);
  put('components/Button.jsx');
  symlinkSync(join(root, 'unrelated-local-note.txt'), join(root, 'assets/external'));
  assert.throws(() => sourceFingerprint(root), /symbolic link/);
  rmSync(join(root, 'assets/external'));
  assert.deepEqual(storybookGeneratedDependencies, [
    '_audit/ci/fixtures/npm-cli/node_modules',
    '_audit/ci/fixtures/style-dictionary/node_modules',
  ]);
  for (const dependencies of storybookGeneratedDependencies) {
    put(`${dependencies}/package/index.js`, 'installed dependency');
    mkdirSync(join(root, dependencies, '.bin'), { recursive: true });
    symlinkSync(join(root, 'unrelated-local-note.txt'), join(root, dependencies, '.bin/npm'));
    assert.deepEqual(sourceFingerprint(root), source, 'Generated tool dependencies and their internal bin symlink do not change source identity');
    put(`${dependencies}/package/index.js`, 'changed installed dependency');
    verifyFreshness(root, stamp);
    assert.throws(() => fingerprint(root, [dependencies]), /symbolic link/, 'Generic fingerprint still rejects dependency symlinks without explicit exclusions');
    rmSync(join(root, dependencies), { recursive: true, force: true });
    assert.deepEqual(sourceFingerprint(root), source, 'Clean and installed fixture states have identical source fingerprints');
  }
  for (const lookalike of [
    '_audit/ci/fixtures/npm-cli/node_modules-review',
    '_audit/ci/fixtures/style-dictionary/node_modules.backup',
    '_audit/ci/fixtures/unreviewed-tool',
  ]) {
    mkdirSync(join(root, lookalike), { recursive: true });
    symlinkSync(join(root, 'unrelated-local-note.txt'), join(root, lookalike, 'external'));
    assert.throws(() => sourceFingerprint(root), /symbolic link/, 'Only the two exact generated paths are excluded: ' + lookalike);
    rmSync(join(root, lookalike), { recursive: true, force: true });
  }
  const actual = stampStorybook(root, source);
  verifyFreshness(root, actual);
  console.log('PASS Storybook freshness regression: source/binary/hidden changes, authored fixture manifests/locks/scripts, exact generated tool-tree exclusions, additions/removals, toolchain, output integrity, mid-build mutation, legacy stamps and rejected unrelated symlinks');
} finally { rmSync(root, { recursive: true, force: true }); }
