import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import { observeConsumerPerformance, armConsumerInteraction, consumerPerformanceSnapshot } from '../../scripts/lib/browser-performance.mjs';
for (const args of [['--unknown'], ['--output'], ['--output', 'one.json', 'extra']]) {
  const rejected = spawnSync(process.execPath, ['scripts/measure-consumer-costs.mjs', ...args], { encoding: 'utf8' });
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /Usage: node scripts\/measure-consumer-costs/);
  assert(!rejected.stdout.includes('Saved packed-consumer'), 'Invalid arguments must fail before measurement/output side effects');
}
const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(`<!doctype html><html lang="vi"><head><title>Timing fixture</title></head><body><script>
  setTimeout(()=>{document.body.insertAdjacentHTML('beforeend','<main><h1>Xin chào</h1><input><button>Commit</button><output></output></main>');
  document.querySelector('button').addEventListener('click',()=>setTimeout(()=>document.querySelector('output').textContent='An',100));},120);
  </script></body></html>`);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.addInitScript(observeConsumerPerformance);
  await page.goto('http://127.0.0.1:' + server.address().port);
  await page.waitForFunction(() => Number.isFinite(window.__csConsumerPerformance?.readinessMs));
  const cold = await page.evaluate(consumerPerformanceSnapshot);
  assert(cold.readinessMs >= 120, 'DOM delay must be included in actual browser readiness');
  assert(cold.navigation.responseEndMs >= 0 && cold.navigation.loadEventEndMs >= cold.navigation.responseEndMs);
  assert.equal(cold.interactionToRenderOpportunityMs, null, 'Unmeasured interactions are not zero-duration successes');
  assert(cold.supportedEntryTypes.includes('paint'));
  await page.evaluate(armConsumerInteraction);
  await page.getByRole('button', {
    name: 'Commit'
  }).click();
  await page.waitForFunction(() => Number.isFinite(window.__csConsumerPerformance.interactionToRenderOpportunityMs));
  const after = await page.evaluate(consumerPerformanceSnapshot);
  assert(after.interactionToRenderOpportunityMs >= 100, 'Actual delayed DOM commit must precede render opportunity');
  assert.equal(after.readinessMs, cold.readinessMs, 'Initial readiness is not rewritten by an interaction');
  assert.equal(await page.locator('output').textContent(), 'An');
  await page.evaluate(() => {
    window.__csConsumerPerformance.readinessMs = null;
  });
  await assert.rejects(() => page.evaluate(consumerPerformanceSnapshot), /readiness\/navigation evidence is missing/);
  await page.evaluate(() => {
    delete window.__csConsumerPerformance;
  });
  await assert.rejects(() => page.evaluate(armConsumerInteraction), /Missing consumer interaction/);
  // An engine without optional observer APIs still records navigation/readiness,
  // and reports the unsupported observer metrics as null, never fabricated zero.
  const unsupported = await browser.newPage();
  await unsupported.addInitScript(() => {
    Object.defineProperty(window, 'PerformanceObserver', {
      value: undefined
    });
  });
  await unsupported.addInitScript(observeConsumerPerformance);
  await unsupported.goto('http://127.0.0.1:' + server.address().port);
  await unsupported.waitForFunction(() => Number.isFinite(window.__csConsumerPerformance?.readinessMs));
  const limited = await unsupported.evaluate(consumerPerformanceSnapshot);
  assert.deepEqual(limited.supportedEntryTypes, []);
  for (const key of ['firstContentfulPaintMs', 'largestContentfulPaintMs', 'longTaskCount', 'longTaskTotalMs']) assert.equal(limited[key], null);
  console.log('PASS browser performance evidence: real delayed mount/commit, navigation order, stable cold baseline, missing evidence rejection and explicit unsupported metrics');
} finally {
  if (browser) await browser.close();
  await new Promise(resolve => server.close(resolve));
}
