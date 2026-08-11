#!/usr/bin/env node
/**
 * Crawl required published docs for broken in-repo links and retired paths.
 * External https:// URLs are not fetched (warn-only skipped).
 * Also scans unpublished MDX href=/src= (git tree). Live HTML twin
 * (_audit/docs-link-check.html) scans published markdown + viewer only — never stories/.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const RETIRED = [
  /status\.html(?![-\w])/i,
  /status-legacy\.html/i,
  /guidelines\/identity-lab/i,
  /identity-lab\.html/i,
];

const catalog = JSON.parse(read('_audit/docs-catalog.json'));
const required = [
  ...catalog.entrance.map((p) => p.path),
  ...catalog.pages.map((p) => p.path),
  ...catalog.pages.filter((p) => p.mdx).map((p) => p.mdx),
  ...catalog.curated.filter((p) => p.mdx).map((p) => p.mdx),
];

const LINK_RE = /\[([^\]]*)\]\(([^)\s]+)\)/g;
const MDX_HREF = /(?:href|src)=["']([^"']+)["']/g;

const problems = [];
const skippedExternal = [];

function resolveRepo(fromRel, href) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return { skip: 'hash-only' };
  if (/[<>{}]|^(?:\.\.\.|xxx|TODO)/i.test(clean)) return { skip: 'placeholder' };
  if (/^(https?:|mailto:|data:)/i.test(clean)) return { skip: 'external' };
  if (clean.startsWith('/')) {
    const abs = join(root, clean.replace(/^\/+/, ''));
    return { target: abs, rel: clean.replace(/^\/+/, '') };
  }
  const fromDir = dirname(join(root, fromRel));
  const target = resolve(fromDir, clean);
  const rel = normalize(target.slice(root.length + 1));
  return { target, rel };
}

function existsTarget(target) {
  if (!existsSync(target)) return false;
  try {
    const st = statSync(target);
    return st.isFile() || st.isDirectory();
  } catch {
    return false;
  }
}

function scan(rel) {
  if (!existsSync(join(root, rel))) {
    problems.push(`${rel}: file missing`);
    return;
  }
  const text = read(rel);
  for (const re of RETIRED) {
    re.lastIndex = 0;
    if (re.test(text) && /\]\([^)]*\)|href=|src=/.test(text)) {
      const hrefHit = new RegExp(String.raw`(?:\]\(|href=["']|src=["'])[^)"']*${re.source}`, 'i');
      if (hrefHit.test(text)) problems.push(`${rel}: retired live href matching ${re}`);
    }
  }
  const patterns = rel.endsWith('.mdx') || rel.endsWith('.jsx') ? [LINK_RE, MDX_HREF] : [LINK_RE];
  for (const re of patterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      const href = m[m.length - 1];
      const resolved = resolveRepo(rel, href);
      if (resolved.skip === 'external') {
        skippedExternal.push(`${rel} → ${href}`);
        continue;
      }
      if (resolved.skip) continue;
      if (!existsTarget(resolved.target)) {
        problems.push(`${rel}: broken link ${href} → ${resolved.rel}`);
      }
    }
  }
}

for (const rel of required) scan(rel);

const viewer = read('docs/viewer.html');
for (const re of RETIRED) {
  re.lastIndex = 0;
  if (re.test(viewer)) problems.push(`docs/viewer.html: retired path ${re}`);
}

assert(problems.length === 0, problems.slice(0, 20).join('\n') + (problems.length > 20 ? `\n… +${problems.length - 20} more` : ''));

console.log('PASS test-docs-link-check', {
  scanned: required.length,
  skippedExternal: skippedExternal.length,
});
