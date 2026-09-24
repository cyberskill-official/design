#!/usr/bin/env node
/**
 * Keyboard/AT checks for the audit's high-risk widgets on compiled
 * @cyberskill/react. Chromium also records Chrome's computed AX tree
 * (Accessibility.getFullAXTree) — still not NVDA/JAWS/VoiceOver/TalkBack.
 * Extra browsers run when installed (or when --browsers= is passed).
 */
import { createServer } from "node:http";
import { readFileSync, statSync, existsSync, writeFileSync } from "node:fs";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";
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
const BROWSERS = { chromium, firefox, webkit };
const requiredAx = [
  "Dialog", "AlertDialog", "Menu", "MenuItem", "Combobox", "DataGrid",
  "Sortable", "Editor", "Carousel", "DatePicker", "DatePickerDialog",
  "TimePicker", "Image",
];

const browsersArg = process.argv.find((a) => a.startsWith("--browsers="));
const requested = browsersArg
  ? browsersArg.split("=")[1].split(",").map((s) => s.trim()).filter(Boolean)
  : ["chromium", "firefox", "webkit"];

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

async function tryLaunch(name) {
  const type = BROWSERS[name];
  if (!type) throw new Error("unknown browser " + name);
  try {
    return await type.launch({ headless: true });
  } catch (err) {
    const msg = String(err && err.message ? err.message : err);
    if (/Executable doesn't exist|browserType\.launch/i.test(msg)) return null;
    throw err;
  }
}

async function assertVerdict(page, browserName, port) {
  await page.goto(`http://127.0.0.1:${port}/_audit/high-risk-at.html`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__highRiskAt, { timeout: 45000 });
  const verdict = await page.evaluate(() => window.__highRiskAt);
  if (!verdict.pass) {
    throw new Error(browserName + " high-risk AT failed: " + (verdict.results || []).filter((r) => !r.ok).map((r) => r.name).join(", "));
  }
  if (!(verdict.dialogOpenP95 < 100)) throw new Error(browserName + " Dialog p95 " + verdict.dialogOpenP95);
  if (!(verdict.buttonClickP95 < 100)) throw new Error(browserName + " Button p95 " + verdict.buttonClickP95);
  if (!(verdict.textFieldP95 < 100)) throw new Error(browserName + " TextField p95 " + verdict.textFieldP95);
  if (verdict.package !== "CyberSkillReact") throw new Error(browserName + " not compiled @cyberskill/react");
  if (!verdict.highContrastText) throw new Error(browserName + " high-contrast pack did not resolve text token");
  const spoken = (verdict.spoken || []).map((row) => row.surface + ": " + row.phrase).join("\n");
  for (const [surface, re] of [
    ["Dialog", /dialog title.*, *dialog/i],
    ["Combobox", /pick.*, *combobox/i],
    ["Sortable", /move down/i],
    ["Image", /dot/i],
  ]) {
    const row = (verdict.spoken || []).find((s) => s.surface === surface);
    if (!row || !re.test(row.phrase)) {
      throw new Error(browserName + " spoken phrase missing for " + surface + " in " + spoken.slice(0, 400));
    }
  }
  const axSurfaces = (verdict.ax || []).map((row) => row.surface);
  for (const name of requiredAx) {
    if (!axSurfaces.includes(name)) throw new Error(browserName + " missing AX " + name);
  }
  const ariaSnap = await page.locator("#ax-gallery").ariaSnapshot();
  if (!/dialog/i.test(ariaSnap) || !/Dialog title|When|dot/i.test(ariaSnap)) {
    throw new Error(browserName + " AX snapshot missing a named dialog");
  }
  if (!/combobox|textbox|text box/i.test(ariaSnap)) {
    throw new Error(browserName + " AX snapshot missing combobox/textbox");
  }
  await page.setViewportSize({ width: 320, height: 640 });
  const narrow = await page.locator("#ax-gallery").boundingBox();
  if (!narrow || narrow.width < 1) throw new Error(browserName + " 320px hid the AX gallery");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overflow > 1) throw new Error(browserName + " 320px horizontal overflow " + overflow + "px");
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });
  const at200 = await page.locator("#ax-gallery").boundingBox();
  if (!at200 || at200.width < 1 || at200.height < 1) {
    throw new Error(browserName + " 200% zoom hid the AX gallery");
  }
  await page.evaluate(() => {
    document.documentElement.style.zoom = "4";
  });
  const gallery = await page.locator("#ax-gallery").boundingBox();
  if (!gallery || gallery.width < 1 || gallery.height < 1) {
    throw new Error(browserName + " 400% zoom hid the AX gallery");
  }
  await page.evaluate(() => {
    document.documentElement.style.zoom = "";
  });
  return { verdict, ariaSnap };
}

async function chromeAxTree(page) {
  const session = await page.context().newCDPSession(page);
  await session.send("Accessibility.enable");
  const tree = await session.send("Accessibility.getFullAXTree");
  const nodes = (tree.nodes || []).filter((n) => !n.ignored);
  const phrases = nodes
    .map((n) => {
      const name = (n.name && n.name.value) || "";
      const role = n.role && n.role.value ? n.role.value : "";
      const value = (n.value && n.value.value) || "";
      return [name, role, value].filter(Boolean).join(", ");
    })
    .filter((p) => p.length);
  const blob = phrases.join("\n");
  for (const re of [/dialog title/i, /pick/i, /move down/i, /gallery/i, /rich text|textbox/i]) {
    if (!re.test(blob)) {
      throw new Error("Chrome AX tree missing " + re + " in " + blob.slice(0, 500));
    }
  }
  return phrases.slice(0, 80);
}

await ensurePlaywrightChromium();
const server = await serve();
const port = server.address().port;
const ran = [];
const skipped = [];
let chromeSpoken = null;
let chromeVerdict = null;
let chromeAria = "";
let chromeTree = [];

try {
  for (const name of requested) {
    const browser = await tryLaunch(name);
    if (!browser) {
      skipped.push(name);
      continue;
    }
    const page = await browser.newPage();
    try {
      const { verdict, ariaSnap } = await assertVerdict(page, name, port);
      let axTree = [];
      if (name === "chromium") {
        axTree = await chromeAxTree(page);
        chromeSpoken = verdict.spoken;
        chromeVerdict = verdict;
        chromeAria = ariaSnap;
        chromeTree = axTree;
      }
      ran.push({
        browser: name,
        checks: verdict.results.length,
        dialogOpenP95: Number(verdict.dialogOpenP95.toFixed(2)),
        axTree: axTree.length,
      });
    } finally {
      await browser.close();
    }
  }

  if (!ran.some((r) => r.browser === "chromium")) {
    throw new Error("chromium high-risk AT is required");
  }

  writeFileSync(
    join(root, "_audit/ci/high-risk-spoken.json"),
    JSON.stringify(
      {
        generatedBy: "test-high-risk-at",
        kind: "chrome-ax-speech-script",
        note: "Chrome Accessibility.getFullAXTree plus DOM name/role/value. Not NVDA, JAWS, VoiceOver, or TalkBack.",
        package: chromeVerdict.package,
        browsersRan: ran.map((r) => r.browser),
        browsersSkipped: skipped,
        spoken: chromeSpoken,
        ax: chromeVerdict.ax,
        chromeAxTreePhrases: chromeTree,
        highContrastText: chromeVerdict.highContrastText,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  server.close();
}

console.log("PASS test-high-risk-at", {
  ran,
  skipped,
  ariaSnapshotChars: chromeAria.length,
  chromeAxTree: chromeTree.length,
  package: chromeVerdict.package,
});
