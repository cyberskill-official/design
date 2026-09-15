#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function assert(c, m) {
  if (!c) throw new Error(m);
}

assert(existsSync(join(root, "scripts/release-bind.mjs")), "release-bind script");
const workflow = readFileSync(join(root, ".github/workflows/npm-publish.yml"), "utf8");
assert(workflow.includes("scripts/release-bind.mjs"), "npm-publish.yml runs release-bind");
assert(/Fail-closed release binding|release-bind/.test(workflow), "binding step named");

const r = spawnSync(process.execPath, ["scripts/release-bind.mjs", "--dry-run"], {
  cwd: root,
  encoding: "utf8",
});
if (r.status !== 0) {
  console.error(r.stdout || r.stderr);
  throw new Error("release-bind --dry-run failed");
}

const report = JSON.parse(readFileSync(join(root, "_audit/ci/release-bind-report.json"), "utf8"));
assert(report.sha && report.digest, "sha + tarball digest");
assert(report.artifacts && report.artifacts.dtcg && report.artifacts.codeConnectNodeMap, "SHA-bound artifacts");
assert(report.artifacts.highContrastPack && report.artifacts.brandPacks, "theme/brand packs bound");
assert(report.artifacts.nativeSwift && report.artifacts.nativeCompose && report.artifacts.nativeFlutter, "native artifacts");
assert(report.artifacts.sbom && report.artifacts.sbom.sha256, "SBOM bound to release digest");
assert(existsSync(join(root, "_audit/ci/bom.cdx.json")), "CycloneDX SBOM written");
assert(report.figmaWrite && report.figmaWrite.status === "soft-skip-explicit", "figma soft-skip explicit");
assert(workflow.includes("CS_NPM_DIST_TAG") || workflow.includes("dist_tag"), "canary channel in npm-publish.yml");

console.log("PASS test-release-bind");
