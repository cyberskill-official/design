# Handoff: 29 Oct 2026 audit remediation

Updated: 2026-11-01, after the a11y-coarse-motion-contrast-forced checkpoint. Goal is still active. Do not mark it complete.

Operator instruction for this checkpoint: commit and push, then record the behavior hash and push that note. Do not publish, deploy, or merge.

## Resume from

- Repo: `/Users/stephencheng/Projects/CyberSkill/design`
- Branch: `main`, tracking `origin/main`
- Audit baseline before this work: `b935f72be11c464603f533a694b043c52f90e747` (`v2.0.0`)
- Checkpoint commit: see the latest commit that touches this file. The first push of this handoff records that hash in the section below after the commit exists.
- Previous checkpoint: `71201ec410c0c7b8d17b08db8733f2e948ed68f0`, with the hash note in `0b1c8e7f`
- Checkpoint commit hash: `a065903b579d384c681d53c4393b27f69a81a443`
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

Last run after the accessibility layer coarse touch targets, reduced motion, and contrast overrides: the catalog test passed in about 0.007s, and `test-native-samples.mjs` printed `PASS`. Compose and Flutter were not compiled. There is no `ANDROID_HOME`, no Flutter SDK, and no `javac`.

`_audit/ci/test-publication-validation.mjs` fails on Node 24 before any command runs. That failure is environmental. CI uses Node 22. Do not loosen the check.

## Latest checkpoint

The accessibility layer (`CSA11yModel` / `csA11y*`) now models `.cs-sr-only` `1x1` screen-reader-only clipping, `pointer: coarse` `44px` minimum hit targets (`46px` for `.cs-igroup__btn` and `.cs-splitter`, `24px` `.cs-check__input`/`.cs-radio__input` inside `44px` label rows, `repeat(5, 44px)` `.cs-colorpicker__grid`, `repeat(7, 44px)` `.cs-calendar__grid`, `64px` `.cs-carousel__view` inline padding and `44px` `.cs-carousel__dot` with `4.5px` radial indicator, `none` scrollbar on `.cs-tabs`), global `0.01ms` `prefers-reduced-motion: reduce` animation/transition clamp with `scroll-behavior: auto`, `prefers-contrast: more` light/dark border and text-muted overrides (`#9a8060`/`#45210e` light, `#7a6450`/`#f5ead9` dark, `2px solid var(--cs-color-border)` on buttons/inputs/cards/dialogs/alerts), and `forced-colors: active` `ButtonText`/`Highlight`/`GrayText` borders, matching `base/a11y.css` lines 1–176.

- Compose and Flutter were not compiled.
- Swift catalog test and `node _audit/ci/test-native-samples.mjs` passed.

## Next concrete step

Style the responsive layout and breakpoint rules (`CSResponsiveModel` / `csResponsive*`) in `base/responsive.css` lines 1–188: container-query helpers (`.cs-cq`, `<=768px` `1fr` columns, `<=640px` stacked column with `100%` buttons), `.cs-desk` and `.cs-sheet` breakpoint padding/radii (`<=768px`, `<=640px`, `<=360px`), `.cs-sidebar` horizontal wrap strip at `<=768px` (hiding `.cs-sidebar__label`), `.cs-canvas-desk` `<=1280px` horizontal scroll with `960px` floor, inline fixed-column grid collapse (`<=768px` 3–6 cols to 2 cols; `<=640px` 2–6 cols to `1fr`), `<=768px` `44px` touch floor, `<=640px` `min(92vw, 320px)` `.cs-drawer` width, and `<=360px` reflow for `.cs-tabs`, `.cs-pagination`, `.cs-otp`, and `.cs-dl`. Re-read `base/responsive.css` lines 1–188 before editing.

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
