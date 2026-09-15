#!/usr/bin/env node
/**
 * Browser-check that product kits load Stable tokens.css and that product
 * hosts hydrate from the compiled @cyberskill/react client bundle.
 */
import { createServer } from "node:http";
import { readFileSync, statSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
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

const built = spawnSync(process.execPath, ["apps/product-hosts/build.mjs"], { cwd: root, encoding: "utf8" });
if (built.status !== 0) {
  throw new Error("product-hosts build failed: " + (built.stderr || built.stdout));
}
const bundle = readFileSync(join(root, "apps/product-hosts/dist/mount.js"), "utf8");
if (bundle.includes(".jsx") && /from ["'].*\.jsx["']/.test(bundle)) {
  throw new Error("product host bundle still imports raw JSX");
}
if (!bundle.includes("cs-") && !bundle.includes("data-product")) {
  throw new Error("product host bundle does not look like compiled @cyberskill/react");
}

await ensurePlaywrightChromium();
const server = await serve();
const port = server.address().port;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

async function fail(msg) {
  await browser.close();
  server.close();
  throw new Error(msg);
}

for (const path of ["/ui_kits/status-hub/index.html", "/ui_kits/website/index.html"]) {
  await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: "domcontentloaded" });
  const hrefs = await page.$$eval('link[rel="stylesheet"]', (nodes) => nodes.map((n) => n.getAttribute("href") || ""));
  if (!hrefs.some((h) => h.includes("packages/tokens/dist/tokens.css"))) {
    await fail(path + " missing tokens.css link");
  }
}

const hosts = [
  { id: "lumi", marker: "cs-lumi" },
  { id: "status-hub", marker: "cs-datagrid" },
  { id: "cyberos", marker: "cs-field" },
  { id: "design-system", marker: "cs-button" },
];

for (const spec of hosts) {
  await page.goto(`http://127.0.0.1:${port}/apps/product-hosts/${spec.id}.html`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__productHost && window.__productHost.id, { timeout: 15000 });
  const info = await page.evaluate(() => window.__productHost);
  if (info.id !== spec.id) await fail(spec.id + " hydrated wrong product");
  if (info.package !== "@cyberskill/react") await fail(spec.id + " expected @cyberskill/react, got " + info.package);
  const found = await page.locator("." + spec.marker).count();
  if (!found) await fail(spec.id + " missing ." + spec.marker + " after hydrate");

  if (spec.id === "lumi") {
    const field = page.locator(".cs-prompt__field, textarea").first();
    await field.fill("a wish");
    const value = await field.inputValue();
    if (!value.includes("wish")) await fail("lumi PromptInput is not live");
  }
  if (spec.id === "status-hub") {
    const sort = page.locator(".cs-datagrid__sort").first();
    if (await sort.count()) {
      await sort.click();
      await page.waitForFunction(() => document.querySelector("th[aria-sort]"), { timeout: 3000 });
    }
  }
  if (spec.id === "cyberos") {
    const input = page.locator("input").first();
    await input.fill("TASK-IMP-030");
    const value = await input.inputValue();
    if (!value.includes("TASK-IMP-030")) await fail("cyberos TextField is not live");
  }

  await page.evaluate(() => {
    document.documentElement.style.zoom = "4";
  });
  const box = await page.locator("main, [role=main], #root, body").first().boundingBox();
  if (!box || box.width < 1) await fail(spec.id + " hid landmark at 400% zoom");
  await page.emulateMedia({ media: "print" });
  const printBox = await page.locator("." + spec.marker).first().boundingBox();
  if (!printBox || printBox.width < 1) await fail(spec.id + " hid marker in print media");
  await page.emulateMedia({ media: "screen" });
  await page.evaluate(() => {
    document.documentElement.style.zoom = "";
  });
}

await browser.close();
server.close();
console.log("PASS test-product-hosts", { hosts: hosts.length, hydrated: true });
