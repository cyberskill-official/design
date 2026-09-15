#!/usr/bin/env node
/**
 * Fail-closed release binding: tag === VERSION === package.json version,
 * HEAD SHA recorded, tarball SHA-256 digest written. npm-publish.yml must
 * run this before Trusted Publishing.
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));

function fail(msg) {
  console.error("FAIL release-bind:", msg);
  process.exit(1);
}

const versionFile = readFileSync(join(root, "VERSION"), "utf8").trim();
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
if (pkg.version !== versionFile) {
  fail(`package.json version ${pkg.version} !== VERSION ${versionFile}`);
}

const git = spawnSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" });
const sha = (git.stdout || "").trim();
if (git.status !== 0 || !/^[0-9a-f]{40}$/.test(sha)) {
  fail("could not read HEAD SHA");
}

const ref = process.env.GITHUB_REF || "";
const tagMatch = /^refs\/tags\/v(.+)$/.exec(ref);
if (tagMatch && tagMatch[1] !== versionFile) {
  fail(`tag ${tagMatch[1]} !== VERSION ${versionFile}`);
}
if (process.env.GITHUB_SHA && process.env.GITHUB_SHA !== sha && !args.has("--allow-detached")) {
  // Actions checkout of a tag can still match; require prefix equality when both present.
  if (!sha.startsWith(process.env.GITHUB_SHA) && process.env.GITHUB_SHA !== sha) {
    fail(`GITHUB_SHA ${process.env.GITHUB_SHA} !== HEAD ${sha}`);
  }
}

const dest = mkdtempSync(join(tmpdir(), "cs-release-bind-"));
const pack = spawnSync("npm", ["pack", "--json", `--pack-destination=${dest}`], {
  cwd: root,
  encoding: "utf8",
  shell: process.platform === "win32",
  maxBuffer: 32 * 1024 * 1024,
});
if (pack.status !== 0) {
  rmSync(dest, { recursive: true, force: true });
  fail((pack.stderr || pack.stdout || "npm pack failed").slice(0, 800));
}
const parsed = JSON.parse(pack.stdout || "[]");
const entry = Array.isArray(parsed) ? parsed[0] : parsed;
const filename = entry.filename || `cyberskill-design-${pkg.version}.tgz`;
const tarballPath = join(dest, filename);
if (!existsSync(tarballPath)) {
  rmSync(dest, { recursive: true, force: true });
  fail("packed tarball missing: " + filename);
}
const digest = createHash("sha256").update(readFileSync(tarballPath)).digest("hex");
rmSync(dest, { recursive: true, force: true });

function hashExisting(rel) {
  const abs = join(root, rel);
  if (!existsSync(abs)) fail("release artifact missing: " + rel);
  return {
    path: rel,
    sha256: createHash("sha256").update(readFileSync(abs)).digest("hex"),
  };
}

const sbom = spawnSync(process.execPath, ["scripts/write-sbom.mjs"], {
  cwd: root,
  encoding: "utf8",
});
if (sbom.status !== 0) {
  fail("write-sbom failed: " + (sbom.stderr || sbom.stdout || "").slice(0, 400));
}

const artifacts = {
  dtcg: hashExisting("tokens/tokens.dtcg.json"),
  workspaceDtcg: hashExisting("packages/tokens/dist/tokens.dtcg.json"),
  nativeSwift: hashExisting("examples/native/swiftui/Sources/CyberSkillSample/CSTokens.swift"),
  nativeCompose: hashExisting("examples/native/compose/app/src/main/java/world/cyberskill/sample/tokens/CSTokens.kt"),
  nativeFlutter: hashExisting("examples/native/flutter/lib/tokens/cs_tokens.dart"),
  codeConnectNodeMap: hashExisting("code-connect/node-map.json"),
  sbom: hashExisting("_audit/ci/bom.cdx.json"),
};

const report = {
  generatedBy: "scripts/release-bind.mjs",
  version: versionFile,
  packageName: pkg.name,
  sha,
  ref: ref || "local",
  tagBound: Boolean(tagMatch),
  tarball: filename,
  digestAlgorithm: "sha256",
  digest,
  packedBytes: Number(entry.size || 0),
  unpackedBytes: Number(entry.unpackedSize || 0),
  artifacts,
  figmaWrite: {
    status: "soft-skip-explicit",
    reason: "FIGMA_TOKEN / FIGMA_FILE_KEY write path is Decision 1C; CI skips when secrets are empty",
  },
};

const out = join(root, "_audit/ci/release-bind-report.json");
writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);

if (args.has("--require-tag") && !tagMatch) {
  fail("tag binding required (refs/tags/v*)");
}

console.log("PASS release-bind", {
  version: versionFile,
  sha: sha.slice(0, 12),
  digest: digest.slice(0, 12),
  artifacts: Object.keys(artifacts),
  figmaWrite: report.figmaWrite.status,
});
void existsSync;
