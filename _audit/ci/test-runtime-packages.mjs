#!/usr/bin/env node
import * as esbuild from "esbuild";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m);
}

const build = spawnSync(process.execPath, ["scripts/build-workspace-packages.mjs"], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 8 * 1024 * 1024,
});
if (build.status !== 0) {
  console.error(build.stderr || build.stdout);
  throw new Error("build-workspace-packages failed");
}

const slim = [
  ["packages/react", "@cyberskill/react"],
  ["packages/tokens", "@cyberskill/tokens"],
  ["packages/themes", "@cyberskill/themes"],
  ["packages/icons", "@cyberskill/icons"],
  ["packages/primitives", "@cyberskill/primitives"],
];

for (const [dir, name] of slim) {
  const pkg = JSON.parse(readFileSync(join(root, dir, "package.json"), "utf8"));
  assert(pkg.name === name, name);
  assert(!pkg.exports?.["./components/*"], name + " must not expose deep JSX");
  assert(!JSON.stringify(pkg.files).includes("templates"), name + " files[] must omit templates");
  const pack = spawnSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: join(root, dir),
    encoding: "utf8",
    shell: process.platform === "win32",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (pack.status !== 0) throw new Error(name + " pack failed: " + (pack.stderr || pack.stdout).slice(0, 400));
  const entry = JSON.parse(pack.stdout || "[]")[0] || {};
  const files = (entry.files || []).map((f) => (typeof f === "string" ? f : f.path));
  const bad = files.filter((f) =>
    /(?:^|\/)(templates\/|_audit\/|_vendor\/|.*\.jsx$)/.test(String(f)),
  );
  assert(bad.length === 0, name + " tarball leaked " + bad.slice(0, 8).join(", "));
}

assert(existsSync(join(root, "packages/react/dist/components/button/Button.js")), "compiled Button");
const compiled = readFileSync(join(root, "packages/react/dist/components/button/Button.js"), "utf8");
assert(!compiled.includes("export function Button"), "Button compiled away from source function form or is forwardRef");
assert(!/from ["'].*\.jsx["']/.test(readFileSync(join(root, "packages/react/index.js"), "utf8")), "react index has no jsx imports");
assert(!/from ["'].*\.jsx["']/.test(readFileSync(join(root, "packages/react/dist/components/data/Image.js"), "utf8")), "compiled Image has no jsx imports");
const reactBarrel = readFileSync(join(root, "packages/react/index.js"), "utf8");
assert((reactBarrel.match(/\bThemeProvider\b/g) || []).length === 1, "ThemeProvider exported once");
const reactMod = await import(pathToFileURL(join(root, "packages/react/index.js")).href);
assert(typeof reactMod.Button === "function" || typeof reactMod.Button === "object", "react barrel imports");
const tokensCss = readFileSync(join(root, "packages/tokens/dist/tokens.css"), "utf8");
assert(tokensCss.includes("@layer primitive, semantic, component, state;"), "tokens.css cascade layers");
assert(tokensCss.includes('@import "./colors.css" layer(semantic);'), "tokens.css layers colors");
assert(existsSync(join(root, "packages/tokens/dist/high-contrast.css")), "high-contrast pack in tokens dist");
assert(existsSync(join(root, "packages/tokens/dist/scope.css")), "scope.css in tokens dist");
const catalogSrc = readFileSync(join(root, "apps/product-fixtures/catalog.mjs"), "utf8");
assert(!catalogSrc.includes("/>"), "product catalog must stay createElement-only (no JSX)");
const ssr = renderToString(createElement(reactMod.Button, { variant: "primary" }, "stable"));
assert(ssr.includes("cs-button"), "compiled Button SSR without JSX source");

assert(existsSync(join(root, "packages/themes/dist/high-contrast.css")), "themes high-contrast pack");
assert(existsSync(join(root, "packages/themes/dist/brand-packs.json")), "themes brand-packs registry");
const brandPacks = JSON.parse(readFileSync(join(root, "packages/themes/dist/brand-packs.json"), "utf8"));
assert(Array.isArray(brandPacks.packs) && brandPacks.packs.length === 15, "15 elemental brand packs");
assert(brandPacks.highContrast === "./high-contrast.css", "brand-packs points at high-contrast");
assert(existsSync(join(root, "packages/themes/dist/apply-brand-pack.js")), "applyBrandPack compiled");
const themesBarrel = readFileSync(join(root, "packages/themes/index.js"), "utf8");
assert(themesBarrel.includes("applyBrandPack"), "themes barrel exports applyBrandPack");

assert(existsSync(join(root, "packages/react/dist/stable-global.js")), "stable-global IIFE");
const stableGlobal = readFileSync(join(root, "packages/react/dist/stable-global.js"), "utf8");
assert(stableGlobal.includes("CyberSkillReact"), "stable-global exposes CyberSkillReact");
assert(stableGlobal.includes("cs-button"), "stable-global includes compiled Button");

try {
  await import("@cyberskill/react/components/button/Button.js");
  throw new Error("deep import of @cyberskill/react/components/* must fail");
} catch (err) {
  assert(err && err.code === "ERR_PACKAGE_PATH_NOT_EXPORTED", "workspace deep import must be package-not-exported, got " + (err && err.code));
}

const facadePkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
assert(facadePkg.exports["./stable"]?.import === "./packages/react/index.js", "facade ./stable is compiled");
const stableSrc = readFileSync(join(root, "packages/react/index.js"), "utf8");
assert(!/from ["'].*\.jsx["']/.test(stableSrc), "facade ./stable has no raw JSX imports");
const stableMod = await import("@cyberskill/design/stable");
const stableSsr = renderToString(createElement(stableMod.Button, { variant: "primary" }, "facade-stable"));
assert(stableSsr.includes("cs-button"), "@cyberskill/design/stable SSRs compiled Button");

const shaken = await esbuild.build({
  stdin: {
    contents: 'import { Button } from "@cyberskill/react"; console.log(Button);\n',
    resolveDir: root,
    loader: "js",
  },
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
  external: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  logLevel: "silent",
});
const shakenOut = shaken.outputFiles[0].text;
assert(shakenOut.includes("cs-button"), "Button-only bundle keeps Button");
assert(!shakenOut.includes("cs-dialog"), "Button-only bundle tree-shakes Dialog");

const { nextRovingIndex } = await import(pathToFileURL(join(root, "packages/primitives/index.js")).href);
assert(nextRovingIndex(2, 1, 5) === 3, "roving next");
assert(nextRovingIndex(0, -1, 5) === 0, "roving clamp low");
assert(nextRovingIndex(4, 1, 5) === 4, "roving clamp high");

const { reportAdoption, reportDeprecation } = await import(
  pathToFileURL(join(root, "packages/primitives/dist/telemetry.js")).href
);
let seen = 0;
globalThis.CS_TELEMETRY = () => {
  seen += 1;
};
assert(reportAdoption({ product: "canary" }) === true, "telemetry sink");
assert(reportDeprecation("@cyberskill/design", "@cyberskill/react") === true, "deprecation event");
assert(seen === 2, "sink received both events");
delete globalThis.CS_TELEMETRY;

console.log("PASS test-runtime-packages", { slim: slim.length });
