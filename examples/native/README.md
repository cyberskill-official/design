# Native multi-screen sample apps

Post-LAUNCH samples (VERSION tracks the repo root file) that demonstrate **Sign in → Home (wish list) → Settings** on three platforms, consuming **generated** design tokens from `tokens/native/` (not hand-copied hex).

| App | Path | Token source |
|---|---|---|
| SwiftUI | `examples/native/swiftui/` | `CSTokens.swift` (synced) |
| Jetpack Compose | `examples/native/compose/` | `tokens/CSTokens.kt` (synced, package remapped) |
| Flutter | `examples/native/flutter/` | `lib/tokens/cs_tokens.dart` (synced) |

## Sync tokens after DTCG changes

```bash
node _audit/ci/generate-native-tokens.mjs
node examples/native/sync-tokens.mjs
```

## Build / run (when toolchains exist)

### SwiftUI (macOS / Xcode)

```bash
cd examples/native/swiftui
swift build
# or open Package.swift in Xcode and run the CyberSkillSample scheme
```

### Compose (Android Studio — supported path)

Open `examples/native/compose/` in **Android Studio** (Hedgehog+ / AGP 8.2-compatible). Select **JDK 17** as the Gradle JDK for this sample's Gradle 8.2.1 / AGP 8.2.2 toolchain, then use **Run** on the `app` configuration. Newer Android Studio installations can bundle a different Java version; the bundled runtime alone does not establish build compatibility.

There is **no committed `gradlew`** in this sample. First sync does **not** create the wrapper scripts — those come from the Gradle `wrapper` task. A fresh clone therefore needs an explicit bootstrap (`gradle wrapper --gradle-version 8.2.1` with **JDK 17**) before `./gradlew :app:assembleDebug` is usable, and `assembleDebug` still needs an Android SDK (`ANDROID_HOME` / `ANDROID_SDK_ROOT`). Android Studio can provide the SDK and a compatible configured Gradle JDK.

Optional CLI (when JDK 17, Gradle 8.2.1 and `ANDROID_HOME` / `ANDROID_SDK_ROOT` are already set):

```bash
cd examples/native/compose
# Fresh clone: generate the wrapper first (JDK 17), then assemble:
gradle wrapper --gradle-version 8.2.1
./gradlew :app:assembleDebug
```

### Flutter (Android runner)

The Android runner is committed, using the pinned Flutter 3.24.5 template with
AGP 8.1.0, Kotlin 1.8.22 and checksum-verified Gradle 8.3. Use JDK 17 and Android
SDK 34. Flutter may select Android Studio's SDK/JDK ahead of shell environment
variables; configure the intended paths with `flutter config --jdk-dir ...
--android-sdk ...`. For isolated verification, set `XDG_CONFIG_HOME` to a task
configuration directory first. Debug builds use the local Android debug key;
release signing and store submission are not configured. This runner does not
provide an iOS build host.

```bash
cd examples/native/flutter
flutter pub get
flutter analyze
flutter build apk --debug
flutter run -d <selected-android-device>
```

## Store packaging scaffolds (Fastlane)

Each platform ships a **Fastlane scaffold** + listing metadata placeholders. These are reproducible packaging paths — **not** App Store / Play Store products. Samples remain samples until a real product need.

| Platform | Fastlane | Metadata | Signing |
|---|---|---|---|
| SwiftUI | `swiftui/fastlane/` | `metadata/en-US/*` | `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` |
| Compose | `compose/fastlane/` | `metadata/android/en-US/*` | `PLAY_SERVICE_ACCOUNT_JSON` + `signing.properties.example` |
| Flutter | `flutter/fastlane/` | `metadata/{ios,android}/en-US/*` | ASC_* + Play JSON |

```bash
# Local dry-run (no secrets): verify scaffolds + metadata
npm run native:store-dry-run
# or: bundle exec fastlane release_dry_run   (from each platform dir after bundle install)

# CI soft-skips signed-release check without ASC_*/PLAY_SERVICE_ACCOUNT_JSON (Decision 1C).
# Store submit lanes (`upload_store`) are intentionally disabled.
```

Compose: copy `signing.properties.example` → `signing.properties` (gitignored) before a local signed `assembleRelease`.

## Scope (honest)

These are **sample hosts**, not App Store / Play Store products. No backend. Navigation and brand-token usage are the bar. Full product shells remain product work. The packaging scaffolds clear the backlog path without submitting builds.

Structural CI: `npm run test:native-samples`. Store dry-run: `npm run native:store-dry-run` + workflow `.github/workflows/native-store.yml`.

## Verification boundaries

`test:native-samples` checks source structure and scaffolds; it does not compile any native app. A Swift compiler and SDK on PATH are also insufficient proof that SwiftUI build plugins are usable. Before the sample build, a minimal probe can isolate toolchain failures:

