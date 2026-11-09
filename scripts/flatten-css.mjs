#!/usr/bin/env node
/** Flatten styles.css @import chain → dist/styles.css (unminified concatenation with section banners). */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = readFileSync(join(ROOT, 'VERSION'), 'utf8').trim();
const outPath = join(ROOT, 'dist', 'styles.css');
const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

const HEADER = `/* CyberSkill Design System v${VERSION} — flattened build of ../styles.css (same closure, same order, no @import chain).
 * Link THIS file from cards, kits and templates; keep editing the modular sources under tokens/ and base/ and
 * regenerate this file after any change. url() paths are already relative to dist/ (../fonts, ../assets). */

`;

function buildFlattened() {
  const entry = readFileSync(join(ROOT, 'styles.css'), 'utf8');
  const imports = [...entry.matchAll(/@import\s+(?:url\()?["']([^"']+)["']\)?\s*;/g)].map((m) => m[1]);
  if (!imports.length) {
    throw new Error('flatten-css: no @import rules found in styles.css');
  }
  const sections = imports.map((relPath) => {
    const content = readFileSync(join(ROOT, relPath), 'utf8');
    if (/@import\b/.test(content)) {
      throw new Error(`flatten-css: nested @import in ${relPath}`);
    }
    return `/* ===== ${relPath} ===== */\n${content.trimEnd()}\n`;
  });
  return HEADER + sections.join('\n');
}

function main() {
  const next = buildFlattened();
  if (checkOnly) {
    if (!existsSync(outPath)) {
      console.error('FAIL flatten-css --check: dist/styles.css missing. Run: npm run build:css');
      process.exit(1);
    }
    const current = readFileSync(outPath, 'utf8');
    if (current !== next) {
      console.error('FAIL flatten-css --check: dist/styles.css drifted from styles.css + tokens/ + base/. Rebuild: npm run build:css');
      process.exit(1);
    }
    console.log('PASS flatten-css --check (' + Buffer.byteLength(current) + ' bytes)');
    return;
  }
  mkdirSync(join(ROOT, 'dist'), { recursive: true });
  writeFileSync(outPath, next);
  console.log('wrote', outPath, '(' + Buffer.byteLength(next) + ' bytes)');
}

main();
