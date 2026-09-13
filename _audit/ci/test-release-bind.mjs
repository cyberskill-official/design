#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m);
}

assert(existsSync(join(root, "scripts/release-bind.mjs")), "release-bind script");
const workflow = readFileSync(join(root, ".github/workflows/npm-publish.yml"), "utf8");
assert(workflow.includes("scripts/release-bind.mjs"), "npm-publish.yml runs release-bind");
assert(/Fail-closed release binding|release-bind/.test(workflow), "binding step named");

const r = spawnSync(process.execPath, ["scripts/release-bind.mjs", "--dry-run"], {
  cwd: root,
  encoding: "utf8",
});
if (r.status !== 0) {
  console.error(r.stdout || r.stderr);
  throw new Error("release-bind --dry-run failed");
}

console.log("PASS test-release-bind");
