import assert from 'node:assert/strict';
import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {withBrowserFixture} from './lib/browser-fixture.mjs';
import {waitForSiteTemplate} from './lib/site-template-ready.mjs';

const entries = JSON.parse(readFileSync('scripts/template-static-logos.json')).templates;
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const checks = [];
await withBrowserFixture(async page => {
  const base = new URL(page.url()).origin;
  const native = entries.find(entry => entry.strategy === 'static-logo');
  const component = entries.find(entry => entry.strategy === 'components');
  for (const entry of [native, component]) {
    await page.goto(base + '/' + entry.path);
    await waitForSiteTemplate(page, entry);
    checks.push({path: entry.path, strategy: entry.strategy, valid: true});
  }
  await page.goto(base + '/' + native.path);
  await waitForSiteTemplate(page, native);
  await page.evaluate(() => document.querySelectorAll('img[data-cs-official-logo]').forEach(image => image.remove()));
  page.setDefaultTimeout(200);
  await assert.rejects(waitForSiteTemplate(page, native), /Timeout/, 'Missing official artwork must fail native readiness');
  page.setDefaultTimeout(30000);
  await page.goto(base + '/' + component.path);
  await waitForSiteTemplate(page, component);
  await page.evaluate(() => { window.CyberSkillDS = undefined; });
  page.setDefaultTimeout(200);
  await assert.rejects(waitForSiteTemplate(page, component), /Timeout/, 'Missing namespace must fail component readiness');
  page.setDefaultTimeout(30000);
  await assert.rejects(waitForSiteTemplate(page, {...native, strategy: 'unknown'}), /Unknown template/);
}, {browserName});
mkdirSync('test-results/site-template-readiness', {recursive: true});
writeFileSync('test-results/site-template-readiness/' + browserName + '.json', JSON.stringify({pass: true, browserName, checks,
  negatives: {missingOfficialImageRejected: true, missingComponentNamespaceRejected: true, unknownStrategyRejected: true},
  scope: 'Actual source-template readiness and targeted missing-dependency mutations; no built-site freshness or CSP verdict.'}, null, 2) + '\n');
console.log('PASS ' + browserName + ' exact template readiness and missing image/namespace/strategy counterproof');
