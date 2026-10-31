import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';

const browserName = process.env.CS_TEST_BROWSER || process.env.CS_BROWSER || 'chromium';

await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  await page.goto(origin + '/_audit/component-state-paint.html');
  await page.waitForFunction(() => window.__statepaint, null, { timeout: 30000 });
  const verdict = await page.evaluate(() => window.__statepaint);
  assert.equal(verdict.pass, true, browserName + ' ' + (verdict.error || (verdict.failed || []).join(', ')));
  assert.equal(verdict.total, 19, browserName + ' paint check count');
}, { browserName });

console.log('PASS component state paint ' + browserName);
