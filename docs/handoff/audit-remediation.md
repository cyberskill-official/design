# Handoff: 29 Oct 2026 audit remediation

Updated: 2026-11-01, after the compose-compile-fixes checkpoint. Goal is still active. Do not mark it complete.

Operator instruction for this checkpoint: commit and push, then record the behavior hash and push that note. Do not publish, deploy, or merge.

## Resume from

- Repo: `/Users/stephencheng/Projects/CyberSkill/design`
- Branch: `main`, tracking `origin/main`
- Audit baseline before this work: `b935f72be11c464603f533a694b043c52f90e747` (`v2.0.0`)
- Checkpoint commit: see the latest commit that touches this file. The first push of this handoff records that hash in the section below after the commit exists.
- Previous checkpoint: `c94d2bb634ca9c73b747b99410925a02088cfc4b`, with the hash note in `c610886a`
- Checkpoint commit hash: `2f72057f5c84027ac346cf5815e92946e17daa2d`
- Temporarily disabled GitHub Actions push workflows (re-enable with `gh workflow enable` when done): `Design System Gates` (`316944477`), `native-validation` (`377620668`), `native-store` (`318755963`), `OpenSSF Scorecard` (`330342703`)

The Cursor canvas is outside this git repo:

`/Users/stephencheng/.cursor/projects/Users-stephencheng-Projects-CyberSkill-design/canvases/design-system-benchmark-audit.canvas.tsx`

Last canvas phrase: `selected row, vietnamese first,`. Do not raise the Platforms score. Platforms stays 2.

## What the goal still requires

Solve every finding from the 29 Oct 2026 audit, then re-benchmark against the same rubric and reference systems with fresh evidence.

| Finding | State |
|---|---|
| F1 theme toggle repaint and contrast | Done in source. Theme channel `choose()` has no space between the two `var()` calls. |
| F2 manual AT matrix | Not done. All 16 rows are still `pending`. Do not invent NVDA or VoiceOver observations. Publication refuses a row that is not passed-with-evidence. |
| F3 security support line | Source `SECURITY.md` names 2.0.x. The published tarball still says 1.7.x until an authorized publish. Do not publish. |
| F4 distribution review | `distributionApproval` is false. Rights review is pending for `support.js`, `doc-export.js`, and `image-slot.js`. Do not invent a grant. `LICENSE` stays `UNLICENSED`. |
| F5 hard visual coverage | A 16th swatch exists. `component-states.png` matched a local Ubuntu 24.04.4 Chromium 1234 capture only. It does not prove the original 15 text baselines on the GitHub `ubuntu-24.04` runner. Do not commit macOS PNGs over the Linux baselines. |
| F6 bounded specs | All 120 exports have at least one bounded requirement. Do not add display-only behavior-board cases to inflate `completeBehaviorSpecifications` or `completeAccessibilitySpecifications`. |
| F7 close callbacks | Shared `onOpenChange(false)` is in place. Older close callbacks still run after it. |
| F8 native libraries | In progress. Swift, Compose, and Flutter libraries exist. This is not behavioral parity with the 120-component web set. |
| F9 token names | Kebab names own the values. camelCase reads `var(--kebab)`. |
| F10 Menubar roving tabindex | Done on the web side. |
| F11 DataGrid selection | Done on the web side. |
| Re-benchmark | Interim canvas only. Reference systems were not re-read. The full unit suite was not re-run. |

Scores that must not be raised without new evidence: Tokens 3, Coverage 3, API 3, A11y evidence 2, Docs 3, Release 2, Platforms 2.

## Verify the last native checkpoint

From the repo root, with Node >= 22.12:

```bash
swift test --package-path examples/native/swiftui --filter testCatalogRulesMatchTheWebComponents && node _audit/ci/test-native-samples.mjs
```

Last run after resolving the Kotlin/Compose compilation and import errors across `Catalog.kt`, `Fields.kt`, `Flows.kt`, `Overlays.kt`, `Primitives.kt`, `Remainder.kt`, `Structures.kt`, and `Surfaces.kt`: the catalog test passed in about 0.006s, and `test-native-samples.mjs` printed `PASS`. Compose and Flutter were not compiled locally. There is no `ANDROID_HOME`, no Flutter SDK, and no `javac`.

`_audit/ci/test-publication-validation.mjs` fails on Node 24 before any command runs. That failure is environmental. CI uses Node 22. Do not loosen the check.

## Latest checkpoint

