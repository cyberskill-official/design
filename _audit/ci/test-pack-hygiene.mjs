#!/usr/bin/env node
/**
 * FIND-064 — published tarball must not ship internal backlog / status seeds.
 * npm 11: `.npmignore` does not subtract from `package.json` `files`, so the
 * public docs grant must be an explicit glob (`docs/*.md` + `docs/vi/`).
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const FORBIDDEN_PREFIXES = [
  'docs/tasks/',
  'docs/audits/',
  'docs/plans/',
  'docs/status/',
  'docs/decisions/',
  'package/docs/tasks/',
  'package/docs/audits/',
  'package/docs/plans/',
  'package/docs/status/',
  'package/docs/decisions/',
];

const REQUIRED_SUBSTRINGS = [
  'THIRD-PARTY-NOTICES.md',
  'fonts/',
  '_vendor/',
  'docs/consuming.md',
  'docs/conventions.md',
];

function main() {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  if (pkg.license !== 'UNLICENSED') {
    throw new Error(`license must stay UNLICENSED (got ${pkg.license})`);
  }
  if (!pkg.files?.includes('THIRD-PARTY-NOTICES.md')) {
    throw new Error('package.json files[] must include THIRD-PARTY-NOTICES.md');
  }
  if (pkg.files?.includes('docs/') || pkg.files?.includes('docs')) {
    throw new Error(
      'package.json files[] must not grant whole docs/ (FIND-064) — use docs/*.md + docs/vi/',
    );
  }
  if (!pkg.files?.includes('docs/*.md')) {
    throw new Error('package.json files[] must include docs/*.md');
  }
  if (!existsSync(join(root, 'THIRD-PARTY-NOTICES.md'))) {
    throw new Error('THIRD-PARTY-NOTICES.md missing at repo root');
  }

  const pack = spawnSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: root,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    maxBuffer: 32 * 1024 * 1024,
  });
  if (pack.status !== 0) {
    console.error(pack.stderr || pack.stdout);
    throw new Error('npm pack --dry-run failed');
  }
  let files = [];
  try {
    const parsed = JSON.parse(pack.stdout || '[]');
    const entry = Array.isArray(parsed) ? parsed[0] : parsed;
    files = (entry?.files || []).map((f) => (typeof f === 'string' ? f : f.path));
  } catch (e) {
    throw new Error(`could not parse npm pack --json: ${e.message || e}`);
  }
  if (!files.length) throw new Error('npm pack --dry-run returned no files');

  const bad = files.filter((f) =>
    FORBIDDEN_PREFIXES.some((p) => String(f).startsWith(p) || String(f).includes('/' + p)),
  );
  if (bad.length) {
    console.error('FAIL test-pack-hygiene — internal paths in tarball:');
    for (const f of bad.slice(0, 40)) console.error('  ✗ ' + f);
    process.exit(1);
  }

  for (const need of REQUIRED_SUBSTRINGS) {
    const ok = files.some((f) => String(f) === need || String(f).endsWith('/' + need) || String(f).includes(need));
    if (!ok) throw new Error(`tarball missing required path: ${need}`);
  }

  console.log(
    `PASS test-pack-hygiene { files: ${files.length}, forbidden: 0, license: UNLICENSED }`,
  );
}

try {
  main();
} catch (e) {
  console.error('FAIL test-pack-hygiene:', e.message || e);
  process.exit(1);
}
