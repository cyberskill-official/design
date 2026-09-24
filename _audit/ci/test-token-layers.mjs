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
for (const key of ["knownPrimitiveFiles", "knownSemanticFiles", "knownComponentFiles", "knownStateFiles"]) {
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
assert(tokensPkg.exports["./css/scope"] === "./dist/scope.css", "scoped-root export");
const tokensCss = readFileSync(join(root, "packages/tokens/dist/tokens.css"), "utf8");
assert(tokensCss.includes("@layer primitive, semantic, component, state;"), "tokens.css declares cascade layers");
assert(tokensCss.includes('@import "./typography.css" layer(primitive);'), "primitive layer import");
assert(tokensCss.includes('@import "./colors.css" layer(semantic);'), "semantic layer import");
assert(tokensCss.includes('@import "./component-tokens.css" layer(component);'), "component layer import");
assert(tokensCss.includes('@import "./styles.css" layer(state);'), "state layer import");
assert(existsSync(join(root, "packages/tokens/dist/scope.css")), "scope.css published");
const rating = readFileSync(join(root, "components/forms/Rating.jsx"), "utf8");
assert(rating.includes("nextRovingIndex"), "Rating consumes the collection/roving primitive");
const combo = readFileSync(join(root, "components/forms/Combobox.jsx"), "utf8");
assert(combo.includes("reduceListbox"), "Combobox consumes the listbox state machine");
const carousel = readFileSync(join(root, "components/data/Carousel.jsx"), "utf8");
assert(carousel.includes("wrapIndex"), "Carousel consumes wrapIndex");
const prim = readFileSync(join(root, "packages/primitives/index.js"), "utf8");
assert(prim.includes("nextRovingIndex") && prim.includes("reduceListbox"), "primitives export collection helpers");
const themesPkg = JSON.parse(readFileSync(join(root, "packages/themes/package.json"), "utf8"));
assert(themesPkg.exports["./high-contrast"] === "./dist/high-contrast.css", "themes high-contrast pack export");
assert(themesPkg.exports["./brand-packs"] === "./dist/brand-packs.json", "themes brand-packs export");
assert(existsSync(join(root, "packages/themes/dist/brand-packs.json")), "themes brand-packs file");
assert(existsSync(join(root, "packages/themes/dist/apply-brand-pack.js")), "applyBrandPack runtime");
assert(existsSync(join(root, "components/_theme/provider.js")), "ThemeProvider runtime");

const provider = readFileSync(join(root, "components/_theme/provider.js"), "utf8");
assert(provider.includes("getThemeInitScript"), "SSR no-flash script");
assert(provider.includes("data-theme"), "applies data-theme");
assert(provider.includes("data-cs-contrast"), "applies contrast Theme attribute");
assert(provider.includes("data-cs-density"), "applies density Theme attribute (IMP-027)");
assert(provider.includes("data-cs-element"), "ThemeProvider can apply elemental brand packs");
assert(!/tokens\/density\.css/.test(provider), "must not import retired density CSS pack");

console.log("PASS test-token-layers", { files: layers.knownSemanticFiles.length });
