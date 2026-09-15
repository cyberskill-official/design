#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

function assert(c, m) {
  if (!c) throw new Error(m);
}

assert(pkg.name === "@cyberskill/design", "facade name");
assert(Array.isArray(pkg.workspaces) && pkg.workspaces.includes("packages/*"), "workspaces");

const expected = [
  "packages/tokens",
  "packages/primitives",
  "packages/react",
  "packages/themes",
  "packages/icons",
  "packages/templates",
  "packages/eslint",
  "packages/codemods",
  "packages/web-components",
  "apps/storybook",
  "apps/consumer-canary",
  "apps/consumer-canary/react-18",
];
for (const dir of expected) {
  assert(existsSync(join(root, dir, "package.json")), dir);
}

const tokens = JSON.parse(readFileSync(join(root, "packages/tokens/package.json"), "utf8"));
assert(tokens.name === "@cyberskill/tokens", "tokens package name");
assert(tokens.exports["./css"] === "./dist/tokens.css", "tokens css export is layered runtime");
assert(tokens.exports["./css/scope"] === "./dist/scope.css", "tokens scope export");
assert(!readFileSync(join(root, "packages/react/package.json"), "utf8").includes("_audit/"), "react package is slim");

console.log("PASS test-workspace-topology", { packages: expected.length });
