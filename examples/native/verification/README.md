# Native locale API comparison

The shared `locale-formatting.json` fixture compares 52 fixed cases with the
current web helpers: EN/VI numbers, VND/USD/EUR/JPY amounts and two civil dates.
All values are demonstrations. These probes call Foundation, Android and Dart
intl directly; the sample screens contain no formatting fields. They do not
establish app layout, spoken output, timezone policy or owner acceptance.

Each currency case records both the default formatter after assigning a currency
code and a profile configured to match the preferred web currency contract.
Foundation and Android explicitly use ISO minor units and half-up rounding for
that profile. Dart intl already selects ISO minor units; its full currency-name
symbols remain visible. The EN date profile follows the web helper's `en-GB`
short-month form. Dates use a fixed UTC civil date, independent of the device zone.
The fixture does not add a region axis to the products.

Replay against a selected toolchain and scratch output directory:

```bash
swiftc -parse-as-library \
  examples/native/swiftui/Sources/CyberSkillSample/SampleLanguage.swift \
  examples/native/verification/swift/LocaleFormattingProbe.swift \
  -o "$CS_FORMATTING_OUTPUT/foundation-probe"
"$CS_FORMATTING_OUTPUT/foundation-probe" \
  examples/native/verification/locale-formatting.json > "$CS_FORMATTING_OUTPUT/foundation.json"
"$CS_FLUTTER_SDK/bin/dart" --packages="$CS_SAMPLE_PACKAGE_CONFIG" \
  examples/native/verification/flutter/locale_formatting_probe.dart \
  examples/native/verification/locale-formatting.json > "$CS_FORMATTING_OUTPUT/flutter-intl.json"
```

Set the output directory first. The selected Flutter package configuration must
come from a resolved sample using the pinned Flutter toolchain; record its intl
version and lockfile identity. The Dart script imports the actual sample language
enum and records the Dart runtime. The Swift probe imports the actual Swift enum.
Standalone Foundation compilation does not prove a SwiftUI app build.

For Android, copy the sample into an isolated build directory, then copy
`android/NativeLocaleFormattingTest.kt` into the test source package
`app/src/androidTest/java/world/cyberskill/sample/probe/` and the fixture into
`app/src/androidTest/assets/locale-formatting.json`. With the sample's pinned
JDK/Gradle/SDK and an explicitly selected owned emulator, run
`:app:connectedDebugAndroidTest` with
`-Pandroid.testInstrumentationRunnerArguments.class=world.cyberskill.sample.probe.NativeLocaleFormattingTest`.
The one instrumented test exports 92 rows (52 configured cases plus 40 default
currency cases) to `/sdcard/Download/cs-native-formatting-evidence/android.json`.
Pull that exact path from the selected serial. Preserve the Gradle log and XML
result. Gradle removes the test APK, so app-private output does not survive.
