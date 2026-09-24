#!/usr/bin/env node
/**
 * Machine-readable public export registry: owner, maturity, support, deprecation, package.
 * Source of truth for TASK-IMP-030 / enterprise audit P0 governance.
 */
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listPublicComponents } from "../_audit/ci/storybook-inventory.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));

const STABLE = new Set([
  "Alert", "AlertDialog", "Avatar", "AvatarGroup", "Badge", "Breadcrumb", "Button",
  "ButtonGroup", "Card", "Checkbox", "Dialog", "Divider", "Drawer", "EmptyState",
  "Icon", "Link", "Logo", "OverlayProvider", "ProgressBar", "RadioGroup", "Select",
  "Spinner", "Switch", "Tabs", "Tag", "TextField", "Textarea", "Toast", "Tooltip",
]);

const EXPERIMENTAL = new Set([
  "AIDisclosureBadge", "ChatMessage", "CitationList", "ConfidenceMeter",
  "HumanReviewGate", "PromptInput", "PromptSuggestions", "TypingIndicator",
  "Editor", "Terminal",
]);

const COUNCIL = {
  owner: "design-system-council",
  backup: "stephencheng",
  support: "current-and-previous-minor",
};

function maturityFor(name) {
  if (STABLE.has(name)) return "stable";
  if (EXPERIMENTAL.has(name)) return "experimental";
  return "beta";
}

function build() {
  const modules = listPublicComponents();
  const exports = [];
  for (const mod of modules) {
    for (const name of mod.all) {
      const maturity = maturityFor(name);
      exports.push({
        name,
        sourcePath: mod.relFromRoot,
        primary: name === mod.primary,
        owner: COUNCIL.owner,
        backup: COUNCIL.backup,
        maturity,
        support: COUNCIL.support,
        deprecation: null,
        package: name === "ThemeProvider" || name === "OverlayProvider"
          ? "@cyberskill/react"
          : "@cyberskill/react",
        contract: STABLE.has(name) || name === "ThemeProvider",
      });
    }
  }
  exports.sort((a, b) => a.name.localeCompare(b.name));
  return {
    generatedBy: "scripts/generate-export-registry.mjs",
    version: readFileSync(join(root, "VERSION"), "utf8").trim(),
    policy: {
      experimental: "API may change; no compatibility promise.",
      beta: "Production pilots allowed; migration notes required.",
      stable: "Semver guarantee, complete docs, owner, support window.",
      deprecated: "Replacement, warning period, and removal date required.",
    },
    council: {
      design: "design-system-council",
      frontend: "stephencheng",
      accessibility: "design-system-council",
      localization: "design-system-council",
      security: "design-system-council",
      product: "design-system-council",
      release: "stephencheng",
    },
    exports,
    packages: [
      "@cyberskill/tokens",
      "@cyberskill/primitives",
      "@cyberskill/react",
      "@cyberskill/themes",
      "@cyberskill/icons",
      "@cyberskill/templates",
      "@cyberskill/eslint-plugin",
      "@cyberskill/codemods",
      "@cyberskill/web-components",
    ].map((name) => ({
      name,
      owner: COUNCIL.owner,
      backup: COUNCIL.backup,
      support: COUNCIL.support,
    })),
  };
}

const registry = build();
const outPath = join(root, "docs/export-registry.json");
const json = `${JSON.stringify(registry, null, 2)}\n`;

if (args.has("--check")) {
  const current = readFileSync(outPath, "utf8");
  if (current !== json) {
    console.error("FAIL generate-export-registry --check: docs/export-registry.json stale. Run: node scripts/generate-export-registry.mjs");
    process.exit(1);
  }
  console.log("PASS generate-export-registry --check", { exports: registry.exports.length });
  process.exit(0);
}

writeFileSync(outPath, json);
console.log("wrote", outPath, { exports: registry.exports.length });
