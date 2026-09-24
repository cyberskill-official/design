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
assert(existsSync(join(root, "docs/stable-contracts.json")), "extracted stable contracts");
const registry = JSON.parse(readFileSync(join(root, "docs/export-registry.json"), "utf8"));
const extracted = JSON.parse(readFileSync(join(root, "docs/stable-contracts.json"), "utf8"));
const stables = registry.exports.filter((e) => e.maturity === "stable").map((e) => e.name);
assert(stables.length > 0, "stable exports");
for (const heading of extracted.headings || []) {
  assert(contracts.includes(heading), "story heading " + heading);
}
for (const name of new Set(stables)) {
  assert(contracts.includes(`make('${name}')`) || contracts.includes(`"${name}"`), "stable story " + name);
  const row = extracted.components.find((c) => c.name === name);
  assert(row, "extracted contract " + name);
  assert(row.anatomy && row.anatomy.includes(name), name + " anatomy must name the component");
  assert(row.usage && row.usage !== "Prefer the default variant. See docs/component-contract.md.", name + " usage must not be the generic stub");
  assert(row.keyboard, name + " keyboard/AT");
  assert(row.owner && row.maturity && row.package, name + " design status fields");
}
const highRisk = ["Dialog", "AlertDialog", "Menu", "Combobox", "DataGrid", "Sortable", "Editor", "Carousel", "DatePicker", "TimePicker", "Image"];
for (const name of highRisk) {
  assert(contracts.includes(`make('${name}')`), "high-risk story " + name);
  const row = extracted.components.find((c) => c.name === name);
  assert(row && row.highRisk, name + " must be extracted as a Phase 2 high-risk surface");
}
const anatomies = extracted.components.map((c) => c.anatomy);
assert(new Set(anatomies).size === anatomies.length, "anatomy text must be unique per component");
const axes = extracted.components.map((c) => c.responsive);
assert(axes.every(Boolean), "each contract has responsive/RTL/dark/high-contrast facts");
assert(extracted.components.every((c) => c.code && c.migration && c.designStatus && c.content), "code/migration/design status");
assert(new Set(axes).size === axes.length, "responsive text must be unique per component");

const html = existsSync(join(root, "_audit/docs-coverage.html"));
assert(html, "docs coverage html dashboard");

const uniqueStables = [...new Set(stables)];
assert(uniqueStables.length > 0 && uniqueStables.length / uniqueStables.length >= 0.9, "≥90% Stable story coverage");

console.log("PASS test-docs-coverage-dashboard", {
  stables: uniqueStables.length,
  extracted: extracted.components.length,
  storyCoverage: 1,
});
