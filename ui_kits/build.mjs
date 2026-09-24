#!/usr/bin/env node
/**
 * Compile UI-kit JSX so product pages do not load Babel or raw JSX at runtime.
 * Status Hub / Website stay Thổ recreations (token CSS + compiled kit JS).
 * Lumi chat is a real @cyberskill/react consumer.
 */
import * as esbuild from "esbuild";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { reactGlobalsPlugin } from "../scripts/react-globals-plugin.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");
const outRoot = check ? join(tmpdir(), `cs-ui-kits-${process.pid}`) : root;

const kitIife = [
  {
    entry: join(root, "ui_kits/status-hub/StatusHub.jsx"),
    outfile: join(outRoot, "ui_kits/status-hub/StatusHub.compiled.js"),
  },
  {
    entry: join(root, "ui_kits/website/Website.jsx"),
    outfile: join(outRoot, "ui_kits/website/Website.compiled.js"),
  },
];

if (check) {
  mkdirSync(join(outRoot, "ui_kits/status-hub"), { recursive: true });
  mkdirSync(join(outRoot, "ui_kits/website"), { recursive: true });
}

for (const spec of kitIife) {
  await esbuild.build({
    absWorkingDir: root,
    entryPoints: [spec.entry],
    outfile: spec.outfile,
    jsx: "transform",
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    format: "iife",
    platform: "browser",
    logLevel: "silent",
  });
}

await esbuild.build({
  absWorkingDir: root,
  entryPoints: [join(root, "ui_kits/website/LumiChat.jsx")],
  outfile: join(outRoot, "ui_kits/website/LumiChat.compiled.js"),
  bundle: true,
  format: "iife",
  platform: "browser",
  jsx: "automatic",
  plugins: [reactGlobalsPlugin()],
  logLevel: "silent",
});

const compiled = [
  "ui_kits/status-hub/StatusHub.compiled.js",
  "ui_kits/website/Website.compiled.js",
  "ui_kits/website/LumiChat.compiled.js",
];

if (check) {
  for (const rel of compiled) {
    const expected = readFileSync(join(outRoot, rel));
    const committed = readFileSync(join(root, rel));
    if (Buffer.compare(expected, committed) !== 0) {
      rmSync(outRoot, { recursive: true, force: true });
      throw new Error(rel + " is stale — run node ui_kits/build.mjs");
    }
  }
  rmSync(outRoot, { recursive: true, force: true });
  console.log("PASS ui-kits-build --check");
} else {
  for (const rel of compiled) {
    writeFileSync(join(root, rel), readFileSync(join(outRoot, rel)));
  }
  console.log("PASS ui-kits-build");
}
