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
 *
 * Soft-skip (exit 0) is only for expected no-ops: missing_secrets, already-published
 * (EPUBLISHCONFLICT), and similar fork/auth-unavailable cases (ENEEDAUTH / 404 / 402).
 * Real denials after a publish attempt — 403 and EOTP — fail the job (non-zero).
 * A successful publish is followed by `npm view <name>@<version>` presence check.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REPORT = join(root, '_audit/ci/npm-publish-report.json');
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

/**
 * Classify npm publish stderr/stdout (or Error) after a publish attempt.
 * @returns {{ kind: 'soft_skip' | 'hard_fail' | 'unknown', reason: string }}
 */
export function classifyNpmPublishError(err) {
  const msg = String(err?.message || err || '');

  // Hard fail: attempted publish was denied (FIND-020).
  if (/EOTP/i.test(msg) || /one-time password/i.test(msg)) {
    return { kind: 'hard_fail', reason: 'eotp' };
  }
  if (/\b403\b/.test(msg)) {
    return { kind: 'hard_fail', reason: 'forbidden_403' };
  }

  // Soft-skip: expected no-ops (already published, fork/auth unavailable).
  if (/EPUBLISHCONFLICT/i.test(msg) || /cannot publish over/i.test(msg)) {
    return { kind: 'soft_skip', reason: 'already_published' };
  }
  if (/ENEEDAUTH/i.test(msg) || /need auth/i.test(msg)) {
    return { kind: 'soft_skip', reason: 'need_auth' };
  }
  if (/404.*Not found/i.test(msg)) {
    return { kind: 'soft_skip', reason: 'not_found_404' };
  }
  if (/\b402\b/.test(msg)) {
    return { kind: 'soft_skip', reason: 'payment_402' };
  }

  return { kind: 'unknown', reason: 'unknown' };
}

/** True only for expected no-ops (not 403 / EOTP). */
export function isSoftSkippableNpmError(err) {
  return classifyNpmPublishError(err).kind === 'soft_skip';
}

export function preferOidcPublish(env = process.env) {
  // GitHub Actions + no explicit token → rely on Trusted Publishing / OIDC.
  return Boolean(env.GITHUB_ACTIONS) && !(env.NPM_TOKEN || '').trim();
}

/**
 * Post-publish registry presence check. Fails if the version is not visible.
 * @param {{ name: string, version: string, cwd?: string, env?: NodeJS.ProcessEnv, spawn?: typeof spawnSync }} opts
 */
export function assertRegistryPresence(opts) {
  const {
    name,
    version,
    cwd = root,
    env = process.env,
    spawn = spawnSync,
  } = opts;
  const spec = `${name}@${version}`;
  const view = spawn('npm', ['view', spec, 'version', '--json'], {
    cwd,
    encoding: 'utf8',
    env,
    shell: process.platform === 'win32',
  });
  const combined = `${view.stdout || ''}\n${view.stderr || ''}`;
  if (view.status !== 0) {
    throw new Error(`post-publish registry check failed for ${spec}: ${combined.slice(0, 800)}`);
  }
  let reported;
  try {
    reported = JSON.parse((view.stdout || '').trim());
  } catch {
    reported = (view.stdout || '').trim().replace(/^"|"$/g, '');
  }
  if (String(reported) !== String(version)) {
    throw new Error(
      `post-publish registry check: expected ${spec} but npm view reported ${JSON.stringify(reported)}`,
    );
  }
  return { ok: true, name, version, spec };
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

function hardFail(reason, detail, extra = {}) {
  console.error('');
  console.error(`FAIL — npm publish (${reason}).`);
  if (detail) console.error(detail);
  writeReport({ skipped: false, ok: false, reason, message: detail || reason, ...extra });
  process.exit(1);
}

function main() {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const rootVersion = readFileSync(join(root, 'VERSION'), 'utf8').trim();
  if (pkg.version !== rootVersion) {
    throw new Error(`VERSION stamp drift: package.json ${pkg.version} ≠ VERSION ${rootVersion}`);
  }
  if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) {
    throw new Error(`VERSION must be semver X.Y.Z (got ${pkg.version})`);
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
  // Token env is legacy-only and will fail under "disallow tokens"; 403/EOTP fail closed.
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
  const auth = oidc ? 'oidc' : 'token';
  if (pub.status !== 0) {
    const classified = classifyNpmPublishError(combined);
    if (classified.kind === 'soft_skip') {
      softSkip(classified.reason, combined.slice(0, 800));
    }
    if (classified.kind === 'hard_fail') {
      hardFail(classified.reason, combined.slice(0, 800), { auth });
    }
    console.error(combined);
    writeReport({ skipped: false, ok: false, message: combined.slice(0, 800), auth });
    process.exit(pub.status || 1);
  }
  console.log(pub.stdout);

  try {
    const presence = assertRegistryPresence({
      name: pkg.name,
      version: pkg.version,
      cwd: root,
      env,
    });
    console.log(`Registry presence OK — ${presence.spec}`);
  } catch (e) {
    hardFail('registry_presence', String(e.message || e), { auth, published: true });
  }

  writeReport({
    skipped: false,
    ok: true,
    published: true,
    registryVerified: true,
    name: pkg.name,
    version: pkg.version,
    auth,
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
