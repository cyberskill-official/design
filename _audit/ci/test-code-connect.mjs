/**
 * Unit tests for Code Connect + npm-publish helpers (no network, no secrets).
 */
import {
  listPrimaries,
  figmaUrl,
  buildNodeMap,
  renderConnectFile,
} from './generate-code-connect.mjs';
import {
  resolveToken,
  isSoftSkippableCodeConnectError,
} from './code-connect-publish.mjs';
import { isSoftSkippableNpmError, preferOidcPublish } from './npm-publish.mjs';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

function assert(c, m) {
  if (!c) throw new Error(m || 'assert failed');
}

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const manifest = JSON.parse(readFileSync(join(root, '_ds_manifest.json'), 'utf8'));
const primaries = listPrimaries(manifest);
assert(primaries.length === 105, 'expected 105 primaries, got ' + primaries.length);

const names = new Set(primaries.map((p) => p.name));
for (const n of ['Button', 'TextField', 'Dialog', 'Card', 'Alert']) {
  assert(names.has(n), 'missing primary ' + n);
}

const map = buildNodeMap(primaries, {});
assert(Object.keys(map.nodes).length === 105, 'node-map size');
assert(figmaUrl('ABC', '1:2').includes('ABC') && figmaUrl('ABC', '1:2').includes('1-2'), 'figmaUrl');

const btn = renderConnectFile('Button', '12:34');
assert(btn.includes("figma.connect(Button"), 'button connect');
assert(btn.includes('variant: figma.enum'), 'button props');
assert(btn.includes('node-id=12-34'), 'button node id');

const stub = renderConnectFile('Accordion', '9999:1');
assert(stub.includes('Accordion'), 'stub name');
assert(stub.includes('CS_FIGMA_FILE_KEY'), 'placeholder key');

assert(isSoftSkippableCodeConnectError('Figma → 403: Invalid scope'), '403 soft');
assert(isSoftSkippableCodeConnectError('status 404 Not found'), '404 soft');
assert(isSoftSkippableCodeConnectError('429 Rate limit'), '429 soft');
assert(!isSoftSkippableCodeConnectError('syntax error in parser'), 'syntax not soft');

assert(isSoftSkippableNpmError('npm ERR! code ENEEDAUTH'), 'npm auth soft');
assert(isSoftSkippableNpmError('npm error code EOTP'), 'EOTP soft');
assert(!isSoftSkippableNpmError('ENOTFOUND weird'), 'ENOTFOUND alone not soft unless matched');
assert(preferOidcPublish({ GITHUB_ACTIONS: 'true' }), 'OIDC when GHA and no token');
assert(!preferOidcPublish({ GITHUB_ACTIONS: 'true', NPM_TOKEN: 'x' }), 'token wins over OIDC prefer');
assert(!preferOidcPublish({}), 'no OIDC locally without GHA');

// committed artifacts
assert(existsSync(join(root, 'figma.config.json')), 'figma.config.json');
assert(existsSync(join(root, 'code-connect/node-map.json')), 'node-map');
assert(existsSync(join(root, 'components/button/Button.figma.tsx')), 'Button.figma.tsx');

const prev = process.env.FIGMA_TOKEN;
const prev2 = process.env.FIGMA_ACCESS_TOKEN;
delete process.env.FIGMA_TOKEN;
delete process.env.FIGMA_ACCESS_TOKEN;
assert(resolveToken() === '', 'empty token');
process.env.FIGMA_TOKEN = 'x';
assert(resolveToken() === 'x', 'FIGMA_TOKEN preferred');
if (prev === undefined) delete process.env.FIGMA_TOKEN; else process.env.FIGMA_TOKEN = prev;
if (prev2 === undefined) delete process.env.FIGMA_ACCESS_TOKEN; else process.env.FIGMA_ACCESS_TOKEN = prev2;

console.log('PASS test-code-connect', { primaries: primaries.length });
