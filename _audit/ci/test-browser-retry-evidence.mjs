import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { withBrowserFixture } from './lib/browser-fixture.mjs';
const browserName = process.env.CS_TEST_BROWSER || 'chromium';
const originalWarn = console.warn;
const warnings = [];
console.warn = (...args) => {
  const line = args.join(' ');
  if (line.startsWith('CS_BROWSER_RETRY ')) warnings.push(JSON.parse(line.slice('CS_BROWSER_RETRY '.length)));
  else originalWarn(...args);
};
const rows = [];
try {
  let attempts = 0;
  await withBrowserFixture(async page => {
    attempts++;
    if (attempts === 1) await page.context().browser().close();
    assert.equal(await page.locator('#fixture').count(), 1);
  }, { browserName });
  assert.equal(attempts, 2, 'A real closed browser retries with a fresh fixture');
  assert.equal(warnings.length, 1);
  assert.deepEqual([warnings[0].failedAttempt, warnings[0].nextAttempt, warnings[0].browser], [1, 2, browserName]);
  assert.match(warnings[0].reason, /closed/i);
  rows.push({ scenario: 'one real closed browser then fresh success', attempts, warnings: structuredClone(warnings) });
  warnings.length = 0;
  attempts = 0;
  await assert.rejects(() => withBrowserFixture(async page => {
    attempts++;
    await page.context().browser().close();
    await page.locator('#fixture').count();
  }, { browserName }), /closed/i);
  assert.equal(attempts, 3, 'Repeated infrastructure failure must exhaust the original bounded limit');
  assert.equal(warnings.length, 2);
  assert.deepEqual(warnings.map(row => row.nextAttempt), [2, 3]);
  rows.push({ scenario: 'repeated real browser closure remains a terminal failure', attempts, warnings: structuredClone(warnings) });
  warnings.length = 0;
  attempts = 0;
  await assert.rejects(() => withBrowserFixture(async () => {
    attempts++;
    assert.equal(1, 2, 'Intentional assertion failure must not retry');
  }, { browserName }), /Intentional assertion failure/);
  assert.equal(attempts, 1);
  assert.equal(warnings.length, 0);
  rows.push({ scenario: 'assertion failure fails immediately', attempts, warnings: [] });
} finally {
  console.warn = originalWarn;
}
const source = readFileSync('_audit/ci/lib/browser-fixture.mjs');
mkdirSync('test-results/browser-retry-evidence', { recursive: true });
writeFileSync(`test-results/browser-retry-evidence/${browserName}.json`, JSON.stringify({ status: 'PASS', browserName, helperSha256: createHash('sha256').update(source).digest('hex'), rows, boundary: 'Intentional process-closure proof; does not establish memory pressure as the cause of historical crashes.' }, null, 2) + '\n');
console.log(`PASS ${browserName} retry evidence: real closure recovery, bounded terminal closure failure, immediate assertion failure and structured retry records`);
