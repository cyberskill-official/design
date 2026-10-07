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

Open `examples/native/compose/` in **Android Studio** (Hedgehog+ / AGP 8.2-compatible). Android Studio supplies the JDK; use **Run** on the `app` configuration for the supported path.

There is **no committed `gradlew`** in this sample. First sync does **not** create the wrapper scripts — those come from the Gradle `wrapper` task. A fresh clone therefore needs an explicit bootstrap (`gradle wrapper` with **JDK 17+**) before `./gradlew :app:assembleDebug` is usable, and `assembleDebug` still needs an Android SDK (`ANDROID_HOME` / `ANDROID_SDK_ROOT`). Without those, use Android Studio.

Optional CLI (only when JDK 17+ and `ANDROID_HOME` / `ANDROID_SDK_ROOT` are already set):

```bash
cd examples/native/compose
# Fresh clone: generate the wrapper first (JDK 17+), then assemble:
gradle wrapper
./gradlew :app:assembleDebug
```

### Flutter

```bash
cd examples/native/flutter
flutter pub get
flutter analyze
flutter run
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

## SwiftUI language selection

The SwiftUI sample starts in Vietnamese. Settings selects Tiếng Việt or English
for all three screens, including sample wish titles and statuses. This preference
is owned above navigation, independently of theme and density, and resets to
Vietnamese on app restart. The selected locale is also passed to SwiftUI's
locale environment. The sample has no date, number or currency formatting fields;
this does not establish locale-formatting parity across platforms.

`swift test --package-path examples/native/swiftui` checks the complete sample
copy set and language/theme state independence. Native CI builds the screens and
runs these tests; live picker interaction and device accessibility still require
verification. Compose and Flutter currently retain their English sample copy;
this SwiftUI repair does not certify their bilingual coverage.
