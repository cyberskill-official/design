#!/usr/bin/env node
/**
 * Browser IIFE of compiled @cyberskill/react for DC templates and AT fixtures.
 * Expects window.React / window.ReactDOM. Exposes window.CyberSkillReact.
 */
import * as esbuild from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { reactGlobalsPlugin } from "./react-globals-plugin.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outfile = join(root, "packages/react/dist/stable-global.js");
const check = process.argv.includes("--check");

const result = await esbuild.build({
  absWorkingDir: root,
  entryPoints: [join(root, "packages/react/index.js")],
  bundle: true,
  format: "iife",
  globalName: "CyberSkillReact",
  platform: "browser",
  plugins: [reactGlobalsPlugin()],
  logLevel: "silent",
  write: false,
});

const built = Buffer.from(result.outputFiles[0].contents);
if (check) {
  const committed = readFileSync(outfile);
  if (Buffer.compare(built, committed) !== 0) {
    throw new Error("packages/react/dist/stable-global.js is stale — run node scripts/build-stable-global.mjs");
  }
} else {
  writeFileSync(outfile, built);
  const src = built.toString("utf8");
  if (!src.includes("CyberSkillReact") || !src.includes("cs-button")) {
    throw new Error("stable-global.js does not look like compiled @cyberskill/react");
  }
}

console.log(check ? "PASS build-stable-global --check" : "PASS build-stable-global");
