#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listPublicComponents } from "./storybook-inventory.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const registry = JSON.parse(readFileSync(join(root, "docs/export-registry.json"), "utf8"));
const modules = listPublicComponents();
const names = new Set(modules.flatMap((m) => m.all));
const MATURITY = new Set(["experimental", "beta", "stable", "deprecated"]);

function assert(c, m) {
  if (!c) throw new Error(m);
}

assert(Array.isArray(registry.exports) && registry.exports.length, "registry.exports");
const byName = new Map(registry.exports.map((e) => [e.name, e]));
const missing = [...names].filter((n) => !byName.has(n));
assert(missing.length === 0, "registry missing exports: " + missing.join(", "));

for (const row of registry.exports) {
  assert(row.owner, `${row.name}: owner`);
  assert(row.backup, `${row.name}: backup`);
  assert(MATURITY.has(row.maturity), `${row.name}: maturity`);
  assert(row.support, `${row.name}: support`);
  assert(row.package, `${row.name}: package`);
  assert("deprecation" in row, `${row.name}: deprecation field`);
}

assert(Array.isArray(registry.packages) && registry.packages.length >= 9, "package owner rows");
for (const pkgRow of registry.packages) {
  assert(pkgRow.owner && pkgRow.backup && pkgRow.support, pkgRow.name + " owner+backup");
}
const stables = registry.exports.filter((e) => e.maturity === "stable");
assert(stables.length > 0, "at least one stable export");
assert(stables.every((e) => e.owner && e.support && e.package), "stable rows complete");

console.log("PASS test-export-registry", {
  exports: registry.exports.length,
  stable: stables.length,
});
