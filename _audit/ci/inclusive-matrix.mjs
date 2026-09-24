#!/usr/bin/env node
/**
 * Inclusive browser matrix. Default: Chromium smoke of 320 / 200% / 400% zoom /
 * mobile / forced-colors / reduced-motion / RTL / pseudo-locale.
 * CI passes --browsers=chromium,firefox,webkit.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ensurePlaywrightChromium } from "../../scripts/ensure-playwright.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const css = readFileSync(join(root, "dist/styles.min.css"), "utf8");

const args = process.argv.slice(2);
const browsersArg = (args.find((a) => a.startsWith("--browsers=")) || "--browsers=chromium").split("=")[1];
const names = browsersArg.split(",").map((s) => s.trim()).filter(Boolean);

const MARKUP = `<!doctype html><html lang="en-XA" dir="rtl" data-theme="dark" data-cs-contrast="high"><head><title>Inclusive matrix</title><style>${css}</style></head><body>
<a class="cs-skip" href="#main">⟦Skip⟧</a>
<main id="main"><button type="button" class="cs-button cs-button--primary cs-button--md"><span class="cs-button__label">⟦Go⟧</span></button></main>
</body></html>`;

async function assertPage(page, name) {
  const dir = await page.locator("html").getAttribute("dir");
  const skip = await page.locator(".cs-skip").count();
  const buttons = await page.locator(".cs-button").count();
  const width = await page.evaluate(() => document.documentElement.clientWidth);
  const painted = await page.evaluate(() => {
    const btn = document.querySelector(".cs-button");
    const cs = getComputedStyle(btn);
    return cs.fontFamily.includes("Be Vietnam") || cs.getPropertyValue("--cs-font-family-ui").includes("Be Vietnam");
  });
  if (dir !== "rtl" || skip !== 1 || buttons !== 1 || width > 400 || !painted) {
    throw new Error(`${name} matrix assertions failed dir=${dir} skip=${skip} buttons=${buttons} width=${width} painted=${painted}`);
  }
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  const zoomed200 = await page.evaluate(() => {
    const btn = document.querySelector("button");
    const r = btn.getBoundingClientRect();
    return { w: r.width, h: r.height };
  });
  if (!(zoomed200.w > 0 && zoomed200.h > 0)) {
    throw new Error(`${name} 200% zoom hid the control`);
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
      const caps = await page.evaluate(() => ({
        customProps: typeof CSS !== "undefined" && CSS.supports("(--x: 0)"),
        backdrop:
          typeof CSS !== "undefined" &&
          (CSS.supports("backdrop-filter: blur(1px)") || CSS.supports("-webkit-backdrop-filter: blur(1px)")),
      }));
      if (!caps.customProps) {
        throw new Error(`${name} missing CSS custom properties (required by support-matrix)`);
      }
      await page.emulateMedia({ forcedColors: "none" });
      await page.addScriptTag({ path: join(root, "_audit/vendor/axe.min.js") });
      const violations = await page.evaluate(async () => {
        const res = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } });
        return res.violations
          .filter((v) => v.impact === "serious" || v.impact === "critical")
          .map((v) => v.id + ":" + v.help);
      });
      if (violations.length) {
        throw new Error(`${name} axe serious/critical: ${violations.join("; ")}`);
      }
      await page.emulateMedia({ forcedColors: "active" });
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
      results.push({ browser: name, pass: true, width: 320, zoom: "200%/400%", mobile: 390 });
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
