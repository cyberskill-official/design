#!/usr/bin/env node
/**
 * FIND-078 — `_ds_manifest.json` templates/cards/startingPoints must cover shipped
 * content on disk (external compiler ownership does not excuse silent blind spots).
 *
 * Allowlisted dirs under templates/ are named + commented.
 * email-safe: shipped HTML exemplars gated by test-email-safe.mjs (FIND-126),
 * not DC/manifest templates. _vendor/schema are support, not templates.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '../..');
const manifestPath = join(root, '_ds_manifest.json');

/**
 * Support / separately-gated dirs under templates/ — not required in M.templates.
 * email-safe → `_audit/ci/test-email-safe.mjs` (FIND-126).
 */
const TEMPLATE_DIR_ALLOWLIST = new Set([
  '_vendor',
  'schema',
  'email-safe',
]);

function listDirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => {
      const full = join(dir, name);
      return statSync(full).isDirectory() && !name.startsWith('.');
    })
    .sort();
}

function hasTemplateContent(dir) {
  for (const name of readdirSync(dir)) {
    if (name.endsWith('.dc.html') || (name.endsWith('.html') && name !== 'index.html')) {
      return true;
    }
    // Prefer .dc.html presence; also accept folder with any .html content file
    if (name.endsWith('.html')) return true;
  }
  return false;
}

function walkCardFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkCardFiles(full, out);
    else if (name.endsWith('.card.html')) {
      out.push(relative(root, full).split('\\').join('/'));
    }
  }
  return out;
}

function main() {
  if (!existsSync(manifestPath)) {
    console.error('FAIL check-manifest-coverage: _ds_manifest.json missing');
    process.exit(1);
  }
  const M = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const problems = [];

  const manifestFolders = new Set(
    (M.templates || [])
      .map((t) => String(t.folder || '').replace(/^templates\//, '').replace(/\/$/, ''))
      .filter(Boolean),
  );

  const templatesRoot = join(root, 'templates');
  for (const dir of listDirs(templatesRoot)) {
    if (TEMPLATE_DIR_ALLOWLIST.has(dir)) continue;
    const full = join(templatesRoot, dir);
    if (!hasTemplateContent(full)) continue;
    if (!manifestFolders.has(dir)) {
      problems.push(`templates/${dir} — on disk with HTML content but absent from _ds_manifest.json templates[]`);
    }
  }

  for (const folder of manifestFolders) {
    const full = join(templatesRoot, folder);
    if (!existsSync(full) || !statSync(full).isDirectory()) {
      problems.push(`manifest templates[] folder templates/${folder} — missing on disk`);
    }
  }

  const manifestCards = new Set((M.cards || []).map((c) => String(c.path || '').split('\\').join('/')).filter(Boolean));
  const diskCards = [
    ...walkCardFiles(join(root, 'guidelines')),
    ...walkCardFiles(join(root, 'components')),
    ...walkCardFiles(join(root, 'ui_kits')),
  ];
  for (const path of diskCards) {
    if (!manifestCards.has(path)) {
      problems.push(`${path} — .card.html on disk but absent from _ds_manifest.json cards[]`);
    }
  }
  for (const path of manifestCards) {
    if (!existsSync(join(root, path))) {
      problems.push(`manifest cards[] path ${path} — missing on disk`);
    }
  }

  const startingPoints = M.startingPoints || [];
  for (const sp of startingPoints) {
    const entry = sp.entryPath || sp.path;
    if (!entry) {
      problems.push(`startingPoint ${sp.id || sp.name || '?'} — missing entryPath`);
      continue;
    }
    if (!existsSync(join(root, entry))) {
      problems.push(`startingPoint ${sp.id || sp.name} entryPath ${entry} — missing on disk`);
    }
  }

  if (problems.length) {
    console.error(`FAIL check-manifest-coverage — ${problems.length} issue(s):`);
    for (const p of problems) console.error(`  ✗ ${p}`);
    console.error('Allowlisted template dirs (not required in manifest):', [...TEMPLATE_DIR_ALLOWLIST].join(', '));
    process.exit(1);
  }

  console.log(
    `PASS check-manifest-coverage { templates: ${manifestFolders.size}, cards: ${manifestCards.size}, startingPoints: ${startingPoints.length}, allowlisted: ${[...TEMPLATE_DIR_ALLOWLIST].join(',')} }`,
  );
}

const isMain = process.argv[1] && /check-manifest-coverage\.mjs$/.test(process.argv[1]);
if (isMain) main();

export { TEMPLATE_DIR_ALLOWLIST, main as checkManifestCoverage };
