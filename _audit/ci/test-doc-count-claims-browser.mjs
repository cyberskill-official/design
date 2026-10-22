import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const read = path => readFileSync(new URL('../../' + path, import.meta.url), 'utf8');
const readme = read('README.md');
const catalog = JSON.parse(read('docs/reference-catalog.json'));
const marker = (key, value) => `<!-- cs-count:${key} -->${value}<!-- /cs-count -->`;
const rows = [];
const cases = [{
  name: 'current source with declared-control subsets',
  pass: true
}, {
  name: 'additional correct subset and total markers',
  pass: true,
  append: '\n' + marker('templatesWithThemeControl', catalog.counts.templatesWithThemeControl) + ' templates declare a Theme control. ' + marker('templates', catalog.counts.templates) + ' templates total.'
}, {
  name: 'incorrect subset marker',
  append: '\n' + marker('templatesWithThemeControl', catalog.counts.templatesWithThemeControl + 1) + ' templates declare Theme.',
  failure: 'README.md count marker templatesWithThemeControl'
}, {
  name: 'incorrect marked total',
  append: '\n' + marker('templates', catalog.counts.templates + 1) + ' templates total.',
  failure: 'README.md count marker templates'
}, {
  name: 'unknown count field',
  append: '\n' + marker('inventedCount', 85),
  failure: 'README.md count marker inventedCount'
}, {
  name: 'invalid numeric value',
  append: '\n' + marker('templates', '85.0'),
  failure: 'README.md count marker templates'
}, {
  name: 'unclosed marker',
  append: '\n<!-- cs-count:templates -->85 templates.',
  failure: 'README.md count markers well formed'
}, {
  name: 'unpaired closing marker',
  append: '\n<!-- /cs-count -->',
  failure: 'README.md count markers well formed'
}, {
  name: 'malformed marker spelling',
  append: '\n<!-- cs-count:templates-->85<!-- /cs-count -->',
  failure: 'README.md count markers well formed'
}, {
  name: 'wrong unmarked whole-template total',
  append: `\n${catalog.counts.templates + 1} templates total.`,
  failure: 'README.md · templates = compiler'
}, {
  name: 'wrong unmarked export total',
  append: `\n${catalog.counts.publicExports + 1} exports.`,
  failure: 'README.md · exports = compiler'
}, {
  name: 'wrong unmarked component-file total',
  append: `\n${catalog.counts.componentSourceFiles + 1} components.`,
  failure: 'README.md · files = compiler'
}, {
  name: 'wrong unmarked token total',
  append: `\n${catalog.counts.publicTokenDeclarations + 1} tokens.`,
  failure: 'README.md · tokens = compiler'
}, {
  name: 'wrong unmarked audit card total',
  audit: `\n${catalog.counts.cards + 1} cards.`,
  failure: 'audit card-count claims = manifest'
}, {
  name: 'wrong marked audit card total',
  audit: '\n' + marker('cards', catalog.counts.cards + 1) + ' cards.',
  failure: '_audit/README.md count marker cards'
}, {
  name: 'catalog total differs from manifest',
  mutate: c => c.counts.templates++,
  failure: 'reference catalog totals and subset sums = manifest'
}, {
  name: 'catalog subset sums differ from total',
  mutate: c => c.counts.templatesWithThemeControl++,
  failure: 'reference catalog totals and subset sums = manifest'
}, {
  name: 'catalog noninteger subset',
  mutate: c => c.counts.templatesWithBooleanControl = 15.5,
  failure: 'reference catalog totals and subset sums = manifest'
}, {
  name: 'catalog wrong version',
  mutate: c => c.version = '0.0.0',
  failure: 'reference catalog totals and subset sums = manifest'
}, {
  name: 'catalog missing',
  catalogStatus: 404,
  failure: 'fetch docs/reference-catalog.json'
}, {
  name: 'catalog intercepted HTML',
  catalogBody: '<!doctype html><html>Fallback</html>',
  failure: 'fetch docs/reference-catalog.json'
}, {
  name: 'catalog malformed JSON returns explicit failure',
  catalogBody: '{',
  failure: 'docs-consistency bootstrap/parse'
}, {
  name: 'invalid marker diagnostic is plain text',
  append: '\n' + marker('templates', '<img src=x onerror="window.countClaimExecuted=true">'),
  failure: 'README.md count marker templates'
}];
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
await withBrowserFixture(async page => {
  const url = new URL('/_audit/docs-consistency.html', page.url()).href;
  const readmeUrl = new URL('/README.md', url).href;
  const auditUrl = new URL('/_audit/README.md', url).href;
  const catalogUrl = new URL('/docs/reference-catalog.json', url).href;
  for (const item of cases) {
    await page.unroute(readmeUrl);
    await page.unroute(auditUrl);
    await page.unroute(catalogUrl);
    const mutatedPaths = [];
    if (item.append) await page.route(readmeUrl, route => {
      mutatedPaths.push('/README.md');
      return route.fulfill({
        contentType: 'text/plain',
        body: readme + item.append
      });
    });
    if (item.audit) await page.route(auditUrl, route => {
      mutatedPaths.push('/_audit/README.md');
      return route.fulfill({
        contentType: 'text/plain',
        body: read('_audit/README.md') + item.audit
      });
    });
    if (item.mutate || item.catalogStatus || item.catalogBody) {
      const data = structuredClone(catalog);
      item.mutate?.(data);
      await page.route(catalogUrl, route => {
        mutatedPaths.push('/docs/reference-catalog.json');
        return route.fulfill({
          status: item.catalogStatus || 200,
          contentType: 'application/json',
          body: item.catalogBody ?? JSON.stringify(data)
        });
      });
    }
    await page.goto(url);
    await page.waitForFunction(() => window.__docs, null, {
      timeout: 30000
    });
    const verdict = await page.evaluate(() => window.__docs);
    assert.equal(verdict.pass, !!item.pass, item.name + ': ' + JSON.stringify(verdict));
    if (item.failure) assert(verdict.steps.some(s => s.startsWith('✗ ' + item.failure)), item.name + ': expected failure row');
    assert.equal(await page.locator('#report img').count(), 0);
    assert.equal(await page.evaluate(() => window.countClaimExecuted), undefined);
    const expectedPaths = [...(item.append ? ['/README.md'] : []), ...(item.audit ? ['/_audit/README.md'] : []), ...(item.mutate || item.catalogStatus || item.catalogBody ? ['/docs/reference-catalog.json'] : [])];
    assert.deepEqual(mutatedPaths.sort(), expectedPaths.sort(), item.name + ': mutation must intercept only its intended file');
    rows.push({
      name: item.name,
      mutatedPaths,
      expectedPass: !!item.pass,
      actualPass: verdict.pass,
      failures: verdict.steps.filter(s => s.startsWith('✗'))
    });
  }
}, {
  browserName
});
const sourcePaths = ['_audit/docs-consistency.html', '_audit/ci/test-doc-count-claims-browser.mjs', '_audit/ci/lib/browser-fixture.mjs', 'docs/reference-catalog.json', '_ds_manifest.json', 'README.md', 'SKILL.md', 'llms.txt', '_audit/README.md'];
const sourceFiles = Object.fromEntries(sourcePaths.map(path => [path, createHash('sha256').update(read(path)).digest('hex')]));
if (process.env.CS_DOC_COUNT_REPORT) writeFileSync(process.env.CS_DOC_COUNT_REPORT, JSON.stringify({
  browserName,
  sourceFiles,
  cases: rows,
  scope: 'Actual docs-consistency gate: named generated count fields, catalog shape/totals/subset sums, recognized unmarked totals and explicit fetch/parse failures. Catalog freshness is a separate Node check; arbitrary prose semantics and actual controls are not certified.'
}, null, 2) + '\n');
console.log(`PASS ${browserName} docs-count gate: ${rows.length} browser cases, including correct subsets and explicit rejection paths`);
