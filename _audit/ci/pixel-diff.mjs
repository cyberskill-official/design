#!/usr/bin/env node
/**
 * Pixel CI — Playwright screenshots vs `_audit/baselines/<slug>.png`, % pixel diff.
 *
 * Hard gate: visual drift above DRIFT_PCT (or size mismatch / capture failure)
 * exits non-zero. Missing baselines / Playwright also fail. Use `--update` after
 * intentional redesigns **on Linux Chromium** (CI is ubuntu-latest), then commit
 * the refreshed PNGs. macOS captures will drift in CI — see `_audit/baselines/README.md`.
 *
 * Usage:
 *   node _audit/ci/pixel-diff.mjs [baseUrl]
 *   node _audit/ci/pixel-diff.mjs --update [baseUrl]   # rewrite baselines from live captures
 *
 * Frame: 909×540 @ deviceScaleFactor 1 (matches visual-diff review frame).
 * Report: `_audit/ci/pixel-diff-report.json` (gitignored).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateSync } from 'node:zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const baselinesDir = resolve(root, '_audit/baselines');
const reportPath = resolve(__dirname, 'pixel-diff-report.json');

const FRAME = { w: 909, h: 540 };
/** Channel delta above this counts a pixel as different (anti-alias / subpixel tolerance). */
const CHANNEL_TOLERANCE = 16;
/** % of differing pixels above this lands the slug in `drifted[]` and fails the run. */
const DRIFT_PCT = 1.0;

const TARGETS = [
  { slug: 'kitchen-sink', path: '/templates/kitchen-sink.html' },
  { slug: 'auth', path: '/templates/auth/Auth.dc.html' },
  { slug: 'app-shell', path: '/templates/app-shell/AppShell.dc.html' },
  { slug: 'settings', path: '/templates/settings/Settings.dc.html' },
  { slug: 'dashboard', path: '/templates/dashboard/Dashboard.dc.html' },
  { slug: 'dashboard-dark', path: '/templates/dashboard/Dashboard.dc.html', theme: 'dark' },
  { slug: 'delivery-kickoff', path: '/templates/delivery-kickoff/DeliveryKickoff.dc.html' },
  { slug: 'bod-report', path: '/templates/bod-report/BodReport.dc.html' },
  { slug: 'slide-deck', path: '/templates/slide-deck/SlideDeck.dc.html' },
  { slug: 'marketing-page', path: '/templates/marketing-page/MarketingPage.dc.html' },
  { slug: 'email', path: '/templates/email/Email.dc.html' },
  { slug: 'vn-labor-contract', path: '/templates/vn-labor-contract/VnLaborContract.dc.html' },
  { slug: 'tech-incident-report', path: '/templates/tech-incident-report/TechIncidentReport.dc.html' },
  { slug: 'status-hub', path: '/ui_kits/status-hub/' },
  { slug: 'website', path: '/ui_kits/website/' },
];

const args = process.argv.slice(2).filter((a) => a !== '--');
const update = args.includes('--update');
const base = args.find((a) => !a.startsWith('--')) || 'http://127.0.0.1:8080';

function readChunk(buf, offset) {
  const len = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  const data = buf.subarray(offset + 8, offset + 8 + len);
  return { len, type, data, next: offset + 12 + len };
}

