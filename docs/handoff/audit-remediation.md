# Handoff: 29 Oct 2026 audit remediation

Updated: 2026-11-01, after the data-style checkpoint. Goal is still active. Do not mark it complete.

Operator instruction for this checkpoint: commit and push, then record the behavior hash and push that note. Do not publish, deploy, or merge.

## Resume from

- Repo: `/Users/stephencheng/Projects/CyberSkill/design`
- Branch: `main`, tracking `origin/main`
- Audit baseline before this work: `b935f72be11c464603f533a694b043c52f90e747` (`v2.0.0`)
- Checkpoint commit: see the latest commit that touches this file. The first push of this handoff records that hash in the section below after the commit exists.
- Previous checkpoint: `e1d3fb6394f09605bcaac30999e9f80e6b30e2dd`, with the hash note in `be2e3f71`
- Checkpoint commit hash: `987fead7fae8bad0c19d06d62a6ae9965cc922b7`
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

Last run after styling `Card`, `Stat`, `Avatar` / `AvatarGroup`, `Tooltip`, `Divider`, `ScrollArea`, and `AspectRatio`: the catalog test passed in about 0.007s, and `test-native-samples.mjs` printed `PASS`. Compose and Flutter were not compiled locally. There is no `ANDROID_HOME`, no Flutter SDK, and no `javac`.

`_audit/ci/test-publication-validation.mjs` fails on Node 24 before any command runs. That failure is environmental. CI uses Node 22. Do not loosen the check.

## Latest checkpoint

`CSDividerModel` / `csDivider*` and `CSDataStyleModel` / `csDataStyle*` now style the `base/data.css` rules across SwiftUI, Compose, and Flutter (`Card` `flat` no shadow, `interactive` ochre hover border + `shadow-md`, `5px` ochre focus halo, `1px` active translate with reduced-motion suppression, `18x20x0` header, `700` `1.35` title, `4px` `font-size-sm` muted subtitle, `16x20` body, `12x20x18` footer with `10px` gap; `Stat` `3px` gap, `font-size-xs` `0.08em` uppercase label, `font-size-3xl` `800` `1.1` `-0.01em` value, `4px` `font-size-sm` `700` up/down/flat delta; `Avatar` `28/40/56px` `sm/md/lg` circular umber/ochre or `radius-md` square, `AvatarGroup` `2px` panel ring and `-10px` overlap; `Tooltip` bubble `8px` offset, `4px` closed translate, `#ffffff` on umber, `font-size-xs` `600` `1.35`, `6x10` padding, `240px` max width, `5px` arrow, `8px` hover bridge, portaled placement arrows/bridges; `Divider` `1px` border, `space-4` margin, `12px` label gap; `ScrollArea` `radius-md`, `35%` umber thin scrollbar, `2px` `-2px` `5px` focus ring; `AspectRatio` `radius-md` `cover` media lock, matching `base/data.css` lines 1–102).

- Compose and Flutter were not compiled locally.
- Swift catalog test and `node _audit/ci/test-native-samples.mjs` passed.

## Next concrete step

Style `Tabs`, `Breadcrumb`, `Pagination`, and `Menu` / `Dropdown` in Swift, Compose, and Flutter (`Tabs` `4px` gap, `1px` bottom border, `Tab` `10x14` padding, `7px` gap, `600` `font-size-sm`, `2px` bottom border, light umber / dark ochre selected text and ochre border, `2px` `-3px` `5px` focus ring, `1x7` mono count pill; `Breadcrumb` `8px` gap, `font-size-sm`, muted link / accent hover, border-default separator, `600` primary current item; `Pagination` `4px` gap, `38x38` `0x10` button, `1px` border, ochre hover border, light umber/inverse and dark ochre/umber current page fill/ink, `0.45` disabled opacity, `0x4` muted ellipsis; `Menu` list `6px` offset, `200px` min width, `6px` padding, `2px` gap, dropdown depth, item `10px` gap, `8x10` padding, `radius-sm`, raised hover/focus, `2px` `-3px` `5px` focus ring, danger item with `10%` danger hover wash, `1px` `4x2` separator, uppercase `font-size-xs` `0.08em` `6x10x2` group label, from `base/navigation.css` lines 1–37).

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
