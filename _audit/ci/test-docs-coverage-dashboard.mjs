#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m);
}

const template = readFileSync(join(root, "stories/Docs/ComponentContractTemplate.mdx"), "utf8");
for (const heading of [
  "Anatomy",
  "Usage",
  "States",
  "Keyboard / AT",
  "Tokens",
  "Code",
  "SSR",
  "Migration",
  "Design status",
]) {
  assert(template.includes(`## ${heading}`), "template heading " + heading);
}

const dashboard = readFileSync(join(root, "stories/Docs/CoverageDashboard.stories.jsx"), "utf8");
assert(dashboard.includes("name: 'Coverage dashboard'"), "coverage dashboard story");

const contracts = readFileSync(join(root, "stories/Docs/StableContracts.stories.jsx"), "utf8");
assert(existsSync(join(root, "docs/export-registry.json")), "export registry");
const registry = JSON.parse(readFileSync(join(root, "docs/export-registry.json"), "utf8"));
const stables = registry.exports.filter((e) => e.maturity === "stable").map((e) => e.name);
assert(stables.length > 0, "stable exports");
for (const name of new Set(stables)) {
  assert(contracts.includes(`make('${name}')`) || contracts.includes(`"${name}"`), "stable story " + name);
}

const html = existsSync(join(root, "_audit/docs-coverage.html"));
assert(html, "docs coverage html dashboard");

console.log("PASS test-docs-coverage-dashboard", { stables: new Set(stables).size });