/** Decode 8-bit greyscale / RGB / RGBA PNG → { width, height, rgba }. */
function decodePng(buf) {
  if (!buf || buf.length < 8 || buf[0] !== 0x89 || buf[1] !== 0x50) {
    const kind = buf && buf[0] === 0xff && buf[1] === 0xd8 ? 'JPEG' : 'unknown';
    throw new Error('not a PNG (' + kind + ') — regenerate with --update');
  }
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 8;
  let colorType = 6;
  const idats = [];
  while (offset < buf.length) {
    const chunk = readChunk(buf, offset);
    offset = chunk.next;
    if (chunk.type === 'IHDR') {
      width = chunk.data.readUInt32BE(0);
      height = chunk.data.readUInt32BE(4);
      bitDepth = chunk.data[8];
      colorType = chunk.data[9];
    } else if (chunk.type === 'IDAT') {
      idats.push(chunk.data);
    } else if (chunk.type === 'IEND') {
      break;
    }
  }
  if (!width || !height) throw new Error('PNG missing IHDR');
  if (bitDepth !== 8) throw new Error('unsupported PNG bitDepth ' + bitDepth);
  const compressed = Buffer.concat(idats);
  const raw = inflateSync(compressed);
  const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : colorType === 0 ? 1 : 0;
  if (!bpp) throw new Error('unsupported PNG colorType ' + colorType);
  const stride = width * bpp;
  const rgba = Buffer.alloc(width * height * 4);
  let src = 0;
  const prev = Buffer.alloc(stride);
  const row = Buffer.alloc(stride);
  for (let y = 0; y < height; y++) {
    const filter = raw[src++];
    raw.copy(row, 0, src, src + stride);
    src += stride;
    for (let i = 0; i < stride; i++) {
      const x = row[i];
      const a = i >= bpp ? row[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      let v = x;
      if (filter === 1) v = (x + a) & 255;
      else if (filter === 2) v = (x + b) & 255;
      else if (filter === 3) v = (x + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        v = (x + pr) & 255;
      } else if (filter !== 0) {
        throw new Error('unsupported PNG filter ' + filter);
      }
      row[i] = v;
    }
    row.copy(prev);
    for (let x = 0; x < width; x++) {
      const di = (y * width + x) * 4;
      if (bpp === 4) {
        rgba[di] = row[x * 4];
        rgba[di + 1] = row[x * 4 + 1];
        rgba[di + 2] = row[x * 4 + 2];
        rgba[di + 3] = row[x * 4 + 3];
      } else if (bpp === 3) {
        rgba[di] = row[x * 3];
        rgba[di + 1] = row[x * 3 + 1];
        rgba[di + 2] = row[x * 3 + 2];
        rgba[di + 3] = 255;
      } else {
        const g = row[x];
        rgba[di] = g;
        rgba[di + 1] = g;
        rgba[di + 2] = g;
        rgba[di + 3] = 255;
      }
    }
  }
  return { width, height, rgba };
}

function diffImages(a, b) {
  if (a.width !== b.width || a.height !== b.height) {
    return {
      width: a.width,
      height: a.height,
      total: a.width * a.height,
      differing: a.width * a.height,
      pct: 100,
      sizeMismatch: true,
      baselineSize: { w: b.width, h: b.height },
      captureSize: { w: a.width, h: a.height },
    };
  }
  const total = a.width * a.height;
  let differing = 0;
  for (let i = 0; i < total; i++) {
    const o = i * 4;
    const dr = Math.abs(a.rgba[o] - b.rgba[o]);
    const dg = Math.abs(a.rgba[o + 1] - b.rgba[o + 1]);
    const db = Math.abs(a.rgba[o + 2] - b.rgba[o + 2]);
    const da = Math.abs(a.rgba[o + 3] - b.rgba[o + 3]);
    if (dr > CHANNEL_TOLERANCE || dg > CHANNEL_TOLERANCE || db > CHANNEL_TOLERANCE || da > CHANNEL_TOLERANCE) {
      differing++;
    }
  }
  const pct = total ? (differing / total) * 100 : 0;
  return { width: a.width, height: a.height, total, differing, pct, sizeMismatch: false };
}

function baselinePath(slug) {
  return join(baselinesDir, slug + '.png');
}

async function applyTheme(page, theme) {
  if (!theme) return;
  try {
    await page.waitForFunction(
      () => typeof window.__dcSetProps === 'function' && typeof window.__dcRootName === 'function',
      null,
      { timeout: 15000 }
    );
    await page.evaluate((t) => {
      const root = window.__dcRootName();
      if (root) window.__dcSetProps(root, { theme: t });
    }, theme);
    await page.waitForTimeout(600);
  } catch (e) {
    console.warn('pixel-diff: theme apply soft-fail for', theme, String(e.message || e));
  }
}

async function capture(page, target) {
  await page.setViewportSize({ width: FRAME.w, height: FRAME.h });
  await page.goto(base.replace(/\/$/, '') + target.path, { waitUntil: 'networkidle', timeout: 90000 });
  await page.addStyleTag({
    content:
      '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}',
  });
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(900);
  await applyTheme(page, target.theme);
  const shot = await page.screenshot({ fullPage: false, type: 'png', animations: 'disabled' });
  if (!shot || shot.length < 100 || shot[0] !== 0x89) {
    throw new Error('bad screenshot for ' + target.slug);
  }
  return Buffer.from(shot);
}

async function main() {
  mkdirSync(baselinesDir, { recursive: true });

  if (!update) {
    const missing = TARGETS.filter((t) => !existsSync(baselinePath(t.slug))).map((t) => t.slug);
    if (missing.length) {
      console.error('pixel-diff: missing baselines:', missing.join(', '));
      console.error('Regenerate with: node _audit/ci/pixel-diff.mjs --update ' + base);
      process.exit(2);
    }
  }

  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    console.error(
      'pixel-diff: playwright not installed.\n' +
        'Install with: npm ci && npx playwright install chromium\n' +
        'Then: node _audit/ci/pixel-diff.mjs ' + base
    );
    process.exit(1);
  }

  const { chromium } = playwright;
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: FRAME.w, height: FRAME.h },
    deviceScaleFactor: 1,
  });

  const results = [];
  let captureFails = 0;

  for (const t of TARGETS) {
    try {
      const shot = await capture(page, t);
      if (update) {
        writeFileSync(baselinePath(t.slug), shot);
        console.log('pixel-diff: wrote baseline', t.slug + '.png', shot.length, 'bytes');
        results.push({ slug: t.slug, updated: true, bytes: shot.length, pct: 0, drifted: false });
        continue;
      }
      const baselineBuf = readFileSync(baselinePath(t.slug));
      const live = decodePng(shot);
      const baseImg = decodePng(baselineBuf);
      const d = diffImages(live, baseImg);
      const drifted = d.pct > DRIFT_PCT || d.sizeMismatch;
      results.push({
        slug: t.slug,
        pct: +d.pct.toFixed(4),
        differing: d.differing,
        total: d.total,
        drifted,
        sizeMismatch: !!d.sizeMismatch,
        captureSize: d.captureSize || { w: live.width, h: live.height },
        baselineSize: d.baselineSize || { w: baseImg.width, h: baseImg.height },
      });
      const mark = drifted ? 'DRIFT' : 'ok';
      console.log(
        'pixel-diff:',
        mark,
        t.slug,
        d.pct.toFixed(3) + '%',
        '(' + d.differing + '/' + d.total + ' px)'
      );
    } catch (e) {
      captureFails++;
      console.error('pixel-diff: FAIL', t.slug, String(e.message || e));
      results.push({ slug: t.slug, error: String(e.message || e), drifted: true, pct: 100 });
    }
  }

  await browser.close();

  const drifted = results.filter((r) => r.drifted && !r.updated).map((r) => r.slug);
  const pcts = results.filter((r) => typeof r.pct === 'number' && !r.updated).map((r) => r.pct);
  const maxDiff = pcts.length ? Math.max(...pcts) : 0;
  const report = {
    advisory: false,
    hard: true,
    updated: update,
    frame: FRAME,
    channelTolerance: CHANNEL_TOLERANCE,
    driftPctThreshold: DRIFT_PCT,
    generatedAt: new Date().toISOString(),
    base,
    targets: TARGETS.map((t) => t.slug),
    results,
    drifted,
    maxDiff: +maxDiff.toFixed(4),
    captureFails,
    note: 'Visual drift above driftPctThreshold fails this script (hard gate). Refresh with --update after intentional redesigns.',
  };
  writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  console.log(
    'pixel-diff: report',
    reportPath,
    '· maxDiff=' + report.maxDiff + '% · drifted=[' + drifted.join(', ') + ']'
  );

  if (update) process.exit(captureFails ? 1 : 0);
  if (captureFails || drifted.length) process.exit(1);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
