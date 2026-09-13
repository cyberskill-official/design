#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const canary = join(root, "apps/consumer-canary/react-18");

function assert(c, m) {
  if (!c) throw new Error(m);
}

assert(existsSync(join(canary, "package.json")), "react-18 canary package");
assert(existsSync(join(canary, "ssr.mjs")), "react-18 ssr fixture");

if (!existsSync(join(canary, "node_modules/react/package.json"))) {
  const install = spawnSync("npm", ["install", "--omit=dev", "--no-workspaces"], {
    cwd: canary,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (install.status !== 0) {
    console.error(install.stdout || install.stderr);
    throw new Error("react-18 canary npm install failed");
  }
}

const r = spawnSync(process.execPath, ["ssr.mjs"], { cwd: canary, encoding: "utf8" });
if (r.status !== 0) {
  console.error(r.stdout || r.stderr);
  throw new Error("react-18 SSR smoke failed");
}

const rootSsr = spawnSync(process.execPath, ["ssr.mjs"], {
  cwd: join(root, "apps/consumer-canary"),
  encoding: "utf8",
});
if (rootSsr.status !== 0) {
  console.error(rootSsr.stdout || rootSsr.stderr);
  throw new Error("react-19 canary SSR smoke failed");
}

console.log("PASS test-react-18-ssr");
