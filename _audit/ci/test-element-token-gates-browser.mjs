import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const inputs = new Map(),
  records = [];
for (const path of ['_audit/ci/test-element-token-gates-browser.mjs', '_audit/ci/lib/browser-fixture.mjs', '_ds_bundle.js', 'package-lock.json']) inputs.set(path, hash(readFileSync(path)));
const css = readFileSync('tokens/elements.css', 'utf8');
const binding = '--cs-accent: var(--_cs-light, var(--_cs-light-accent)) var(--_cs-dark, var(--_cs-dark-accent));';
assert.equal(css.split(binding).length, 2);
const cases = [{
  name: 'baseline',
  gate: 'token-format-parity',
  verdict: '__tokenformat',
  pass: true
}, {
  name: 'baseline',
  gate: 'element-geometry',
  verdict: '__elementgeometry',
  pass: true
}, {
  name: 'system-dark baseline',
  gate: 'token-format-parity',
  verdict: '__tokenformat',
  pass: true,
  colorScheme: 'dark'
}, {
  name: 'system-dark baseline',
  gate: 'element-geometry',
  verdict: '__elementgeometry',
  pass: true,
  colorScheme: 'dark'
}, {
  name: 'JSON element drift',
  gate: 'token-format-parity',
  verdict: '__tokenformat',
  mutate: (path, bytes) => {
    if (path !== 'tokens/tokens.json') return bytes;
    const value = JSON.parse(bytes);
    value.elements.tho['--cs-accent'] = '#010203';
    return JSON.stringify(value);
  },
  requiredFailure: 'css element packs ↔ tokens.json elements'
}, {
  name: 'DTCG override drift',
  gate: 'token-format-parity',
  verdict: '__tokenformat',
  mutate: (path, bytes) => {
    if (path !== 'tokens/tokens.dtcg.json') return bytes;
    const value = JSON.parse(bytes);
    value.$extensions['com.cyberskill'].overrides.elements.tho['--cs-accent'] = '#010203';
    return JSON.stringify(value);
  },
  requiredFailure: 'css overrides ↔ DTCG $extensions overrides'
}, ...['token-format-parity', 'element-geometry'].map(gate => ({
  name: 'public resolver drift',
  gate,
  verdict: gate === 'element-geometry' ? '__elementgeometry' : '__tokenformat',
  mutate: (path, bytes) => path === 'tokens/elements.css' ? css.replace(binding, '--cs-accent: #010203;') : bytes,
  requiredFailure: gate === 'element-geometry' ? 'Actual light/dark public roles' : 'actual resolved element roles match authored palettes'
})), {
  name: 'missing source pack',
  gate: 'element-geometry',
  verdict: '__elementgeometry',
  mutate: (path, bytes) => path === 'tokens/elements.css' ? css.replace('[data-cs-element="tho"][data-cs-variant="sand"] {', '[data-cs-element="unexpected"][data-cs-variant="sand"] {') : bytes,
  requiredFailure: '15 light packs present'
}];
await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  let active;
  await page.route(origin + '/**', async route => {
    const path = decodeURIComponent(new URL(route.request().url()).pathname).slice(1);
    assert(path && !path.split('/').some(part => !part || part === '..' || part === '.'));
    const bytes = readFileSync(resolve(path));
    inputs.set(path, hash(bytes));
    const body = active?.mutate ? active.mutate(path, bytes) : bytes;
    const type = {
      '.html': 'text/html',
      '.mjs': 'application/javascript',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.css': 'text/css',
      '.woff2': 'font/woff2',
      '.svg': 'image/svg+xml',
      '.webp': 'image/webp'
    }[extname(path)] || 'application/octet-stream';
    await route.fulfill({
      body,
      contentType: type
    });
  });
  for (const test of cases) {
    active = test;
    await page.emulateMedia({
      colorScheme: test.colorScheme || 'light'
    });
    await page.goto(origin + '/_audit/' + test.gate + '.html');
    await page.waitForFunction(name => window[name], test.verdict);
    const verdict = await page.evaluate(name => window[name], test.verdict);
    assert.equal(verdict.pass, !!test.pass, JSON.stringify({
      case: test.name,
      gate: test.gate,
      verdict
    }));
    if (test.requiredFailure) {
      assert(!verdict.error, 'A semantic counterproof must produce a failing verdict, not crash');
      assert([...(verdict.failed || []), ...(verdict.problems || [])].some(value => value.includes(test.requiredFailure)), JSON.stringify(verdict));
    }
    if (test.pass && test.gate === 'token-format-parity') assert.equal(verdict.total, 14, 'All original13 parity checks plus independent actual resolver check');
    if (test.pass && test.gate === 'element-geometry') assert.equal(verdict.packs, 15, 'All original30 light/dark sets retained');
    records.push({
      name: test.name,
      gate: test.gate,
      verdict
    });
  }
}, {
  browserName
});
for (const [path, before] of inputs) assert.equal(hash(readFileSync(path)), before, 'Source changed during element gate proof');
mkdirSync('test-results/element-token-gates', {
  recursive: true
});
writeFileSync('test-results/element-token-gates/' + browserName + '.json', JSON.stringify({
  pass: true,
  browserName,
  inputs: Object.fromEntries(inputs),
  records,
  scope: 'Actual existing browser gates, original13format checks plus resolvedbinding guard, originalgeometry thresholds unchanged; JSON/DTCG/resolver/missingpack semantic counterproofs. No pixel baseline or source palette changes.'
}, null, 2) + '\n');
console.log('PASS ' + browserName + ': token/geometry baselines and five semantic counterproofs');
