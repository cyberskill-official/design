#!/usr/bin/env node
/**
 * Bundle the per-product client host from compiled @cyberskill/react.
 * No JSX in the host source — createElement only.
 */
import * as esbuild from "esbuild";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "../..");

await esbuild.build({
  absWorkingDir: root,
  entryPoints: [join(here, "src/mount.js")],
  bundle: true,
  format: "esm",
  outfile: join(here, "dist/mount.js"),
  platform: "browser",
  logLevel: "silent",
});

console.log("PASS product-hosts-build");
