#!/usr/bin/env node
/**
 * Two non-React consumer pilots: custom-element upgrade, keyboard, no console
 * errors, and upgrade-time budget.
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
};
const PILOTS = [
  { path: "apps/wc-pilot-checkout/index.html", name: "checkout", action: "submit" },
  { path: "apps/wc-pilot-settings/index.html", name: "settings", action: "click" },
];
const UPGRADE_BUDGET_MS = 250;

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

try {
  for (const pilot of PILOTS) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto(`http://127.0.0.1:${port}/${pilot.path}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => window.__wcPilot && window.__wcPilot.defined, { timeout: 10000 });
    const verdict = await page.evaluate(() => window.__wcPilot);
    if (verdict.name !== pilot.name) throw new Error(pilot.path + " unexpected name " + verdict.name);
    if (!(verdict.upgradeMs < UPGRADE_BUDGET_MS)) {
      throw new Error(pilot.name + " upgrade " + verdict.upgradeMs + "ms >= " + UPGRADE_BUDGET_MS);
    }
    const focused = await page.locator("cs-button").evaluate((el) => {
      const btn = el.shadowRoot && el.shadowRoot.querySelector("button");
      if (!btn) return false;
      btn.focus();
      return el.shadowRoot.activeElement === btn;
    });
    if (!focused) throw new Error(pilot.name + " shadow button not focusable");
    if (pilot.action === "submit") {
      await page.locator("cs-text-field").evaluate((el) => {
        const input = el.shadowRoot && el.shadowRoot.querySelector("input");
        if (input) input.value = "a@b.co";
      });
      await page.locator("form").evaluate((form) => form.requestSubmit());
      await page.waitForFunction(() => document.getElementById("status")?.textContent === "queued");
    } else {
      await page.locator("#save").click();
      await page.waitForFunction(() => document.getElementById("status")?.textContent === "saved");
    }
    if (errors.length) throw new Error(pilot.name + " console: " + errors.join(" | "));
    await page.close();
    console.log("PASS wc-pilot", { name: pilot.name, upgradeMs: Number(verdict.upgradeMs.toFixed(2)) });
  }
} finally {
  await browser.close();
  server.close();
}

console.log("PASS test-wc-pilots", { pilots: PILOTS.length, upgradeBudgetMs: UPGRADE_BUDGET_MS });
