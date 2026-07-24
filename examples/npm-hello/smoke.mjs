#!/usr/bin/env node
/**
 * Offline smoke for examples/npm-hello — proves the published package name is
 * installed and that dual package exports resolve (bundler primary + legacy
 * browser). This example's index.html still loads the legacy browser entry.
 * Run from this directory after `npm install`.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fail = (m) => {
  console.error('✗ npm-hello smoke:', m);
  process.exit(1);
};

const designRoot = join(__dirname, 'node_modules/@cyberskill/design');
const pkgPath = join(designRoot, 'package.json');
if (!existsSync(pkgPath)) fail('run npm install in examples/npm-hello first');

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
if (pkg.name !== '@cyberskill/design') fail('unexpected package name ' + pkg.name);
if (pkg.version !== '1.0.0') fail('expected @cyberskill/design@1.0.0, got ' + pkg.version);

const exportsMap = pkg.exports || {};
if (!exportsMap['.']?.import?.includes('_esm/react.mjs')) {
  fail('exports["."] must point at _esm/react.mjs (bundler-native)');
}
if (!exportsMap['./legacy']?.import?.includes('_esm/cs.mjs')) {
  fail('exports["./legacy"] must point at _esm/cs.mjs');
}
if (!exportsMap['./styles.css']) fail('exports["./styles.css"] missing');
if (!pkg.peerDependencies?.react) fail('peerDependencies.react missing');

// Default package resolve → bundler React entry
let resolvedEntry;
try {
  resolvedEntry = fileURLToPath(import.meta.resolve('@cyberskill/design'));
} catch (e) {
  fail('import.meta.resolve(@cyberskill/design) failed: ' + (e && e.message));
}
if (!resolvedEntry.includes('@cyberskill/design') || !resolvedEntry.endsWith('_esm/react.mjs')) {
  fail('unexpected entry resolve: ' + resolvedEntry);
}

let resolvedLegacy;
try {
  resolvedLegacy = fileURLToPath(import.meta.resolve('@cyberskill/design/legacy'));
} catch (e) {
  fail('import.meta.resolve(@cyberskill/design/legacy) failed: ' + (e && e.message));
}
if (!resolvedLegacy.endsWith('_esm/cs.mjs')) {
  fail('unexpected legacy resolve: ' + resolvedLegacy);
}

const styles = join(designRoot, 'styles.css');
const esm = join(designRoot, '_esm/cs.mjs');
const react = join(designRoot, '_esm/react.mjs');
const bundle = join(designRoot, '_ds_bundle.js');
for (const p of [styles, esm, react, bundle]) {
  if (!existsSync(p)) fail('missing entry ' + p);
}

const html = readFileSync(join(__dirname, 'index.html'), 'utf8');
if (!html.includes('@cyberskill/design')) fail('index.html must import package name');
if (!html.includes('_esm/cs.mjs')) fail('index.html must use legacy browser entry (_esm/cs.mjs)');
if (!/data-cs-element="hoa"/.test(html) || !/data-cs-variant="plasma"/.test(html)) {
  fail('index.html must scope Lumi identity (hoa · plasma) from docs/products.md');
}

console.log('PASS examples/npm-hello smoke', {
  package: '@cyberskill/design@' + pkg.version,
  entry: resolvedEntry.replace(__dirname + '/', ''),
  legacy: resolvedLegacy.replace(__dirname + '/', ''),
  product: 'Lumi',
  element: 'hoa',
  variant: 'plasma',
});
