#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m);
}

assert(existsSync(join(root, ".changeset/config.json")), ".changeset/config.json");
const cfg = JSON.parse(readFileSync(join(root, ".changeset/config.json"), "utf8"));
assert(cfg.baseBranch === "main" || cfg.baseBranch === "master", "changeset baseBranch");
assert(Array.isArray(cfg.linked) || cfg.fixed || cfg.ignore, "changeset groups");
assert(existsSync(join(root, ".changeset/README.md")), "changeset readme");
assert(readdirSync(join(root, ".changeset")).length >= 2, "changeset dir");
const notes = readdirSync(join(root, ".changeset")).filter((f) => f.endsWith(".md") && f !== "README.md");
assert(notes.length >= 1, "at least one changeset note");

console.log("PASS test-changesets");
