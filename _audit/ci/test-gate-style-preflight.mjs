import assert from 'node:assert/strict';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
await withBrowserFixture(async page => {
  const origin = new URL(page.url()).origin;
  await page.route('**/styles.css', route => route.fulfill({ contentType: 'text/css', body: '/* Missing stylesheet fixture. */' }));
  // The prerequisite is checked without depending on a CDN or executing the suite.
  await page.route('https://unpkg.com/**', route => route.abort());
  for (const [path, global] of [['a11y-gate.html', '__a11y'], ['component-behavior-test.html', '__behavior']]) {
    await page.goto(`${origin}/_audit/${path}`);
    await page.waitForFunction(name => window[name], global, { timeout: 10000 });
    const verdict = await page.evaluate(name => window[name], global);
    assert.equal(verdict.pass, false);
    assert.equal(verdict.total, 0);
    assert.match(verdict.error, /Stylesheet preflight failed/);
  }
});
console.log('PASS gate prerequisites: missing CSS cannot produce a behavior/accessibility pass');