```bash
# From repository root
swiftc -typecheck _audit/ci/fixtures/swiftui-toolchain-probe.swift
swiftc -typecheck -target arm64-apple-macos13.0 tokens/native/CSTokens.swift
```

A missing `SwiftUIMacros.StateMacro` in the minimal probe is a toolchain blocker, not a passing sample build. Use a compatible configured SwiftUI toolchain before claiming compilation. Token typechecking alone does not verify app navigation, locale/theme behavior, appearance or native parity. Current source-linked attempts are recorded in the repository-only `_audit/revision/checkpoints/` directory.

## Density sample

Settings includes a **Compact spacing** switch, initially off. It selects the generated `Comfortable` or `Compact` constants for control spacing and the Sign out button's horizontal/vertical content padding. This setting is local to the mounted Settings screen; reopening the screen starts comfortable. It does not change theme, language or the minimum control height.

Expected logical dimensions (SwiftUI points, Compose dp, Flutter logical pixels):

| Metric | Comfortable | Compact |
|---|---:|---:|
| Control gap | 8 | 6 |
| Medium button horizontal padding | 20 | 16 |
| Medium button vertical padding | 12 | 10 |

Run `npm run test:density-exports` from the repository root to compare generated metrics against computed browser CSS. `npm run test:native-samples` checks source structure and token references; it does not compile or render the apps. With each platform toolchain, build the sample, open Settings, toggle compact on/off, and verify the spacing and padding change while the button retains its token minimum height. These runtime checks remain required for native parity acceptance.

## Theme preference

**Prefer dark theme** selects the generated light/dark color roles for Sign in,
Home and Settings, and the corresponding Material or SwiftUI control appearance.
The preference is owned above navigation: it survives leaving and reopening
Settings, including sign-out navigation. It starts light when the sample app is
restarted and is not persisted to a device setting or backend. Brand swatches
retain their immutable Umber and Ochre colors. Compact spacing remains local to
Settings as described above; it does not reset the theme preference.

Flutter widget regressions exercise theme switching, navigation retention and
compact button padding/minimum height. Native compilation and these tests do
not establish cross-platform visual, device or assistive-technology parity.

## Shared sample copy and language selection

All three samples start in Vietnamese and offer Tiếng Việt / English in Settings.
The 24 copy pairs live in `sample-copy.json`; `npm run native:copy` generates the
Swift, Kotlin and Dart enums. `npm run test:native-copy` checks the projections
and rejects missing/empty translations, duplicate keys, unsupported languages,
non-NFC text and invalid literals. It does not certify rendered layout or speech.

Language is owned above navigation, independently of theme and density. It
survives returning Home and signing out, and resets to Vietnamese when the app
restarts. Settings density remains local to that screen. All labels, sample wish
titles and statuses use the shared copy. Flutter configures its supported locales
and Material localization delegates; SwiftUI receives the selected locale in its
environment. Compose changes the sample copy without changing the device locale.
The samples contain no date, number or currency formatting fields; those are not
claimed as cross-platform formatting evidence.

Flutter widget tests and Compose instrumented tests exercise live language changes,
theme retention, density reset and navigation. The Flutter test also preserves a
sign-in draft when Settings is pushed above it. Swift tests check the copy and
preference state; execution still requires a compatible SwiftUI toolchain.

## Bundled native typography

All three samples bundle Be Vietnam Pro at weights 400, 500, 600 and 800, with the
complete OFL notice in each platform resource bundle. `fonts/manifest.json`
records the upstream commit, exact TTF hashes, weights and PostScript names from
the repository's pinned `fonts/subset-recipe.json`. These are the original,
unmodified full TTFs; web WOFF2 subsets and their CSS bindings are unchanged.
`npm run native:fonts` projects the byte-identical files and notices; its check
rejects changed source bytes or missing resources. The native UI-family token
binds to Be Vietnam Pro; Flutter and SwiftUI resolve the resource family from
that generated token, and Compose uses the corresponding resource FontFamily
for all Material typography styles.

SwiftUI registers the resource fonts for its process and requests scalable custom
fonts. Failure to load a bundle resource is reported rather than silently treated
as success. A separate macOS CoreText resource probe can verify registration,
face names and all 24 EN/VI strings in NFC/NFD. That probe does not build or render
the SwiftUI app. The local SwiftUI app build still requires the unavailable
SwiftUIMacros plugin; a configured Xcode build/test remains necessary.

