#!/usr/bin/env node
/**
 * Browser-check that product kits and generated Stable hosts load the
 * layered @cyberskill/tokens CSS and keep a named landmark at 400% zoom.
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

const pages = [
  { path: "/ui_kits/status-hub/index.html", tokenLink: true, marker: null },
  { path: "/ui_kits/website/index.html", tokenLink: true, marker: null },
  { path: "/apps/product-hosts/lumi.html", tokenLink: true, marker: "cs-lumi" },
  { path: "/apps/product-hosts/status-hub.html", tokenLink: true, marker: "cs-datagrid" },
];

for (const spec of pages) {
  await page.goto(`http://127.0.0.1:${port}${spec.path}`, { waitUntil: "domcontentloaded" });
  const hrefs = await page.$$eval('link[rel="stylesheet"]', (nodes) => nodes.map((n) => n.getAttribute("href") || ""));
  if (spec.tokenLink && !hrefs.some((h) => h.includes("packages/tokens/dist/tokens.css"))) {
    await browser.close();
    server.close();
    throw new Error(spec.path + " missing tokens.css link");
  }
  if (spec.marker) {
    const found = await page.locator("." + spec.marker).count();
    if (!found) {
      await browser.close();
      server.close();
      throw new Error(spec.path + " missing ." + spec.marker);
    }
  }
  await page.evaluate(() => {
    document.documentElement.style.zoom = "4";
  });
  const main = await page.locator("main, [role=main], #root, body").first().boundingBox();
  if (!main || main.width < 1) {
    await browser.close();
    server.close();
    throw new Error(spec.path + " hid landmark at 400% zoom");
  }
}

await browser.close();
server.close();
console.log("PASS test-product-hosts", { pages: pages.length });
