import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgDir = dirname(fileURLToPath(import.meta.url));
const here = join(pkgDir, "next-host");
const require = createRequire(join(pkgDir, "package.json"));
const nextBin = require.resolve("next/dist/bin/next");
const build = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: here,
  encoding: "utf8",
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});
if (build.status !== 0) {
  console.error(build.stdout || "");
  console.error(build.stderr || "");
  throw new Error("next canary build failed");
}

const html = readFileSync(join(here, ".next-canary/server/app/index.html"), "utf8");
if (!html.includes("cs-button cs-button--primary") || !html.includes("next-canary")) {
  throw new Error("next SSR HTML did not render @cyberskill/react Button");
}
if (!html.includes("data-theme") || !html.includes("cs-root") || !html.includes("prefers-color-scheme")) {
  throw new Error("next SSR HTML missing theme root or no-flash script");
}
console.log("PASS consumer-canary next", { bytes: Buffer.byteLength(html) });
