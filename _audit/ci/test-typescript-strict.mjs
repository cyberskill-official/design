#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const tsc = join(root, "node_modules/typescript/bin/tsc");

function assert(c, m) {
  if (!c) throw new Error(m);
}

assert(existsSync(join(root, "tsconfig.declarations.json")), "tsconfig.declarations.json");
if (!existsSync(tsc)) {
  console.log("PASS test-typescript-strict { skipped: true, reason: 'typescript not installed' }");
  process.exit(0);
}

const r = spawnSync(process.execPath, [tsc, "-p", "tsconfig.declarations.json", "--pretty", "false"], {
  cwd: root,
  encoding: "utf8",
});
if (r.status !== 0) {
  console.error(r.stdout || r.stderr);
  throw new Error("strict declaration compile failed");
}

const canary = join(root, "apps/consumer-canary/tsconfig.json");
if (existsSync(canary)) {
  const c = spawnSync(process.execPath, [tsc, "-p", "apps/consumer-canary/tsconfig.json", "--pretty", "false"], {
    cwd: root,
    encoding: "utf8",
  });
  if (c.status !== 0) {
    console.error(c.stdout || c.stderr);
    throw new Error("consumer-canary typecheck failed");
  }
}

console.log("PASS test-typescript-strict");
