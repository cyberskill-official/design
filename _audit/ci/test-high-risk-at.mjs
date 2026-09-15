#!/usr/bin/env node
/**
 * Keyboard/AT checks for the audit's high-risk widgets, plus Dialog open p95.
 */
import { createServer } from "node:http";
import { readFileSync, statSync, existsSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { ensurePlaywrightChromium } from "../../scripts/ensure-playwright.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function serve() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const rel = decodeURIComponent((req.url || "/").split("?")[0]).replace(/^\/+/, "") || "index.html";
      const file = join(root, rel);
      if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
        res.writeHead(404);
        res.end("missing");
        return;
      }
      res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
      res.end(readFileSync(file));
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

await ensurePlaywrightChromium();
const server = await serve();
const port = server.address().port;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${port}/_audit/high-risk-at.html`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__highRiskAt, { timeout: 45000 });
const verdict = await page.evaluate(() => window.__highRiskAt);
await browser.close();
server.close();

if (!verdict.pass) {
  console.error(verdict);
  throw new Error("high-risk AT failed: " + (verdict.results || []).filter((r) => !r.ok).map((r) => r.name).join(", "));
}
if (!(verdict.dialogOpenP95 < 100)) {
  throw new Error("Dialog open p95 " + verdict.dialogOpenP95 + "ms >= 100ms");
}
console.log("PASS test-high-risk-at", {
  checks: verdict.results.length,
  dialogOpenP95: Number(verdict.dialogOpenP95.toFixed(2)),
});
