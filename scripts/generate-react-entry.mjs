#!/usr/bin/env node
/**
 * Generate bundler-native React package entries from `_ds_bundle.js` header:
 *   • `_esm/react.mjs`  — re-exports every exposed component from source JSX/JS
 *                         (React is a peerDependency / external — no CDN, no bundle)
 *   • `_esm/react.d.ts` — TypeScript surface mirroring those named exports
 *
 * Regenerate whenever the bundle's exposed export set changes (same trigger as
 * `_esm/cs.mjs`). The package-exports + unit-test gates assert parity.
 *
 * Usage: node scripts/generate-react-entry.mjs [--check]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { BUNDLE_PATH, parseBundleHeader, REPO_ROOT } from "./build-bundle.mjs";

const OUT_MJS = join(REPO_ROOT, "_esm/react.mjs");
const OUT_DTS = join(REPO_ROOT, "_esm/react.d.ts");

/** Runtime-only exports that lack a matching `.d.ts` named export today. */
const DECLARE_ONLY = new Set(["CS_ICONS", "CS_LOGO_VIEWBOX", "CS_LOGO_MARK_INNER"]);

function groupBySource(components) {
  const by = new Map();
  for (const c of components) {
    if (!by.has(c.sourcePath)) by.set(c.sourcePath, []);
    by.get(c.sourcePath).push(c.name);
  }
  return by;
}

function buildMjs(components) {
  const lines = [
    "// CyberSkill Design System — bundler-native React entry (GENERATED).",
    "// Re-exports every public component from source. React / react-dom are",
    "// peerDependencies (external) — do not use this entry without a bundler",
    "// that can transpile JSX (Next transpilePackages, Vite, etc.).",
    "// Browser / no-build consumers: import from `@cyberskill/design/legacy`",
    "// (`_esm/cs.mjs`) instead. Styles are NOT injected — link styles.css.",
    "// Regenerate: node scripts/generate-react-entry.mjs",
    "",
  ];
  const by = groupBySource(components);
  // Stable order: source path byte-sort, names within file as in header order.
  const paths = [...by.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  for (const sourcePath of paths) {
    const names = by.get(sourcePath);
    const rel = "../" + sourcePath;
    lines.push(`export { ${names.join(", ")} } from ${JSON.stringify(rel)};`);
  }
  lines.push("");
  return lines.join("\n");
}

function buildDts(components) {
  const lines = [
    "// CyberSkill Design System — bundler-native React types (GENERATED).",
    "// Mirrors `_esm/react.mjs`. Regenerate: node scripts/generate-react-entry.mjs",
    "",
  ];
  const by = groupBySource(components);
  const paths = [...by.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  for (const sourcePath of paths) {
    const names = by.get(sourcePath);
    const typed = names.filter((n) => !DECLARE_ONLY.has(n));
    const declared = names.filter((n) => DECLARE_ONLY.has(n));
    const dtsMod = sourcePath.replace(/\.(jsx|js)$/, "");
    if (typed.length) {
      lines.push(`export { ${typed.join(", ")} } from ${JSON.stringify("../" + dtsMod)};`);
      // Re-export Props / related types when the module declares them — TS 5.0+
      // (`export type *`); safe even when a file has no type exports.
      lines.push(`export type * from ${JSON.stringify("../" + dtsMod)};`);
    }
    for (const n of declared) {
      if (n === "CS_ICONS") {
        lines.push(`export declare const CS_ICONS: Readonly<Record<string, string>>;`);
      } else if (n === "CS_LOGO_VIEWBOX" || n === "CS_LOGO_MARK_INNER") {
        lines.push(`export declare const ${n}: string;`);
      }
    }
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const check = process.argv.includes("--check");
  const header = parseBundleHeader(readFileSync(BUNDLE_PATH, "utf8"));
  const mjs = buildMjs(header.components);
  const dts = buildDts(header.components);

  if (check) {
    const curMjs = readFileSync(OUT_MJS, "utf8");
    const curDts = readFileSync(OUT_DTS, "utf8");
    if (curMjs !== mjs || curDts !== dts) {
      console.error(
        "FAIL generate-react-entry --check: _esm/react.mjs / react.d.ts drift. Run: node scripts/generate-react-entry.mjs"
      );
      process.exit(1);
    }
    console.log("OK generate-react-entry --check", {
      exports: header.components.length,
      files: groupBySource(header.components).size,
    });
    return;
  }

  writeFileSync(OUT_MJS, mjs);
  writeFileSync(OUT_DTS, dts);
  console.log("Wrote", {
    mjs: OUT_MJS.replace(REPO_ROOT + "/", ""),
    dts: OUT_DTS.replace(REPO_ROOT + "/", ""),
    exports: header.components.length,
  });
}

main();
