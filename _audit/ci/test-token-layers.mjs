#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const layers = JSON.parse(readFileSync(join(root, "tokens/layers.json"), "utf8"));

function assert(c, m) {
  if (!c) throw new Error(m);
}

assert(Array.isArray(layers.layers) && layers.layers.join(",") === "primitive,semantic,component,state", "layer order");
for (const key of ["knownPrimitiveFiles", "knownSemanticFiles", "knownComponentFiles"]) {
  assert(Array.isArray(layers[key]) && layers[key].length, key);
  for (const p of layers[key]) {
    assert(existsSync(join(root, p)), "missing " + p);
  }
}
assert(existsSync(join(root, "base/high-contrast.css")), "high-contrast pack");
const tokensPkg = JSON.parse(readFileSync(join(root, "packages/tokens/package.json"), "utf8"));
assert(tokensPkg.exports["./css"] === "./dist/tokens.css", "@cyberskill/tokens/css must be the layered runtime");
assert(tokensPkg.exports["./css/style-axis"] === "./dist/styles.css", "style-axis pack export");
assert(tokensPkg.exports["./css/high-contrast"] === "./dist/high-contrast.css", "high-contrast pack export");
assert(existsSync(join(root, "components/_theme/provider.js")), "ThemeProvider runtime");

const provider = readFileSync(join(root, "components/_theme/provider.js"), "utf8");
assert(provider.includes("getThemeInitScript"), "SSR no-flash script");
assert(provider.includes("data-theme"), "applies data-theme");
assert(provider.includes("data-cs-contrast"), "applies contrast Theme attribute");
assert(provider.includes("data-cs-density"), "applies density Theme attribute (IMP-027)");
assert(!/tokens\/density\.css/.test(provider), "must not import retired density CSS pack");

console.log("PASS test-token-layers", { files: layers.knownSemanticFiles.length });
