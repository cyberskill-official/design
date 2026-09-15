#!/usr/bin/env node
/**
 * Lint gate: the CyberSkill ESLint plugin is loadable, and consumer-canary
 * plus codemod sources do not introduce raw color literals.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import plugin from "../../packages/eslint/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const HEX = /#(?:[0-9a-fA-F]{3,8})\b/;
const RGB = /\b(?:rgb|hsl)a?\(/i;

function assert(c, m) {
  if (!c) throw new Error(m);
}

assert(plugin.rules["no-raw-color"], "plugin exports no-raw-color");
assert(plugin.rules["no-deep-token"], "plugin exports no-deep-token");
assert(plugin.configs.recommended.rules["@cyberskill/no-raw-color"] === "error", "recommended config");

function walk(dir, pred, out = []) {
  if (!statSync(dir, { throwIfNoEntry: false })?.isDirectory()) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, pred, out);
    else if (pred(name)) out.push(full);
  }
  return out;
}

const registry = JSON.parse(readFileSync(join(root, "docs/export-registry.json"), "utf8"));
const stableSources = registry.exports
  .filter((e) => e.maturity === "stable" && e.sourcePath)
  .map((e) => join(root, e.sourcePath));
const targets = [
  ...walk(join(root, "apps/consumer-canary"), (n) => /\.(js|mjs|jsx)$/.test(n)),
  ...walk(join(root, "packages/codemods"), (n) => /\.(js|mjs)$/.test(n)),
  ...walk(join(root, "packages/primitives/src"), (n) => /\.js$/.test(n)),
  ...stableSources,
];

const hits = [];
for (const file of targets) {
  const text = readFileSync(file, "utf8").replace(/data:(?:image|text)\/[^"'`\s]+/g, "");
  if (HEX.test(text) || RGB.test(text)) hits.push(file.slice(root.length + 1));
}
assert(hits.length === 0, "raw color in lint targets: " + hits.join(", "));

console.log("PASS lint-cyberskill", { files: targets.length });
