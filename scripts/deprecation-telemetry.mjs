#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(join(root, "docs/export-registry.json"), "utf8"));
const deprecated = registry.exports.filter((e) => e.maturity === "deprecated" || e.deprecation);
console.log(JSON.stringify({
  generatedBy: "scripts/deprecation-telemetry.mjs",
  version: registry.version,
  deprecatedCount: deprecated.length,
  deprecated,
}, null, 2));
