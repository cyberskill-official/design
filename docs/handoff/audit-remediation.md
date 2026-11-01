# Handoff: 29 Oct 2026 audit remediation

Updated: 2026-11-01, after the nav-item-active-hover-slots checkpoint. Goal is still active. Do not mark it complete.

Operator instruction for this checkpoint: commit and push, then record the behavior hash and push that note. Do not publish, deploy, or merge.

## Resume from

- Repo: `/Users/stephencheng/Projects/CyberSkill/design`
- Branch: `main`, tracking `origin/main`
- Audit baseline before this work: `b935f72be11c464603f533a694b043c52f90e747` (`v2.0.0`)
- Checkpoint commit: see the latest commit that touches this file. The first push of this handoff records that hash in the section below after the commit exists.
- Previous checkpoint: `3c9be1796955c58d3062794629be788b462150f3`, with the hash note in `6cdcd76b`
- Checkpoint commit hash: `2db2eb0bc4c14363917a91051fc58da5ce3e591c`
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

Last run after the nav item active, hover, and slot styles: the catalog test passed in about 0.006s, and `test-native-samples.mjs` printed `PASS`. Compose and Flutter were not compiled. There is no `ANDROID_HOME`, no Flutter SDK, and no `javac`.

`_audit/ci/test-publication-validation.mjs` fails on Node 24 before any command runs. That failure is environmental. CI uses Node 22. Do not loosen the check.

## Latest checkpoint

`NavItem` (`CSNavItem` / `CsNavItem`) and `Sidebar` rows now use an `11px` gap (`CSNavItemModel.gap()` / `csNavItemGap()`), `9px 12px` padding (`CSNavItemModel.paddingY()`, `paddingX()` / `csNavItemPaddingY()`, `csNavItemPaddingX()`), `--cs-radius-md`, semibold `--cs-font-size-sm` (`CSNavItemModel.fontWeight()` / `csNavItemFontWeight()`), `--cs-color-surface-raised` hover fill (`CSNavItemModel.showsHoverFill(active:hovered:)` / `csNavItemShowsHoverFill(active, hovered)`), `color-mix(in oklab, var(--cs-color-brand-ochre) 22%, var(--cs-color-surface-panel))` active fill (`CSNavItemModel.activeOchrePortion` / `csNavItemActiveOchrePortion`) with `--cs-color-brand-umber` (light) / `--cs-color-brand-ochre` (dark) active text and icon color (`CSNavItemModel.activeUsesOchreInk(dark:)` / `csNavItemActiveUsesOchreInk(dark)`), muted inactive icon (`CSNavItemModel.showsIcon(_:)` / `csNavItemShowsIcon(icon)`), and `margin-inline-start: auto` trail (`CSNavItemModel.showsTrail(_:)` / `csNavItemShowsTrail(trail)`), matching `.cs-nav-item`, `.cs-nav-item:hover`, `.cs-nav-item__icon`, `.cs-nav-item.is-active`, `.cs-nav-item.is-active .cs-nav-item__icon`, and `.cs-nav-item__trail` in `base/shell.css` and `components/navigation/Sidebar.jsx`.

- Compose and Flutter were not compiled.
- Swift catalog test and `node _audit/ci/test-native-samples.mjs` passed.

## Next concrete step

Style `Steps` (`CSSteps` / `CsSteps`) in `base/shell.css` lines 13–22 and `components/navigation/Steps.jsx`: flex row with `0` gap, `flex: 1` step columns with `8px` gap and `12px` inline-end padding, `28px` circular marker (`--cs-font-family-mono`, `700`, `--cs-font-size-sm`, `--cs-color-surface-raised`, muted text, `1px` default border), non-last connector rail (`inset-block-start: 13px`, `inset-inline-start: 34px`, `calc(100% - 46px)` width, `2px` height, `--cs-color-border-default`), `--cs-color-brand-umber` fill + `#fff` text + umber connector rail for `done` (`✓`), `--cs-color-brand-ochre` fill + `--cs-color-brand-umber` text + `4px` `28%` ochre ring for `active` (`aria-current="step"`), bold `--cs-font-size-sm` title, and `--cs-font-size-xs` muted body (`s.body != null`). Re-read `base/shell.css` lines 13–22 and `components/navigation/Steps.jsx` before editing.

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
