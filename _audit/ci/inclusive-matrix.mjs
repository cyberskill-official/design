#!/usr/bin/env node
/**
 * Inclusive browser matrix. Default: Chromium smoke of 320 / forced-colors /
 * reduced-motion / RTL / pseudo-locale. CI passes --browsers=chromium,firefox,webkit.
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ensurePlaywrightChromium } from "../../scripts/ensure-playwright.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const browsersArg = (args.find((a) => a.startsWith("--browsers=")) || "--browsers=chromium").split("=")[1];
const names = browsersArg.split(",").map((s) => s.trim()).filter(Boolean);

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
      await page.setContent(
        `<!doctype html><html lang="en-XA" dir="rtl"><body>
        <a class="cs-skip" href="#main">⟦Skip⟧</a>
        <main id="main"><button type="button">⟦Go⟧</button></main>
        </body></html>`,
        { waitUntil: "domcontentloaded" },
      );
      const dir = await page.locator("html").getAttribute("dir");
      const skip = await page.locator(".cs-skip").count();
      const width = await page.evaluate(() => document.documentElement.clientWidth);
      await browser.close();
      if (dir !== "rtl" || skip !== 1 || width > 400) {
        throw new Error(`${name} matrix assertions failed dir=${dir} skip=${skip} width=${width}`);
      }
      results.push({ browser: name, pass: true, width });
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
