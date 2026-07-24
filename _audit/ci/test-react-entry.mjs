/**
 * Unit test — bundler-native React entry (`_esm/react.mjs` + types + package
 * exports). Asserts export/manifest parity with the bundle header, no browser
 * CDN/React self-ensure leakage, peerDependencies, and dual-entry map
 * (`.` / `./react` → react.mjs; `./legacy` → cs.mjs).
 *
 * Plain Node — does not execute JSX (consumer bundlers transpile).
 */
import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m || "assert failed");
}

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const reactMjs = readFileSync(join(root, "_esm/react.mjs"), "utf8");
const reactDts = readFileSync(join(root, "_esm/react.d.ts"), "utf8");
const csMjs = readFileSync(join(root, "_esm/cs.mjs"), "utf8");
const bundle = readFileSync(join(root, "_ds_bundle.js"), "utf8");
const first = bundle.slice(0, bundle.indexOf("\n"));
const hm = first.match(/^\/\* @ds-bundle: (.*) \*\/$/);
assert(hm, "_ds_bundle.js missing @ds-bundle header");
const header = JSON.parse(hm[1]);
const exposed = header.components.map((c) => c.name);

// --- package.json surface ---
assert(pkg.version === "1.0.0", "VERSION pin");
assert(pkg.types === "_esm/react.d.ts", 'package.json types must be _esm/react.d.ts');
assert(pkg.module === "_esm/react.mjs", 'package.json module must be _esm/react.mjs');
assert(pkg.peerDependencies?.react, "peerDependencies.react required");
assert(pkg.peerDependencies?.["react-dom"], "peerDependencies.react-dom required");

const ex = pkg.exports || {};
assert(ex["."]?.import === "./_esm/react.mjs", 'exports["."] → react.mjs');
assert(ex["."]?.types === "./_esm/react.d.ts", 'exports["."].types → react.d.ts');
assert(ex["./react"]?.import === "./_esm/react.mjs", 'exports["./react"] → react.mjs');
assert(ex["./react"]?.types === "./_esm/react.d.ts", 'exports["./react"].types → react.d.ts');
assert(ex["./legacy"]?.import === "./_esm/cs.mjs", 'exports["./legacy"] → cs.mjs');
assert(ex["./styles.css"], 'exports["./styles.css"] present');

assert(existsSync(join(root, "_esm/react.mjs")), "react.mjs exists");
assert(existsSync(join(root, "_esm/react.d.ts")), "react.d.ts exists");
assert(existsSync(join(root, "_esm/cs.mjs")), "legacy cs.mjs exists");

// --- react.mjs shape: no browser bridge ---
assert(!/unpkg\.com/.test(reactMjs), "react.mjs must not load React from CDN");
assert(!/CyberSkillDesignSystem_/.test(reactMjs), "react.mjs must not hardcode bundle namespace");
assert(!/_ds_bundle\.js/.test(reactMjs), "react.mjs must not side-load _ds_bundle.js");
assert(!/document\./.test(reactMjs), "react.mjs must not touch document (SSR-safe source)");
assert(!/ensureScript/.test(reactMjs), "react.mjs must not self-ensure scripts");
assert(/^export \{ /m.test(reactMjs), "react.mjs must use export { } from");

// --- export parity with bundle header ---
const reexported = [];
const re = /^export \{ ([^}]+) \} from /gm;
let m;
while ((m = re.exec(reactMjs))) {
  for (const name of m[1].split(",").map((s) => s.trim()).filter(Boolean)) {
    reexported.push(name);
  }
}
assert(reexported.length > 0, "no named re-exports in react.mjs");
const missing = exposed.filter((n) => !reexported.includes(n));
const extra = reexported.filter((n) => !exposed.includes(n));
assert(missing.length === 0, "missing from react.mjs: " + missing.slice(0, 8).join(", "));
assert(extra.length === 0, "extra in react.mjs: " + extra.slice(0, 8).join(", "));

// --- each source path in header is a real file and appears in react.mjs ---
for (const c of header.components) {
  assert(existsSync(join(root, c.sourcePath)), "missing source " + c.sourcePath);
  assert(
    reactMjs.includes(JSON.stringify("../" + c.sourcePath)) ||
      reactMjs.includes('"../' + c.sourcePath + '"'),
    "react.mjs missing source path " + c.sourcePath
  );
}

// --- types file mentions Button (primary consumer) ---
assert(/export \{ Button \}/.test(reactDts), "react.d.ts must export Button");
assert(/export type \*/.test(reactDts), "react.d.ts must re-export types");

// --- legacy cs.mjs still the browser bridge (unchanged contract) ---
assert(/ensureScript/.test(csMjs) || /unpkg\.com/.test(csMjs), "cs.mjs remains the browser self-ensure path");
assert(/^export const Button = CS\.Button;/m.test(csMjs), "cs.mjs still re-exports Button from CS");

// --- generator --check stays green ---
const check = spawnSync(process.execPath, [join(root, "scripts/generate-react-entry.mjs"), "--check"], {
  cwd: root,
  encoding: "utf8",
});
assert(check.status === 0, "generate-react-entry --check failed: " + (check.stderr || check.stdout));

console.log("PASS test-react-entry", {
  exports: reexported.length,
  peerDeps: Object.keys(pkg.peerDependencies),
  entry: ex["."].import,
  legacy: ex["./legacy"].import,
});
