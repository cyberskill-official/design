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
 * Soft-skip (exit 0) is only for expected no-ops: already_published (EPUBLISHCONFLICT)
 * and true non-GHA missing_secrets. On GHA tag / workflow_dispatch, ENEEDAUTH / 404 /
 * 402 are hard_fail (same as 403 / EOTP). A successful publish is followed by
 * `npm view <name>@<version>` plus `dist-tags.latest === VERSION` (FIND-094).
 */
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { recordCiVerdict } from './ci-verdict.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REPORT = join(root, '_audit/ci/npm-publish-report.json');
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

/**
 * True when this script is running the canonical release publish path:
 * GitHub Actions on workflow_dispatch or a version tag push (npm-publish.yml).
 * @param {NodeJS.ProcessEnv} [env]
 */
export function isGhaReleasePublish(env = process.env) {
  if (!env.GITHUB_ACTIONS) return false;
  const event = env.GITHUB_EVENT_NAME || '';
  if (event === 'workflow_dispatch') return true;
  if (event === 'push' && String(env.GITHUB_REF || '').startsWith('refs/tags/')) return true;
  return false;
}

/**
 * Classify npm publish stderr/stdout (or Error) after a publish attempt.
 * @param {unknown} err
 * @param {{ ghaRelease?: boolean, env?: NodeJS.ProcessEnv }} [opts]
 * @returns {{ kind: 'soft_skip' | 'hard_fail' | 'unknown', reason: string }}
 */
export function classifyNpmPublishError(err, opts = {}) {
  const msg = String(err?.message || err || '');
  const ghaRelease = opts.ghaRelease ?? isGhaReleasePublish(opts.env || process.env);

  // Hard fail: attempted publish was denied (FIND-020).
  if (/EOTP/i.test(msg) || /one-time password/i.test(msg)) {
    return { kind: 'hard_fail', reason: 'eotp' };
  }
  if (/\b403\b/.test(msg)) {
    return { kind: 'hard_fail', reason: 'forbidden_403' };
  }

  // Soft-skip only for already-published (always). Auth/404/402 soft-skip off GHA only.
  if (/EPUBLISHCONFLICT/i.test(msg) || /cannot publish over/i.test(msg)) {
    return { kind: 'soft_skip', reason: 'already_published' };
  }
  if (/ENEEDAUTH/i.test(msg) || /need auth/i.test(msg)) {
    return ghaRelease
      ? { kind: 'hard_fail', reason: 'need_auth' }
      : { kind: 'soft_skip', reason: 'need_auth' };
  }
  if (/404.*Not found/i.test(msg)) {
    return ghaRelease
      ? { kind: 'hard_fail', reason: 'not_found_404' }
      : { kind: 'soft_skip', reason: 'not_found_404' };
  }
  if (/\b402\b/.test(msg)) {
    return ghaRelease
      ? { kind: 'hard_fail', reason: 'payment_402' }
      : { kind: 'soft_skip', reason: 'payment_402' };
  }

  return { kind: 'unknown', reason: 'unknown' };
}

/** True only for expected no-ops (not 403 / EOTP; not GHA auth/404/402). */
export function isSoftSkippableNpmError(err, opts = {}) {
  return classifyNpmPublishError(err, opts).kind === 'soft_skip';
}

export function preferOidcPublish(env = process.env) {
  // GitHub Actions + no explicit token → rely on Trusted Publishing / OIDC.
  return Boolean(env.GITHUB_ACTIONS) && !(env.NPM_TOKEN || '').trim();
}


/**
 * Prefer the last N characters of npm output — prepublishOnly floods the head
 * and used to hide the real ERR! line from reports (FIND-088 debug).
 * @param {string} text
 * @param {number} [max]
 */
export function npmErrorSnippet(text, max = 1200) {
  const s = String(text || '');
  if (s.length <= max) return s;
  return s.slice(-max);
}

/**
 * setup-node registry-url writes `_authToken=${NODE_AUTH_TOKEN}` + always-auth.
 * An empty/missing token counts as "auth configured" and blocks Trusted Publishing
 * OIDC exchange, which npm surfaces as 404 Not Found on PUT.
 * @param {NodeJS.ProcessEnv} env
 * @returns {{ env: NodeJS.ProcessEnv, userconfig: string | null }}
 */
export function oidcPublishEnv(env = process.env) {
  const next = { ...env };
  delete next.NODE_AUTH_TOKEN;
  delete next.NPM_TOKEN;
  // Avoid inheriting a tokenized userconfig from actions/setup-node.
  delete next.NPM_CONFIG_USERCONFIG;
  delete next.npm_config_userconfig;
  const dir = mkdtempSync(join(tmpdir(), 'cs-npm-oidc-'));
  const userconfig = join(dir, '.npmrc');
  writeFileSync(
    userconfig,
    [
      'registry=https://registry.npmjs.org/',
      // Explicitly no _authToken / always-auth — OIDC trusted publishing only.
      '',
    ].join('\n'),
  );
  next.NPM_CONFIG_USERCONFIG = userconfig;
  return { env: next, userconfig };
}


function parseNpmJsonStdout(stdout) {
  const trimmed = (stdout || '').trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed.replace(/^"|"$/g, '');
  }
}

