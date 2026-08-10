#!/usr/bin/env node
/**
 * Native sample store packaging dry-run — Decision 1C soft-skip without signing secrets.
 *
 * Usage:
 *   node _audit/ci/native-store-dry-run.mjs --dry-run   # scaffold + metadata only (no secrets)
 *   node _audit/ci/native-store-dry-run.mjs             # same + soft-skip when ASC_* / Play JSON absent
 *
 * Never submits to App Store / Play Store. Samples remain samples until product need.
 */
import { existsSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { recordCiVerdict } from './ci-verdict.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REPORT = join(root, '_audit/ci/native-store-report.json');
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

/** Secrets required for a signed store-bound build (not for submit — submit stays disabled). */
export const ASC_SECRETS = ['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_KEY_P8'];
export const PLAY_SECRETS = ['PLAY_SERVICE_ACCOUNT_JSON'];
/** Optional Android keystore secrets (Compose / Flutter Android release). */
export const ANDROID_KEYSTORE_SECRETS = [
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
];

export function missingSecrets(names, env = process.env) {
  return names.filter((n) => !String(env[n] || '').trim());
}

export function hasAnyKeystoreMaterial(env = process.env) {
  return Boolean(
    String(env.ANDROID_KEYSTORE_BASE64 || '').trim()
    || String(env.ANDROID_KEYSTORE_PATH || '').trim(),
  );
}

const PLATFORMS = [
  {
    id: 'swiftui',
    root: 'examples/native/swiftui',
    required: [
      'Gemfile',
      'fastlane/Fastfile',
      'fastlane/Appfile',
      'fastlane/metadata/en-US/name.txt',
      'fastlane/metadata/en-US/subtitle.txt',
      'fastlane/metadata/en-US/description.txt',
      'fastlane/metadata/en-US/keywords.txt',
      'fastlane/metadata/en-US/release_notes.txt',
      'fastlane/metadata/en-US/privacy_url.txt',
      'fastlane/metadata/en-US/support_url.txt',
      'fastlane/metadata/en-US/marketing_url.txt',
    ],
    secrets: ASC_SECRETS,
  },
  {
    id: 'compose',
    root: 'examples/native/compose',
    required: [
      'Gemfile',
      'signing.properties.example',
      'fastlane/Fastfile',
      'fastlane/Appfile',
      'fastlane/metadata/android/en-US/title.txt',
      'fastlane/metadata/android/en-US/short_description.txt',
      'fastlane/metadata/android/en-US/full_description.txt',
      'fastlane/metadata/android/en-US/changelogs/1.txt',
    ],
    secrets: PLAY_SECRETS,
    keystoreOptional: true,
  },
  {
    id: 'flutter',
    root: 'examples/native/flutter',
    required: [
      'Gemfile',
      'fastlane/Fastfile',
      'fastlane/Appfile',
      'fastlane/metadata/ios/en-US/name.txt',
      'fastlane/metadata/ios/en-US/description.txt',
      'fastlane/metadata/android/en-US/title.txt',
      'fastlane/metadata/android/en-US/full_description.txt',
      'fastlane/metadata/android/en-US/changelogs/1.txt',
    ],
    secrets: [...ASC_SECRETS, ...PLAY_SECRETS],
  },
];

function writeReport(payload) {
  try {
    writeFileSync(REPORT, JSON.stringify({ ...payload, at: new Date().toISOString() }, null, 2) + '\n');
  } catch (_) { /* ignore */ }
}

function softSkip(reason, detail, platforms) {
  console.error('');
  console.error(`SOFT SKIP — native store packaging (${reason}).`);
  if (detail) console.error(detail);
  console.error('Set ASC_KEY_ID / ASC_ISSUER_ID / ASC_KEY_P8 and PLAY_SERVICE_ACCOUNT_JSON for signed builds.');
  console.error('Store submit stays disabled — samples remain samples. See examples/native/README.md.');
  writeReport({
    skipped: true,
    reason,
    message: detail || reason,
    platforms,
    submit: false,
    channel: 'native-store',
  });
  recordCiVerdict({ channel: 'native-store', kind: 'soft_skip', reason, detail });
  process.exit(0);
}

function assertScaffold(platform) {
  const base = join(root, platform.root);
  const missing = [];
  const empty = [];
  for (const rel of platform.required) {
    const path = join(base, rel);
    if (!existsSync(path) || !statSync(path).isFile()) {
      missing.push(rel);
      continue;
    }
    const body = readFileSync(path, 'utf8');
    if (!body.trim()) empty.push(rel);
  }
  if (missing.length || empty.length) {
    const parts = [];
    if (missing.length) parts.push(`missing: ${missing.join(', ')}`);
    if (empty.length) parts.push(`empty: ${empty.join(', ')}`);
    throw new Error(`${platform.id} scaffold incomplete — ${parts.join('; ')}`);
  }
  // Fastfile must refuse store submit (safety rail).
  const fastfile = readFileSync(join(base, 'fastlane/Fastfile'), 'utf8');
  if (!/upload_store/.test(fastfile) || !/Store submit disabled|samples remain samples/i.test(fastfile)) {
    throw new Error(`${platform.id} Fastfile must define a disabled upload_store lane`);
  }
  return { id: platform.id, root: platform.root, files: platform.required.length, ok: true };
}

function assertCanonicalNativeTokens() {
  const tokens = [
    'tokens/native/CSTokens.swift',
    'tokens/native/CSTokens.kt',
    'tokens/native/cs_tokens.dart',
  ];
  const missing = [];
  const weak = [];
  for (const rel of tokens) {
    const path = join(root, rel);
    if (!existsSync(path)) {
      missing.push(rel);
      continue;
    }
    const body = readFileSync(path, 'utf8');
    if (!/colorBrandUmber|ColorBrandUmber|color_brand_umber/i.test(body)) weak.push(rel);
  }
  if (missing.length || weak.length) {
    const parts = [];
    if (missing.length) parts.push(`missing ${missing.join(', ')}`);
    if (weak.length) parts.push(`missing brand umber fingerprint in ${weak.join(', ')}`);
    throw new Error(`Native channel tokens incomplete — ${parts.join('; ')}`);
  }
  return tokens.map((rel) => ({ path: rel, ok: true }));
}

function main() {
  console.log('Native store packaging — scaffold dry-run (no store submit).');
  const tokenFiles = assertCanonicalNativeTokens();
  console.log(`  OK tokens/native (${tokenFiles.length} canonical files)`);
  const platforms = PLATFORMS.map(assertScaffold);
  for (const p of platforms) {
    console.log(`  OK ${p.id} (${p.files} required files)`);
  }

  if (dryRun) {
    console.log('Dry-run OK — Fastlane scaffolds + metadata placeholders present (no secrets checked).');
    writeReport({
      skipped: false,
      ok: true,
      dryRun: true,
      platforms,
      tokens: tokenFiles,
      submit: false,
      channel: 'native-store',
    });
    recordCiVerdict({ channel: 'native-store', kind: 'dry_run', detail: 'scaffolds + native tokens OK' });
    return;
  }

  // Release path: require signing secrets; still never submit.
  const ascMissing = missingSecrets(ASC_SECRETS);
  const playMissing = missingSecrets(PLAY_SECRETS);
  const allMissing = [...new Set([...ascMissing, ...playMissing])];

  if (allMissing.length) {
    softSkip(
      'missing_secrets',
      `Missing: ${allMissing.join(', ')}. Signed release builds not attempted.`,
      platforms,
    );
  }

  // Secrets present — still do not submit; report ready-for-operator.
  const keystoreNote = hasAnyKeystoreMaterial()
    ? 'ANDROID_KEYSTORE material present'
    : 'ANDROID_KEYSTORE_* optional material absent (Compose/Flutter Android may still need local signing.properties)';
  console.log('');
  console.log('Signing secrets present — store submit remains DISABLED for samples.');
  console.log(keystoreNote);
  console.log('Operator must promote samples to product apps before any real upload.');
  writeReport({
    skipped: false,
    ok: true,
    dryRun: false,
    secretsPresent: true,
    platforms,
    submit: false,
    message: 'Scaffold ready; submit disabled by design',
    keystore: hasAnyKeystoreMaterial(),
    channel: 'native-store',
  });
  recordCiVerdict({
    channel: 'native-store',
    kind: 'success',
    detail: 'signing secrets present; submit still disabled',
  });
}

const invoked = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;
if (invoked) {
  try {
    main();
  } catch (e) {
    console.error(e.message || e);
    writeReport({ skipped: false, ok: false, message: String(e.message || e), submit: false });
    process.exit(1);
  }
}
