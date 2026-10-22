import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { buildSync } from 'esbuild';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<link rel="stylesheet" href="/styles.css"></head><body><div id="fixture"></div>' +
  '<script src="/_vendor/react/react.production.min.js"></script>' +
  '<script src="/_vendor/react/react-dom.production.min.js"></script>' +
  '<script src="/_ds_bundle.js"></script></body></html>';

/** Ephemeral loopback server; no output files and no external resources. */
export async function withBrowserFixture(run, { development = false, contextOptions = {}, browserName = 'chromium', launchOptions = {}, reactRuntimeRoot = root } = {}) {
  const runtime = development ? buildSync({
    stdin: { contents: "import React from 'react'; import * as client from 'react-dom/client'; import { flushSync, createPortal } from 'react-dom'; window.React = React; window.ReactDOM = { ...client, flushSync, createPortal };", resolveDir: reactRuntimeRoot },
    bundle: true, write: false, platform: 'browser', format: 'iife',
    define: { 'process.env.NODE_ENV': '"development"' },
  }).outputFiles[0].contents : null;
  const fixtureHtml = development ? html.replace(
    '<script src="/_vendor/react/react.production.min.js"></script><script src="/_vendor/react/react-dom.production.min.js"></script>',
    '<script src="/react-development.js"></script>') : html;
  const server = createServer(async (req, res) => {
    try {
      const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (path === '/') { res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.end(fixtureHtml); return; }
      if (path === '/react-development.js' && runtime) { res.setHeader('Content-Type', 'text/javascript'); res.end(runtime); return; }
      const file = resolve(root, '.' + path);
      if (!file.startsWith(root.replace(/\/$/, '') + sep)) { res.writeHead(403); res.end(); return; }
      const type = { '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.html':'text/html', '.json':'application/json', '.woff2':'font/woff2', '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png' }[extname(file)] || 'application/octet-stream';
      res.setHeader('Content-Type', type);
      res.end(await readFile(file));
    } catch { res.writeHead(404); res.end(); }
  });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  let browser;
  try {
    const engine = {chromium, firefox, webkit}[browserName];
    if (!engine) throw new Error(`Unsupported browser fixture engine: ${browserName}`);
    const effectiveLaunchOptions = browserName === 'chromium' && process.platform === 'linux'
      ? { ...launchOptions, args: ['--disable-dev-shm-usage', ...(launchOptions.args || [])] }
      : launchOptions;
    for (let attempt = 0; attempt < 3; attempt++) {
      const errors = [];
      try {
        browser = await engine.launch(effectiveLaunchOptions);
        const page = await browser.newPage(contextOptions);
        page.on('pageerror', error => errors.push(String(error)));
        await page.goto(`http://127.0.0.1:${server.address().port}/`);
        await page.evaluate(() => {
          const name = Object.keys(window).find(k => /^CyberSkillDesignSystem_[a-f0-9]{6}$/.test(k));
          if (!name || window[name].__errors.length) throw new Error('Component bundle failed to load');
          window.CS = window[name];
          window.fixtureRoot = ReactDOM.createRoot(document.getElementById('fixture'));
          window.renderFixture = element => ReactDOM.flushSync(() => fixtureRoot.render(element));
        });
        try { await run(page); } catch (error) {
          if (errors.length) error.message += `\nUncaught browser errors: ${errors.join("\n")}`;
          throw error;
        }
        if (errors.length) throw new Error(`Uncaught browser errors: ${errors.join('\n')}`);
        break;
      } catch (error) {
        if (attempt < 2 && /crashed|has been closed|(?:Page|Target|Browser|Context) closed|Connection closed/i.test(String(error?.message || error))) {
          console.warn('CS_BROWSER_RETRY ' + JSON.stringify({
            browser: browserName, failedAttempt: attempt + 1, nextAttempt: attempt + 2,
            test: process.argv[1] || null, reason: String(error?.message || error),
          }));
          await browser?.close().catch(() => {});
          browser = undefined;
          continue;
        }
        throw error;
      }
    }
  } finally {
    await browser?.close().catch(() => {});
    await new Promise(resolve => server.close(resolve));
  }
}
