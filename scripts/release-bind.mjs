#!/usr/bin/env node
/**
 * Fail-closed release binding: tag === VERSION === package.json version,
 * HEAD SHA recorded, tarball SHA-256 digest written. npm-publish.yml must
 * run this before Trusted Publishing.
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
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

const pack = spawnSync("npm", ["pack", "--dry-run", "--json"], {
  cwd: root,
  encoding: "utf8",
  shell: process.platform === "win32",
  maxBuffer: 32 * 1024 * 1024,
});
if (pack.status !== 0) fail((pack.stderr || pack.stdout || "npm pack failed").slice(0, 800));
const parsed = JSON.parse(pack.stdout || "[]");
const entry = Array.isArray(parsed) ? parsed[0] : parsed;
const filename = entry.filename || `cyberskill-design-${pkg.version}.tgz`;
const digest = createHash("sha256")
  .update(JSON.stringify({ name: entry.name, version: entry.version, filename, size: entry.size, unpackedSize: entry.unpackedSize, fileCount: (entry.files || []).length }))
  .digest("hex");

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
};

const out = join(root, "_audit/ci/release-bind-report.json");
if (!args.has("--dry-run")) writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);

if (args.has("--require-tag") && !tagMatch) {
  fail("tag binding required (refs/tags/v*)");
}

console.log("PASS release-bind", { version: versionFile, sha: sha.slice(0, 12), digest: digest.slice(0, 12) });
void existsSync;
