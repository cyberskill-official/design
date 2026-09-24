#!/usr/bin/env node
/**
 * Phase 1: Stable component sources consume semantic tokens — no bare hex,
 * rgb()/hsl(), or --cs-raw- primitives in JSX/JS (data URIs allowed).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const HEX = /#(?:[0-9a-fA-F]{3,8})\b/;
const RGB = /\b(?:rgb|hsl)a?\(/i;
const RAW = /--cs-raw-/;

function assert(c, m) {
  if (!c) throw new Error(m);
}

const registry = JSON.parse(readFileSync(join(root, "docs/export-registry.json"), "utf8"));
const stables = registry.exports.filter((e) => e.maturity === "stable" && e.sourcePath);
const hits = [];
for (const row of stables) {
  const src = readFileSync(join(root, row.sourcePath), "utf8")
    .replace(/data:(?:image|text)\/[^"'`\s]+/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  if (HEX.test(src) || RGB.test(src) || RAW.test(src)) hits.push(row.name + " " + row.sourcePath);
}
assert(hits.length === 0, "Stable sources must not use raw colors or --cs-raw-: " + hits.join(", "));

const lint = readFileSync(join(root, "_audit/ci/lint-cyberskill.mjs"), "utf8");
assert(lint.includes("export-registry.json") && lint.includes("stableSources"), "lint-cyberskill walks Stable component sources");

console.log("PASS test-stable-semantic-tokens", { stables: stables.length });
