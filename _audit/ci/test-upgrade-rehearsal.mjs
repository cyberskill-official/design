#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const r = spawnSync(process.execPath, ["scripts/upgrade-rehearsal.mjs"], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
});
if (r.status !== 0) {
  console.error(r.stdout || r.stderr);
  throw new Error("upgrade-rehearsal failed");
}
console.log("PASS test-upgrade-rehearsal");
