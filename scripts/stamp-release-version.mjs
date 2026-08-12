#!/usr/bin/env node
// stamp-release-version — propagate root VERSION into every design-system stamp.
//
// VERSION is the source of truth (auto-bumped by .github/workflows/version.yml).
// This keeps package.json, token metas, legacy ESM entry, DESIGN.md, npm-hello,
// and consumer-facing prose pins (README / SKILL / llms.txt / stories / …)
// in lockstep. Does NOT write a CHANGELOG.
//
// Usage:
//   node scripts/stamp-release-version.mjs            # report drift
//   node scripts/stamp-release-version.mjs --apply    # write files
//   node scripts/stamp-release-version.mjs --check    # exit 10 on drift
//   node scripts/stamp-release-version.mjs --check --exit-code  # same

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const root = (() => {
  try { return execSync("git rev-parse --show-toplevel", { encoding: "utf8" }).trim(); } catch { return process.cwd(); }
})();

const version = readFileSync(join(root, "VERSION"), "utf8").trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`stamp: VERSION is not semver: "${version}"`);
  process.exit(2);
}

const apply = process.argv.includes("--apply");
// --check implies fail-on-drift (FIND-027 / FIND-116)
const exitCode = process.argv.includes("--exit-code") || process.argv.includes("--check");
const changes = [];

/** Launch-narrative anchors and dated history — never rewrite these pins. */
const HISTORICAL_OK = [
  /LAUNCHED(?:\s+at)?\s+\*\*v?1\.1\.0\*\*/gi,
  /LAUNCHED\s+\*\*v?1\.1\.0\*\*/gi,
  /version is\s+\*\*LAUNCHED at 1\.1\.0\*\*/gi,
  /LAUNCHED\s+`@cyberskill\/design@\d+\.\d+\.\d+`/gi,
  /LAUNCH was\s+`@cyberskill\/design@\d+\.\d+\.\d+`/gi,
  /LAUNCH là\s+`@cyberskill\/design@\d+\.\d+\.\d+`/gi,
  /\*\*LAUNCH\s+`@cyberskill\/design@\d+\.\d+\.\d+`\*\*/gi,
  /Trạng thái:\s*LAUNCH\s+`@cyberskill\/design@\d+\.\d+\.\d+`/gi,
  /##\s+Patch\s+[—–-]\s+`@cyberskill\/design@\d+\.\d+\.\d+`/g,
  /##\s+Release\s+[—–-]\s+`@cyberskill\/design@\d+\.\d+\.\d+`/g,
  /##\s+LAUNCH\s+[—–-]\s+`@cyberskill\/design@\d+\.\d+\.\d+`/g,
  /first LAUNCH was\s+\*\*1\.1\.0\*\*/gi,
  /first LAUNCH\s+\*\*v?1\.1\.0\*\*/gi,
  /LAUNCH đầu tiên là\s+\*\*1\.1\.0\*\*/gi,
  // Install commands immediately under a dated Patch/LAUNCH heading block (fenced)
  /```bash\nnpm install @cyberskill\/design@\d+\.\d+\.\d+\n```/g,
];

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function write(rel, text) {
  writeFileSync(join(root, rel), text);
}