/**
 * Post-publish registry presence check. Fails if the version is not visible
 * or if dist-tags.latest is not the published VERSION (FIND-094).
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
  const reported = parseNpmJsonStdout(view.stdout);
  if (String(reported) !== String(version)) {
    throw new Error(
      `post-publish registry check: expected ${spec} but npm view reported ${JSON.stringify(reported)}`,
    );
  }

  const latestView = spawn('npm', ['view', name, 'dist-tags.latest', '--json'], {
    cwd,
    encoding: 'utf8',
    env,
    shell: process.platform === 'win32',
  });
  const latestCombined = `${latestView.stdout || ''}\n${latestView.stderr || ''}`;
  if (latestView.status !== 0) {
    throw new Error(
      `post-publish dist-tags.latest check failed for ${name}: ${latestCombined.slice(0, 800)}`,
    );
  }
  const latest = parseNpmJsonStdout(latestView.stdout);
  if (String(latest) !== String(version)) {
    throw new Error(
      `post-publish dist-tags.latest check: expected ${version} but npm view reported ${JSON.stringify(latest)}`,
    );
  }

  return { ok: true, name, version, spec, latest: String(latest) };
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
  console.error('CI: Trusted Publisher must bind cyberskill-official/design + workflow npm-publish.yml (FIND-088). Package disallows classic tokens — local interactive: npm publish --otp. See docs/release-runbook.md.');
  writeReport({ skipped: true, reason, message: detail || reason, channel: 'npm-publish' });
  recordCiVerdict({ channel: 'npm-publish', kind: 'soft_skip', reason, detail });
  process.exit(0);
}

function hardFail(reason, detail, extra = {}) {
  console.error('');
  console.error(`FAIL — npm publish (${reason}).`);
  if (detail) console.error(detail);
  if (reason === 'not_found_404' || reason === 'need_auth') {
    console.error('Remediation (FIND-088): on npmjs.com → @cyberskill/design → Trusted Publishers, set GitHub org/repo cyberskill-official/design and workflow filename npm-publish.yml (no GitHub Environment unless the job sets environment:). Re-run the tag workflow after saving. Do not set NPM_TOKEN / NODE_AUTH_TOKEN.');
  }
  writeReport({ skipped: false, ok: false, reason, message: detail || reason, channel: 'npm-publish', ...extra });
  recordCiVerdict({ channel: 'npm-publish', kind: 'hard_fail', reason, detail });
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

  // Consumer-safe tarball intent: styles, tokens, components, templates, public docs.
  // `_vendor/` ships for legacy browser React/Babel (FIND-111).
  // FIND-064 — docs grant is `docs/*.md` + `docs/vi/` + viewer (not whole `docs/` backlog).
  const required = [
    'styles.css',
    '_esm/',
    'tokens/',
    '_ds_bundle.js',
    'components/',
    '_vendor/',
    'THIRD-PARTY-NOTICES.md',
  ];
  const docsGrant =
    pkg.files?.includes('docs/*.md') ||
    pkg.files?.includes('docs/') ||
    pkg.files?.includes('docs');
  if (!docsGrant) {
    throw new Error('package.json files[] missing public docs grant (docs/*.md or docs/)');
  }
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
    writeReport({
      skipped: false,
      ok: true,
      dryRun: true,
      name: pkg.name,
      version: pkg.version,
      channel: 'npm-publish',
    });
    recordCiVerdict({
      channel: 'npm-publish',
      kind: 'dry_run',
      detail: `${pkg.name}@${pkg.version}`,
    });
    return;
  }

  const token = (process.env.NPM_TOKEN || '').trim();
  const oidc = preferOidcPublish(process.env);
  const ghaRelease = isGhaReleasePublish(process.env);

  if (!oidc && !token) {
    // Soft-skip missing_secrets only off GHA (local). On release workflow → hard fail.
    if (ghaRelease) {
      hardFail(
        'missing_secrets',
        'GitHub Actions release publish requires OIDC Trusted Publishing (no classic NPM_TOKEN).',
      );
    }
    softSkip('missing_secrets', 'Not on GitHub Actions OIDC — no publish attempted (package disallows classic tokens).');
  }

  // For OIDC: strip setup-node tokenized userconfig + NODE_AUTH_TOKEN so the CLI
  // can exchange the GitHub OIDC token (empty _authToken otherwise → 404).
  // Token env is legacy-only and will fail under "disallow tokens"; 403/EOTP fail closed.
  let env;
  if (oidc) {
    ({ env } = oidcPublishEnv(process.env));
    console.log('Auth mode: Trusted Publishing (OIDC) — no NPM_TOKEN (clean userconfig)');
  } else {
    env = { ...process.env };
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
  const snippet = npmErrorSnippet(combined);
  const auth = oidc ? 'oidc' : 'token';
  if (pub.status !== 0) {
    const classified = classifyNpmPublishError(combined, { ghaRelease, env: process.env });
    if (classified.kind === 'soft_skip') {
      softSkip(classified.reason, snippet);
    }
    if (classified.kind === 'hard_fail') {
      hardFail(classified.reason, snippet, { auth });
    }
    console.error(combined);
    writeReport({ skipped: false, ok: false, message: snippet, auth });
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
    console.log(`Registry presence OK — ${presence.spec} · dist-tags.latest=${presence.latest}`);
  } catch (e) {
    hardFail('registry_presence', String(e.message || e), { auth, published: true });
  }

  writeReport({
    skipped: false,
    ok: true,
    published: true,
    registryVerified: true,
    latestVerified: true,
    name: pkg.name,
    version: pkg.version,
    auth,
    channel: 'npm-publish',
  });
  recordCiVerdict({
    channel: 'npm-publish',
    kind: 'success',
    detail: `PUBLISHED ${pkg.name}@${pkg.version}`,
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
