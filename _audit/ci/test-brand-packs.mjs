#!/usr/bin/env node
/**
 * Phase 4 brand packs: applyBrandPack must resolve all 15 elemental packs
 * and change --cs-accent under @cyberskill/tokens/css. Not a second style-axis.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { ensurePlaywrightChromium } from "../../scripts/ensure-playwright.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

function assert(c, m) {
  if (!c) throw new Error(m);
}

const brandJson = JSON.parse(readFileSync(join(root, "packages/themes/dist/brand-packs.json"), "utf8"));
assert(Array.isArray(brandJson.packs) && brandJson.packs.length === 15, "15 packs in registry");

const api = await import(pathToFileURL(join(root, "packages/themes/dist/apply-brand-pack.js")).href);
assert(api.listBrandPacks().length === 15, "listBrandPacks");
for (const pack of brandJson.packs) {
  const byName = api.resolveBrandPack(pack.name);
  assert(byName && byName.element === pack.element, "resolve " + pack.name);
  const bySlot = api.resolveBrandPack(pack.element + ":" + pack.intensity);
  assert(bySlot && bySlot.name === pack.name, "resolve slot " + pack.element + ":" + pack.intensity);
}

const fake = { attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, removeAttribute(k) { delete this.attrs[k]; } };
assert(api.applyBrandPack("plasma", fake)?.element === "hoa", "apply plasma");
assert(fake.attrs["data-cs-element"] === "hoa" && fake.attrs["data-cs-variant"] === "plasma", "plasma attrs");
assert(api.applyBrandPack("ember", fake)?.intensity === "middle", "apply ember middle");
assert(fake.attrs["data-cs-element"] === "hoa" && fake.attrs["data-cs-variant"] == null, "middle drops variant");

const elementsCss = readFileSync(join(root, "tokens/elements.css"), "utf8");
assert(/\[data-cs-element="hoa"\]\[data-cs-variant="plasma"\]/.test(elementsCss), "plasma CSS");
assert(/\[data-cs-element="kim"\]\[data-cs-variant="steel"\]/.test(elementsCss), "steel CSS");

await ensurePlaywrightChromium();
const server = await new Promise((resolve) => {
  const s = createServer((req, res) => {
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
  s.listen(0, "127.0.0.1", () => resolve(s));
});
const port = server.address().port;
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/_audit/ci/brand-packs.html`, { waitUntil: "load" });
  await page.waitForFunction(() => {
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')];
    return links.length > 0 && links.every((l) => l.sheet);
  });
  const accents = await page.evaluate(() => {
    const host = document.getElementById("host");
    const read = () => getComputedStyle(host).getPropertyValue("--cs-accent").trim();
    host.setAttribute("data-cs-element", "hoa");
    host.setAttribute("data-cs-variant", "plasma");
    const plasma = read();
    host.setAttribute("data-cs-element", "kim");
    host.setAttribute("data-cs-variant", "steel");
    const steel = read();
    host.removeAttribute("data-cs-variant");
    host.setAttribute("data-cs-element", "hoa");
    const ember = read();
    return { plasma, steel, ember };
  });
  assert(accents.plasma && accents.steel && accents.ember, "accent tokens resolved");
  assert(accents.plasma !== accents.steel, "plasma and steel accents must differ");
  assert(accents.plasma !== accents.ember, "plasma and ember accents must differ");
} finally {
  await browser.close();
  server.close();
}

console.log("PASS test-brand-packs", { packs: brandJson.packs.length });
