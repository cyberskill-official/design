import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, mkdtemp, cp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve, dirname, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { PIXEL_TARGETS, PIXEL_FRAME, PIXEL_INPUT_SCOPE, PIXEL_ABSENT_INPUTS, createPixelInputs, verifyPixelInputs, validatePixelReport, pixelResourcePath } from "../lib/pixel-report-contract.mjs";
const root = fileURLToPath(new URL("../../", import.meta.url));
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const local = {
  sha256,
  readBytes: path => readFile(resolve(root, path))
};
const inputs = await createPixelInputs(local);
const clone = value => structuredClone(value);
// Synthetic comparison rows exercise receipt handling only. Real CLI captures follow below.
const fixture = {
  schemaVersion: 1,
  kind: "compare",
  hard: true,
  advisory: false,
  updated: false,
  frame: PIXEL_FRAME,
  channelTolerance: 16,
  driftPctThreshold: 1,
  generatedAt: new Date().toISOString(),
  base: "http://127.0.0.1:8080",
  renderer: {
    name: "chromium",
    version: "synthetic-receipt-fixture",
    platform: process.platform,
    arch: process.arch
  },
  targets: PIXEL_TARGETS.map(target => target.slug),
  sourceInputs: inputs,
  results: PIXEL_TARGETS.map(target => ({
    ...target,
    requestedTheme: target.theme || "default",
    result: "captured",
    pct: 0,
    total: 909 * 540,
    differing: 0,
    drifted: false,
    sizeMismatch: false,
    captureSize: PIXEL_FRAME,
    baselineSize: PIXEL_FRAME
  })),
  captureFails: 0,
  inputFailures: [],
  drifted: [],
  maxDiff: 0
};
assert.equal(validatePixelReport(fixture).pass, true);
await verifyPixelInputs(inputs, local);
const invalid = [["null", () => null], ["empty", () => ({})], ["legacy", () => ({
  drifted: [],
  captureFails: 0
})], ["update", r => {
  r.updated = true;
}], ["update kind", r => {
  r.kind = "update";
}], ["advisory", r => {
  r.advisory = true;
}], ["soft", r => {
  r.hard = false;
}], ["frame", r => {
  r.frame = {
    w: 908,
    h: 540
  };
}], ["tolerance", r => {
  r.channelTolerance = 255;
}], ["threshold", r => {
  r.driftPctThreshold = 100;
}], ["date", r => {
  r.generatedAt = "";
}], ["origin", r => {
  r.base = "file:///";
}], ["origin credentials", r => {
  r.base = "https://name:secret@example.invalid";
}], ["renderer", r => {
  delete r.renderer;
}], ["renderer version", r => {
  r.renderer.version = "";
}], ["renderer platform", r => {
  r.renderer.platform = "unknown";
}], ["target omitted", r => {
  r.targets.pop();
}], ["target duplicated", r => {
  r.targets[1] = r.targets[0];
}], ["row omitted", r => {
  r.results.pop();
}], ["row duplicated", r => {
  r.results[1] = r.results[0];
}], ["row path", r => {
  r.results[0].path = "/different.html";
}], ["row theme", r => {
  r.results[5].requestedTheme = "light";
}], ["uncompared row", r => {
  delete r.results[0].result;
}], ["updated row", r => {
  r.results[0].updated = true;
}], ["missing total", r => {
  delete r.results[0].total;
}], ["bad total", r => {
  r.results[0].total = 0;
}], ["negative count", r => {
  r.results[0].differing = -1;
}], ["overflow count", r => {
  r.results[0].differing = r.results[0].total + 1;
}], ["fractional count", r => {
  r.results[0].differing = 0.5;
}], ["NaN", r => {
  r.results[0].pct = NaN;
}], ["percentage inconsistent", r => {
  r.results[0].pct = 1;
}], ["drift inconsistent", r => {
  r.results[0].drifted = true;
}], ["capture dimension", r => {
  r.results[0].captureSize = {
    w: 1,
    h: 1
  };
}], ["baseline dimension missing", r => {
  delete r.results[0].baselineSize;
}], ["size mismatch hidden", r => {
  r.results[0].baselineSize = {
    w: 1,
    h: 1
  };
}], ["failed capture hidden", r => {
  Object.assign(r.results[0], {
    result: "capture_failed",
    error: "fixture",
    pct: 100,
    drifted: true
  });
}], ["capture count", r => {
  r.captureFails = 1;
}], ["drift inventory", r => {
  r.drifted = ["auth"];
}], ["maximum", r => {
  r.maxDiff = 0.1;
}], ["input verdict omitted", r => {
  delete r.inputFailures;
}], ["identity omitted", r => {
  delete r.sourceInputs;
}], ["identity scope", r => {
  r.sourceInputs.scope = "unknown";
}], ["absence omitted", r => {
  delete r.sourceInputs.absentPaths;
}], ["absence scope", r => {
  r.sourceInputs.absentPaths = [];
}], ["absence duplicated", r => {
  r.sourceInputs.absentPaths.push(r.sourceInputs.absentPaths[0]);
}], ["baseline omitted", r => {
  delete r.sourceInputs.files["_audit/baselines/auth.png"];
}], ["target input omitted", r => {
  delete r.sourceInputs.files["templates/auth/Auth.dc.html"];
}], ["lockfile omitted", r => {
  delete r.sourceInputs.files["package-lock.json"];
}], ["unsafe path", r => {
  r.sourceInputs.files["../other"] = "a".repeat(64);
}], ["invalid digest", r => {
  r.sourceInputs.files["package.json"] = "unknown";
}]];
for (const [name, change] of invalid) {
  const receipt = clone(fixture),
    replacement = change(receipt);
  assert.throws(() => validatePixelReport(replacement === undefined ? receipt : replacement), /Pixel report:/, name);
}
// A schema-valid failure must retain a failing verdict.
const drift = clone(fixture);
Object.assign(drift.results[0], {
  differing: 909 * 540,
  pct: 100,
  drifted: true
});
drift.drifted = [drift.targets[0]];
drift.maxDiff = 100;
assert.equal(validatePixelReport(drift).pass, false);
const failed = clone(drift);
Object.assign(failed.results[0], {
  result: "capture_failed",
  error: "injected capture error"
});
failed.captureFails = 1;
assert.equal(validatePixelReport(failed).pass, false);
const inputFailure = clone(fixture);
inputFailure.inputFailures = ["working tree changed"];
assert.equal(validatePixelReport(inputFailure).pass, false);
// Independently derived membership and current bytes cannot be bypassed with a smaller manifest.
for (const path of ["styles.css", "package-lock.json", "_audit/baselines/auth.png", "templates/auth/Auth.dc.html"]) {
  await assert.rejects(verifyPixelInputs(inputs, {
    sha256,
    readBytes: async candidate => {
      const bytes = await local.readBytes(candidate);
      return candidate === path ? Buffer.concat([bytes, Buffer.from("altered")]) : bytes;
    }
  }), /source input changed/, path);
}
for (const change of [r => {
  delete r.files["styles.css"];
}, r => {
  r.files["unexpected.txt"] = "a".repeat(64);
}, r => {
  r.hash = "0".repeat(64);
}]) {
  const manifest = clone(inputs);
  change(manifest);
  await assert.rejects(verifyPixelInputs(manifest, local), /source inventory/);
}
await assert.rejects(verifyPixelInputs(inputs, {
  sha256,
  readBytes: async path => {
    if (path !== "scripts/public-site-policy.json") return local.readBytes(path);
    const policy = JSON.parse(await local.readBytes(path));
    policy.audiences.runtime.files.pop();
    return Buffer.from(JSON.stringify(policy));
  }
}), /source inventory membership changed/);
assert.equal(pixelResourcePath(inputs.files, "/templates/auth/Auth.dc"), "templates/auth/Auth.dc.html");
assert.equal(pixelResourcePath(inputs.files, "/ui_kits/website/"), "ui_kits/website/index.html");
assert.equal(pixelResourcePath(inputs.files, "/%2e%2e/secret"), null);
assert.equal(pixelResourcePath(inputs.files, "/unknown.js"), null);
await assert.rejects(verifyPixelInputs(inputs, {
  sha256,
  readBytes: path => PIXEL_ABSENT_INPUTS.includes(path) ? Promise.resolve(Buffer.from("{}")) : local.readBytes(path)
}), /unexpected image sidecar present/);
await assert.rejects(verifyPixelInputs(inputs, {
  sha256,
  readBytes: path => {
    if (PIXEL_ABSENT_INPUTS.includes(path)) throw Error("transport unavailable");
    return local.readBytes(path);
  }
}), /transport unavailable/);
console.log("PASS pixel receipt schema: " + invalid.length + " malformed cases; 3 valid failure states; 10 identity changes; redirect/path scope");
async function serve(directory, transform = () => null) {
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      const override = await transform(pathname);
      let path = pathname.endsWith("/") ? pathname + "index.html" : pathname;
      let file = resolve(directory, "." + path);
      if (!file.startsWith(directory.replace(/\/$/, "") + sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      let bytes;
      try {
        bytes = await readFile(file);
      } catch {
        file += ".html";
        bytes = await readFile(file);
      }
      const type = {
        ".html": "text/html",
        ".mjs": "text/javascript",
        ".js": "text/javascript",
        ".json": "application/json",
        ".css": "text/css"
      }[extname(file)] || "application/octet-stream";
      res.setHeader("Content-Type", type);
      res.setHeader("Cache-Control", "no-store");
      res.end(override ?? bytes);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });
  await new Promise((yes, no) => {
    server.once("error", no);
    server.listen(0, "127.0.0.1", yes);
  });
  return {
    origin: "http://127.0.0.1:" + server.address().port,
    close: () => new Promise(yes => server.close(yes))
  };
}
const live = await serve(root);
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  let report = fixture,
    alterStyles = false;
  await page.route("**/_audit/ci/pixel-diff-report.json", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(report)
  }));
  await page.route("**/styles.css", async route => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      body: (await response.body()).toString() + (alterStyles ? "\n/* stale fixture */" : "")
    });
  });
  async function gate(receipt, expected, label) {
    report = receipt;
    await page.goto(live.origin + "/_audit/pixel-ci.html");
    await page.waitForFunction(() => window.__pixelci, null, {
      timeout: 60000
    });
    const verdict = await page.evaluate(() => window.__pixelci);
    assert.equal(verdict.pass, expected, label + " " + JSON.stringify(verdict));
    assert.equal(verdict.hard, true);
    assert.equal(verdict.advisory, false);
    return verdict;
  }
  await gate({}, false, "empty");
  for (const [name, change] of invalid.filter(([name]) => ["legacy", "row omitted", "row duplicated", "threshold", "updated row", "baseline omitted"].includes(name))) {
    const receipt = clone(fixture),
      replacement = change(receipt);
    await gate(replacement === undefined ? receipt : replacement, false, name);
  }
  const positive = await gate(fixture, true, "complete synthetic receipt, actual current files");
  assert.equal(positive.compared, PIXEL_TARGETS.length);
  assert.equal(positive.sourceState, "matches");
  alterStyles = true;
  assert.equal((await gate(fixture, false, "stale actual served stylesheet")).sourceState, "not_current");
  alterStyles = false;
  const reduced = clone(fixture);
  delete reduced.sourceInputs.files["styles.css"];
  assert.equal((await gate(reduced, false, "omitted manifest member")).sourceState, "not_current");
  const malicious = clone(failed);
  malicious.results[0].error = '<img src=x onerror="window.pixelInjected=true">';
  await gate(malicious, false, "capture failure text");
  assert.equal(await page.evaluate(() => !!window.pixelInjected), false);
  console.log("PASS real Pixel CI page: 11 receipt cases, stale served bytes and omitted member rejected, safe error rendering");
} finally {
  await browser?.close();
  await live.close();
}

