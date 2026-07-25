/**
 * Subtree-copy consumer smoke — proves Stitch/Claude-style file copy works:
 * styles.css + base/ + tokens/ + fonts/ + _esm/ + _ds_bundle.js as an isolated
 * tree (no _audit/, no Storybook, no templates). Playwright loads a minimal
 * smoke page from the copy and asserts tokens + ESM mount.
 *
 * Plain Node unit test (wired into npm run test:unit). No board row — this is
 * the portable-runtime check the package-exports / consumer-smoke gates do not
 * cover (those load from the full repo root).
 */
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  writeFileSync,
  rmSync,
  existsSync,
  readdirSync,
} from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname } from 'node:path';
import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

function assert(c, m) {
  if (!c) throw new Error(m || 'assert failed');
}

const PORTABLE = [
  'styles.css',
  'base',
  'tokens',
  'fonts',
  '_esm',
  '_ds_bundle.js',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

const smokeHtml = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="./styles.css">
</head><body>
<div id="root"></div>
<script type="module">
const out = { steps: [], pass: true };
function step(name, ok, detail) {
  out.steps.push((ok ? "✓ " : "✗ ") + name + (detail ? " — " + detail : ""));
  if (!ok) out.pass = false;
}
try {
  const cs = getComputedStyle(document.documentElement);
  const umber = cs.getPropertyValue("--cs-color-brand-umber").trim();
  step("styles.css + tokens resolve", umber.toLowerCase() === "#45210e", "umber=" + umber);
  const ff = cs.getPropertyValue("--cs-font-family-ui").trim();
  step("font token present", /Be Vietnam Pro/i.test(ff), "ui=" + ff);
  const { Button, default: CS } = await import("./_esm/cs.mjs");
  step("ESM import + namespace", !!(CS && Button), CS ? Object.keys(CS).length + " exports" : "MISSING");
  const rootEl = document.getElementById("root");
  const { createElement: h } = window.React;
  window.ReactDOM.createRoot(rootEl).render(h(Button, { variant: "primary" }, "Subtree"));
  await new Promise((r) => setTimeout(r, 400));
  const btn = rootEl.querySelector(".cs-button");
  const bg = btn ? getComputedStyle(btn).backgroundColor : "";
  step("Button mounts with brand token", !!btn && /69, ?33, ?14/.test(bg), bg || "no .cs-button");
} catch (e) {
  step("subtree smoke threw", false, String(e).slice(0, 200));
}
window.__subtree = out;
</script>
</body></html>
`;

const tmp = mkdtempSync(join(root, '.tmp-subtree-'));
try {
  for (const rel of PORTABLE) {
    const src = join(root, rel);
    assert(existsSync(src), 'missing portable path: ' + rel);
    cpSync(src, join(tmp, rel), { recursive: true });
  }
  // Fonts: at least one woff2 per self-hosted family must land in the copy, display face included.
  const fonts = readdirSync(join(tmp, 'fonts'));
  assert(fonts.some((f) => /bevietnampro.*\.woff2$/i.test(f)), 'Be Vietnam Pro woff2 missing in subtree');
  assert(fonts.some((f) => /jetbrainsmono.*\.woff2$/i.test(f)), 'JetBrains Mono woff2 missing in subtree');
  assert(fonts.some((f) => /spacegrotesk.*\.woff2$/i.test(f)), 'Space Grotesk woff2 missing in subtree');
  writeFileSync(join(tmp, 'smoke.html'), smokeHtml);

  const server = createServer((req, res) => {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p === '/') p = '/smoke.html';
    const file = join(tmp, p.replace(/^\//, ''));
    if (!file.startsWith(tmp) || !existsSync(file) || !statSync(file).isFile()) {
      res.writeHead(404);
      res.end('404');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(readFileSync(file));
  });

  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('pageerror', e.message));
  await page.goto(`http://127.0.0.1:${port}/smoke.html`, { waitUntil: 'networkidle', timeout: 60000 });
  const result = await page.waitForFunction(() => window.__subtree, null, { timeout: 60000 })
    .then((h) => h.jsonValue());
  await browser.close();
  server.close();

  assert(result?.pass, 'subtree consume failed:\n' + (result?.steps || []).join('\n'));
  console.log('PASS test-subtree-consume', {
    portable: PORTABLE,
    fonts: fonts.length,
    steps: result.steps,
  });
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
