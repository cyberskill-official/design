#!/usr/bin/env bash
set -euo pipefail
mkdir -p native-evidence
evidence_dir="$PWD/native-evidence"
{
  git rev-parse HEAD
  printf 'Platform: %s\nRunner image: %s %s\n' "$NATIVE_PLATFORM" "${ImageOS:-unknown}" "${ImageVersion:-unknown}"
  git ls-files -z examples/native tokens/native scripts/ci/native-validation.sh .github/workflows/native-validation.yml |
    xargs -0 shasum -a 256
} > native-evidence/source.txt
case "$NATIVE_PLATFORM" in
  swiftui)
    export DEVELOPER_DIR=/Applications/Xcode_16.4.app/Contents/Developer
    test -d "$DEVELOPER_DIR"
    xcodebuild -version
    swift --version
    cmp tokens/native/CSTokens.swift examples/native/swiftui/Sources/CyberSkillSample/CSTokens.swift
    swift build --package-path examples/native/swiftui --scratch-path "$RUNNER_TEMP/native-swift-build"
    swift test --package-path examples/native/swiftui --scratch-path "$RUNNER_TEMP/native-swift-build"
    ;;
  compose)
    export JAVA_HOME="$JAVA_HOME_17_X64"
    export PATH="$JAVA_HOME/bin:$PATH"
    java -version
    sed 's/^package world\.cyberskill\.tokens$/package world.cyberskill.sample.tokens/' tokens/native/CSTokens.kt > "$RUNNER_TEMP/CSTokens-sample.kt"
    cmp "$RUNNER_TEMP/CSTokens-sample.kt" examples/native/compose/app/src/main/java/world/cyberskill/sample/tokens/CSTokens.kt
    "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" 'platforms;android-34' 'build-tools;34.0.0'
    curl --fail --location --retry 3 https://services.gradle.org/distributions/gradle-8.2.1-bin.zip -o "$RUNNER_TEMP/gradle.zip"
    printf '%s  %s\n' '03ec176d388f2aa99defcadc3ac6adf8dd2bce5145a129659537c0874dea5ad1' "$RUNNER_TEMP/gradle.zip" | sha256sum --check
    unzip -q "$RUNNER_TEMP/gradle.zip" -d "$RUNNER_TEMP"
    "$RUNNER_TEMP/gradle-8.2.1/bin/gradle" --no-daemon --console=plain -p examples/native/compose :app:assembleDebug
    ;;
  flutter)
    cmp tokens/native/cs_tokens.dart examples/native/flutter/lib/tokens/cs_tokens.dart
    git clone --depth 1 --branch 3.24.5 https://github.com/flutter/flutter.git "$RUNNER_TEMP/flutter"
    test "$(git -C "$RUNNER_TEMP/flutter" rev-parse HEAD)" = dec2ee5c1f98f8e84a7d5380c05eb8a3d0a81668
    export PATH="$RUNNER_TEMP/flutter/bin:$PATH"
    flutter --version
    cd examples/native/flutter
    flutter pub get
    cp pubspec.lock "$evidence_dir/flutter-pubspec.lock"
    flutter analyze --no-fatal-infos
    flutter test
    ;;
  *) printf 'Unsupported native platform: %s\n' "$NATIVE_PLATFORM" >&2; exit 2 ;;
esac
printf 'PASS %s compilation/checks; native visual parity and human acceptance remain unverified.\n' "$NATIVE_PLATFORM"
