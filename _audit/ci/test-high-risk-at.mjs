#!/usr/bin/env node
/**
 * Keyboard/AT checks for the audit's high-risk widgets, plus Dialog open p95
 * and Chrome accessibility-tree name/role/value (not VoiceOver speech).
 */
import { createServer } from "node:http";
import { readFileSync, statSync, existsSync, writeFileSync } from "node:fs";
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
await page.goto(`http://127.0.0.1:${port}/_audit/high-risk-at.html`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__highRiskAt, { timeout: 45000 });
const verdict = await page.evaluate(() => window.__highRiskAt);

if (!verdict.pass) {
  await browser.close();
  server.close();
  console.error(verdict);
  throw new Error("high-risk AT failed: " + (verdict.results || []).filter((r) => !r.ok).map((r) => r.name).join(", "));
}
if (!(verdict.dialogOpenP95 < 100)) {
  await browser.close();
  server.close();
  throw new Error("Dialog open p95 " + verdict.dialogOpenP95 + "ms >= 100ms");
}
if (!(verdict.buttonClickP95 < 100)) {
  await browser.close();
  server.close();
  throw new Error("Button click p95 " + verdict.buttonClickP95 + "ms >= 100ms");
}
if (!(verdict.textFieldP95 < 100)) {
  await browser.close();
  server.close();
  throw new Error("TextField p95 " + verdict.textFieldP95 + "ms >= 100ms");
}
if (verdict.package !== "CyberSkillReact") {
  await browser.close();
  server.close();
  throw new Error("high-risk AT must run against compiled @cyberskill/react");
}
const spoken = (verdict.spoken || []).map((row) => row.surface + ": " + row.phrase).join("\n");
for (const [surface, re] of [
  ["Dialog", /dialog title.*, *dialog/i],
  ["Combobox", /pick.*, *combobox/i],
  ["Sortable", /move down/i],
  ["Image", /dot/i],
]) {
  const row = (verdict.spoken || []).find((s) => s.surface === surface);
  if (!row || !re.test(row.phrase)) {
    await browser.close();
    server.close();
    throw new Error("spoken AT phrase missing for " + surface + " in " + spoken.slice(0, 400));
  }
}

const requiredAx = [
  "Dialog", "AlertDialog", "Menu", "MenuItem", "Combobox", "DataGrid",
  "Sortable", "Editor", "Carousel", "DatePicker", "DatePickerDialog",
  "TimePicker", "Image",
];
const axSurfaces = (verdict.ax || []).map((row) => row.surface);
for (const name of requiredAx) {
  if (!axSurfaces.includes(name)) {
    await browser.close();
    server.close();
    throw new Error("missing AX name/role/value for " + name);
  }
}

const ariaSnap = await page.locator("#ax-gallery").ariaSnapshot();
if (!/dialog/i.test(ariaSnap) || !/Dialog title|When|dot/i.test(ariaSnap)) {
  await browser.close();
  server.close();
  throw new Error("Chrome AX snapshot missing a named dialog");
}
if (!/combobox|textbox|text box/i.test(ariaSnap)) {
  await browser.close();
  server.close();
  throw new Error("Chrome AX snapshot missing combobox/textbox");
}

await page.evaluate(() => {
  document.documentElement.style.zoom = "4";
});
const gallery = await page.locator("#ax-gallery").boundingBox();
if (!gallery || gallery.width < 1 || gallery.height < 1) {
  await browser.close();
  server.close();
  throw new Error("400% zoom hid the AX gallery");
}

writeFileSync(
  join(root, "_audit/ci/high-risk-spoken.json"),
  JSON.stringify(
    {
      generatedBy: "test-high-risk-at",
      kind: "chrome-ax-speech-script",
      note: "Chrome accessibility-tree name/role/value phrases. Not NVDA, JAWS, VoiceOver, or TalkBack.",
      package: verdict.package,
      spoken: verdict.spoken,
      ax: verdict.ax,
    },
    null,
    2,
  ) + "\n",
);

await browser.close();
server.close();

console.log("PASS test-high-risk-at", {
  checks: verdict.results.length,
  dialogOpenP95: Number(verdict.dialogOpenP95.toFixed(2)),
  buttonClickP95: Number(verdict.buttonClickP95.toFixed(2)),
  textFieldP95: Number(verdict.textFieldP95.toFixed(2)),
  ax: verdict.ax.length,
  spoken: (verdict.spoken || []).length,
  ariaSnapshotChars: ariaSnap.length,
  package: verdict.package,
});
