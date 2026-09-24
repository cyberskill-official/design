#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const budgets = JSON.parse(readFileSync(join(root, "docs/package-budgets.json"), "utf8"));

function assert(c, m) {
  if (!c) throw new Error(m);
}

function packStats(cwd) {
  const pack = spawnSync("npm", ["pack", "--dry-run", "--json"], {
    cwd,
    encoding: "utf8",
    shell: process.platform === "win32",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (pack.status !== 0) throw new Error((pack.stderr || pack.stdout || "pack failed").slice(0, 800));
  const parsed = JSON.parse(pack.stdout || "[]");
  const entry = Array.isArray(parsed) ? parsed[0] : parsed;
  return {
    unpacked: Number(entry.unpackedSize || 0),
    packed: Number(entry.size || 0),
    files: (entry.files || []).length,
  };
}

const trends = JSON.parse(readFileSync(join(root, "docs/package-budget-trends.json"), "utf8"));
assert(trends.schema === "package-budget-trends@1", "budget trends schema");
assert(Array.isArray(trends.series) && trends.series.length >= 1, "budget trends series");
const lastTrend = trends.series[trends.series.length - 1];
const version = readFileSync(join(root, "VERSION"), "utf8").trim();
assert(lastTrend.version === version, `trend version ${lastTrend.version} !== VERSION ${version}`);
assert(lastTrend.facade?.unpacked <= budgets.facade.unpackedMaxBytes, "trend facade unpacked under ceiling");
assert(lastTrend.facade?.packed <= budgets.facade.packedMaxBytes, "trend facade packed under ceiling");
assert(lastTrend.cssMin <= budgets.cssMinMaxBytes, "trend css under ceiling");
assert(lastTrend.reactEntry <= budgets.reactEntryMaxBytes, "trend react entry under ceiling");

const facade = packStats(root);
assert(facade.unpacked <= budgets.facade.unpackedMaxBytes, `facade unpacked ${facade.unpacked} > ${budgets.facade.unpackedMaxBytes}`);
assert(facade.packed <= budgets.facade.packedMaxBytes, `facade packed ${facade.packed} > ${budgets.facade.packedMaxBytes}`);

const css = readFileSync(join(root, "dist/styles.min.css"));
assert(css.byteLength <= budgets.cssMinMaxBytes, `styles.min.css ${css.byteLength} > ${budgets.cssMinMaxBytes}`);

const reactEntry = readFileSync(join(root, "_esm/react.mjs"));
assert(reactEntry.byteLength <= budgets.reactEntryMaxBytes, `react.mjs ${reactEntry.byteLength} > ${budgets.reactEntryMaxBytes}`);

for (const [name, spec] of Object.entries(budgets.workspaces || {})) {
  const dir = join(root, spec.dir);
  if (!existsSync(join(dir, "package.json"))) continue;
  const stats = packStats(dir);
  assert(stats.unpacked <= spec.unpackedMaxBytes, `${name} unpacked ${stats.unpacked} > ${spec.unpackedMaxBytes}`);
}

console.log("PASS test-package-budgets", {
  facade,
  css: css.byteLength,
  reactEntry: reactEntry.byteLength,
  trend: lastTrend.version,
});
