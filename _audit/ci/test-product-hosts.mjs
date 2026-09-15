#!/usr/bin/env node
/**
 * Browser-check that product kits load Stable tokens.css without Babel/raw JSX,
 * and that all eight product hosts hydrate from compiled @cyberskill/react.
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

const kits = spawnSync(process.execPath, ["ui_kits/build.mjs", "--check"], { cwd: root, encoding: "utf8" });
if (kits.status !== 0) {
  throw new Error("ui_kits build stale: " + (kits.stderr || kits.stdout));
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
if (!bundle.includes("reportAdoption") && !bundle.includes("adoption")) {
  throw new Error("product host bundle does not include adoption telemetry");
}

await ensurePlaywrightChromium();
const server = await serve();
const port = server.address().port;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.addInitScript(() => {
  window.CS_TELEMETRY = (event) => {
    window.__csAdoption = event;
  };
});

async function fail(msg) {
  await browser.close();
  server.close();
  throw new Error(msg);
}

await page.goto(`http://127.0.0.1:${port}/templates/delivery-kickoff/DeliveryKickoff.dc.html`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.CyberSkillDS && window.CyberSkillDS.Logo, { timeout: 15000 });
const deliveryPkg = await page.evaluate(() => !!(window.CyberSkillReact && window.CyberSkillDS && window.CyberSkillDS.Logo === window.CyberSkillReact.Logo));
if (!deliveryPkg) await fail("delivery-kickoff is not mounted from compiled @cyberskill/react");

const kitPages = [
  "/ui_kits/status-hub/index.html",
  "/ui_kits/website/index.html",
  "/ui_kits/website/chat.html",
];
for (const path of kitPages) {
  const src = readFileSync(join(root, path.replace(/^\//, "")), "utf8");
  if (/babel/i.test(src) || /text\/babel/.test(src)) {
    await fail(path + " still loads Babel or raw JSX");
  }
  await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: "domcontentloaded" });
  const hrefs = await page.$$eval('link[rel="stylesheet"]', (nodes) => nodes.map((n) => n.getAttribute("href") || ""));
  if (!hrefs.some((h) => h.includes("packages/tokens/dist/tokens.css"))) {
    await fail(path + " missing tokens.css link");
  }
  await page.waitForFunction(() => document.querySelector("#root")?.childElementCount > 0, { timeout: 15000 });
}

await page.goto(`http://127.0.0.1:${port}/ui_kits/website/chat.html`, { waitUntil: "domcontentloaded" });
const chatField = page.locator(".cs-prompt__field, textarea").first();
await chatField.waitFor({ timeout: 15000 });
await chatField.fill("a compiled wish");
if (!(await chatField.inputValue()).includes("wish")) {
  await fail("Lumi chat PromptInput is not live on compiled @cyberskill/react");
}

const hosts = [
  { id: "lumi", marker: "cs-lumi", pkg: "@cyberskill/react" },
  { id: "status-hub", marker: "cs-datagrid", pkg: "@cyberskill/react" },
  { id: "cyberos", marker: "cs-field", pkg: "@cyberskill/react" },
  { id: "design-system", marker: "cs-button", pkg: "@cyberskill/react" },
  { id: "cyberskill-world", marker: "cs-lumi", pkg: "@cyberskill/tokens" },
  { id: "client-delivery", marker: "cs-card", pkg: "@cyberskill/react" },
  { id: "board", marker: "cs-stat", pkg: "@cyberskill/react" },
  { id: "hr", marker: "cs-alert", pkg: "@cyberskill/react" },
];

for (const spec of hosts) {
  await page.goto(`http://127.0.0.1:${port}/apps/product-hosts/${spec.id}.html`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__productHost && window.__productHost.id, { timeout: 15000 });
  const info = await page.evaluate(() => ({ host: window.__productHost, adoption: window.__csAdoption }));
  if (info.host.id !== spec.id) await fail(spec.id + " hydrated wrong product");
  if (info.host.package !== spec.pkg) await fail(spec.id + " expected " + spec.pkg + ", got " + info.host.package);
  if (!info.host.telemetry) await fail(spec.id + " did not report adoption telemetry");
  if (!info.adoption || info.adoption.product !== spec.id) await fail(spec.id + " telemetry sink missed product id");
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
  if (spec.id === "design-system") {
    const btn = page.locator("button").first();
    await btn.click();
    if (!(await btn.innerText()).includes("Design System")) await fail("design-system Button is not live");
  }
  if (spec.id === "cyberskill-world") {
    const btn = page.locator("button").first();
    await btn.click();
    if (!(await btn.innerText()).includes("Start a project")) await fail("cyberskill-world Button is not live");
  }
  if (spec.id === "client-delivery") {
    const btn = page.locator("button").first();
    await btn.click();
    if (!(await btn.innerText()).includes("Kickoff")) await fail("client-delivery Button is not live");
  }
  if (spec.id === "board") {
    const text = await page.locator(".cs-stat").first().innerText();
    if (!text.includes("18")) await fail("board Stat is not live");
  }
  if (spec.id === "hr") {
    const text = await page.locator(".cs-alert").first().innerText();
    if (!/Policy|Employment/i.test(text)) await fail("hr Alert is not live");
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
console.log("PASS test-product-hosts", { hosts: hosts.length, kits: kitPages.length, hydrated: true, telemetry: true });
