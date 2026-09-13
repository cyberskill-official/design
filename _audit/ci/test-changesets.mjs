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

console.log("PASS test-changesets");
