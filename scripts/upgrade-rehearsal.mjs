#!/usr/bin/env node
/**
 * Consumer upgrade rehearsal: pack the facade, resolve workspace themes,
 * run the React 19 canary SSR smoke. Must finish under 15 minutes (P2).
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const started = Date.now();
const LIMIT_MS = 15 * 60 * 1000;

function run(args, cwd = root) {
  const r = spawnSync(process.execPath, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (r.status !== 0) {
    console.error(r.stdout || r.stderr);
    throw new Error(args.join(" ") + " failed");
  }
  return r;
}

if (!existsSync(join(root, "packages/react/dist/components/button/Button.js"))) {
  run(["scripts/build-workspace-packages.mjs"]);
}
run(["scripts/release-bind.mjs", "--dry-run"]);
run(["ssr.mjs"], join(root, "apps/consumer-canary"));
run(["vite-build.mjs"], join(root, "apps/consumer-canary"));
run(["next-build.mjs"], join(root, "apps/consumer-canary"));

const elapsed = Date.now() - started;
if (elapsed >= LIMIT_MS) {
  throw new Error("upgrade rehearsal exceeded 15 minutes: " + elapsed + "ms");
}
console.log("PASS upgrade-rehearsal", { elapsedMs: elapsed, limitMs: LIMIT_MS });
