#!/usr/bin/env node
/**
 * Make `npm test` / `test:unit` reproducible on a clean checkout.
 * If Playwright Chromium is missing, install it (and only Chromium by default).
 */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

export async function ensurePlaywrightChromium() {
  const { chromium } = await import("playwright");
  try {
    const browser = await chromium.launch({ headless: true });
    await browser.close();
    return { installed: false };
  } catch (err) {
    const msg = String(err && err.message ? err.message : err);
    if (!/Executable doesn't exist|browserType\.launch/i.test(msg) && !/chromium/i.test(msg)) {
      throw err;
    }
    console.log("Playwright Chromium missing — running: npx playwright install chromium");
    const r = spawnSync("npx", ["playwright", "install", "chromium"], {
      cwd: root,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    if (r.status !== 0) {
      throw new Error(
        "Failed to install Playwright Chromium. Run: npx playwright install --with-deps chromium",
      );
    }
    return { installed: true };
  }
}

const isMain = process.argv[1] && /ensure-playwright\.mjs$/.test(process.argv[1]);
if (isMain) {
  ensurePlaywrightChromium()
    .then((r) => {
      console.log("PASS ensure-playwright", r);
    })
    .catch((e) => {
      console.error(e.message || e);
      process.exit(1);
    });
}

void require;