function stampJsonField(rel, pathKeys, label = pathKeys.join(".")) {
  if (!existsSync(join(root, rel))) return;
  const raw = read(rel);
  const obj = JSON.parse(raw);
  let cur = obj;
  for (let i = 0; i < pathKeys.length - 1; i++) {
    if (cur == null || typeof cur !== "object") return;
    cur = cur[pathKeys[i]];
  }
  const key = pathKeys[pathKeys.length - 1];
  const before = cur?.[key];
  if (before === version) return;
  changes.push(`${rel}: ${label} ${before} -> ${version}`);
  if (!apply) return;
  if (pathKeys.length === 1) {
    write(rel, raw.replace(new RegExp(`("${key}"\\s*:\\s*")[^"]*(")`), `$1${version}$2`));
    return;
  }
  // Nested $meta.version (and similar): replace the first "version" under that object block.
  if (pathKeys.length === 2 && pathKeys[0] === "$meta" && pathKeys[1] === "version") {
    write(rel, raw.replace(/("\$meta"\s*:\s*\{[^]*?"version"\s*:\s*")[^"]*(")/, `$1${version}$2`));
    return;
  }
  cur[key] = version;
  write(rel, JSON.stringify(obj, null, 2) + "\n");
}

function stampPackageJson() {
  const rel = "package.json";
  const raw = read(rel);
  const pkg = JSON.parse(raw);
  if (pkg.version === version) return;
  changes.push(`${rel}: version ${pkg.version} -> ${version}`);
  if (apply) write(rel, raw.replace(/("version"\s*:\s*")[^"]*(")/, `$1${version}$2`));
}

function stampPackageLock() {
  const rel = "package-lock.json";
  if (!existsSync(join(root, rel))) return;
  const raw = read(rel);
  const lock = JSON.parse(raw);
  const beforeRoot = lock.version;
  const beforePkg = lock.packages?.[""]?.version;
  if (beforeRoot === version && beforePkg === version) return;
  changes.push(`${rel}: version ${beforeRoot}/${beforePkg} -> ${version}`);
  if (!apply) return;
  lock.version = version;
  if (lock.packages && lock.packages[""]) lock.packages[""].version = version;
  write(rel, JSON.stringify(lock, null, 2) + "\n");
}

function stampTokensJs() {
  const rel = "tokens/tokens.js";
  if (!existsSync(join(root, rel))) return;
  let raw = read(rel);
  const meta = raw.match(/"version"\s*:\s*"([^"]+)"/);
  const header = raw.match(/\(v([^)]+)\)/);
  const before = meta?.[1];
  if (before === version && (!header || header[1] === version)) return;
  changes.push(`${rel}: $meta/header ${before} -> ${version}`);
  if (!apply) return;
  raw = raw.replace(/\(v[\d.]+\)/, `(v${version})`);
  raw = raw.replace(/("version"\s*:\s*")[^"]*(")/, `$1${version}$2`);
  write(rel, raw);
}

function stampCsMjs() {
  const rel = "_esm/cs.mjs";
  if (!existsSync(join(root, rel))) return;
  let raw = read(rel);
  const exp = raw.match(/export\s+const\s+VERSION\s*=\s*["']([^"']+)["']/);
  const before = exp?.[1];
  if (before === version && raw.includes(`at v${version}`)) return;
  changes.push(`${rel}: VERSION ${before} -> ${version}`);
  if (!apply) return;
  raw = raw.replace(/at v[\d.]+/, `at v${version}`);
  raw = raw.replace(/export\s+const\s+VERSION\s*=\s*["'][^"']+["']/, `export const VERSION = "${version}"`);
  write(rel, raw);
}

function stampTextReplace(rel, patterns) {
  // patterns: [{ re, to }] where `to` may use $version
  if (!existsSync(join(root, rel))) return;
  let raw = read(rel);
  const before = raw;
  for (const { re, to } of patterns) {
    raw = raw.replace(re, to.replaceAll("$version", version));
  }
  if (raw === before) return;
  changes.push(`${rel}: consumer pin -> ${version}`);
  if (apply) write(rel, raw);
}

function stampDesignMd() {
  const rel = "DESIGN.md";
  if (!existsSync(join(root, rel))) return;
  const raw = read(rel);
  const m = raw.match(/^version:\s*"?([\d.]+)"?\s*$/m);
  if (m && m[1] === version) return;
  changes.push(`${rel}: front-matter ${m?.[1] || "?"} -> ${version}`);
  if (!apply) return;
  execSync("node scripts/generate-design-md.mjs", { cwd: root, stdio: "inherit" });
}

function stampNpmHello() {
  const oldFromPkg = (() => {
    try { return JSON.parse(read("examples/npm-hello/package.json")).dependencies?.["@cyberskill/design"]; }
    catch { return null; }
  })();
  // dependency pin only — leave the example package's own version (0.0.0) alone
  if (existsSync(join(root, "examples/npm-hello/package.json"))) {
    const raw = read("examples/npm-hello/package.json");
    const dep = JSON.parse(raw).dependencies?.["@cyberskill/design"];
    if (dep && dep !== version) {
      changes.push(`examples/npm-hello/package.json: @cyberskill/design ${dep} -> ${version}`);
      if (apply) {
        write(
          "examples/npm-hello/package.json",
          raw.replace(/("@cyberskill\/design"\s*:\s*")[^"]*(")/, `$1${version}$2`)
            .replace(/@cyberskill\/design@[\d.]+/g, `@cyberskill/design@${version}`),
        );
      }
    }
  }
  const pin = oldFromPkg && oldFromPkg !== version ? oldFromPkg : null;
  const pinRe = pin
    ? new RegExp(pin.replace(/\./g, "\\."), "g")
    : /@cyberskill\/design@\d+\.\d+\.\d+/g;
  if (pin) {
    stampTextReplace("examples/npm-hello/index.html", [
      { re: pinRe, to: version },
      { re: /@cyberskill\/design@\d+\.\d+\.\d+/g, to: `@cyberskill/design@${version}` },
    ]);
    stampTextReplace("examples/npm-hello/README.md", [
      { re: pinRe, to: version },
      { re: /@cyberskill\/design@\d+\.\d+\.\d+/g, to: `@cyberskill/design@${version}` },
    ]);
  } else {
    stampTextReplace("examples/npm-hello/index.html", [
      { re: /@cyberskill\/design@\d+\.\d+\.\d+/g, to: `@cyberskill/design@${version}` },
    ]);
    stampTextReplace("examples/npm-hello/README.md", [
      { re: /@cyberskill\/design@\d+\.\d+\.\d+/g, to: `@cyberskill/design@${version}` },
    ]);
  }
}

function protectHistorical(raw) {
  const slots = [];
  let out = raw;
  for (const re of HISTORICAL_OK) {
    re.lastIndex = 0;
    out = out.replace(re, (m) => {
      const i = slots.length;
      slots.push(m);
      return `\u0000HIST${i}\u0000`;
    });
  }
  return {
    text: out,
    restore(stamped) {
      return stamped.replace(/\u0000HIST(\d+)\u0000/g, (_, n) => slots[Number(n)] ?? "");
    },
  };
}

/** Prose / MDX / audit fallback pins that must track VERSION (FIND-027 / FIND-116). */
function stampProseFile(rel, { allowPackageAt = false } = {}) {
  if (!existsSync(join(root, rel))) return;
  const before = read(rel);
  const { text: protectedText, restore } = protectHistorical(before);
  let raw = protectedText;

  // Current-pin prose shapes only — never rewrite dated LAUNCH/Patch history.
  raw = raw.replace(/current\s+\*\*v?\d+\.\d+\.\d+\*\*/gi, `current **v${version}**`);
  raw = raw.replace(/[Cc]urrent pin is\s+\*\*\d+\.\d+\.\d+\*\*/g, `Current pin is **${version}**`);
  raw = raw.replace(/VERSION is\s+\*\*\d+\.\d+\.\d+\*\*/g, `VERSION is **${version}**`);
  raw = raw.replace(/VERSION\s+\*\*\d+\.\d+\.\d+\*\*/g, `VERSION **${version}**`);
  raw = raw.replace(/live at\s+\*\*\d+\.\d+\.\d+\*\*/gi, `live at **${version}**`);
  raw = raw.replace(/· VERSION \d+\.\d+\.\d+/g, `· VERSION ${version}`);
  raw = raw.replace(/\[VERSION\]\(VERSION\):\s*pinned\s+\d+\.\d+\.\d+/g, `[VERSION](VERSION): pinned ${version}`);
  raw = raw.replace(/sweep at VERSION \d+\.\d+\.\d+/gi, `sweep at VERSION ${version}`);
  raw = raw.replace(/let ver=['"]\d+\.\d+\.\d+['"]/g, `let ver='${version}'`);
  // npm package pin in entrance / consumer guidance (historical LAUNCH lines are protected)
  raw = raw.replace(
    /npm package \*\*`@cyberskill\/design@\d+\.\d+\.\d+`\*\*/g,
    `npm package **\`@cyberskill/design@${version}\`**`,
  );
  raw = raw.replace(
    /includes `@cyberskill\/design@\d+\.\d+\.\d+`/g,
    `includes \`@cyberskill/design@${version}\``,
  );
  raw = raw.replace(
    /— `@cyberskill\/design@\d+\.\d+\.\d+` legacy entry/g,
    `— \`@cyberskill/design@${version}\` legacy entry`,
  );

  if (allowPackageAt) {
    raw = raw.replace(/@cyberskill\/design@\d+\.\d+\.\d+/g, `@cyberskill/design@${version}`);
  }

  raw = restore(raw);
  if (raw === before) return;
  changes.push(`${rel}: prose pin -> ${version}`);
  if (apply) write(rel, raw);
}

function listMd(dirRel) {
  const dir = join(root, dirRel);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => join(dirRel, f).split("\\").join("/"));
}

function walkMdx(dirRel, out = []) {
  const dir = join(root, dirRel);
  if (!existsSync(dir)) return out;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith(".")) continue;
    const rel = `${dirRel}/${ent.name}`;
    if (ent.isDirectory()) walkMdx(rel, out);
    else if (ent.name.endsWith(".mdx")) out.push(rel.split("\\").join("/"));
  }
  return out;
}

function stampProseSurfaces() {
  // Entrance docs (agent / human front doors) — may rewrite remaining @package pins
  for (const rel of ["README.md", "SKILL.md", "llms.txt"]) {
    stampProseFile(rel, { allowPackageAt: true });
  }

  // Operator docs (EN + VI) — current-pin shapes only; LAUNCH history protected
  for (const rel of [...listMd("docs"), ...listMd("docs/vi")]) {
    stampProseFile(rel);
  }

  // Storybook product-site MDX — current pin only
  for (const rel of walkMdx("stories")) stampProseFile(rel);

  // Audit board fallback when VERSION fetch fails
  stampProseFile("_audit/run.html");

  // Seed meta (machine; not CSS packs)
  stampJsonField("tokens/element-seeds.json", ["$meta", "version"], "$meta.version");
}

// --- run ---------------------------------------------------------------------
stampPackageJson();
stampPackageLock();
stampJsonField("tokens/tokens.json", ["$meta", "version"], "$meta.version");
stampTokensJs();
// DTCG nested extension
(() => {
  const rel = "tokens/tokens.dtcg.json";
  if (!existsSync(join(root, rel))) return;
  const raw = read(rel);
  const obj = JSON.parse(raw);
  const before = obj?.$extensions?.["com.cyberskill"]?.version;
  if (before === version) return;
  changes.push(`${rel}: $extensions.version ${before} -> ${version}`);
  if (!apply) return;
  write(rel, raw.replace(
    /("com\.cyberskill"\s*:\s*\{[^]*?"version"\s*:\s*")[^"]*(")/,
    `$1${version}$2`,
  ));
})();
(() => {
  const rel = "tokens/provenance.json";
  if (!existsSync(join(root, rel))) return;
  const raw = read(rel);
  const obj = JSON.parse(raw);
  const needRelease = obj.release !== version;
  const needStamp = obj.dtcgStamp?.version !== version;
  if (!needRelease && !needStamp) return;
  changes.push(`${rel}: release/dtcgStamp ${obj.release}/${obj.dtcgStamp?.version} -> ${version}`);
  if (!apply) return;
  let out = raw;
  out = out.replace(/("release"\s*:\s*")[^"]*(")/, `$1${version}$2`);
  out = out.replace(/("dtcgStamp"\s*:\s*\{[^]*?"version"\s*:\s*")[^"]*(")/, `$1${version}$2`);
  write(rel, out);
})();
stampCsMjs();
stampDesignMd();
stampNpmHello();
stampProseSurfaces();

if (!changes.length) {
  console.log(`stamp: all targets already at ${version}`);
  process.exit(0);
}
console.log(apply ? `stamp: applied ${changes.length} change(s) -> ${version}` : `stamp: ${changes.length} drift(s) vs ${version}`);
for (const c of changes) console.log(`  ${c}`);
if (!apply && exitCode) process.exit(10);
process.exit(0);
