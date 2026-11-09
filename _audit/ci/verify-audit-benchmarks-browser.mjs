#!/usr/bin/env node
/**
 * Benchmark Non-Regression Gate (v2.3.1 -> v2.4.0 -> v2.5.0+).
 * Executes the live browser verification suites (`audit/v2.5.0-verification.html` 10-dimension
 * 68-check suite + embedded `audit/v2.4.0-verification.html` 64-check baseline suite = 132 checks)
 * and fails closed if any dimension drops below 10.0/10, any historical check regresses,
 * any `watch` item appears, or any cell in the 32x6 non-text contrast matrix drops below 3.0:1.
 */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const writeReceipt = process.argv.includes('--write-receipt');
const receiptPath = join(root, 'audit', 'v2.5.0-verification.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function readGitTagFile(tag, relPath) {
  try {
    return execFileSync('git', ['show', `${tag}:${relPath}`], {
      cwd: root,
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 16 * 1024 * 1024,
    });
  } catch {
    return null;
  }
}

let server;
let browser;
try {
  server = createServer((req, res) => {
    const u = new URL(req.url, 'http://127.0.0.1');
    const pathname = decodeURIComponent(u.pathname);
    const file = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + sep) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.setHeader('Content-Type', MIME[extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(readFileSync(file));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();

  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Serve tagged baseline files deterministically from local git tags when available.
  await context.route('https://raw.githubusercontent.com/cyberskill-official/design/**', async (route) => {
    const url = new URL(route.request().url());
    const parts = url.pathname.replace(/^\/cyberskill-official\/design\//, '').split('/');
    const tag = parts.shift();
    const relPath = parts.join('/');
    const buf = tag && relPath ? readGitTagFile(tag, relPath) : null;
    if (buf) {
      await route.fulfill({
        status: 200,
        contentType: MIME[extname(relPath)] || 'text/plain; charset=utf-8',
        body: buf,
      });
      return;
    }
    const fallbackFile = resolve(root, relPath);
    if (fallbackFile.startsWith(root + sep) && existsSync(fallbackFile) && statSync(fallbackFile).isFile()) {
      await route.fulfill({
        status: 200,
        contentType: MIME[extname(relPath)] || 'text/plain; charset=utf-8',
        body: readFileSync(fallbackFile),
      });
      return;
    }
    await route.continue();
  });

  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${port}/audit/v2.5.0-verification.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(
    () => {
      const r = window.CSAudit25Runner && window.CSAudit25Runner.result && window.CSAudit25Runner.result();
      return r && r.baselineSuite && Array.isArray(r.checks) && r.checks.length > 0;
    },
    null,
    { timeout: 90000 },
  );

  const result = await page.evaluate(() => window.CSAudit25Runner.result());
  const lowCells = await page.locator('#au-scopes td.is-low').count();

  if (writeReceipt) {
    writeFileSync(receiptPath, JSON.stringify(result, null, 2) + '\n');
  }

  const EXPECTED_DIMS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'];
  const dimSummary = {};
  for (const dim of EXPECTED_DIMS) {
    const rows = result.checks.filter((c) => c.dim === dim);
    assert(rows.length > 0, `Missing benchmark dimension ${dim}`);
    const p231 = rows.filter((c) => c.v231?.pass).length;
    const p240 = rows.filter((c) => c.v240?.pass).length;
    const p250 = rows.filter((c) => c.v250?.pass).length;
    const s231 = +(10 * p231 / rows.length).toFixed(2);
    const s240 = +(10 * p240 / rows.length).toFixed(2);
    const s250 = +(10 * p250 / rows.length).toFixed(2);
    assert.equal(p250, rows.length, `Dimension ${dim} failed on current tree: ${p250}/${rows.length}`);
    assert(s250 >= s240, `Dimension ${dim} regressed vs v2.4.0 (${s250} < ${s240})`);
    assert(s240 >= s231, `Dimension ${dim} historical order violated (${s240} < ${s231})`);
    dimSummary[dim] = `${p250}/${rows.length} (10.0)`;
  }

  assert.equal(result.checks.length, 69, `Expected 69 checks across D1-D10, got ${result.checks.length}`);
  const failing = result.checks.filter((c) => !c.v250?.pass);
  assert.deepEqual(failing, [], `Failing checks on current tree: ${failing.map((c) => c.dim + ':' + c.title).join(', ')}`);
  const regressed = result.checks.filter((c) => c.state === 'regressed' || c.state === 'open');
  assert.deepEqual(regressed, [], `Open or regressed checks found: ${regressed.map((c) => c.title).join(', ')}`);

  const watches = (result.edges || []).filter((e) => e.level === 'watch');
  assert.deepEqual(watches, [], `Unexpected Watch items in edgeCases: ${watches.map((w) => w.title).join('; ')}`);

  assert.equal(lowCells, 0, `Expected 0 cells below 3.0:1 in the 32x6 non-text contrast matrix, found ${lowCells}`);
  assert.equal(result.raw?.v250?.p1?.scopes?.length, 32, 'Expected 32 Theme x Element x Variant scopes');

  assert(result.baselineSuite, 'Missing embedded v2.4.0 baselineSuite result');
  assert.equal(result.baselineSuite.total, 64, 'Expected 64 checks in embedded v2.4.0 baseline suite');
  assert.equal(result.baselineSuite.v250, 64, `Embedded v2.4.0 baseline suite regressed: ${result.baselineSuite.v250}/64`);
  assert(
    result.baselineSuite.v250 >= result.baselineSuite.v240 && result.baselineSuite.v240 >= result.baselineSuite.v231,
    'Embedded baseline suite violated monotonic non-regression',
  );

  assert(existsSync(receiptPath), 'Missing audit/v2.5.0-verification.json receipt');
  const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
  assert.equal(receipt.checks?.length, 69, 'audit/v2.5.0-verification.json check count stale (run with --write-receipt)');
  assert.equal(receipt.checks.filter((c) => c.v250?.pass).length, 69, 'audit/v2.5.0-verification.json has failing checks');
  assert.equal(receipt.baselineSuite?.v250, 64, 'audit/v2.5.0-verification.json baselineSuite stale');
  assert.equal((receipt.edges || []).filter((e) => e.level === 'watch').length, 0, 'audit/v2.5.0-verification.json has watch items');

  console.log(
    `PASS audit benchmark non-regression: 69/69 D1-D10 checks (10.0/10), 64/64 embedded baseline checks (10.0/10), 192/192 32-scope contrast cells >= 3:1, 0 watch items`,
    dimSummary,
  );
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((r) => server.close(r));
}