// Run the actual CLI against isolated static documents and genuine screenshot baselines.
// These are pipeline fixtures, not product visual acceptance. Product baselines are never written.
const scratch = await mkdtemp(resolve(tmpdir(), "cs-pixel-receipt-"));
let isolated;
try {
  async function save(path, bytes) {
    const file = resolve(scratch, path);
    await mkdir(dirname(file), {
      recursive: true
    });
    await writeFile(file, bytes);
  }
  for (const path of ["_audit/ci/pixel-diff.mjs", "_audit/ci/lib/pixel-theme.mjs", "_audit/lib/pixel-report-contract.mjs", "_audit/pixel-ci.html", "package.json", "package-lock.json"]) {
    await mkdir(dirname(resolve(scratch, path)), {
      recursive: true
    });
    await cp(resolve(root, path), resolve(scratch, path));
  }
  await symlink(resolve(root, "node_modules"), resolve(scratch, "node_modules"), "dir");
  const documents = [...new Set(PIXEL_TARGETS.map(t => t.path.slice(1) + (t.path.endsWith("/") ? "index.html" : "")))];
  const html = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0}section{height:100vh;background:white}section[data-theme=dark]{background:#111}</style></head><body><main data-sc-name="Fixture"><section data-theme=""></section></main><script>window.__dcRootName=()=>"Fixture";window.__dcSetProps=(_,p)=>document.querySelector("section").setAttribute("data-theme",p.theme);if(location.pathname.includes("/marketing-page/"))fetch(".image-slots.state.json").then(r=>r.ok?r.json():null).catch(()=>{})</script></body></html>';
  for (const path of documents) await save(path, html);
  await save("scripts/public-site-policy.json", JSON.stringify({
    schemaVersion: 1,
    audiences: {
      runtime: {
        files: documents
      },
      authoring: {
        files: ["package.json"]
      }
    }
  }));
  let foreign = false;
  isolated = await serve(scratch, path => foreign && path === "/package.json" ? Buffer.from('{"foreign":true}') : null);
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: {
      width: 909,
      height: 540
    },
    deviceScaleFactor: 1
  });
  for (const target of PIXEL_TARGETS) {
    await page.goto(isolated.origin + target.path);
    if (target.theme) await page.evaluate(theme => window.__dcSetProps("Fixture", {
      theme
    }), target.theme);
    await save("_audit/baselines/" + target.slug + ".png", await page.screenshot({
      type: "png"
    }));
  }
  await browser.close();
  browser = null;
  async function cli() {
    return new Promise((yes, no) => {
      const child = spawn(process.execPath, ["_audit/ci/pixel-diff.mjs", isolated.origin], {
        cwd: scratch,
        stdio: ["ignore", "pipe", "pipe"]
      });
      let output = "";
      child.stdout.on("data", b => {
        output += b;
      });
      child.stderr.on("data", b => {
        output += b;
      });
      child.once("error", no);
      child.once("close", code => yes({
        code,
        output
      }));
    });
  }
  const clean = await cli();
  assert.equal(clean.code, 0, clean.output);
  const actual = JSON.parse(await readFile(resolve(scratch, "_audit/ci/pixel-diff-report.json")));
  assert.equal(validatePixelReport(actual).pass, true);
  assert.equal(actual.renderer.version.includes("fixture"), false);
  assert.equal(actual.results.filter(row => row.result === "captured").length, PIXEL_TARGETS.length);
  assert.equal(actual.maxDiff, 0);
  assert.equal(actual.sourceInputs.scope, PIXEL_INPUT_SCOPE);
  // A different served checkout must fail before capture and remove the old passing receipt.
  foreign = true;
  const wrong = await cli();
  assert.equal(wrong.code, 1, wrong.output);
  assert.match(wrong.output, /source input changed: package.json/);
  await assert.rejects(readFile(resolve(scratch, "_audit/ci/pixel-diff-report.json")), {
    code: "ENOENT"
  });
  foreign = false;
  // A genuine changed screenshot must produce a complete failure receipt, never an empty success.
  await save(documents[0], html.replace("background:white", "background:#f00"));
  const changed = await cli();
  assert.equal(changed.code, 1, changed.output);
  const actualDrift = JSON.parse(await readFile(resolve(scratch, "_audit/ci/pixel-diff-report.json")));
  assert.equal(validatePixelReport(actualDrift).pass, false);
  assert.equal(actualDrift.results.length, PIXEL_TARGETS.length);
  assert.equal(actualDrift.captureFails, 0);
  assert.deepEqual(actualDrift.drifted, ["kitchen-sink"]);
  assert.equal(actualDrift.results[0].pct, 100);
  await save(documents[0], html.replace("</body>", '<img src="/missing-capture-resource.svg"></body>'));
  const unavailable = await cli();
  assert.equal(unavailable.code, 1, unavailable.output);
  const actualFailure = JSON.parse(await readFile(resolve(scratch, "_audit/ci/pixel-diff-report.json")));
  assert.equal(validatePixelReport(actualFailure).pass, false);
  assert.equal(actualFailure.results.length, PIXEL_TARGETS.length);
  assert.equal(actualFailure.captureFails, 1);
  assert.equal(actualFailure.results[0].result, "capture_failed");
  assert.match(actualFailure.results[0].error, /Capture resource HTTP 404/);
  console.log("PASS actual Pixel CLI isolated fixtures: " + PIXEL_TARGETS.length + " real clean captures; foreign source abort removes old receipt; genuine 100% screenshot drift and missing capture resource fail");
} finally {
  await browser?.close();
  await isolated?.close();
  await rm(scratch, {
    recursive: true,
    force: true
  });
}
