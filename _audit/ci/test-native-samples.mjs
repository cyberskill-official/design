/**
 * Structural proof for multi-screen native sample apps.
 * Asserts SwiftUI / Compose / Flutter each have ≥3 screens and reference generated CSTokens.
 * Also asserts App Store / Play Store Fastlane scaffolds (Phase 7).
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { missingSecrets, ASC_SECRETS, PLAY_SECRETS } from './native-store-dry-run.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
function assert(c, m) {
  if (!c) throw new Error(m);
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function read(rel) {
  return readFileSync(join(root, rel), 'utf8');
}

// --- SwiftUI ---
const swiftRoot = 'examples/native/swiftui';
assert(existsSync(join(root, swiftRoot, 'Package.swift')), 'Swift Package.swift');
const swiftScreens = [
  'Sources/CyberSkillSample/Screens/SignInView.swift',
  'Sources/CyberSkillSample/Screens/HomeView.swift',
  'Sources/CyberSkillSample/Screens/SettingsView.swift',
];
for (const s of swiftScreens) {
  assert(existsSync(join(root, swiftRoot, s)), 'missing ' + s);
  assert(read(join(swiftRoot, s)).includes('CSTokens'), s + ' uses CSTokens');
}
assert(
  read(join(swiftRoot, 'Sources/CyberSkillSample/CyberSkillSampleApp.swift')).includes('NavigationStack')
    || read(join(swiftRoot, 'Sources/CyberSkillSample/CyberSkillSampleApp.swift')).includes('navigation'),
  'Swift root navigation',
);
assert(
  read(join(swiftRoot, 'Sources/CyberSkillSample/CSTokens.swift')).includes('colorBrandUmber'),
  'Swift ships synced CSTokens',
);

// --- Compose ---
const composeRoot = 'examples/native/compose';
assert(existsSync(join(root, composeRoot, 'settings.gradle.kts')), 'Compose settings.gradle.kts');
const composeScreens = [
  'app/src/main/java/world/cyberskill/sample/ui/SignInScreen.kt',
  'app/src/main/java/world/cyberskill/sample/ui/HomeScreen.kt',
  'app/src/main/java/world/cyberskill/sample/ui/SettingsScreen.kt',
];
for (const s of composeScreens) {
  assert(existsSync(join(root, composeRoot, s)), 'missing ' + s);
  const body = read(join(composeRoot, s));
  assert(body.includes('CSTokens'), s + ' uses CSTokens');
  // Compose API is modifier= (lowercase). Modifier= is a compile error (type name as param).
  assert(!/\bModifier\s*=/.test(body), s + ' must use modifier= not Modifier=');
}
const mainAct = read(join(composeRoot, 'app/src/main/java/world/cyberskill/sample/MainActivity.kt'));
assert(mainAct.includes('NavHost') && mainAct.includes('sign_in') && mainAct.includes('home') && mainAct.includes('settings'), 'Compose NavHost routes');
assert(
  read(join(composeRoot, 'app/src/main/java/world/cyberskill/sample/tokens/CSTokens.kt')).includes('colorBrandUmber'),
  'Compose ships synced CSTokens',
);
assert(
  read(join(composeRoot, 'app/src/main/java/world/cyberskill/sample/tokens/CSTokens.kt')).includes('world.cyberskill.sample.tokens'),
  'Compose token package matches app',
);

// --- Flutter ---
const flutterRoot = 'examples/native/flutter';
assert(existsSync(join(root, flutterRoot, 'pubspec.yaml')), 'Flutter pubspec');
const flutterScreens = [
  'lib/screens/sign_in_screen.dart',
  'lib/screens/home_screen.dart',
  'lib/screens/settings_screen.dart',
];
for (const s of flutterScreens) {
  assert(existsSync(join(root, flutterRoot, s)), 'missing ' + s);
  assert(read(join(flutterRoot, s)).includes('CSTokens'), s + ' uses CSTokens');
}
const mainDart = read(join(flutterRoot, 'lib/main.dart'));
assert(mainDart.includes("'/sign-in'") && mainDart.includes("'/home'") && mainDart.includes("'/settings'"), 'Flutter routes');
assert(
  read(join(flutterRoot, 'lib/tokens/cs_tokens.dart')).includes('colorBrandUmber'),
  'Flutter ships synced CSTokens',
);

// Sync script exists
assert(existsSync(join(root, 'examples/native/sync-tokens.mjs')), 'sync-tokens.mjs');

// --- Store packaging scaffolds (Phase 7 / Decision 1C) ---
function assertStoreScaffold(relRoot, files) {
  for (const f of files) {
    const p = join(root, relRoot, f);
    assert(existsSync(p), 'store scaffold missing ' + join(relRoot, f));
    assert(readFileSync(p, 'utf8').trim().length > 0, 'store scaffold empty ' + f);
  }
  const fast = read(join(relRoot, 'fastlane/Fastfile'));
  assert(/upload_store/.test(fast), relRoot + ' Fastfile needs upload_store lane');
  assert(/Store submit disabled|samples remain samples/i.test(fast), relRoot + ' must refuse store submit');
}

assertStoreScaffold(swiftRoot, [
  'Gemfile',
  'fastlane/Fastfile',
  'fastlane/Appfile',
  'fastlane/metadata/en-US/name.txt',
  'fastlane/metadata/en-US/description.txt',
]);
assertStoreScaffold(composeRoot, [
  'Gemfile',
  'signing.properties.example',
  'fastlane/Fastfile',
  'fastlane/Appfile',
  'fastlane/metadata/android/en-US/title.txt',
  'fastlane/metadata/android/en-US/changelogs/1.txt',
]);
assertStoreScaffold(flutterRoot, [
  'Gemfile',
  'fastlane/Fastfile',
  'fastlane/Appfile',
  'fastlane/metadata/ios/en-US/name.txt',
  'fastlane/metadata/android/en-US/title.txt',
  'fastlane/metadata/android/en-US/changelogs/1.txt',
]);
assert(existsSync(join(root, '_audit/ci/native-store-dry-run.mjs')), 'native-store-dry-run.mjs');
assert(existsSync(join(root, '.github/workflows/native-store.yml')), 'native-store.yml workflow');

// Canonical generated native tokens (Phase 5 channel verification).
for (const rel of [
  'tokens/native/CSTokens.swift',
  'tokens/native/CSTokens.kt',
  'tokens/native/cs_tokens.dart',
]) {
  assert(existsSync(join(root, rel)), 'missing ' + rel);
  assert(/colorBrandUmber|ColorBrandUmber|color_brand_umber/i.test(read(rel)), rel + ' brand umber');
}

assert(missingSecrets(ASC_SECRETS, {}).length === ASC_SECRETS.length, 'ASC secrets empty-env');
assert(missingSecrets(PLAY_SECRETS, { PLAY_SERVICE_ACCOUNT_JSON: 'x' }).length === 0, 'Play secret present');
assert(missingSecrets(ASC_SECRETS, { ASC_KEY_ID: 'a', ASC_ISSUER_ID: 'b', ASC_KEY_P8: 'c' }).length === 0, 'ASC complete');

// Inventory size
const swiftFiles = walk(join(root, swiftRoot)).filter((f) => f.endsWith('.swift'));
const ktFiles = walk(join(root, composeRoot)).filter((f) => f.endsWith('.kt'));
const dartFiles = walk(join(root, flutterRoot)).filter((f) => f.endsWith('.dart'));
assert(swiftFiles.length >= 5, 'swift multi-file');
assert(ktFiles.length >= 5, 'kotlin multi-file');
assert(dartFiles.length >= 4, 'dart multi-file');

// Dry-run must stay green without secrets (FIND Phase 5 native verification).
const dry = spawnSync(process.execPath, [join(root, '_audit/ci/native-store-dry-run.mjs'), '--dry-run'], {
  cwd: root,
  encoding: 'utf8',
});
assert(dry.status === 0, 'native-store-dry-run --dry-run failed: ' + (dry.stderr || dry.stdout));

console.log('PASS test-native-samples', {
  swiftScreens: 3,
  composeScreens: 3,
  flutterScreens: 3,
  swiftFiles: swiftFiles.length,
  ktFiles: ktFiles.length,
  dartFiles: dartFiles.length,
  storeScaffolds: ['swiftui', 'compose', 'flutter'],
  nativeDryRun: 'ok',
});