Resolved all Kotlin/Compose compilation and import errors in `examples/native/compose/design/src/main/java/world/cyberskill/design/{Catalog,Fields,Flows,Overlays,Primitives,Remainder,Structures,Surfaces}.kt` reported by `:design:compileDebugKotlin`: replaced desktop-only `onPointerEvent` with a shared `pointerInput` / `awaitPointerEventScope` extension in `Remainder.kt`, made `csControlEnabled` non-`@Composable` backed by `CsDisabledScope` so event/key lambdas can call it outside `@Composable` contexts, hoisted `LocalCsLanguage.current` and `LocalContentColor.current` reads out of non-`@Composable` `semantics` and `Canvas` lambdas (`CsCalendar`, `CsProgressBar`, `CsInlineEdit`), fixed misplaced `@Composable` annotations on `CsAlertDialog`, `csTableCopy`, `CsToggle`, and `CsContextMenu`, updated `CsWatermark` `drawText` and `CsContextMenu` `awaitPointerEvent().buttons.isSecondaryPressed`, removed duplicate `csTagCopy` in `Primitives.kt` and `csDescriptionSpoken` in `Catalog.kt`, widened `csDateFormat`/`csDateParse` `language` to `String?`, and added missing layout/semantics/modifier imports in `Catalog.kt`, `Fields.kt`, `Flows.kt`, `Remainder.kt`, `Structures.kt`, and `Surfaces.kt`.

- Compose and Flutter were not compiled locally.
- Swift catalog test and `node _audit/ci/test-native-samples.mjs` passed.

## Next concrete step

Style the base reset and typographic role utilities in Swift, Compose, and Flutter (`scroll-padding-block` `space-4` `16px`, page background + primary ink + `font-family-ui` + `font-size-base` + `1.5` body line-height, `1.35` heading line-height, `:focus-visible` `2px` primary outline at `2px` offset + `5px` ochre halo + `2px` ochre drop-shadow fallback, `.cs-skip` offscreen `-999px`/`1x1` and focused `fixed` `12x12` `toast+1` `10x14` panel with `2px` brand-ochre border + `5px` ochre halo + `shadow-md`, plus `.cs-display`/`.cs-h1`..`.cs-h4`/`.cs-body-lg`/`.cs-body`/`.cs-secondary`/`.cs-caption`/`.cs-eyebrow`/`.cs-mono`/`.cs-display-face` role rules from `base/reset.css` lines 1–62 and `base/typography.css` lines 1–20).

Keep going one real behavior at a time. Do not stop at another string table when a view already calls `copy`. Do not redefine F8 as "struct names exist".

## Native rules that already bit this work

- Quote Vietnamese from `components/_i18n/strings.js`. Do not invent a translation. Do not translate "Lumi". `NativeSelect.jsx` has no `makeT`; do not invent a Vietnamese placeholder for it.
- `!= null` and `??` keep an explicit empty string. `||` replaces an empty string with the table. Match the web operator.
- Missing language: explicit tag, then parent, then Vietnamese. Missing key: requested locale, then `en`, then `vi`. A `ja` table is used only when `strings.js` has one.
- Kotlin: `@Composable` belongs on the composable function, never on a `const` or a copy helper. Optional parameters cannot precede required ones.
- Keep these substrings intact if you edit nearby code: `if !isFocused { finish() }`, `else if (sawFocus) finish()`, `csGridPainted(rows.size`, `csGridPainted(rows.length`, `painted(count:`, `CSFocusReturn.perform`, `openerConnected: captured || onRestore != nil`, `csCalendarDayName(viewYear, viewMonth, day, language)`, `csCalendarDayName(viewYear, viewMonth, day, widget.language)`, `CSTreeTableModel.rows`, `csTreeRows(nodes, expanded)`, `CSTreeTableModel.toggle(expanded, row.key)`, `csTreeToggle(expanded, row.key)`.
- macOS deployment is 13. `onKeyPress` is a no-op there. Use `csRovingKeys` plus `CSLegacyRovingKeys`. The macOS `swift test` does not compile the iOS key path.
- `NSText` has no `hasMarkedText`. Use `NSTextView`.
- Canvas phrase: replace the previous unique phrase. Do not duplicate a short anchor.

## Checkpoint habit

After each verified native change:

1. Run the Swift catalog filter and `node _audit/ci/test-native-samples.mjs`.
2. Update this file: what changed, what is next, and the new commit hash.
3. Commit, then push, only when the operator has asked for that. This handoff was created under an explicit commit-and-push instruction for the audit checkpoint.
