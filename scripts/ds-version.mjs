#!/usr/bin/env node
// ds-version — compute and apply the next design-system VERSION from Conventional Commits.
//
// Port of CyberOS scripts/cyberos-version.mjs, adapted for this repo:
//   • No CHANGELOG.md (doctrine: tip SHA + docs/release-notes.md)
//   • No BUILD_NUMBER (no store upload counter here)
//   • Ignore git fixup!/squash! subjects (autosquash markers ≠ API breaks)
//
// Baseline = the last commit that touched VERSION. Bump LEVEL is the strongest
// Conventional-Commit signal among non-merge commits since that baseline:
//   feat -> minor | fix,perf,revert,refactor -> patch | `!` or BREAKING CHANGE -> major
//   chore,docs,test,ci,build,style -> no bump on their own
// A `Release-As: X.Y.Z` trailer forces an exact next version.
//
// Usage:
//   node scripts/ds-version.mjs [--check]     dry run (default)
//   node scripts/ds-version.mjs --apply       write VERSION
//   node scripts/ds-version.mjs --level minor|patch|major
//   node scripts/ds-version.mjs --set 1.4.0
//   node scripts/ds-version.mjs --since <ref>
//   node scripts/ds-version.mjs --json
//   node scripts/ds-version.mjs --exit-code   exit 20 when a bump is due
//   node scripts/ds-version.mjs --selftest

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const RANK = { none: 0, patch: 1, minor: 2, major: 3 };
const TYPE_LEVEL = { feat: "minor", fix: "patch", perf: "patch", revert: "patch", refactor: "patch" };
// Git autosquash markers — not Conventional Commit API signals.
const IGNORE_TYPES = new Set(["fixup", "squash"]);

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], ...opts }).trim();
}
function repoRoot() {
  try { return sh("git rev-parse --show-toplevel"); } catch { return process.cwd(); }
}

function parseSemver(v) {
  const m = String(v).trim().match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!m) throw new Error(`not a semver: "${v}"`);
  return { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] || null };
}
function fmt(s) { return `${s.major}.${s.minor}.${s.patch}`; }

function bump(v, level) {
  const s = parseSemver(v);
  if (level === "major") {
    if (s.major === 0) return { major: 0, minor: s.minor + 1, patch: 0, pre: null };
    return { major: s.major + 1, minor: 0, patch: 0, pre: null };
  }
  if (level === "minor") return { major: s.major, minor: s.minor + 1, patch: 0, pre: null };
  if (level === "patch") return { major: s.major, minor: s.minor, patch: s.patch + 1, pre: null };
  return s;
}

function classify(subject, body) {
  const out = { level: "none", breaking: false, releaseAs: null, ignored: false };
  const ra = `${subject}\n${body}`.match(/^\s*Release-As:\s*v?(\d+\.\d+\.\d+)\s*$/m);
  if (ra) out.releaseAs = ra[1];
  const m = subject.match(/^(?<type>[a-z]+)(?:\([^)]*\))?(?<bang>!)?:\s/i);
  if (m) {
    const type = m.groups.type.toLowerCase();
    if (IGNORE_TYPES.has(type)) {
      out.ignored = true;
      return out;
    }
    if (m.groups.bang) out.breaking = true;
    out.level = TYPE_LEVEL[type] || "none";
  }
  if (/^BREAKING CHANGE:/m.test(body) || /^BREAKING-CHANGE:/m.test(body)) out.breaking = true;
  if (out.breaking) out.level = "major";
  return out;
}

function baselineRef(root, since) {
  if (since) return since;
  const c = sh(`git log -1 --format=%H -- VERSION`, { cwd: root });
  if (c) return c;
  try { return sh(`git describe --tags --match "v*" --abbrev=0`, { cwd: root }); } catch { /* no tag */ }
  return sh(`git rev-list --max-parents=0 HEAD | tail -1`, { cwd: root });
}

function commitsSince(root, base) {
  let raw = "";
  try { raw = sh(`git log --no-merges --format=%H%x1f%s%x1f%b%x1e ${base}..HEAD`, { cwd: root }); } catch { return []; }
  if (!raw) return [];
  return raw.split("\x1e").map((r) => r.trim()).filter(Boolean).map((rec) => {
    const [hash, subject, body = ""] = rec.split("\x1f");
    return { hash: (hash || "").trim(), subject: (subject || "").trim(), body: body.trim() };
  });
}

