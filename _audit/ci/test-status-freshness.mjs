#!/usr/bin/env node
/**
 * Status hub freshness: VERSION must match docs/status, and on a full clone
 * the embedded head must be an ancestor of HEAD within STATUS_HEAD_LAG_MAX.
 * Exact HEAD==commit is impossible in the same commit without amend.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const STATUS_HEAD_LAG_MAX = 5;

function assert(c, m) {
  if (!c) throw new Error(m);
}

function git(args) {
  return spawnSync("git", args, { cwd: root, encoding: "utf8" });
}

const html = readFileSync(join(root, "docs/status/index.html"), "utf8");
const marker = 'id="sv3-data">';
const start = html.indexOf(marker);
assert(start >= 0, "sv3-data script");
const jsonStart = html.indexOf("{", start);
const jsonEnd = html.indexOf("</script>", jsonStart);
assert(jsonStart >= 0 && jsonEnd > jsonStart, "sv3-data JSON bounds");
const data = JSON.parse(html.slice(jsonStart, jsonEnd));
const version = readFileSync(join(root, "VERSION"), "utf8").trim();
assert(data.version === version, `status version ${data.version} !== VERSION ${version}`);
assert(/^[0-9a-f]{7,40}$/i.test(String(data.head || "")), "status head sha");

const shallow = git(["rev-parse", "--is-shallow-repository"]);
const isShallow = String(shallow.stdout || "").trim() === "true";
if (isShallow) {
  console.log("PASS test-status-freshness", { version, head: data.head, shallow: true });
  process.exit(0);
}

const resolved = git(["rev-parse", "--verify", `${data.head}^{commit}`]);
assert(resolved.status === 0, `status head ${data.head} is not a git object — regenerate docs/status`);
const lagRun = git(["rev-list", "--count", `${data.head}..HEAD`]);
assert(lagRun.status === 0, "git rev-list status head..HEAD");
const lag = Number(String(lagRun.stdout || "").trim());
assert(Number.isFinite(lag) && lag <= STATUS_HEAD_LAG_MAX, `status head lag ${lag} > ${STATUS_HEAD_LAG_MAX}`);

console.log("PASS test-status-freshness", { version, head: data.head, lag });