Android's instrumented font test resolves all four resource weights, rejects the
system default typeface and checks the sample characters. Flutter render tests
explicitly load all four bundled faces. Font-table checks cover sample NFC/NFD
characters, exact weights and names. These bounded checks do not establish
arbitrary Unicode coverage, all shaping/fallback cases, matched platform line
metrics, device assistive technology or human visual acceptance.

## Flutter rendered layout evidence

Native CI runs `flutter test --update-goldens verification/render_samples.dart`
with the pinned Flutter 3.24.5 installation. This captures
96 cases in both EN/VI: Sign in, Home and Settings at 360×800 and 800×600, light/dark,
100%/150%/200% text, and both Settings spacing modes. Home and Settings also record the
view after bringing Sign out into view, check that the control is hit-testable
and activate it to verify return to Sign in.
Framework layout exceptions fail the run. Settings content can scroll while its
bottom action retains the generated minimum height and density padding.

The generated PNGs are review evidence, not approved pixel baselines. They use
the bundled Be Vietnam Pro weights with retained hashes. Paragraph-layout
checks reject constrained/truncated text; font glyph boxes may overhang tight
line boxes without actual clipping. Home content scrolls and its heading wraps
at enlarged text. Settings' language selector grows with its label. These
captures do not verify arbitrary fallback, assistive technology, SwiftUI/Compose
visual parity or human acceptance. Images and logs are retained as CI artifacts.

Flutter Sign in scrolls when keyboard insets reduce the viewport and uses the
button token as a minimum height. Sixteen widget checks include twelve keyboard
fixtures (EN/VI, both sizes, text 1/1.5/2) with the actual bundled fonts; entered
drafts, password obscuring, named semantics, action reachability and navigation
are checked. The rendered matrix produces 168 PNGs including Home/Settings end
views. These checks retain the distinction between widget rendering and a
running Android application.

A local debug APK was also installed on the owned Android 14/API34 arm64 emulator.
Two actual windows, 360×800 and 800×600 at OS font setting 200%, exercised EN/VI,
both themes, preference retention, density reset, Sign out and submitting with
the real Android keyboard open. The installed APK digest matches the final
build and its font resources match the manifest. This finite device run does
not certify TalkBack speech, every OS scaling curve, iOS or human appearance
acceptance. Logs, captures and source hashes are recorded in the revision
checkpoint `w13-language-font-runtime-20261008.json`.

## Compose rendered layout and control semantics

Compose Sign in uses the generated button minimum height while allowing its
label to grow at larger text sizes. Settings keeps its Sign out action at the
bottom and gives the other controls a scrolling region. The theme and spacing
rows expose their visible labels, switch roles and checked states as one
interactive control per row; tapping the label or switch uses the same callback.

On a dedicated API 34 emulator, the instrumented tests exercise 96 rendered
cases in both EN/VI: three screens, 360×800/800×600 content regions, light/dark, uniform test
text scales 1/1.5/2, and both Settings spacing modes. They check native text-line
bounds, full label/action reachability, filled-button minimum height, Home's
44dp effective hit area, and action callbacks. Three additional tests check the
actual app's navigation, theme/language retention, density reset, password
semantics and Settings control names. A fourth checks bundled font resolution
and the sample glyphs at all declared weights. Text measurement allows one physical pixel for rounding;
paragraph maximum constraints are not treated as painted glyph widths.

With JDK 17, Gradle 8.2.1, API 34 SDK/build tools and a dedicated running emulator:

```bash
cd examples/native/compose
# Compilation of the app and instrumented test APKs:
gradle :app:assembleDebug :app:assembleDebugAndroidTest
# Runtime checks; select the intended emulator with ANDROID_SERIAL:
gradle :app:connectedDebugAndroidTest
# Captures survive the test runner's removal of its app:
adb -s "$ANDROID_SERIAL" pull /sdcard/Download/cs-native-language-evidence ./native-rendered
```

The native CI Compose job compiles both APKs; its compilation verdict does not
claim execution of the instrumented tests. The Flutter CI job builds a debug
Android APK as well as running widget and rendered-layout checks; APK compilation
does not establish device execution. Runtime receipts and source hashes
are retained in the repository-only revision checkpoints. The local 2026-10-08
run used Android 14/API 34 arm64 and captured 192 matrix PNGs after the bilingual/font revision. Earlier system-font
checks used the actual system font setting at 200% and physical windows of
360×800/800×600 in both themes, checking named/checkable controls and Sign out
navigation. Those checks predate this bilingual/font revision. The latest captures use the bundled Be Vietnam Pro faces and are review
evidence rather than approved baselines. Earlier system-font captures remain
historical evidence. Uniform
`LocalDensity` overrides in the matrix do not certify every OS font-scaling
curve. Device/TalkBack behavior,
SwiftUI application build/appearance, cross-platform line metrics/locale
formatting and human acceptance remain separate requirements.
