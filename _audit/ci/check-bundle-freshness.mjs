// Bundle-freshness gate — exits 0 iff the committed _ds_bundle.js was built from
// the component sources as they exist right now.
//
// The bundle's line-1 `/* @ds-bundle: {...} */` header records a sourceHashes map
// (first 12 hex chars of the sha256 of every bundled source file). This script
// recomputes those hashes for the library source set (components/** +
// tokens/tokens.js — the same discovery the build uses) and diffs them against
// the header. Any edited, added, or deleted source without a matching
// `npm run build:bundle` rebuild fails with a per-file diff.
//
// Standalone by design: NOT wired into run.html or any workflow yet (a later
// phase does that). Run manually: node _audit/ci/check-bundle-freshness.mjs
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  BUNDLE_PATH,
  REPO_ROOT,
  collectSources,
  parseBundleHeader,
} from "../../scripts/build-bundle.mjs";

const shortHash = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 12);

let header;
try {
  header = parseBundleHeader(readFileSync(BUNDLE_PATH, "utf8"));
} catch (e) {
  console.error("✗ " + String((e && e.message) || e));
  process.exit(1);
}

const recorded = header.sourceHashes || {};
const current = collectSources(REPO_ROOT);
const problems = [];

for (const path of current) {
  const actual = shortHash(readFileSync(join(REPO_ROOT, path)));
  const expected = recorded[path];
  if (expected === undefined) {
    problems.push(`✗ ${path} — new source (${actual}) not in the bundle header`);
  } else if (expected !== actual) {
    problems.push(`✗ ${path} — bundle built from ${expected}, source is now ${actual}`);
  }
}
for (const path of Object.keys(recorded)) {
  if (!current.includes(path)) {
    const gone = !existsSync(join(REPO_ROOT, path));
    problems.push(
      `✗ ${path} — in the bundle header but ${gone ? "deleted from" : "no longer part of"} the source set`
    );
  }
}

// FIND-025 — published bundle must not ship ui_kits / image-slot side effects.
const illegal = current.filter(
  (p) => !(p.startsWith("components/") || p === "tokens/tokens.js")
);
if (illegal.length) {
  console.error("BUNDLE SCOPE — sources outside components/ + tokens/tokens.js:");
  for (const p of illegal) console.error("  " + p);
  process.exit(1);
}
for (const banned of ["image-slot.js", "ui_kits/"]) {
  if (Object.keys(recorded).some((p) => p === banned || p.startsWith(banned))) {
    problems.push(`✗ ${banned} — must not appear in published bundle header (FIND-025)`);
  }
}

if (problems.length) {
  console.error(`BUNDLE STALE — ${problems.length} source file(s) drifted from _ds_bundle.js:`);
  for (const p of problems) console.error("  " + p);
  console.error("Rebuild with: npm run build:bundle");
  process.exit(1);
}

console.log(`✓ bundle fresh — ${current.length} sources match the _ds_bundle.js header hashes`);
