/**
 * Structural proof for multi-screen native sample apps.
 * Asserts SwiftUI / Compose / Flutter each have ≥3 screens and reference generated CSTokens.
 * Also asserts App Store / Play Store Fastlane scaffolds (Phase 7).
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
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

// Samples are projections of the canonical generated tokens, not independent
// token sources. Compare the whole file so stale non-brand values cannot pass.
for (const [source, destination, transform] of [
  ['tokens/native/CSTokens.swift', 'examples/native/swiftui/Sources/CyberSkillSample/CSTokens.swift', text => text],
  ['tokens/native/CSTokens.kt', 'examples/native/compose/app/src/main/java/world/cyberskill/sample/tokens/CSTokens.kt', text => text.replace(/package world\.cyberskill\.tokens/, 'package world.cyberskill.sample.tokens')],
  ['tokens/native/cs_tokens.dart', 'examples/native/flutter/lib/tokens/cs_tokens.dart', text => text],
  ['tokens/native/CSModes.swift', 'examples/native/swiftui/Sources/CyberSkillDesign/CSModes.swift', text => text],
  ['tokens/native/CSModes.kt', 'examples/native/compose/design/src/main/java/world/cyberskill/design/CSModes.kt', text => text.replace(/package world\.cyberskill\.tokens/, 'package world.cyberskill.design')],
  ['tokens/native/cs_modes.dart', 'examples/native/flutter_design/lib/cs_modes.dart', text => text],
]) {
  assert(read(destination) === transform(read(source)), 'Stale native sample token copy: ' + destination + '; run npm run native:sync-tokens');
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
}
assert(read(join(swiftRoot, 'Sources/CyberSkillSample/Screens/SignInView.swift')).includes('CSTextField'), 'Swift sign-in uses the design library field');
assert(read(join(swiftRoot, 'Sources/CyberSkillSample/Screens/SignInView.swift')).includes('CSButton'), 'Swift sign-in uses the design library button');
assert(read(join(swiftRoot, 'Sources/CyberSkillSample/Screens/SettingsView.swift')).includes('CSButton'), 'Swift settings uses the design library button');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Components.swift')).includes('CSModes.resolve'), 'Swift component library resolves a mode pack');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Components.swift')).includes('struct CSSwitch'), 'Swift library exports a switch');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Components.swift')).includes('struct CSDialog'), 'Swift library exports a dialog');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Components.swift')).includes('struct CSCard'), 'Swift library exports a card');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Components.swift')).includes('struct CSBadge'), 'Swift library exports a badge');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Components.swift')).includes('struct CSDivider'), 'Swift library exports a divider');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Components.swift')).includes('struct CSSelect'), 'Swift library exports a select');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSCheckbox'), 'Swift library exports a checkbox');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSRadioGroup'), 'Swift library exports a radio group');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSProgressBar'), 'Swift library exports a progress bar');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSAvatar'), 'Swift library exports an avatar');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSAlert'), 'Swift library exports an alert');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSSlider'), 'Swift library exports a slider');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSTabs'), 'Swift library exports tabs');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSSkeleton'), 'Swift library exports a skeleton');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSSpinner'), 'Swift library exports a spinner');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSTag'), 'Swift library exports a tag');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('struct CSStat'), 'Swift library exports a stat');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Catalog.swift')).includes('enum CSPaginationModel'), 'Swift library matches pagination windows');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Catalog.swift')).includes('struct CSTextarea'), 'Swift library exports a textarea');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Catalog.swift')).includes('struct CSSearchField'), 'Swift library exports a search field');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Catalog.swift')).includes('struct CSNumberField'), 'Swift library exports a number field');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Catalog.swift')).includes('struct CSRating'), 'Swift library exports a rating');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Catalog.swift')).includes('struct CSAccordion'), 'Swift library exports an accordion');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Catalog.swift')).includes('struct CSToast'), 'Swift library exports a toast');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Primitives.swift')).includes('enum CSRoving'), 'Swift tabs use the web roving index');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Records.swift')).includes('struct CSDataGrid'), 'Swift library exports a data grid');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Records.swift')).includes('struct CSTagInput'), 'Swift library exports a tag input');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Records.swift')).includes('struct CSConfidenceMeter'), 'Swift library exports a confidence meter');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Records.swift')).includes('struct CSCollapsible'), 'Swift library exports a collapsible');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Records.swift')).includes('struct CSTimeline'), 'Swift library exports a timeline');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Records.swift')).includes('struct CSToolbar'), 'Swift library exports a toolbar');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Overlays.swift')).includes('struct CSMenu'), 'Swift library exports a menu');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Overlays.swift')).includes('struct CSMenubar'), 'Swift library exports a menubar');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Overlays.swift')).includes('enum CSMenuModel'), 'Swift menu uses the web roving index');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Structures.swift')).includes('struct CSCommandPalette'), 'Swift library exports a command palette');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Structures.swift')).includes('struct CSTransfer'), 'Swift library exports a transfer');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Structures.swift')).includes('struct CSTree'), 'Swift library exports a tree');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Structures.swift')).includes('struct CSDrawer'), 'Swift library exports a drawer');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Fields.swift')).includes('struct CSCalendar'), 'Swift library exports a calendar');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Fields.swift')).includes('struct CSCombobox'), 'Swift library exports a combobox');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Fields.swift')).includes('struct CSAlertDialog'), 'Swift library exports an alert dialog');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Flows.swift')).includes('struct CSTimePicker'), 'Swift library exports a time picker');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Flows.swift')).includes('struct CSMentions'), 'Swift library exports mentions');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Flows.swift')).includes('struct CSSortable'), 'Swift library exports a sortable list');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Flows.swift')).includes('struct CSTour'), 'Swift library exports a tour');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Flows.swift')).includes('func toggleName') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Flows.kt').includes('fun csToggleName') && read('examples/native/flutter_design/lib/flows.dart').includes('csToggleName('), 'native toggles keep a blank name and use Toggle only when the button has no content');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Flows.swift')).includes('func okText') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Flows.kt').includes('fun csPopconfirmOkText') && read('examples/native/flutter_design/lib/flows.dart').includes('csPopconfirmOkText('), 'native popconfirms keep a blank confirm label and close before the callback');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Flows.swift')).includes('func timeName') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Flows.kt').includes('fun csTimeName') && read('examples/native/flutter_design/lib/flows.dart').includes('csTimeName('), 'native time fields keep a blank label and use Time only when nothing else names the control');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Surfaces.swift')).includes('struct CSColorPicker'), 'Swift library exports a color picker');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Surfaces.swift')).includes('struct CSSplitter'), 'Swift library exports a splitter');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Surfaces.swift')).includes('struct CSDatePicker'), 'Swift library exports a date picker');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Surfaces.swift')).includes('struct CSChatMessage'), 'Swift library exports a chat message');
assert(read(join(swiftRoot, 'Sources/CyberSkillSample/Screens/HomeView.swift')).includes('CSListRow'), 'Swift home uses the design library list');
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
  // Compose API is modifier= (lowercase). Modifier= is a compile error (type name as param).
  assert(!/\bModifier\s*=/.test(body), s + ' must use modifier= not Modifier=');
}
assert(read(join(composeRoot, 'app/src/main/java/world/cyberskill/sample/ui/SignInScreen.kt')).includes('CsTextField'), 'Compose sign-in uses the design library field');
assert(read(join(composeRoot, 'app/src/main/java/world/cyberskill/sample/ui/SignInScreen.kt')).includes('CsButton'), 'Compose sign-in uses the design library button');
assert(read(join(composeRoot, 'app/src/main/java/world/cyberskill/sample/ui/SettingsScreen.kt')).includes('CsButton'), 'Compose settings uses the design library button');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Controls.kt')).includes('CSModes.resolve'), 'Compose component library resolves a mode pack');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Controls.kt')).includes('fun CsSwitch'), 'Compose library exports a switch');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Controls.kt')).includes('fun CsDialog'), 'Compose library exports a dialog');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Controls.kt')).includes('fun CsCard'), 'Compose library exports a card');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Controls.kt')).includes('fun CsBadge'), 'Compose library exports a badge');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Controls.kt')).includes('fun CsDivider'), 'Compose library exports a divider');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Controls.kt')).includes('fun <T> CsSelect'), 'Compose library exports a select');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsCheckbox'), 'Compose library exports a checkbox');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsRadioGroup'), 'Compose library exports a radio group');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsProgressBar'), 'Compose library exports a progress bar');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsAvatar'), 'Compose library exports an avatar');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsAlert'), 'Compose library exports an alert');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsSlider'), 'Compose library exports a slider');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsTabs'), 'Compose library exports tabs');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsSkeleton'), 'Compose library exports a skeleton');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsSpinner'), 'Compose library exports a spinner');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsTag'), 'Compose library exports a tag');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Primitives.kt')).includes('fun CsStat'), 'Compose library exports a stat');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Catalog.kt')).includes('fun csPaginationTokens'), 'Compose library matches pagination windows');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Catalog.kt')).includes('fun CsTextarea'), 'Compose library exports a textarea');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Catalog.kt')).includes('fun CsSearchField'), 'Compose library exports a search field');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Catalog.kt')).includes('fun CsNumberField'), 'Compose library exports a number field');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Catalog.kt')).includes('fun CsRating'), 'Compose library exports a rating');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Catalog.kt')).includes('fun CsAccordion'), 'Compose library exports an accordion');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Catalog.kt')).includes('fun CsToast'), 'Compose library exports a toast');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Records.kt')).includes('fun CsDataGrid'), 'Compose library exports a data grid');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Records.kt')).includes('fun CsTagInput'), 'Compose library exports a tag input');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Records.kt')).includes('fun CsConfidenceMeter'), 'Compose library exports a confidence meter');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Records.kt')).includes('fun CsCollapsible'), 'Compose library exports a collapsible');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Records.kt')).includes('fun CsTimeline'), 'Compose library exports a timeline');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Records.kt')).includes('fun CsToolbar'), 'Compose library exports a toolbar');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Overlays.kt')).includes('fun CsMenu'), 'Compose library exports a menu');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Overlays.kt')).includes('fun CsMenubar'), 'Compose library exports a menubar');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Overlays.kt')).includes('fun csMenuIndex'), 'Compose menu uses the web roving index');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Structures.kt')).includes('fun CsCommandPalette'), 'Compose library exports a command palette');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Structures.kt')).includes('fun CsTransfer'), 'Compose library exports a transfer');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Structures.kt')).includes('fun CsTree'), 'Compose library exports a tree');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Structures.kt')).includes('fun CsDrawer'), 'Compose library exports a drawer');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Fields.kt')).includes('fun CsCalendar'), 'Compose library exports a calendar');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Fields.kt')).includes('fun CsCombobox'), 'Compose library exports a combobox');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Fields.kt')).includes('fun CsAlertDialog'), 'Compose library exports an alert dialog');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Flows.kt')).includes('fun CsTimePicker'), 'Compose library exports a time picker');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Flows.kt')).includes('fun CsMentions'), 'Compose library exports mentions');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Flows.kt')).includes('fun CsSortable'), 'Compose library exports a sortable list');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Flows.kt')).includes('fun CsTour'), 'Compose library exports a tour');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Surfaces.kt')).includes('fun CsColorPicker'), 'Compose library exports a color picker');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Surfaces.kt')).includes('fun CsSplitter'), 'Compose library exports a splitter');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Surfaces.kt')).includes('fun CsDatePicker'), 'Compose library exports a date picker');
assert(read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Surfaces.kt')).includes('fun CsChatMessage'), 'Compose library exports a chat message');
assert(read(join(composeRoot, 'app/src/main/java/world/cyberskill/sample/ui/HomeScreen.kt')).includes('CsListRow'), 'Compose home uses the design library list');
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
}
assert(read(join(flutterRoot, 'lib/screens/sign_in_screen.dart')).includes('CsTextField'), 'Flutter sign-in uses the design library field');
assert(read(join(flutterRoot, 'lib/screens/sign_in_screen.dart')).includes('CsButton'), 'Flutter sign-in uses the design library button');
assert(read(join(flutterRoot, 'lib/screens/settings_screen.dart')).includes('CsButton'), 'Flutter settings uses the design library button');
assert(read('examples/native/flutter_design/lib/controls.dart').includes('CSModes.resolve'), 'Flutter component library resolves a mode pack');
assert(read('examples/native/flutter_design/lib/controls.dart').includes('class CsSwitch'), 'Flutter library exports a switch');
assert(read('examples/native/flutter_design/lib/controls.dart').includes('class CsDialog'), 'Flutter library exports a dialog');
assert(read('examples/native/flutter_design/lib/controls.dart').includes('class CsCard'), 'Flutter library exports a card');
assert(read('examples/native/flutter_design/lib/controls.dart').includes('class CsBadge'), 'Flutter library exports a badge');
assert(read('examples/native/flutter_design/lib/controls.dart').includes('class CsDivider'), 'Flutter library exports a divider');
assert(read('examples/native/flutter_design/lib/controls.dart').includes('class CsSelect'), 'Flutter library exports a select');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsCheckbox'), 'Flutter library exports a checkbox');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsRadioGroup'), 'Flutter library exports a radio group');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsProgressBar'), 'Flutter library exports a progress bar');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsAvatar'), 'Flutter library exports an avatar');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsAlert'), 'Flutter library exports an alert');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsSlider'), 'Flutter library exports a slider');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsTabs'), 'Flutter library exports tabs');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsSkeleton'), 'Flutter library exports a skeleton');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsSpinner'), 'Flutter library exports a spinner');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsTag'), 'Flutter library exports a tag');
assert(read('examples/native/flutter_design/lib/primitives.dart').includes('class CsStat'), 'Flutter library exports a stat');
assert(read('examples/native/flutter_design/lib/catalog.dart').includes('csPaginationTokens'), 'Flutter library matches pagination windows');
assert(read('examples/native/flutter_design/lib/catalog.dart').includes('class CsTextarea'), 'Flutter library exports a textarea');
assert(read('examples/native/flutter_design/lib/catalog.dart').includes('class CsSearchField'), 'Flutter library exports a search field');
assert(read('examples/native/flutter_design/lib/catalog.dart').includes('class CsNumberField'), 'Flutter library exports a number field');
assert(read('examples/native/flutter_design/lib/catalog.dart').includes('class CsRating'), 'Flutter library exports a rating');
assert(read('examples/native/flutter_design/lib/catalog.dart').includes('class CsAccordion'), 'Flutter library exports an accordion');
assert(read('examples/native/flutter_design/lib/catalog.dart').includes('class CsToast'), 'Flutter library exports a toast');
assert(read('examples/native/flutter_design/lib/records.dart').includes('class CsDataGrid'), 'Flutter library exports a data grid');
assert(read('examples/native/flutter_design/lib/records.dart').includes('class CsTagInput'), 'Flutter library exports a tag input');
assert(read('examples/native/flutter_design/lib/records.dart').includes('class CsConfidenceMeter'), 'Flutter library exports a confidence meter');
assert(read('examples/native/flutter_design/lib/records.dart').includes('class CsCollapsible'), 'Flutter library exports a collapsible');
assert(read('examples/native/flutter_design/lib/records.dart').includes('class CsTimeline'), 'Flutter library exports a timeline');
assert(read('examples/native/flutter_design/lib/records.dart').includes('class CsToolbar'), 'Flutter library exports a toolbar');
assert(read('examples/native/flutter_design/lib/overlays.dart').includes('class CsMenu'), 'Flutter library exports a menu');
assert(read('examples/native/flutter_design/lib/overlays.dart').includes('class CsMenubar'), 'Flutter library exports a menubar');
assert(read('examples/native/flutter_design/lib/overlays.dart').includes('csMenuIndex'), 'Flutter menu uses the web roving index');
assert(read('examples/native/flutter_design/lib/structures.dart').includes('class CsCommandPalette'), 'Flutter library exports a command palette');
assert(read('examples/native/flutter_design/lib/structures.dart').includes('class CsTransfer'), 'Flutter library exports a transfer');
assert(read(join(swiftRoot, 'Sources/CyberSkillDesign/Structures.swift')).includes('CSCheckbox(') && read(join(composeRoot, 'design/src/main/java/world/cyberskill/design/Structures.kt')).includes('CsCheckbox(') && read('examples/native/flutter_design/lib/structures.dart').includes('CsCheckbox('), 'native transfer rows are checkboxes');
assert(read('examples/native/flutter_design/lib/structures.dart').includes('class CsTree'), 'Flutter library exports a tree');
assert(read('examples/native/flutter_design/lib/structures.dart').includes('class CsDrawer'), 'Flutter library exports a drawer');
assert(read('examples/native/flutter_design/lib/fields.dart').includes('class CsCalendar'), 'Flutter library exports a calendar');
assert(read('examples/native/flutter_design/lib/fields.dart').includes('class CsCombobox'), 'Flutter library exports a combobox');
assert(read('examples/native/flutter_design/lib/fields.dart').includes('class CsAlertDialog'), 'Flutter library exports an alert dialog');
assert(read('examples/native/flutter_design/lib/flows.dart').includes('class CsTimePicker'), 'Flutter library exports a time picker');
assert(read('examples/native/flutter_design/lib/flows.dart').includes('class CsMentions'), 'Flutter library exports mentions');
assert(read('examples/native/flutter_design/lib/flows.dart').includes('class CsSortable'), 'Flutter library exports a sortable list');
assert(read('examples/native/flutter_design/lib/flows.dart').includes('class CsTour'), 'Flutter library exports a tour');
assert(read('examples/native/flutter_design/lib/surfaces.dart').includes('class CsColorPicker'), 'Flutter library exports a color picker');
assert(read('examples/native/flutter_design/lib/surfaces.dart').includes('class CsSplitter'), 'Flutter library exports a splitter');
assert(read('examples/native/flutter_design/lib/surfaces.dart').includes('class CsDatePicker'), 'Flutter library exports a date picker');
assert(read('examples/native/flutter_design/lib/surfaces.dart').includes('class CsChatMessage'), 'Flutter library exports a chat message');
const iconSwift = read('examples/native/swiftui/Sources/CyberSkillDesign/IconPaths.swift');
const iconKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/IconPaths.kt');
const iconDart = read('examples/native/flutter_design/lib/icon_paths.dart');
const iconNames = [...iconSwift.matchAll(/"([a-z0-9-]+)": \[/g)].map(match => match[1]);
assert(iconNames.length === 28, 'Swift icon set has 28 glyphs');
for (const iconName of iconNames) {
  assert(iconKotlin.includes('"' + iconName + '"'), 'Compose icon set missing ' + iconName);
  assert(iconDart.includes("'" + iconName + "'"), 'Flutter icon set missing ' + iconName);
}
assert(iconSwift.includes('M6 6l12 12M18 6L6 18') && iconKotlin.includes('M6 6l12 12M18 6L6 18') && iconDart.includes('M6 6l12 12M18 6L6 18'), 'close icon path matches across native libraries');
assert(iconKotlin.includes('fun CsIcon') && iconDart.includes('class CsIcon'), 'Compose and Flutter icon widgets stroke a path');
const remainder = ['Cascader','Chart','Dock','Editor','Form','FormField','FormFieldArray','FormWizard','HotKeys','HoverCard','HumanReviewGate','InlineEdit','InputGroup','Item','LocaleProvider','LumiAvatar','Masonry','MenuItem','NativeSelect','NavItem','OverlayProvider','PromptInput','PromptSuggestions','QRCode','Terminal','TreeSelect','TreeTable','TypingIndicator'];
const remainderSwift = read('examples/native/swiftui/Sources/CyberSkillDesign/Remainder.swift');
const remainderKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/Remainder.kt');
const remainderDart = read('examples/native/flutter_design/lib/remainder.dart');
for (const name of remainder) {
  assert(remainderSwift.includes('struct CS' + name), 'Swift library missing ' + name);
  assert(remainderKotlin.includes('fun Cs' + name), 'Compose library missing ' + name);
  assert(remainderDart.includes('class Cs' + name), 'Flutter library missing ' + name);
}
const qrKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/QrEncode.kt');
const qrDart = read('examples/native/flutter_design/lib/qr_encode.dart');
assert(qrKotlin.includes('0x77c4') && qrDart.includes('0x77c4'), 'native QR copies the web format word');
assert(remainderKotlin.includes('fun csChartBars') && remainderDart.includes('csChartBars('), 'native charts use the web bar geometry');
assert(remainderSwift.includes('CSChartModel.kind') && remainderSwift.includes('CSChartModel.pie') && remainderKotlin.includes('csChartKind(') && remainderDart.includes('csChartKind('), 'native charts follow the web type');
assert(remainderSwift.includes('func sliceSlot') && remainderKotlin.includes('fun csChartSliceSlot') && remainderDart.includes('csChartSliceSlot('), 'native pie slices rotate five colors');
assert(remainderSwift.includes('func legend') && remainderKotlin.includes('fun csChartLegend') && remainderDart.includes('csChartLegend('), 'native charts hide the spark legend');
assert(remainderSwift.includes('icon ?? "sparkle"') && remainderKotlin.includes('icon ?: "sparkle"') && remainderDart.includes("icon ?? 'sparkle'"), 'native prompt suggestions use the sparkle fallback');
assert(remainderSwift.includes('func chosen') && remainderKotlin.includes('fun csPromptChosen') && remainderDart.includes('csPromptChosen('), 'native prompt suggestions keep a blank label and skip a click without a handler');
assert(remainderSwift.includes('func syncAfterLeave') && remainderKotlin.includes('fun csHoverSyncAfterLeave') && remainderDart.includes('csHoverSyncAfterLeave('), 'native hover cards delay open and close');
assert(remainderSwift.includes('func dismiss') && remainderKotlin.includes('request = 0') && remainderDart.includes('void dismiss()'), 'native hover cards close on escape');
const progressSwift = read('examples/native/swiftui/Sources/CyberSkillDesign/Primitives.swift');
const progressKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/Primitives.kt');
const progressDart = read('examples/native/flutter_design/lib/primitives.dart');
assert(progressSwift.includes('func variant') && progressKotlin.includes('fun csProgressVariant') && progressDart.includes('csProgressVariant('), 'native progress bars keep ochre, umber, and success');
assert(progressSwift.includes('func barName') && progressKotlin.includes('fun csProgressBarName') && progressDart.includes('csProgressBarName('), 'native progress bars keep a blank label and clamp a value below zero');
assert(progressSwift.includes('func labelledBy') && progressKotlin.includes('fun csCheckLabelledBy') && progressDart.includes('csCheckLabelledBy('), 'native checkboxes keep a blank description hidden and a zero label as the name');
assert(progressSwift.includes('func groupName') && progressKotlin.includes('fun csRadioGroupName') && progressDart.includes('csRadioGroupName('), 'native radios keep a blank group name and check only an equal value');
assert(progressSwift.includes('func showsDelta') && progressKotlin.includes('fun csStatShowsDelta') && progressDart.includes('csStatShowsDelta('), 'native stats keep a flat trend and a zero delta');
assert(progressSwift.includes('func arrowPath') && progressKotlin.includes('fun csStatArrowPath') && progressDart.includes('csStatArrowPath('), 'native stats draw the web arrow and hide it from assistive technology');
assert(progressSwift.includes('func lineWidth') && progressKotlin.includes('fun csSkeletonLineWidth') && progressDart.includes('csSkeletonLineWidth('), 'native skeletons shorten the last text line');
assert(progressSwift.includes('func topIsOchre') && progressKotlin.includes('fun csSpinnerTopOchre') && progressDart.includes('csSpinnerTopOchre('), 'native spinners use umber in light and ochre in dark');
assert(progressSwift.includes('func spoken') && progressKotlin.includes('fun csAvatarSpoken') && progressDart.includes('csAvatarSpoken('), 'native avatars speak the name only when the web would');
assert(progressSwift.includes('func showsCount') && progressKotlin.includes('fun csTabsShowsCount') && progressDart.includes('csTabsShowsCount('), 'native tabs keep a zero count and a blank list name');
assert(progressSwift.includes('func snap') && progressKotlin.includes('fun csSliderSnap') && progressDart.includes('csSliderSnap('), 'native sliders collapse a reversed range and keep a blank label');
const watermarkSwift = read('examples/native/swiftui/Sources/CyberSkillDesign/Overlays.swift');
const watermarkKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/Overlays.kt');
const watermarkDart = read('examples/native/flutter_design/lib/overlays.dart');
assert(watermarkSwift.includes('func escape') && watermarkKotlin.includes('fun csWatermarkEscape') && watermarkDart.includes('csWatermarkEscape('), 'native watermarks escape amp and lt only');
assert(watermarkSwift.includes('func centers') && watermarkKotlin.includes('fun csWatermarkCenters') && watermarkDart.includes('csWatermarkCenters('), 'native watermarks repeat on the web tile');
assert(watermarkSwift.includes('primaryTextColor') && watermarkKotlin.includes('colorTextPrimary') && watermarkDart.includes('colorTextPrimary'), 'native watermarks use the theme text color');
const badgeSwift = read('examples/native/swiftui/Sources/CyberSkillDesign/Components.swift');
const badgeKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/Controls.kt');
const badgeDart = read('examples/native/flutter_design/lib/controls.dart');
assert(badgeSwift.includes('func variant') && badgeKotlin.includes('fun csBadgeVariant') && badgeDart.includes('csBadgeVariant('), 'native badges keep the web variant names');
assert(badgeSwift.includes('func toneClass') && badgeKotlin.includes('fun csBadgeToneClass') && badgeDart.includes('csBadgeToneClass('), 'native badges omit the neutral class and keep an unknown class name');
assert(badgeSwift.includes('func switchName') && badgeKotlin.includes('fun csSwitchName') && badgeDart.includes('csSwitchName('), 'native switches keep a blank name and use Setting only when nothing names the control');
assert(badgeSwift.includes('func showsLabel') && badgeKotlin.includes('fun csDividerShowsLabel') && badgeDart.includes('csDividerShowsLabel('), 'native dividers keep a zero label and a blank rule');
assert(badgeSwift.includes('func describedBy') && badgeKotlin.includes('fun csDialogDescribedBy') && badgeDart.includes('csDialogDescribedBy('), 'native dialogs keep an explicit blank description empty and describe the body otherwise');
const stepsSwift = read('examples/native/swiftui/Sources/CyberSkillDesign/Catalog.swift');
const stepsKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/Catalog.kt');
const stepsDart = read('examples/native/flutter_design/lib/catalog.dart');
assert(stepsSwift.includes('func marker') && stepsKotlin.includes('fun csStepMarker') && stepsDart.includes('csStepMarker('), 'native steps keep a custom marker number');
assert(stepsSwift.includes('func listName') && stepsKotlin.includes('fun csStepListName') && stepsDart.includes('csStepListName('), 'native steps keep the catalog list name and mark the active step as current');
assert(stepsSwift.includes('func statusKind') && stepsKotlin.includes('fun csStatusKind') && stepsDart.includes('csStatusKind('), 'native status dots use ochre for busy and stay still when motion is reduced');
assert(stepsSwift.includes('func spoken(') && stepsKotlin.includes('fun csDescriptionSpoken') && stepsDart.includes('csDescriptionSpoken('), 'native description lists keep a blank term and wrap pairs from 160px');
assert(stepsSwift.includes('func keyFace') && stepsKotlin.includes('fun csKbdKeyFace') && stepsDart.includes('csKbdKeyFace('), 'native key hints keep a blank face and the web padding');
assert(stepsSwift.includes('func groupLabel') && stepsKotlin.includes('fun csButtonGroupLabel') && stepsDart.includes('csButtonGroupLabel('), 'native button groups overlap by one pixel and keep a blank group name');
assert(stepsSwift.includes('func title') && stepsKotlin.includes('fun csEmptyTitle') && stepsDart.includes('csEmptyTitle('), 'native empty states keep a blank title and a zero body');
assert(stepsSwift.includes('M3 8l2-4h14l2 4') && stepsKotlin.includes('M3 8l2-4h14l2 4') && stepsDart.includes('M3 8l2-4h14l2 4'), 'native empty states draw the web tray');
assert(stepsSwift.includes('func showsSeparator') && stepsKotlin.includes('fun csBreadcrumbSeparator') && stepsDart.includes('csBreadcrumbSeparator('), 'native breadcrumbs mark the last item as the current page and keep a blank trail name');
assert(stepsSwift.includes('func destination') && stepsKotlin.includes('fun csPaginationDestination') && stepsDart.includes('csPaginationDestination('), 'native pagination skips the current page and stays inside the page count');
assert(stepsSwift.includes('func starLabel') && stepsKotlin.includes('fun csRatingStar') && stepsDart.includes('csRatingStar('), 'native ratings name each star and keep a blank group label');
assert(stepsSwift.includes('let overlap') && stepsKotlin.includes('csAvatarOverlap') && stepsDart.includes('csAvatarOverlap'), 'native avatar groups overlap by 10');
assert(stepsSwift.includes('func mark') && stepsKotlin.includes('fun csResultMark') && stepsDart.includes('csResultMark('), 'native results keep the status glyph and a zero body');
assert(stepsSwift.includes('func suffix') && stepsKotlin.includes('fun csLinkSuffix') && stepsDart.includes('csLinkSuffix('), 'native links keep the external mark and the standalone arrow');
assert(stepsSwift.includes('func escape') && stepsKotlin.includes('fun csTooltipEscape') && stepsDart.includes('csTooltipEscape('), 'native tooltips dismiss on escape until the next enter');
assert(stepsSwift.includes('func notify') && stepsKotlin.includes('fun csToastNotify') && stepsDart.includes('csToastNotify('), 'native toasts close through onOpenChange before onClose');
assert(stepsSwift.includes('func panelOpen') && stepsKotlin.includes('fun csAccordionPanel') && stepsDart.includes('csAccordionPanel('), 'native accordions open only the first panel unless many are allowed');
assert(stepsSwift.includes('func describedBy') && stepsKotlin.includes('fun csTextareaDescribedBy') && stepsDart.includes('csTextareaDescribedBy('), 'native textareas keep a blank label hidden and merge descriptions');
assert(stepsSwift.includes('func showsClear') && stepsKotlin.includes('fun csSearchShowsClear') && stepsDart.includes('csSearchShowsClear('), 'native search fields keep a blank query and block a read-only clear');
assert(stepsSwift.includes('func canDecrease') && stepsKotlin.includes('fun csNumberCanDecrease') && stepsDart.includes('csNumberCanDecrease('), 'native number fields stop at the bound and keep a blank draft');
const fileSwift = read('examples/native/swiftui/Sources/CyberSkillDesign/Structures.swift');
const fileKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/Structures.kt');
const fileDart = read('examples/native/flutter_design/lib/structures.dart');
assert(fileSwift.includes('func notify') && fileKotlin.includes('fun csFileNotify') && fileDart.includes('csFileNotify('), 'native file fields skip an empty selection and keep one file unless multiple is set');
assert(fileSwift.includes('func box') && fileKotlin.includes('fun csOneTimeBox') && fileDart.includes('csOneTimeBox('), 'native one-time codes keep ASCII digits and leave an empty box blank');
assert(fileSwift.includes('func slideLabel') && fileKotlin.includes('fun csCarouselSlideLabel') && fileDart.includes('csCarouselSlideLabel('), 'native carousels name each slide and leave the status empty when there are none');
assert(fileSwift.includes('func bodyFocusable') && fileKotlin.includes('fun csDrawerBodyFocusable') && fileDart.includes('csDrawerBodyFocusable('), 'native drawers keep a blank title as a side panel and close through onOpenChange first');
const alertSwift = read('examples/native/swiftui/Sources/CyberSkillDesign/Fields.swift');
const alertKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/Fields.kt');
const alertDart = read('examples/native/flutter_design/lib/fields.dart');
assert(alertSwift.includes('func initialFocus') && alertKotlin.includes('fun csAlertInitialFocus') && alertDart.includes('csAlertInitialFocus('), 'native alert dialogs focus cancel when destructive and hide a blank description');
assert(alertSwift.includes('func barLabel') && alertKotlin.includes('fun csCodeBarLabel') && alertDart.includes('csCodeBarLabel('), 'native code blocks keep a filename and use the language only when the filename is blank');
assert(alertSwift.includes('func replyActions') && alertKotlin.includes('fun csCommentReplyActions') && alertDart.includes('csCommentReplyActions('), 'native comments use Reply only when no actions were passed');
assert(alertSwift.includes('func emptyText') && alertKotlin.includes('fun csComboboxEmptyText') && alertDart.includes('csComboboxEmptyText('), 'native comboboxes keep a zero label and say No results only when the list is empty');
assert(alertSwift.includes('func shiftView') && alertKotlin.includes('fun csCalendarShift') && alertDart.includes('csCalendarShift('), 'native calendars wrap January back to December and keep the Vietnamese month names');
assert(alertSwift.includes('func focusDate') && alertKotlin.includes('fun csCalendarFocus') && alertDart.includes('csCalendarFocus('), 'native calendars move the focused day across month boundaries');
assert(alertSwift.includes('shift: shift'), 'native calendar page keys honor Shift');
assert(alertSwift.includes('func dayName') && alertKotlin.includes('fun csCalendarDayName') && alertDart.includes('csCalendarDayName('), 'native calendars speak the long date and mark today');
assert(alertKotlin.includes('csCalendarDayName(viewYear, viewMonth, day, language)') && alertDart.includes('csCalendarDayName(viewYear, viewMonth, day, widget.language)'), 'native calendar day buttons speak the long date');
assert(alertKotlin.includes('csCalendarFocus(viewYear, viewMonth, active, key, event.isShiftPressed)') && alertDart.includes('csCalendarFocus(viewYear, viewMonth, active, key, shift: shift)'), 'native calendar grids move the focused day from the keyboard');
assert(alertSwift.includes('func tabStop') && alertKotlin.includes('fun csCalendarTabStop') && alertDart.includes('csCalendarTabStop('), 'native calendars keep one day tab stop');
assert(progressSwift.includes('func nextIndex') && alertKotlin.includes('fun csFocusNext') && alertDart.includes('csFocusNext('), 'native modals wrap Tab and restore focus inside the panel');
assert(badgeKotlin.includes('csFocusNext(trap, stops, event.isShiftPressed, trap >= 0)') && fileKotlin.includes('csFocusNext(trap, 1, event.isShiftPressed, true)') && badgeDart.includes('csFocusNext(trap, stops,') && fileDart.includes('csFocusNext(trap, 1,'), 'native dialogs and drawers wrap Tab from the first control');
assert(progressSwift.includes('func shouldRestore') && alertKotlin.includes('fun csModalShouldRestore') && badgeDart.includes('csModalShouldRestore('), 'native modals return focus to the opener when the panel owned that focus');
assert(progressSwift.includes('func wasTop') && alertKotlin.includes('fun csOverlayWasTop') && badgeDart.includes('csOverlayWasTop('), 'native overlay stack keeps the nested modal on top of a toast');
assert(progressSwift.includes('func resolved') && badgeSwift.includes('shared.push') && fileSwift.includes('shared.push') && alertSwift.includes('shared.push'), 'native panels register on the live overlay stack');
assert(progressSwift.includes('func freshId') && alertKotlin.includes('fun csOverlayFreshId') && badgeDart.includes('csOverlayFreshId('), 'native panels take a unique overlay id');
assert(badgeKotlin.includes('csOverlayFreshId("dialog")') && alertKotlin.includes('csOverlayFreshId("alert")') && fileKotlin.includes('csOverlayFreshId("drawer")'), 'native dialog, alert, and drawer register separate ids');
assert(badgeSwift.includes('CSFocusReturn.perform') && fileSwift.includes('CSFocusReturn.perform') && alertSwift.includes('CSFocusReturn.perform') && progressSwift.includes('openerConnected: captured || onRestore != nil'), 'native dialog, drawer, and alert close paths restore the opener');
assert(alertSwift.includes('initialIndex(preferred: danger') && badgeSwift.includes('initialIndex(preferred: nil') && fileSwift.includes('initialIndex(preferred: nil'), 'native dialogs focus the first control and a destructive alert focuses cancel');
assert(alertSwift.includes('func placement') && alertKotlin.includes('fun csPopoverPlacement') && alertDart.includes('csPopoverPlacement('), 'native popovers keep an empty label and place the panel from the alignment');
assert(watermarkSwift.includes('func hover') && watermarkKotlin.includes('fun csMenubarHover') && watermarkDart.includes('csMenubarHover('), 'native menubars move on hover only while a menu is open and skip separators');
assert(watermarkSwift.includes('func sourceLine') && watermarkKotlin.includes('fun csDisclosureSourceLine') && watermarkDart.includes('csDisclosureSourceLine('), 'native AI disclosures drop a blank source and keep a zero source');
assert(watermarkSwift.includes('func nextOpen') && watermarkKotlin.includes('fun csFabNextOpen') && watermarkDart.includes('csFabNextOpen('), 'native floating actions toggle only when the dial has an action');
assert(watermarkSwift.includes('func behavior') && watermarkKotlin.includes('fun csBackTopBehavior') && watermarkDart.includes('csBackTopBehavior('), 'native back-to-top controls keep a blank label and jump when motion is reduced');
const contextSwift = read('examples/native/swiftui/Sources/CyberSkillDesign/Surfaces.swift');
const contextKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/Surfaces.kt');
const contextDart = read('examples/native/flutter_design/lib/surfaces.dart');
assert(contextSwift.includes('func keyboardPoint') && contextKotlin.includes('fun csContextKeyboardPoint') && contextDart.includes('csContextKeyboardPoint('), 'native context menus open at the pointer and do not wrap the last item');
assert(contextSwift.includes('point(clientX: point.x') && contextKotlin.includes('csContextPoint(down.position.x.toDouble()') && contextDart.includes('csContextPoint(local.dx'), 'native context menus place the list at the live pointer');
assert(contextSwift.includes('keyboardPoint(height: height)') && contextKotlin.includes('csContextKeyboardPoint(zoneHeight)') && contextDart.includes('csContextKeyboardPoint(zoneHeight)'), 'native context menus open from Shift+F10 at the bottom of the zone');
assert(contextSwift.includes('func placeMenu') && contextKotlin.includes('fun csContextPlace') && contextDart.includes('csContextPlace('), 'native context menus flip above the pointer when the list does not fit');
assert(contextSwift.includes('func position') && contextKotlin.includes('fun csFloatingPlace') && contextDart.includes('csFloatingPlace('), 'native floating panels use every web placement, including right-to-left alignment');
assert(contextSwift.includes('placed?.left ?? anchor.x') && read('examples/native/swiftui/Sources/CyberSkillDesign/Fields.swift').includes('$0.maxWidth') && read('examples/native/swiftui/Sources/CyberSkillDesign/Catalog.swift').includes('placed?.maxWidth'), 'native menus, popovers, and tooltips keep the placement maximum size');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Fields.swift').includes('trigger.minX') && read('examples/native/swiftui/Sources/CyberSkillDesign/Catalog.swift').includes('trigger.minX') && read('examples/native/flutter_design/lib/fields.dart').includes('placed?.maxWidth') && read('examples/native/flutter_design/lib/catalog.dart').includes('placed?.maxHeight'), 'native popovers and tooltips measure the live trigger');
assert(read('examples/native/compose/design/src/main/java/world/cyberskill/design/Fields.kt').includes('it.positionInRoot()') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Catalog.kt').includes('it.positionInRoot()'), 'native compose popovers and tooltips measure the live trigger');
assert(contextSwift.includes('func showsDescription') && contextKotlin.includes('fun csNavShowsDescription') && contextDart.includes('csNavShowsDescription('), 'native navigation menus keep a blank address as a hash and show a zero description');
assert(contextKotlin.includes('csNavClick(open, index)') && contextDart.includes('csNavClick(open, index)') && contextKotlin.includes('csNavHover(open, index)') && contextDart.includes('csNavHover(open, index)') && contextKotlin.includes('csNavShift(box,') && contextDart.includes('buttonOrigin.dx'), 'native navigation menus open a panel from the expanded item and place it with the web gap');
assert(contextSwift.includes('card.label') && contextKotlin.includes('card.label') && contextDart.includes('card.label') && contextSwift.includes('showsDescription(card.description)') && contextKotlin.includes('csNavShowsDescription(card.description)') && contextDart.includes('csNavShowsDescription(card.description)'), 'native navigation cards keep the label and a zero description');
assert(contextSwift.includes('func sourceSuffix') && contextKotlin.includes('fun csCitationSource') && contextDart.includes('csCitationSource('), 'native citations keep a zero source and hide a blank heading');
assert(contextSwift.includes('func speaker') && contextKotlin.includes('fun csChatSpeaker') && contextDart.includes('csChatSpeaker('), 'native chat keeps a blank name and uses You only for the user role');
assert(contextSwift.includes('func previewName') && contextKotlin.includes('fun csImagePreviewName') && contextDart.includes('csImagePreviewName('), 'native images keep a blank alt and add it to the preview name when it is present');
assert(contextSwift.includes('func dialogLabel') && contextKotlin.includes('fun csDateDialogLabel') && contextDart.includes('csDateDialogLabel('), 'native date fields keep a blank placeholder and trim a blank label out of the dialog name');
assert(contextSwift.includes('CSCalendar(') && contextKotlin.includes('CsCalendar(') && contextDart.includes('CsCalendar(') && contextSwift.includes('func parse') && contextKotlin.includes('fun csDateParse') && contextDart.includes('csDateParse('), 'native date pickers open a month grid and read the formatted value');
assert(contextSwift.includes('code == "ja"') && contextKotlin.includes('code == "ja"') && contextDart.includes("code == 'ja'"), 'native dates write Japanese as year, month, then day');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Remainder.swift').includes('for rule in custom') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Remainder.kt').includes('for (rule in custom)') && read('examples/native/flutter_design/lib/remainder.dart').includes('for (final rule in custom)'), 'native wizards run a custom step rule after required');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Remainder.swift').includes('M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Remainder.kt').includes('M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z') && read('examples/native/flutter_design/lib/remainder.dart').includes('M4 20l4.5-.9L20 7.6a2 2 0 0 0-2.8-2.8L5.7 16.3 4 20z'), 'native inline edits draw the hidden pen');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Flows.swift').includes('CSTourModel.hole(target)') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Flows.kt').includes('csTourHole(target)') && read('examples/native/flutter_design/lib/flows.dart').includes('csTourHole(target)'), 'native tours pad a measured target into a spotlight hole');
assert(!read('examples/native/swiftui/Sources/CyberSkillDesign/Remainder.swift').includes('end: text.count') && read('examples/native/swiftui/Sources/CyberSkillDesign/Remainder.swift').includes('selectionStart') && !read('examples/native/compose/design/src/main/java/world/cyberskill/design/Remainder.kt').includes('0, text.length') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Remainder.kt').includes('selectionStart') && !read('examples/native/flutter_design/lib/remainder.dart').includes('0, widget.text.length') && read('examples/native/flutter_design/lib/remainder.dart').includes('selectionStart'), 'native editor commands use the selected range');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Remainder.swift').includes('func remember') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Remainder.kt').includes('fun csEditorRemember') && read('examples/native/flutter_design/lib/remainder.dart').includes('csEditorRemember('), 'native editors keep a selection inside the field and ignore one outside it');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('CSCheckbox(label: allName') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('CsCheckbox(label = selectAllLabel') && read('examples/native/flutter_design/lib/records.dart').includes('CsCheckbox(label: selectAllLabel'), 'native data grids select rows with checkboxes');
assert(read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridRowKey(row["id"], index)') && read('examples/native/flutter_design/lib/records.dart').includes("csGridRowKey(row['id'], index)"), 'native data grids use the row index when the id is missing');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('rowIndex(virtual: useVirtual') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridRowIndex(useVirtual') && read('examples/native/flutter_design/lib/records.dart').includes('csGridRowIndex(useVirtual'), 'native data grids number virtual rows from the header');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('sticky(column.key, pinned: pinnedKey)') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridSticky(column.key, pinned)') && read('examples/native/flutter_design/lib/records.dart').includes('csGridSticky(column.key, pinnedKey)'), 'native data grids keep a pinned column at the inline start');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('filtered(rows: rows, query: filterText') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridFiltered(rows, filterText') && read('examples/native/flutter_design/lib/records.dart').includes('csGridFiltered(widget.rows, widget.filterText'), 'native data grids keep a filter query of 0');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('showsCaption(caption)') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('if (csGridShowsCaption(caption))') && read('examples/native/flutter_design/lib/records.dart').includes('csGridShowsCaption(widget.caption)'), 'native data grids show a caption of 0');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('emptyText(empty, fallback:') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridEmptyText(empty, csGridCopy') && read('examples/native/flutter_design/lib/records.dart').includes("csGridEmptyText(widget.empty, csGridCopy('empty'"), 'native data grids keep a blank empty body');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('values: sortValues') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridSorted(csGridFiltered(rows, filterText, keysToSearch), sort, sortValues)') && read('examples/native/flutter_design/lib/records.dart').includes('sort, widget.sortValues'), 'native data grids sort with sortValue when the column has one');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('cellText(row: row, key: column.key') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridCellText(row, column.key') && read('examples/native/flutter_design/lib/records.dart').includes('csGridCellText(row, column.key'), 'native data grids draw a cell render when the column has one');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('if column.sortable') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('if (column.sortable)') && read('examples/native/flutter_design/lib/records.dart').includes('if (column.sortable)'), 'native data grids leave an unsortable column as plain text');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('virtual(enabled: virtualRows') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridVirtual(virtual, shown.size, virtualThreshold)') && read('examples/native/flutter_design/lib/records.dart').includes('csGridVirtual(widget.virtual, rows.length, threshold: widget.virtualThreshold)'), 'native data grids virtualize a short list when virtual is on');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('threshold: virtualThreshold') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridVirtual(virtual, shown.size, virtualThreshold)') && read('examples/native/flutter_design/lib/records.dart').includes('threshold: widget.virtualThreshold'), 'native data grids honor a custom virtual threshold');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('height: gridHeight, rowHeight:') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridWindow(shown.size, height,') && read('examples/native/flutter_design/lib/records.dart').includes('csGridWindow(rows.length, widget.height,'), 'native data grids size the painted window from the grid height and row height');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('rowHeight(requested: gridRowHeight, measured:') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridRowHeight(rowHeight,') && read('examples/native/flutter_design/lib/records.dart').includes('csGridRowHeight(widget.rowHeight'), 'native data grids use a measured row when it is taller than the request');
assert(read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift').includes('measured(gridRowHeight, next:') && read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt').includes('csGridMeasured(settled, incoming)') && read('examples/native/flutter_design/lib/records.dart').includes('csGridMeasured(widget.rowHeight'), 'native data grids ignore a row measurement that moves by 0.01 or less');
const timelineSwift = read('examples/native/swiftui/Sources/CyberSkillDesign/Records.swift');
const timelineKotlin = read('examples/native/compose/design/src/main/java/world/cyberskill/design/Records.kt');
const timelineDart = read('examples/native/flutter_design/lib/records.dart');
assert(timelineSwift.includes('func marker') && timelineKotlin.includes('fun csTimelineMarker') && timelineDart.includes('csTimelineMarker('), 'native timelines leave a todo marker empty');
assert(timelineSwift.includes('func rowName') && timelineKotlin.includes('fun csGridRowName') && timelineDart.includes('csGridRowName('), 'native data grids name a row from the first text cell and keep a blank empty state');
assert(timelineSwift.includes('func next') && timelineKotlin.includes('fun csGridNextSort') && timelineDart.includes('csGridNextSort('), 'native data grids sort ascending, then descending, then clear');
assert(timelineSwift.includes('func filtered') && timelineKotlin.includes('fun csGridFiltered') && timelineDart.includes('csGridFiltered('), 'native data grids keep every row for a blank query and match without case');
assert(timelineSwift.includes('func window') && timelineKotlin.includes('fun csGridWindow') && timelineDart.includes('csGridWindow('), 'native data grids paint every short list and window a long list');
assert(timelineSwift.includes('painted(count:') && timelineKotlin.includes('csGridPainted(shown.size') && timelineDart.includes('csGridPainted(rows.length'), 'native data grids paint the rows inside the window');
assert(timelineKotlin.includes('scroll.value.toDouble()') && timelineDart.includes('safeRow, scrollTop,'), 'native data grids move the painted window with the scroll offset');
assert(timelineSwift.includes('func storageKey') && timelineKotlin.includes('fun csGridStorageKey') && timelineDart.includes('csGridStorageKey('), 'native data grids store column order under the web storage key');
assert(timelineSwift.includes('columnStore.set'), 'native data grids write the pinned column order');
assert(timelineKotlin.includes('csGridSaveOrder(CsGridColumnStore.values, persistKey, next)') && timelineDart.includes('csGridSaveOrder(csGridColumnStore, widget.persistKey, next)'), 'native data grids pin a column and store that order');
assert(timelineKotlin.includes('csGridPrefsSave(context, persistKey, next)') && timelineDart.includes('csGridFileSave('), 'native data grids keep the pinned column order after a restart');
assert(read('examples/native/flutter_design/lib/grid_column_file_io.dart').includes('/data/data/') && !read('examples/native/flutter_design/lib/grid_column_file_io.dart').includes('systemTemp'), 'native flutter column file stays out of the temporary directory');
assert(timelineSwift.includes('func orderedKeys') && timelineKotlin.includes('fun csGridOrderedKeys') && timelineDart.includes('csGridOrderedKeys('), 'native data grids pin a column first and ignore an unknown saved key');
assert(timelineSwift.includes('func rowKey') && timelineKotlin.includes('fun csGridRowKey') && timelineDart.includes('csGridRowKey('), 'native data grids keep a blank row id and use the index when the id is missing');
assert(timelineSwift.includes('func shownPlaceholder') && timelineKotlin.includes('fun csTagPlaceholderShown') && timelineDart.includes('csTagPlaceholderShown('), 'native tag fields hide the placeholder once a tag exists and ignore a disabled edit');
assert(timelineSwift.includes('func toneWord') && timelineKotlin.includes('fun csConfidenceToneWord') && timelineDart.includes('csConfidenceToneWord('), 'native confidence meters say the tone in words and keep a blank label blank');
assert(timelineSwift.includes('func toolbarMove') && timelineKotlin.includes('fun csToolbarMove') && timelineDart.includes('csToolbarMove('), 'native toolbars clamp the arrow keys and drop separators from the overflow menu');
assert(remainderSwift.includes('func plainInsert') && remainderKotlin.includes('fun csEditorPlainInsert') && remainderDart.includes('csEditorPlainInsert('), 'native editors escape pasted text');
assert(remainderSwift.includes('func arrowLeft') && remainderKotlin.includes('fun csCascaderArrowLeft') && remainderDart.includes('csCascaderArrowLeft('), 'native cascaders follow the web path');
assert(remainderSwift.includes('func scale') && remainderKotlin.includes('fun csDockScale') && remainderDart.includes('csDockScale('), 'native docks use the web hover scale');
assert(remainderSwift.includes('CSDockModel.scale(index:') && remainderKotlin.includes('csDockScale(index, hover)') && remainderDart.includes('csDockScale(index, hover)'), 'native docks apply the hover scale');
assert(remainderSwift.includes('func rowId') && remainderKotlin.includes('fun csTreeRowId') && remainderDart.includes('csTreeRowId('), 'native tree tables encode row ids');
assert(remainderSwift.includes('CSTreeTableModel.rows') && remainderKotlin.includes('csTreeRows(nodes, expanded)') && remainderDart.includes('csTreeRows(nodes, expanded)'), 'native tree tables render the expanded rows');
assert(remainderSwift.includes('CSTreeTableModel.controls(prefix:') && remainderKotlin.includes('csTreeControls(treeId,') && remainderDart.includes('csTreeControls(treeId,'), 'native tree tables name the open child rows from the twist');
assert(remainderSwift.includes('CSTreeTableModel.toggle(expanded, row.key)') && remainderKotlin.includes('csTreeToggle(expanded, row.key)') && remainderDart.includes('csTreeToggle(expanded, row.key)'), 'native tree tables toggle from the twist');
assert(remainderSwift.includes('func submit') && remainderKotlin.includes('fun csPromptSubmit') && remainderDart.includes('csPromptSubmit('), 'native prompts keep the untrimmed submission');
assert(remainderSwift.includes('func spoken') && remainderKotlin.includes('fun csPromptSpoken') && remainderDart.includes('csPromptSpoken('), 'native prompts speak the placeholder when the accessible name is blank');
assert(remainderSwift.includes('func reviewerLine') && remainderKotlin.includes('fun csReviewerLine') && remainderDart.includes('csReviewerLine('), 'native review gates keep a blank reviewer hidden and prefix a present name');
assert(remainderSwift.includes('let dotCount') && remainderKotlin.includes('csTypingDots') && remainderDart.includes('csTypingDots'), 'native typing indicators keep three dots and a blank label');
assert(remainderSwift.includes('func labelledBy') && remainderKotlin.includes('fun csNativeLabelledBy') && remainderDart.includes('csNativeLabelledBy('), 'native selects keep a zero label and error');
assert(remainderSwift.includes('func placeholderText') && remainderKotlin.includes('fun csSelectPlaceholderText') && remainderDart.includes('csSelectPlaceholderText('), 'native selects keep a blank placeholder and use Select… only when it is missing');
assert(remainderSwift.includes('func addonName') && remainderKotlin.includes('fun csInputGroupAddonName') && remainderDart.includes('csInputGroupAddonName('), 'native input groups keep a blank name and use Input only when nothing else names the field');
assert(remainderSwift.includes('cancelling: cancelling') && remainderKotlin.includes('fun csInlineCommit') && remainderDart.includes('csInlineCommit('), 'native inline edits cancel before commit');
assert(remainderKotlin.includes('editing = true') && remainderDart.includes('editing = true'), 'native inline edits open a field');
assert(remainderSwift.includes('if !isFocused { finish() }') && remainderKotlin.includes('else if (sawFocus) finish()') && remainderDart.includes('else if (sawFocus) finish()'), 'native inline edits commit on blur');
assert(remainderKotlin.includes('csQrMatrix(value)') && remainderDart.includes('csQrMatrix(value)'), 'native QR widgets draw the matrix');
assert(read(join(flutterRoot, 'lib/screens/home_screen.dart')).includes('CsListRow'), 'Flutter home uses the design library list');
const mainDart = read(join(flutterRoot, 'lib/main.dart'));
assert(mainDart.includes("'/sign-in'") && mainDart.includes("'/home'") && mainDart.includes("'/settings'"), 'Flutter routes');
assert(
  read(join(flutterRoot, 'lib/tokens/cs_tokens.dart')).includes('colorBrandUmber'),
  'Flutter ships synced CSTokens',
);

// A widget fixture is not an Android application. The sample must ship its
// runner and checked wrapper so a fresh checkout can build a debug APK.
for (const rel of ['android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/kotlin/world/cyberskill/cyberskill_sample/MainActivity.kt',
  'android/settings.gradle', 'android/app/build.gradle', 'android/gradlew',
  'android/gradle/wrapper/gradle-wrapper.jar', 'android/gradle/wrapper/gradle-wrapper.properties']) {
  assert(existsSync(join(root, flutterRoot, rel)), 'Flutter Android runner missing '+rel);
}
assert(read(join(flutterRoot,'android/gradle/wrapper/gradle-wrapper.properties')).includes('distributionSha256Sum=591855b517fc635b9e04de1d05d5e76ada3f89f5fc76f87978d1b245b4f69225'), 'Flutter wrapper distribution checksum missing');
assert(createHash('sha256').update(readFileSync(join(root,flutterRoot,'android/gradle/wrapper/gradle-wrapper.jar'))).digest('hex') === '0336f591bc0ec9aa0c9988929b93ecc916b3c1d52aed202c7381db144aa0ef15', 'Flutter Gradle wrapper must match official Gradle 8.3 checksum');
assert(!read(join(flutterRoot,'android/app/build.gradle')).includes('signingConfig = signingConfigs.debug'), 'Flutter release must not use debug signing');
assert(read('scripts/ci/native-validation.sh').includes('flutter build apk --debug'), 'Native Flutter CI must build the actual Android runner');

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

// Check consumer references against the shipped API; this catches misspelled or
// stale token names but does not replace a compiler or rendered-device test.
for (const [directory, screens, tokenPath] of [
  [swiftRoot, swiftScreens, 'Sources/CyberSkillSample/CSTokens.swift'],
  [composeRoot, composeScreens, 'app/src/main/java/world/cyberskill/sample/tokens/CSTokens.kt'],
  [flutterRoot, flutterScreens, 'lib/tokens/cs_tokens.dart'],
]) {
  const declarations = read(join(directory, tokenPath));
  for (const screen of screens) for (const [,name] of read(join(directory, screen)).matchAll(/CSTokens\.(\w+)/g)) {
    assert(new RegExp('\\b'+name+'\\b').test(declarations), screen+' references missing token '+name);
  }
  const settings = read(join(directory, screens[2]));
  for (const metric of ['densityControlGap','componentButtonMdPaddingX','componentButtonMdPaddingY']) {
    for (const mode of ['Compact','Comfortable']) assert(settings.includes('CSTokens.'+metric+mode), directory+' Settings must consume '+metric+mode);
  }
}

// Inventory size
const swiftFiles = walk(join(root, swiftRoot)).filter((f) => f.endsWith('.swift'));
const ktFiles = walk(join(root, composeRoot)).filter((f) => f.endsWith('.kt'));
const dartFiles = walk(join(root, flutterRoot)).filter((f) => f.endsWith('.dart'));
assert(swiftFiles.length >= 5, 'swift multi-file');
assert(ktFiles.length >= 5, 'kotlin multi-file');
assert(dartFiles.length >= 4, 'dart multi-file');

// Dry-run must stay green without secrets (FIND Phase 5 native verification).
// Unit validation must not rewrite a report that Storybook fingerprints.
const canonicalReport = join(root, '_audit/ci/native-store-report.json');
const canonicalBefore = existsSync(canonicalReport) ? readFileSync(canonicalReport) : null;
const reportDirectory = mkdtempSync(join(tmpdir(), 'cs-native-store-test-'));
try {
  const reportPath = join(reportDirectory, 'report.json');
  const dry = spawnSync(process.execPath, [join(root, '_audit/ci/native-store-dry-run.mjs'), '--dry-run', '--report-path=' + reportPath], {
    cwd: root,
    encoding: 'utf8',
  });
  assert(dry.status === 0, 'native-store-dry-run --dry-run failed: ' + (dry.stderr || dry.stdout));
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  assert(report.ok === true && report.skipped === false && report.dryRun === true && report.submit === false,
    'Native sample validation requires an executed scaffold dry-run, not readiness or soft skip');
  assert(report.platforms.length === 3 && report.platforms.every(platform => platform.ok === true), 'All native scaffolds must pass');
  assert(report.tokens.length === 3 && report.tokens.every(token => token.ok === true), 'All canonical native tokens must pass');
} finally {
  rmSync(reportDirectory, {recursive: true, force: true});
}
assert(canonicalBefore === null ? !existsSync(canonicalReport) : readFileSync(canonicalReport).equals(canonicalBefore),
  'Native sample unit check changed the canonical diagnostic report');

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
