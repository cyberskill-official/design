# Explicit typed native mode data

`CSModes.swift`, `CSModes.kt` and `cs_modes.dart` add a data API beside the existing flat `CSTokens` constants. No existing identifier, type, value or file is replaced. Generate with `node scripts/generate-native-mode-packs.mjs` after canonical standalone modes are fresh; use `--check` for read-only freshness.

Callers must choose every axis: theme, color scheme, element, variant, density, contrast and the existing liquid-glass style. A null element explicitly selects the default palette; a null variant explicitly selects the middle variant. Light/dark themes require the matching color scheme. System theme requires an explicit light/dark branch. Invalid element/variant combinations are rejected. There is no OS detection, missing-axis default or guessed fallback.

Swift example:

```swift
let pack = try CSModes.resolve(
  theme: .system, colorScheme: .dark,
  element: .hoa, variant: .plasma,
  density: .compact, contrast: .high, style: .liquidGlass)
let surface: CSColorValue = pack.colorSurfacePanel
let height: CSDimension = pack.componentButtonMdMinHeightAlias
```

Kotlin uses the same required arguments with `CSTheme.SYSTEM`, `CSColorScheme.DARK`, `CSElement.HOA`, `CSVariant.PLASMA`, `CSDensity.COMPACT`, `CSContrast.HIGH` and `CSStyle.LIQUID_GLASS`. Dart uses required named arguments with the same camelCase enum cases as Swift. Invalid selections throw Swift `CSModeError.invalidSelection`, Kotlin `IllegalArgumentException` or Dart `ArgumentError`. Dart source requires null safety (Dart 2.12 or later); this is a language requirement, not a claim of validation across Flutter versions.

Each selected pack exposes 194 typed getters and 12 explicit omission records from its canonical document. This differs from the 197 authored portable-root members: three relative-em members are omitted, and nine separately classified material/identifier declarations are also explicit omissions. Every omission retains its name, reason and resolved CSS. Additional kebab aliases have distinct `Alias` native names while retaining the same value as their legacy spelling.

Colors preserve sRGB or OKLAB channels, including out-of-sRGB values. Dimensions retain px/rem, durations retain ms/s, font families remain ordered lists and curves retain all four coordinates. Shadows retain ordered typed layers with their color, offsets, blur and spread; a single layer becomes a one-item list. A scalar font family likewise becomes a one-item list. There is no implicit rem baseline, px-to-point/dp conversion, gamut clipping, dynamic font mapping or shadow-to-widget conversion. Current canonical shadows have no inset field; additional/inset shadow fields fail before writing rather than being discarded. Platform UI adapters and appearance acceptance remain separate work.

Structural sharing stores 389 distinct typed values and 128 value rows for the 256 selections. The three self-contained sources total approximately 645 KB; `mode-provenance.json` records exact byte counts, input hashes and output hashes. No runtime JSON loading or external resource lookup is required.

`test-native-mode-packs.mjs` validates all canonical inputs, preserves legacy files, reads literal data/getter slots from actual Kotlin/Dart source and checks every value and omission with semantic mutations and failure-preservation negatives. These are source-level checks. `test-native-mode-swift.mjs` requires an actual Swift compiler and executes all 49,664 getters, all 1,584 typed axis combinations and compiled semantic mutations. Numeric proof compares exact Double bit patterns. Kotlin/Compose and Dart/Flutter compilation/execution remains unverified where those toolchains are unavailable; passing source checks do not establish that acceptance. Swift validation establishes data behavior on the tested compiler/SDK, not native UI rendering or device/manual accessibility acceptance.

Kotlin index rows use validated decimal CSV literals decoded to integer lists, keeping tens of thousands of index literals out of one JVM initializer. This is a bounded generation choice informed by the [JVM method code-length limit](https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.7.3), not a substitute for actual Kotlin compilation.
