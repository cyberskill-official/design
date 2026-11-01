# Handoff: 29 Oct 2026 audit remediation

Updated: 2026-11-01, after the responsive-cq-grid-reflow checkpoint. Goal is still active. Do not mark it complete.

Operator instruction for this checkpoint: commit and push, then record the behavior hash and push that note. Do not publish, deploy, or merge.

## Resume from

- Repo: `/Users/stephencheng/Projects/CyberSkill/design`
- Branch: `main`, tracking `origin/main`
- Audit baseline before this work: `b935f72be11c464603f533a694b043c52f90e747` (`v2.0.0`)
- Checkpoint commit: see the latest commit that touches this file. The first push of this handoff records that hash in the section below after the commit exists.
- Previous checkpoint: `a065903b579d384c681d53c4393b27f69a81a443`, with the hash note in `afbdd42a`
- Checkpoint commit hash: `c94d2bb634ca9c73b747b99410925a02088cfc4b`
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

Last run after the responsive layer container-query helpers, desk/sheet breakpoint padding, sidebar wrap strip, canvas-desk scroll floor, fixed-column grid collapse, 44px touch floor, and 360px reflow: the catalog test passed in about 0.005s, and `test-native-samples.mjs` printed `PASS`. Compose and Flutter were not compiled. There is no `ANDROID_HOME`, no Flutter SDK, and no `javac`.

`_audit/ci/test-publication-validation.mjs` fails on Node 24 before any command runs. That failure is environmental. CI uses Node 22. Do not loosen the check.

## Latest checkpoint

The responsive layer (`CSResponsiveModel` / `csResponsive*`) now models `100%` max-width / `auto` height media, `.cs-cq` (`container-type: inline-size; container-name: cs`) with `<=768px` `1fr` columns (`.cs-cq-cols-2`/`3`/`4`), `.cs-cq-hide-narrow`, and `<=640px` `.cs-cq-stack`, `.cs-desk` (`24x10` at `<=768px`, `12x6` at `<=640px`) and `.cs-sheet` (`40x40` at `<=768px`, `26x20` + `8px` radius at `<=640px`, `20x15` at `<=360px`) padding with `overflow-wrap: anywhere`, horizontal table scrolling at `<=768px`, `.cs-sidebar` horizontal wrap strip at `<=768px` (`4x10` gap, `0` inline-end border, `1px` block-end border, `100%` `.cs-sidebar__label`, `1fr` app-shell collapse), `.cs-canvas-desk` horizontal scroll with `960px` floor at `<=1280px` and preserved inner columns, `22px` phone inline section padding, inline fixed-column grid collapse (`3..6 -> 2` at `<=768px`, `2..6 -> 1` and two-column fractional specs at `<=640px`), `44px` touch floor on `.cs-nav-item` and `.cs-search` at `<=768px`, and `<=360px` reflow (`.cs-tabs` scroll + `thin`/`none` scrollbar, `.cs-pagination` wrap, `.cs-otp` wrap + `4px` gap + `36x40` fine-pointer inputs, `.cs-dl` `1fr`), matching `base/responsive.css` lines 1–188.

- Compose and Flutter were not compiled.
- Swift catalog test and `node _audit/ci/test-native-samples.mjs` passed.

## Next concrete step

Fix all Kotlin/Compose compilation errors in `examples/native/compose/design/src/main/java/world/cyberskill/design/{Fields,Flows,Overlays,Primitives,Records,Remainder,Structures,Surfaces}.kt` reported by the `ubuntu-24.04` `:design:compileDebugKotlin` run (`@Composable` invocation contexts, missing `boundsInRoot`/`positionInRoot`/`matchParentSize`/`drawText`/`isShiftPressed`/`onPointerEvent`/`contentDescription`/`selected`/`buttons` imports or helpers, duplicate `csTagCopy` in `Primitives.kt` vs `Records.kt`, and nullable `String?` arguments in `Surfaces.kt`).

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
