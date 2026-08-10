#!/usr/bin/env node
/**
 * UX-030 / FIND-074 / FIND-075 — Storybook static freshness.
 *
 * When `storybook-static/` is present, require `.cs-freshness.json` whose
 * `sourceHash` matches the current hash of `stories/` + `.storybook/`.
 *
 * Local checkouts without a static tree may skip (PASS skipped) unless
 * `--require` is passed. CI Storybook job always passes `--require` after
 * `npm run build:storybook` so the gate can fail for real (FIND-075).
 *
 * Write stamp: `node scripts/stamp-storybook-freshness.mjs` (also hooked from
 * `build:storybook` via package.json).
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '../..');
const staticDir = join(root, 'storybook-static');
const stampPath = join(staticDir, '.cs-freshness.json');
const watchDirs = ['stories', '.storybook'];
const args = new Set(process.argv.slice(2));
const requireStatic = args.has('--require');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(jsx?|tsx?|mjs|cjs|mdx?|json|css)$/.test(name)) out.push(full);
  }
  return out;
}

export function hashStorySources(repoRoot = root) {
  const h = createHash('sha256');
  const files = [];
  for (const d of watchDirs) walk(join(repoRoot, d), files);
  files.sort();
  for (const f of files) {
    h.update(relative(repoRoot, f).split('\\').join('/'));
    h.update('\0');
    h.update(readFileSync(f));
    h.update('\0');
  }
  return h.digest('hex').slice(0, 16);
}

const isMain = process.argv[1] && /test-storybook-freshness\.mjs$/.test(process.argv[1]);
if (isMain) {
  if (!existsSync(staticDir)) {
    if (requireStatic) {
      console.error(
        "FAIL test-storybook-freshness: storybook-static absent (--require). Run: npm run build:storybook",
      );
      process.exit(1);
    }
    console.log("PASS test-storybook-freshness { skipped: true, reason: 'storybook-static absent' }");
    process.exit(0);
  }
  if (!existsSync(stampPath)) {
    console.error(
      'FAIL test-storybook-freshness: storybook-static present but .cs-freshness.json missing. Run: npm run build:storybook',
    );
    process.exit(1);
  }
  const stamp = JSON.parse(readFileSync(stampPath, 'utf8'));
  const want = hashStorySources();
  if (stamp.sourceHash !== want) {
    console.error(
      'FAIL test-storybook-freshness: stamp',
      stamp.sourceHash,
      '!= live',
      want,
      '— rebuild storybook-static',
    );
    process.exit(1);
  }
  console.log('PASS test-storybook-freshness { sourceHash:', want, '}');
}
