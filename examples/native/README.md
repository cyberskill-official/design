# Native multi-screen sample apps

Pre-release samples (VERSION still **1.0.0**) that demonstrate **Sign in → Home (wish list) → Settings** on three platforms, consuming **generated** design tokens from `tokens/native/` (not hand-copied hex).

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

Open `examples/native/compose/` in **Android Studio** (Hedgehog+ / AGP 8.2-compatible). Android Studio supplies the JDK and can generate a Gradle wrapper on first sync. Then Run the `app` configuration.

There is **no committed `gradlew`** in this sample: bootstrapping a wrapper still needs **JDK 17+**, and `assembleDebug` still needs an Android SDK. Without those, a CLI `./gradlew` path is not runnable from a plain clone — use Android Studio.

Optional CLI (only when JDK 17+ and `ANDROID_HOME` / `ANDROID_SDK_ROOT` are already set):

```bash
cd examples/native/compose
# After Android Studio has generated the wrapper (or you ran `gradle wrapper` on JDK 17+):
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
