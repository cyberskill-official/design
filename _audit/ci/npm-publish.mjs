#!/usr/bin/env node
/**
 * npm publish — Trusted Publishing (OIDC) on GitHub Actions.
 *
 * Usage:
 *   node _audit/ci/npm-publish.mjs --dry-run   # pack inventory only (no auth)
 *   node _audit/ci/npm-publish.mjs             # npm publish --access public
 *
 * In GitHub Actions with id-token: write + npm Trusted Publisher configured,
 * the CLI authenticates via OIDC (do not set NODE_AUTH_TOKEN / NPM_TOKEN).
 * Package Publishing access disallows classic tokens; local non-OIDC → soft-skip
 * (interactive maintainer publish uses `npm publish --otp` outside this script).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REPORT = join(root, '_audit/ci/npm-publish-report.json');
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

export function isSoftSkippableNpmError(err) {
  const msg = String(err?.message || err || '');
  return /ENEEDAUTH/i.test(msg)
    || /need auth/i.test(msg)
    || /EOTP/i.test(msg)
    || /one-time password/i.test(msg)
    || /404.*Not found/i.test(msg)
    || /402\b/.test(msg)
    || /403\b/.test(msg)
    || /EPUBLISHCONFLICT/i.test(msg)
    || /cannot publish over/i.test(msg);
}

export function preferOidcPublish(env = process.env) {
  // GitHub Actions + no explicit token → rely on Trusted Publishing / OIDC.
  return Boolean(env.GITHUB_ACTIONS) && !(env.NPM_TOKEN || '').trim();
}

function writeReport(payload) {
  try {
    writeFileSync(REPORT, JSON.stringify({ ...payload, at: new Date().toISOString() }, null, 2) + '\n');
  } catch (_) { /* ignore */ }
}

function softSkip(reason, detail) {
  console.error('');
  console.error(`SOFT SKIP — npm publish (${reason}).`);
  if (detail) console.error(detail);
  console.error('CI: configure npm Trusted Publisher for npm-publish.yml (OIDC). Package disallows classic tokens — local interactive: npm publish --otp. See docs/ci-cd.md.');
  writeReport({ skipped: true, reason, message: detail || reason });
  process.exit(0);
}

function main() {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const rootVersion = readFileSync(join(root, 'VERSION'), 'utf8').trim();
  if (pkg.version !== rootVersion) {
    throw new Error(`VERSION stamp drift: package.json ${pkg.version} ≠ VERSION ${rootVersion}`);
  }
  if (pkg.version !== '1.1.1') {
    throw new Error(`VERSION pin: package.json must stay 1.1.1 until the next owner bump (got ${pkg.version})`);
  }
  if (pkg.private === true) {
    throw new Error('package.json private must be false for the publish path (workflow landed)');
  }
  if (pkg.license !== 'UNLICENSED') {
    console.warn(`license is ${pkg.license} — expected UNLICENSED until an explicit open license is chosen`);
  }

  // Consumer-safe tarball intent: full portable tree (styles, tokens, components, templates, docs).
  const required = ['styles.css', '_esm/', 'tokens/', '_ds_bundle.js', 'components/', 'docs/'];
  for (const f of required) {
    if (!pkg.files?.includes(f) && !pkg.files?.includes(f.replace(/\/$/, ''))) {
      throw new Error(`package.json files[] missing required entry: ${f}`);
    }
    const path = join(root, f.replace(/\/$/, ''));
    if (!existsSync(path)) throw new Error(`missing pack path: ${f}`);
  }

  console.log(`Package ${pkg.name}@${pkg.version} · files ${pkg.files.length} entries · license ${pkg.license}`);

  if (dryRun) {
    const pack = spawnSync('npm', ['pack', '--dry-run'], { cwd: root, encoding: 'utf8', shell: process.platform === 'win32' });
    if (pack.status !== 0) {
      console.error(pack.stderr || pack.stdout);
      writeReport({ skipped: false, ok: false, dryRun: true, message: pack.stderr || pack.stdout });
      process.exit(pack.status || 1);
    }
    console.log(pack.stdout || pack.stderr);
    console.log('Dry-run OK — tarball inventory listed (no publish).');
    writeReport({ skipped: false, ok: true, dryRun: true, name: pkg.name, version: pkg.version });
    return;
  }

  const token = (process.env.NPM_TOKEN || '').trim();
  const oidc = preferOidcPublish(process.env);

  if (!oidc && !token) {
    softSkip('missing_secrets', 'Not on GitHub Actions OIDC — no publish attempted (package disallows classic tokens).');
  }

  // For OIDC: do not inject NODE_AUTH_TOKEN (forces classic auth / EOTP).
  // Token env is legacy-only and will fail under "disallow tokens"; still soft-skip on 403.
  const env = { ...process.env };
  if (oidc) {
    delete env.NODE_AUTH_TOKEN;
    delete env.NPM_TOKEN;
    console.log('Auth mode: Trusted Publishing (OIDC) — no NPM_TOKEN');
  } else {
    env.NODE_AUTH_TOKEN = token;
    env.NPM_TOKEN = token;
    console.log('Auth mode: NPM_TOKEN (likely rejected — package disallows tokens)');
  }

  const pub = spawnSync('npm', ['publish', '--access', 'public'], {
    cwd: root,
    encoding: 'utf8',
    env,
    shell: process.platform === 'win32',
  });
  const combined = `${pub.stdout || ''}\n${pub.stderr || ''}`;
  if (pub.status !== 0) {
    if (isSoftSkippableNpmError(combined)) {
      softSkip('npm_registry_unavailable', combined.slice(0, 800));
    }
    console.error(combined);
    writeReport({ skipped: false, ok: false, message: combined.slice(0, 800), auth: oidc ? 'oidc' : 'token' });
    process.exit(pub.status || 1);
  }
  console.log(pub.stdout);
  writeReport({
    skipped: false,
    ok: true,
    published: true,
    name: pkg.name,
    version: pkg.version,
    auth: oidc ? 'oidc' : 'token',
  });
}

const invoked = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (invoked) {
  try {
    main();
  } catch (e) {
    console.error(e.message || e);
    writeReport({ skipped: false, ok: false, message: String(e.message || e) });
    process.exit(1);
  }
}
