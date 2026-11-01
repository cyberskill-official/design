# Handoff: 29 Oct 2026 audit remediation

Updated: 2026-11-01, after the flows-timepicker-mentions-sortable-tour-datatable-popconfirm-toggle-parity checkpoint. Goal is still active. Do not mark it complete.

Operator instruction for this checkpoint: commit and push, then record the behavior hash and push that note. Do not publish, deploy, or merge.

## Resume from

- Repo: `/Users/stephencheng/Projects/CyberSkill/design`
- Branch: `main`, tracking `origin/main`
- Audit baseline before this work: `b935f72be11c464603f533a694b043c52f90e747` (`v2.0.0`)
- Checkpoint commit: pending (`feat(native): align flows time picker, mentions, sortable, tour, data table, popconfirm, and toggle with web contracts`)
- Previous checkpoint: `f725f9b9750af55bd93ed36a327d4f0aae7bec41`, with the hash note in `a266aa70`
- GitHub Actions push workflows temporarily disabled during intermediate checkpoint pushes (`316944477`, `377620668`, `318755963`, `330342703`)

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
| F5 hard visual coverage | Done on `ubuntu-24.04` CI (`Design System Gates` run `41286519158`, `pixel-diff` job `124788817760`): all 16 targets (`kitchen-sink`, `auth`, `app-shell`, `settings`, `dashboard`, `dashboard-dark`, `delivery-kickoff`, `bod-report`, `slide-deck`, `marketing-page`, `email`, `vn-labor-contract`, `tech-incident-report`, `status-hub`, `website`, `component-states`) passed with `drifted: []` and `maxDiff: 0.264%`. Do not commit macOS PNGs over the Linux baselines. |
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

Last run after styling `Link`, `Anchor`, `Image`, `Toolbar`, `Menubar`, `NavigationMenu`, `Carousel`, `Comment`, `Form` / `FormField`, `Tree`, `BackTop`, `TreeSelect`, `Cascader`, `Transfer`, `Mentions`, `ColorPicker`, `Tour`, `QRCode`, `Masonry`, `Splitter`, `HotKeys`, `Dock`, `DataGrid`, `TreeTable`, `Sortable`, `Chart`, `Editor`, and `Terminal`: the full Swift test suite (8 tests) passed in about 0.014s, and `test-native-samples.mjs` printed `PASS`. Compose and Flutter were not compiled locally. There is no `ANDROID_HOME`, no Flutter SDK, and no `javac`.

`_audit/ci/test-publication-validation.mjs` fails on Node 24 before any command runs. That failure is environmental. CI uses Node 22. Do not loosen the check.

## Latest checkpoint

Aligned `CSTimePicker`/`CsTimePicker`, `CSMentions`/`CsMentions`, `CSSortable`/`CsSortable`, `CSTour`/`CsTour`, `CSDataTable`/`CsDataTable`, `CSPopconfirm`/`CsPopconfirm`, and `CSToggle`/`CsToggle` across `Flows.swift`, `Flows.kt`, and `flows.dart` with `TimePicker.jsx`, `Mentions.jsx`, `Sortable.jsx`, `Tour.jsx`, `DataTable.jsx`, `Popconfirm.jsx`, and `Toggle.jsx`: added `defaultStep = 30.0`, `minStep = 1`, `maxStep = 1440`, `clockIconSize() = 16`, `clockIconStrokeWidth() = 1.8`, and `safeStep(_:)` (`csTimeValueDefault`, `csTimeDefaultStep`, `csTimeMinStep`, `csTimeMaxStep`, `csTimeClockIconSize`, `csTimeClockIconStrokeWidth`, `csTimeSafeStep`) to `CSTimeModel` and wired `csTimeValueDefault` and `csTimeDefaultStep` in `CsTimePicker`; added `defaultRows = 3`, `maxHits = 6`, `resolvedValue(value:defaultValue:)`, `optionId(_:index:)`, `activeDescendantId(_:open:activeIndex:hitCount:)`, `optionClass(active:)`, and `acceptsKey(composing:keyCode:)` (`csMentionDefaultRows`, `csMentionMaxHits`, `csMentionResolvedValue`, `csMentionOptionId`, `csMentionActiveDescendantId`, `csMentionOptionClass`, `csMentionAcceptsKey`) to `CSMentionModel`, added `defaultValue: String = ""` and optional `text: String? = nil` (`users: [String] = []`) with internal state to `CSMentions`/`CsMentions`, and wired `optionId`; added `gripGlyph = "⠿"`, `upGlyph = "↑"`, `downGlyph = "↓"`, `itemClass(dragging:over:)`, and `startsDrag(fromOps:key:)` (`csSortGripGlyph`, `csSortUpGlyph`, `csSortDownGlyph`, `csSortItemClass`, `csSortStartsDrag`) to `CSSortModel` and wired the glyph constants in `CSSortable`/`CsSortable`; added `dialogRole = "dialog"`, `skipButtonVariant = "ghost"`, `backButtonVariant = "secondary"`, `primaryButtonVariant = "primary"`, `buttonSize = "xs"`, `titleId(_:)`, `resetIndexOnOpen(open:current:)`, and `primaryActionLabel(isLast:next:done:)` (`csTourDialogRole`, `csTourSkipButtonVariant`, `csTourBackButtonVariant`, `csTourPrimaryButtonVariant`, `csTourButtonSize`, `csTourTitleId`, `csTourResetIndexOnOpen`, `csTourPrimaryActionLabel`) to `CSTourModel` and wired `resetIndexOnOpen` and `primaryActionLabel` in `CSTour`/`CsTour`; added `defaultRowKey = "id"`, `defaultState = "idle"`, `isBusy(_:)`, `wrapClass(_:)`, `role(_:)`, `showsCustomLoading(_:)`, and `showsCustomError(_:)` (`csTableDefaultRowKey`, `csTableDefaultState`, `csTableIsBusy`, `csTableWrapClass`, `csTableRole`, `csTableShowsCustomLoading`, `csTableShowsCustomError`) to `CSTableModel` and added `rowKey` and default `state = "idle"` to `CSDataTable`/`CsDataTable`; added `panelRole = "alertdialog"`, `triggerHasPopup = "dialog"`, `cancelButtonVariant = "ghost"`, `okButtonVariant = "primary"`, `buttonSize = "xs"`, `titleId(_:)`, and `escapeClose() = false` (`csPopconfirmPanelRole`, `csPopconfirmTriggerHasPopup`, `csPopconfirmCancelButtonVariant`, `csPopconfirmOkButtonVariant`, `csPopconfirmButtonSize`, `csPopconfirmTitleId`, `csPopconfirmEscapeClose`) to `CSPopconfirmModel`, defaulted `onCancel = {}` on `CSPopconfirm`/`CsPopconfirm`, and wired `escapeClose()` on Escape dismissal; and added `iconGap() = 6` (`csToggleIconGap`) to `CSToggleModel`, added `defaultPressed: Bool = false` with internal `innerPressed` state, made `pressed: Bool? = nil` and `onChange` optional on `CSToggle`/`CsToggle`, and wired `CSToggleModel.value(pressed:inner:)` (`csToggleValue`) for controlled and uncontrolled modes.

- `swift test --package-path examples/native/swiftui --filter testCatalogRulesMatchTheWebComponents` and `node _audit/ci/test-native-samples.mjs` passed.

## Next concrete step

Continue the second-pass audit of the 120 native components across `Surfaces` and `Remainder` against all web `components/**/*.jsx` files and `test/component-behaviors.test.mjs`, closing any remaining behavioral or prop parity gaps.

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
