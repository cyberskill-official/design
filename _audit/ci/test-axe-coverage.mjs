/**
 * Lock axe-smoke fixtures to the public primary inventory.
 * Ensures `_audit/lib/axe-fixtures.js` names === listPublicComponents().
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { listPublicComponents } from './storybook-inventory.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
function assert(c, m) {
  if (!c) throw new Error(m);
}

const fixturesPath = join(root, '_audit/lib/axe-fixtures.js');
assert(existsSync(fixturesPath), 'axe-fixtures.js present');
const fixtures = readFileSync(fixturesPath, 'utf8');
assert(/global\.__axeFixtures|window\.__axeFixtures/.test(fixtures), 'fixtures publish __axeFixtures');
assert(/buildCluster\s*:/.test(fixtures) || /buildCluster\s*=/.test(fixtures) || /function buildCluster/.test(fixtures), 'buildCluster export');
assert(/expandForScan/.test(fixtures), 'expandForScan export');
assert(/data-axe-forced-open/.test(fixtures), 'expandForScan force-opens Tooltip for axe');
assert(/cs-hovercard__panel/.test(fixtures), 'expandForScan asserts HoverCard panels');
assert(/cs-ctxmenu-zone/.test(fixtures), 'expandForScan opens ContextMenu zones');

const namesMatch = fixtures.match(/var NAMES = (\[[\s\S]*?\]);/);
assert(namesMatch, 'NAMES array in axe-fixtures.js');
const fixtureNames = JSON.parse(namesMatch[1]);
const inventory = listPublicComponents().map((m) => m.primary).sort();
const fixtureSorted = [...fixtureNames].sort();

assert(fixtureSorted.length === inventory.length, `fixture count ${fixtureSorted.length} !== inventory ${inventory.length}`);
const missing = inventory.filter((n) => !fixtureNames.includes(n));
const extra = fixtureNames.filter((n) => !inventory.includes(n));
if (missing.length || extra.length) {
  console.error('✗ axe fixture inventory drift', { missing, extra });
  process.exit(1);
}

// Smoke HTML wires fixtures + inventory count language
const smoke = readFileSync(join(root, '_audit/axe-smoke.html'), 'utf8');
assert(smoke.includes('./lib/axe-fixtures.js'), 'axe-smoke loads fixtures');
assert(smoke.includes('__axeFixtures'), 'axe-smoke uses __axeFixtures');
assert(/every public primary|all public primar/i.test(smoke), 'axe-smoke lede claims full primary coverage');
assert(!/\b40-component\b/.test(smoke), 'axe-smoke no longer claims 40-component cluster');

console.log('PASS test-axe-coverage', { primaries: inventory.length });
