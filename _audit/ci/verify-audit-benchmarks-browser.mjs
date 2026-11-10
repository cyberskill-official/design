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

  const EXPECTED_DIMS = [
    'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8',
    'D9', 'D10', 'D11', 'D12', 'D13', 'D14', 'D15', 'D16',
  ];
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

  assert.equal(result.checks.length, 105, `Expected 105 checks across D1-D16, got ${result.checks.length}`);
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
  assert.equal(receipt.checks?.length, 105, 'audit/v2.5.0-verification.json check count stale (run with --write-receipt)');
  assert.equal(receipt.checks.filter((c) => c.v250?.pass).length, 105, 'audit/v2.5.0-verification.json has failing checks');
  assert.equal(receipt.baselineSuite?.v250, 64, 'audit/v2.5.0-verification.json baselineSuite stale');
  assert.equal((receipt.edges || []).filter((e) => e.level === 'watch').length, 0, 'audit/v2.5.0-verification.json has watch items');

  // Verify the 3 Generation-2 Complex Product Stress-Test Screens (`audit/gen2-stress-test.html`)
  await page.goto(`http://127.0.0.1:${port}/audit/gen2-stress-test.html`, { waitUntil: 'load' });
  const gen2 = await page.evaluate(() => {
    const num = (x) => {
      const s = String(x).trim();
      return s.endsWith('%') ? parseFloat(s) / 100 : parseFloat(s);
    };
    const oklabToRgb = (L, a, b) => {
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.291485548 * b;
      const l = l_ * l_ * l_;
      const m = m_ * m_ * m_;
      const s = s_ * s_ * s_;
      const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
      const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
      const bb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
      const enc = (x) => {
        const c = Math.max(0, Math.min(1, x));
        return (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055) * 255;
      };
      return [enc(r), enc(g), enc(bb)];
    };
    const parseRgb = (str) => {
      const s = String(str || '').trim();
      let m;
      if ((m = s.match(/^rgba?\(([^)]+)\)$/i))) {
        const p = m[1].split(/[\s,/]+/).filter(Boolean);
        return [num(p[0]), num(p[1]), num(p[2])];
      }
      if ((m = s.match(/^color\(srgb\s+([^)]+)\)$/i))) {
        const p = m[1].split(/[\s/]+/).filter(Boolean);
        return [num(p[0]) * 255, num(p[1]) * 255, num(p[2]) * 255];
      }
      if ((m = s.match(/^oklab\(([^)]+)\)$/i))) {
        const p = m[1].split(/[\s/]+/).filter(Boolean);
        return oklabToRgb(num(p[0]), parseFloat(p[1]), parseFloat(p[2]));
      }
      return [0, 0, 0];
    };
    const relLum = ([r, g, b]) => {
      const f = (c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const ratio = (c1, c2) => {
      const l1 = relLum(parseRgb(c1));
      const l2 = relLum(parseRgb(c2));
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    };

    const s1 = document.getElementById('gen2-screen-1');
    const s2 = document.getElementById('gen2-screen-2');
    const s3 = document.getElementById('gen2-screen-3');
    const statVal = s1.querySelector('.cs-stat__value');
    const statStyle = getComputedStyle(statVal);
    const statLhRatio = parseFloat(statStyle.lineHeight) / parseFloat(statStyle.fontSize);

    const nestedLight = document.getElementById('gen2-nested-light-receipt');
    const s1BgLum = relLum(parseRgb(getComputedStyle(s1).backgroundColor));
    const nestedLightBgLum = relLum(parseRgb(getComputedStyle(nestedLight).backgroundColor));

    const selectedAgent = document.getElementById('gen2-selected-agent');
    const selStyle = getComputedStyle(selectedAgent);
    const selectedContrast = ratio(selStyle.color, selStyle.backgroundColor);

    const userBubble = document.getElementById('gen2-umber-user-bubble');
    const bubbleStyle = getComputedStyle(userBubble);

    const nestedHud = document.getElementById('gen2-nested-hud');
    const s3BgLum = relLum(parseRgb(getComputedStyle(s3).backgroundColor));
    const nestedHudBgLum = relLum(parseRgb(getComputedStyle(nestedHud).backgroundColor));

    const mobileOverflow = s3.scrollWidth > s3.clientWidth;
    const clearBtnRect = s3.querySelector('.cs-search__clear').getBoundingClientRect();
    const dockRects = [...s3.querySelectorAll('.cs-dock__item')].map((el) => el.getBoundingClientRect());

    const invalidControls = [
      document.getElementById('gen2-treeselect'),
      document.getElementById('gen2-cascader'),
      document.getElementById('gen2-datepicker'),
      document.getElementById('gen2-mobile-invalid-input'),
    ].map((el) => {
      const probe = document.createElement('span');
      probe.style.color = 'var(--cs-color-semantic-danger)';
      el.parentElement.appendChild(probe);
      const expected = getComputedStyle(probe).color;
      probe.remove();
      return {
        id: el.id,
        actual: getComputedStyle(el).borderTopColor,
        expected,
      };
    });

    return {
      imgCount: document.querySelectorAll('img').length,
      svgLogoCount: document.querySelectorAll('svg[viewBox="0 0 64 64"]').length,
      statLhRatio: +statLhRatio.toFixed(2),
      s1BgLum: +s1BgLum.toFixed(4),
      nestedLightBgLum: +nestedLightBgLum.toFixed(4),
      selectedContrast: +selectedContrast.toFixed(2),
      bubbleBorderWidth: parseFloat(bubbleStyle.borderTopWidth),
      s3BgLum: +s3BgLum.toFixed(4),
      nestedHudBgLum: +nestedHudBgLum.toFixed(4),
      mobileOverflow,
      clearBtnMinDim: Math.min(clearBtnRect.width, clearBtnRect.height),
      dockMinHeight: Math.min(...dockRects.map((r) => r.height)),
      invalidControls,
    };
  });

  assert.equal(gen2.imgCount, 0, 'Gen-2 screens must use inline <svg> logos, never external <img>');
  assert(gen2.svgLogoCount >= 2, 'Expected >= 2 inline <svg viewBox="0 0 64 64"> logos in Gen-2 screens');
  assert(gen2.statLhRatio >= 1.2, `Expected Vietnamese .cs-stat__value line-height ratio >= 1.20, got ${gen2.statLhRatio}`);
  assert(gen2.s1BgLum < 0.05 && gen2.nestedLightBgLum > 0.85, `Expected nested light receipt inside dark Screen 1 (${gen2.s1BgLum} -> ${gen2.nestedLightBgLum})`);
  assert(gen2.selectedContrast >= 7.0, `Expected dark-mode .cs-item.is-selected contrast >= 7.0:1, got ${gen2.selectedContrast}:1`);
  assert(gen2.bubbleBorderWidth >= 1, 'Expected >= 1px border separation on dark-mode #45210E user bubble');
  assert(gen2.s3BgLum > 0.85 && gen2.nestedHudBgLum < 0.05, `Expected nested dark HUD inside light Screen 3 (${gen2.s3BgLum} -> ${gen2.nestedHudBgLum})`);
  assert.equal(gen2.mobileOverflow, false, 'Expected 0 horizontal overflow in 390px mobile Screen 3');
  assert(gen2.clearBtnMinDim >= 44, `Expected SearchField clear button >= 44x44px, got ${gen2.clearBtnMinDim}px`);
  assert(gen2.dockMinHeight >= 48, `Expected mobile .cs-dock__item height >= 48px, got ${gen2.dockMinHeight}px`);
  for (const ctl of gen2.invalidControls) {
    assert.equal(
      ctl.actual,
      ctl.expected,
      `Expected semantic danger border on invalid Gen-2 control #${ctl.id} (${ctl.actual} vs ${ctl.expected})`,
    );
  }

  console.log(
    `PASS audit benchmark non-regression: 105/105 D1-D16 checks (10.0/10), 64/64 embedded baseline checks (10.0/10), 192/192 32-scope contrast cells >= 3:1, 3/3 Gen-2 complex stress-test screens verified, 0 watch items`,
    dimSummary,
  );
} finally {
  if (browser) await browser.close();
  if (server) await new Promise((r) => server.close(r));
}
