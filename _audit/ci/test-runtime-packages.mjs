#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m);
}

const build = spawnSync(process.execPath, ["scripts/build-workspace-packages.mjs"], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 8 * 1024 * 1024,
});
if (build.status !== 0) {
  console.error(build.stderr || build.stdout);
  throw new Error("build-workspace-packages failed");
}

const slim = [
  ["packages/react", "@cyberskill/react"],
  ["packages/tokens", "@cyberskill/tokens"],
  ["packages/themes", "@cyberskill/themes"],
  ["packages/icons", "@cyberskill/icons"],
  ["packages/primitives", "@cyberskill/primitives"],
];

for (const [dir, name] of slim) {
  const pkg = JSON.parse(readFileSync(join(root, dir, "package.json"), "utf8"));
  assert(pkg.name === name, name);
  assert(!pkg.exports?.["./components/*"], name + " must not expose deep JSX");
  assert(!JSON.stringify(pkg.files).includes("templates"), name + " files[] must omit templates");
  const pack = spawnSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: join(root, dir),
    encoding: "utf8",
    shell: process.platform === "win32",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (pack.status !== 0) throw new Error(name + " pack failed: " + (pack.stderr || pack.stdout).slice(0, 400));
  const entry = JSON.parse(pack.stdout || "[]")[0] || {};
  const files = (entry.files || []).map((f) => (typeof f === "string" ? f : f.path));
  const bad = files.filter((f) =>
    /(?:^|\/)(templates\/|_audit\/|_vendor\/|.*\.jsx$)/.test(String(f)),
  );
  assert(bad.length === 0, name + " tarball leaked " + bad.slice(0, 8).join(", "));
}

assert(existsSync(join(root, "packages/react/dist/components/button/Button.js")), "compiled Button");
const compiled = readFileSync(join(root, "packages/react/dist/components/button/Button.js"), "utf8");
assert(!compiled.includes("export function Button"), "Button compiled away from source function form or is forwardRef");
assert(!/from ["'].*\.jsx["']/.test(readFileSync(join(root, "packages/react/index.js"), "utf8")), "react index has no jsx imports");

const { reportAdoption, reportDeprecation } = await import(
  pathToFileURL(join(root, "packages/primitives/dist/telemetry.js")).href
);
let seen = 0;
globalThis.CS_TELEMETRY = () => {
  seen += 1;
};
assert(reportAdoption({ product: "canary" }) === true, "telemetry sink");
assert(reportDeprecation("@cyberskill/design", "@cyberskill/react") === true, "deprecation event");
assert(seen === 2, "sink received both events");
delete globalThis.CS_TELEMETRY;

console.log("PASS test-runtime-packages", { slim: slim.length });