function plan(root, opts) {
  const current = readFileSync(join(root, "VERSION"), "utf8").trim();
  if (opts.set) return { current, next: parseSemver(opts.set) && opts.set, level: "set", reason: `forced --set ${opts.set}`, commits: [] };
  const base = baselineRef(root, opts.since);
  const commits = commitsSince(root, base);
  let level = "none"; let releaseAs = null;
  const kept = [];
  for (const c of commits) {
    const k = classify(c.subject, c.body);
    if (k.ignored) continue;
    if (k.releaseAs) releaseAs = k.releaseAs;
    if (RANK[k.level] > RANK[level]) level = k.level;
    if (k.level !== "none" || k.breaking) kept.push({ ...c, ...k });
  }
  if (opts.level) level = opts.level;
  if (releaseAs && !opts.level) return { current, next: releaseAs, level: "release-as", reason: `Release-As: ${releaseAs}`, base, commits: kept };
  const next = level === "none" ? current : fmt(bump(current, level));
  const reason = level === "none"
    ? `no feat/fix/breaking commits since ${base.slice(0, 12)} - no bump`
    : `${level} from ${kept.length} commit(s) since ${base.slice(0, 12)}`;
  return { current, next, level, reason, base, commits: kept };
}

function apply(root, p) {
  if (p.next === p.current) return false;
  writeFileSync(join(root, "VERSION"), `${p.next}\n`);
  return true;
}

function selftest() {
  let pass = 0, fail = 0;
  const eq = (name, got, want) => {
    if (JSON.stringify(got) === JSON.stringify(want)) pass++;
    else { fail++; console.error(`FAIL ${name}: got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); }
  };
  eq("bump minor", fmt(bump("1.0.0", "minor")), "1.1.0");
  eq("bump patch", fmt(bump("1.2.3", "patch")), "1.2.4");
  eq("bump major", fmt(bump("1.2.3", "major")), "2.0.0");
  eq("0.x major->minor", fmt(bump("0.1.0", "major")), "0.2.0");
  eq("feat->minor", classify("feat(x): y", "").level, "minor");
  eq("fix->patch", classify("fix: y", "").level, "patch");
  eq("bang->major", classify("feat!: y", "").level, "major");
  eq("breaking body->major", classify("feat: y", "BREAKING CHANGE: z").level, "major");
  eq("chore->none", classify("chore: y", "").level, "none");
  eq("fixup bang ignored", classify("fixup!: y", "").level, "none");
  eq("fixup ignored flag", classify("fixup!: y", "").ignored, true);
  eq("release-as", classify("chore: y", "Release-As: 2.5.0").releaseAs, "2.5.0");
  console.log(`selftest: ${pass} passed, ${fail} failed`);
  return fail === 0 ? 0 : 1;
}

function main() {
  const argv = process.argv.slice(2);
  const has = (f) => argv.includes(f);
  const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
  if (has("--selftest")) process.exit(selftest());

  const root = repoRoot();
  const opts = { since: val("--since"), level: val("--level"), set: val("--set") };
  if (opts.level && !RANK[opts.level]) { console.error(`bad --level: ${opts.level}`); process.exit(2); }
  const p = plan(root, opts);
  const bumpDue = p.next !== p.current;

  if (has("--apply")) {
    const changed = apply(root, p);
    const line = `DS_VERSION=${p.next} DS_VERSION_CHANGED=${changed}`;
    console.log(has("--json") ? JSON.stringify({ ...p, changed }) : `${changed ? "bumped" : "no change"}: ${p.current} -> ${p.next}  (${p.reason})\n${line}`);
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `version=${p.next}\nchanged=${changed}\n`);
    process.exit(0);
  }

  if (has("--json")) console.log(JSON.stringify(p));
  else {
    console.log(`current: ${p.current}`);
    console.log(`next:    ${p.next}  (${p.level})`);
    console.log(`reason:  ${p.reason}`);
    if (p.commits && p.commits.length) console.log(`commits:\n${p.commits.map((c) => `  ${c.level.padEnd(5)} ${c.subject}`).join("\n")}`);
  }
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `version=${p.next}\nchanged=${bumpDue}\n`);
  process.exit(has("--exit-code") && bumpDue ? 20 : 0);
}

main();

export { parseSemver, bump, classify };
