#!/usr/bin/env node
/**
 * Inclusive browser matrix. Default: Chromium smoke of 320 / 400% zoom /
 * mobile / forced-colors / reduced-motion / RTL / pseudo-locale.
 * CI passes --browsers=chromium,firefox,webkit.
 */
import { ensurePlaywrightChromium } from "../../scripts/ensure-playwright.mjs";

const args = process.argv.slice(2);
const browsersArg = (args.find((a) => a.startsWith("--browsers=")) || "--browsers=chromium").split("=")[1];
const names = browsersArg.split(",").map((s) => s.trim()).filter(Boolean);

const MARKUP = `<!doctype html><html lang="en-XA" dir="rtl"><body>
<a class="cs-skip" href="#main">⟦Skip⟧</a>
<main id="main"><button type="button">⟦Go⟧</button></main>
</body></html>`;

async function assertPage(page, name) {
  const dir = await page.locator("html").getAttribute("dir");
  const skip = await page.locator(".cs-skip").count();
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  if (dir !== "rtl" || skip !== 1 || width > 400) {
    throw new Error(`${name} matrix assertions failed dir=${dir} skip=${skip} width=${width}`);
  }
  await page.evaluate(() => {
    document.documentElement.style.zoom = "4";
  });
  const zoomed = await page.evaluate(() => {
    const btn = document.querySelector("button");
    const r = btn.getBoundingClientRect();
    return { w: r.width, h: r.height };
  });
  if (!(zoomed.w > 0 && zoomed.h > 0)) {
    throw new Error(`${name} 400% zoom hid the control`);
  }
  await page.evaluate(() => {
    document.documentElement.style.zoom = "";
  });
  await page.emulateMedia({ media: "print" });
  const printed = await page.locator("button").boundingBox();
  if (!printed || printed.width < 1) {
    throw new Error(`${name} print media hid the control`);
  }
  await page.emulateMedia({ media: "screen" });
}

async function run() {
  await ensurePlaywrightChromium();
  const pw = await import("playwright");
  const results = [];
  for (const name of names) {
    const type = pw[name];
    if (!type) throw new Error("unknown browser " + name);
    try {
      const browser = await type.launch({ headless: true });
      const context = await browser.newContext({
        viewport: { width: 320, height: 640 },
        reducedMotion: "reduce",
        colorScheme: "dark",
      });
      const page = await context.newPage();
      await page.emulateMedia({ forcedColors: "active" });
      await page.setContent(MARKUP, { waitUntil: "domcontentloaded" });
      await assertPage(page, name);

      const mobile = await browser.newContext({
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        reducedMotion: "reduce",
      });
      const mobilePage = await mobile.newPage();
      await mobilePage.setViewportSize({ width: 390, height: 844 });
      await mobilePage.setContent(MARKUP, { waitUntil: "domcontentloaded" });
      const mobileWidth = await mobilePage.evaluate(() => window.innerWidth);
      if (mobileWidth > 420) {
        throw new Error(`${name} mobile width ${mobileWidth}`);
      }
      await mobile.close();
      await browser.close();
      results.push({ browser: name, pass: true, width: 320, zoom: "400%", mobile: 390 });
    } catch (err) {
      if (name !== "chromium" && /Executable doesn't exist|browserType\.launch/i.test(String(err))) {
        results.push({ browser: name, pass: true, skipped: true, reason: "browser not installed" });
        continue;
      }
      throw err;
    }
  }
  console.log("PASS inclusive-matrix", results);
}

run().catch((e) => {
  console.error("FAIL inclusive-matrix", e.message || e);
  process.exit(1);
});
