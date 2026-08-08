#!/usr/bin/env node
/**
 * Promoted UX-audit probe suite entry (Phase 5).
 *
 * The 2026-08-08 audit used session scripts (`audit-probe.mjs`, `audit-drill.mjs`,
 * `audit-shots.mjs`) that are not committed. This module is the durable, repo-owned
 * replacement: it documents the coverage matrix and runs the portable proxies that
 * already live under `_audit/` + `_audit/ci/`.
 *
 * Usage:
 *   node _audit/ci/audit-probe-suite.mjs
 *   node _audit/ci/audit-probe-suite.mjs --list
 *
 * Full browser board (preferred for CI):
 *   node _audit/ci/run-gates.mjs http://127.0.0.1:8790/_audit/run.html
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

const PROXIES = [
  { id: "unit", cmd: ["npm", "run", "test:unit"], note: "13 Node unit gates incl. i18n + storybook freshness" },
  { id: "zoom-spacing", file: "_audit/zoom-text-spacing.html", global: "__zoomspacing", note: "200%/400% zoom proxy + WCAG 1.4.12 spacing" },
  { id: "light-contrast", file: "_audit/light-contrast.html", global: "__lightcontrast", note: "Light DOM contrast walk × templates" },
  { id: "overflow-320", file: "_audit/responsive-overflow-320.html", global: "__overflow320", note: "Whole-set 320 reflow" },
  { id: "language-overflow", file: "_audit/language-overflow.html", global: "__langoverflow", note: "VN overflow + EN leak lexicon" },
];

const listOnly = process.argv.includes("--list");
if (listOnly) {
  for (const p of PROXIES) {
    console.log(`- ${p.id}: ${p.note}${p.file ? ` (${p.file})` : ""}${p.doc ? ` (${p.doc})` : ""}`);
  }
  process.exit(0);
}

console.log("audit-probe-suite — running portable proxies (AT matrix is human-only)\n");

let failed = 0;
{
  const r = spawnSync("npm", ["run", "test:unit"], { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) failed++;
}

const base = process.env.AUDIT_BASE || "http://127.0.0.1:8790";
const runner = join(root, "_audit/ci/run-single-gate.mjs");
for (const p of PROXIES) {
  if (!p.file || !p.global) continue;
  if (!existsSync(join(root, p.file))) {
    console.error("MISSING", p.file);
    failed++;
    continue;
  }
  const url = `${base}/${p.file}`;
  console.log("\n→", p.id, url);
  const r = spawnSync(process.execPath, [runner, url, p.global, "180000"], {
    cwd: root,
    stdio: "inherit",
  });
  if (r.status !== 0) failed++;
}

console.log("\nManual AT: owner-attested (human-only; not automatable)");
if (failed) {
  console.error(`\nFAIL audit-probe-suite (${failed} step(s)). Is the static server up on ${base}?`);
  process.exit(1);
}
console.log("\nPASS audit-probe-suite { proxies: ok, atMatrix: human-only }");
