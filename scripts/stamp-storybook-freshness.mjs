#!/usr/bin/env node
/** Write storybook-static/.cs-freshness.json after a Storybook build (UX-030). */
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { hashStorySources } from "../_audit/ci/test-storybook-freshness.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const staticDir = join(root, "storybook-static");
if (!existsSync(staticDir)) mkdirSync(staticDir, { recursive: true });
const sourceHash = hashStorySources(root);
const stamp = {
  sourceHash,
  builtAt: new Date().toISOString(),
  watch: ["stories", ".storybook"],
};
writeFileSync(join(staticDir, ".cs-freshness.json"), JSON.stringify(stamp, null, 2) + "\n");
console.log("storybook freshness stamped", sourceHash);
