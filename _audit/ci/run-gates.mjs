// Headless runner for _audit/run.html — reads window.__run once the board finishes,
// exits non-zero on any hard-gate failure. Writes a text diagnostic for CI artifacts.
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const url = process.argv[2];
if (!url) { console.error('usage: node run-gates.mjs <url to _audit/run.html>'); process.exit(2); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
page.on('console', (m) => { if (/VERDICT|ERROR/i.test(m.text())) console.log('[page]', m.text()); });

await page.goto(url, { waitUntil: 'load' });

// The runner sets window.__run once every gate (incl. advisory) has settled.
// Light-contrast + overflow@320 whole-set rows live on the fast board (UX audit D2/E2) — allow headroom.
const result = await page.waitForFunction(() => window.__run, null, { timeout: 12 * 60 * 1000 })
  .then((h) => h.jsonValue())
  .catch(() => null);

const report = result
  ? [
      'CyberSkill DS — gate board',
      'pass: ' + !!result.pass,
      'total hard: ' + (result.total ?? '?'),
      'failed: ' + ((result.failed && result.failed.length) ? result.failed.join(', ') : '(none)'),
      'advisoryFailed: ' + ((result.advisoryFailed && result.advisoryFailed.length) ? result.advisoryFailed.join(', ') : '(none)'),
      '',
      JSON.stringify(result.details || {}, null, 2).slice(0, 12000),
    ].join('\n')
  : '(no window.__run — board did not finish)';
writeFileSync(new URL('./import-report.txt', import.meta.url), report);

await browser.close();

if (!result) { console.error('TIMEOUT — window.__run never populated (see uploaded import-report artifact if present)'); process.exit(1); }
console.log('Gate board result:', JSON.stringify({ pass: result.pass, total: result.total, failed: result.failed, advisoryFailed: result.advisoryFailed }));
if (!result.pass) { console.error('FAST GATES FAILED:', (result.failed || []).join(', ')); process.exit(1); }
console.log('✓ all fast gates pass' + (result.total ? ' (' + result.total + ')' : ''));
