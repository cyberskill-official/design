# Handoff: 29 Oct 2026 audit remediation

Updated: 2026-11-01, after the surfaces-colorpicker-splitter-datepicker-chatmessage-icon-anchor-citationlist-scrollarea-image-logo-contextmenu-navmenu-cardslots-toaststack-parity checkpoint. Goal is still active. Do not mark it complete.

Operator instruction for this checkpoint: commit and push, then record the behavior hash and push that note. Do not publish, deploy, or merge.

## Resume from

- Repo: `/Users/stephencheng/Projects/CyberSkill/design`
- Branch: `main`, tracking `origin/main`
- Audit baseline before this work: `b935f72be11c464603f533a694b043c52f90e747` (`v2.0.0`)
- Checkpoint commit: pending (`feat(native): align surfaces color picker, splitter, date picker, chat message, icon, anchor, citation list, scroll area, image, logo, context menu, nav menu, card slots, and toast stack with web contracts`)
- Previous checkpoint: `4243142035c50aab1a415b776dcc21afffcb729c`, with the hash note in `2d42b266`
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

Aligned `CSColorPicker`/`CsColorPicker`, `CSSplitter`/`CsSplitter`, `CSDatePicker`/`CsDatePicker`, `CSChatMessage`/`CsChatMessage`, `CSIcon`/`CsIcon`, `CSAnchor`/`CsAnchor`, `CSCitationList`/`CsCitationList`, `CSScrollArea`/`CsScrollArea`, `CSImage`/`CsImage`, `CSLogo`/`CsLogo`, `CSContextMenu`/`CsContextMenu`, `CSNavigationMenu`/`CsNavigationMenu`, `CSCardHeader`/`CSCardBody`/`CSCardFooter` (`CsCardHeader`/`CsCardBody`/`CsCardFooter`), and `CSToastStack`/`CsToastStack` across `Surfaces.swift`, `Surfaces.kt`, and `surfaces.dart` with `ColorPicker.jsx`, `Splitter.jsx`, `DatePicker.jsx`, `ChatMessage.jsx`, `Icon.jsx`, `Anchor.jsx`, `CitationList.jsx`, `ScrollArea.jsx`, `Image.jsx`, `Logo.jsx`, `ContextMenu.jsx`, `NavigationMenu.jsx`, `Card.jsx`, and `Toast.jsx`: added `defaultValue = "#f4ba17"`, `hexMaxLength = 7`, `triggerHasPopup = "dialog"`, `listboxRole = "listbox"`, `optionRole = "option"`, `descriptionId(_:description:)`, `errorId(_:error:)`, `describedBy(explicit:descriptionId:errorId:)`, and `invalid(error:)` (`csColorDefaultValue`, `csColorHexMaxLength`, `csColorTriggerHasPopup`, `csColorListboxRole`, `csColorOptionRole`, `csColorDescriptionId`, `csColorErrorId`, `csColorDescribedBy`, `csColorInvalid`) to `CSColorModel` and added `description`, `error`, `required`, and `ariaDescribedBy` to `CSColorPicker`/`CsColorPicker`; added `defaultInitial = 50.0`, `defaultMin = 20.0`, `defaultMax = 80.0`, `defaultHeight = 180.0`, `separatorRole = "separator"`, `orientation = "vertical"`, `rightPercent(_:min:max:)`, and `acceptsKey(composing:keyCode:)` (`csSplitterDefaultInitial`, `csSplitterDefaultMin`, `csSplitterDefaultMax`, `csSplitterDefaultHeight`, `csSplitterSeparatorRole`, `csSplitterOrientation`, `csSplitterRightPercent`, `csSplitterAcceptsKey`) to `CSSplitterModel` and added `initial` and optional `percent`/`onChange` with `height = 180` default on `CSSplitter`/`CsSplitter`; added `triggerHasPopup = "dialog"`, `dialogRole = "dialog"`, `iconSize() = 16`, `iconStrokeWidth() = 1.8`, `descriptionId(_:description:)`, `errorId(_:error:)`, `describedBy(explicit:descriptionId:errorId:)`, and `invalid(error:)` (`csDateTriggerHasPopup`, `csDateDialogRole`, `csDateIconSize`, `csDateIconStrokeWidth`, `csDateDescriptionId`, `csDateErrorId`, `csDateDescribedBy`, `csDateInvalid`) to `CSDateField` and added `description`, `error`, `required`, and `ariaDescribedBy` to `CSDatePicker`/`CsDatePicker`; added `defaultRole = "lumi"`, `articleRole = "article"`, `rootClass(role:)`, `showsSlot(_:)`, and `userInitial(_:)` (`csChatDefaultRole`, `csChatArticleRole`, `csChatRootClass`, `csChatShowsSlot`, `csChatUserInitial`) to `CSChatRole` and added `meta` and `actions` slots to `CSChatMessage`/`CsChatMessage`; added `defaultSize = "md"`, `viewBox = "0 0 24 24"`, `isDecorative(label:)`, `role(label:)`, and `"xs"` (`14`) and `"xl"` (`32`) size mappings (`csIconDefaultSize`, `csIconViewBox`, `csIconIsDecorative`, `csIconRole`) to `CSIconModel`/`csIconPoints`; added `navRole = "navigation"`, `titleId(_:title:)`, `itemHref(_:)`, `linkClass(active:)`, and `explicit` active override (`csAnchorNavRole`, `csAnchorTitleId`, `csAnchorItemHref`, `csAnchorLinkClass`, `csAnchorResolvedActive`) to `CSAnchorModel` and added `activeId`, `onSelect`, and default `items = []` to `CSAnchor`/`CsAnchor`; added `rootClass = "cs-citations"`, `itemClass = "cs-citation"`, and `showsHeading(_:)` (`csCitationRootClass`, `csCitationItemClass`, `csCitationShowsHeading`) to `CSCitationModel` and defaulted `items = []` on `CSCitationList`; added `rootClass = "cs-scroll-area"`, `tabIndex = 0`, and `maxBlockSize(_:)` (`csScrollAreaRootClass`, `csScrollAreaTabIndex`, `csScrollAreaMaxBlockSize`) to `CSScrollAreaModel`; added `dialogRole = "dialog"`, `fallbackIconSize() = 28`, `fallbackIconStrokeWidth() = 1.6`, `rootClass(state:canPreview:)`, and `acceptsPreviewKey(_:)` (`csImageDialogRole`, `csImageFallbackIconSize`, `csImageFallbackIconStrokeWidth`, `csImageRootClass`, `csImageAcceptsPreviewKey`) to `CSImageModel`; added `viewBox = "0 0 512 512"`, `rootClass = "cs-logo"`, `role(decorative:)`, and `titleMarkup(decorative:title:)` (`csLogoViewBox`, `csLogoRootClass`, `csLogoRole`, `csLogoTitleMarkup`) to `CSLogoModel`; added `zoneRole = "group"`, `menuRole = "menu"`, `itemRole = "menuitem"`, `separatorRole = "separator"`, `defaultPlacement = "bottom-start"`, `resolvedPlacement(_:)`, `itemClass(danger:)`, `opensFromKeyboard(key:shiftKey:)`, `acceptsKey(composing:keyCode:)`, and `escapeClose() = false` (`csContextZoneRole`, `csContextMenuRole`, `csContextItemRole`, `csContextSeparatorRole`, `csContextDefaultPlacement`, `csContextResolvedPlacement`, `csContextItemClass`, `csContextOpensFromKeyboard`, `csContextAcceptsKey`, `csContextEscapeClose`) to `CSContextMenuModel` and added `dangerItems`, `portal = true`, `placement`, `tabIndex = 0`, and default `items = []` to `CSContextMenu`/`CsContextMenu`; added `navRole = "navigation"`, `chevronGlyph = "▾"`, `topClass(open:)`, and `escapeClose() = false` (`csNavRole`, `csNavChevronGlyph`, `csNavTopClass`, `csNavEscapeClose`) to `CSNavigationMenuModel` and added `ariaLabel` and default `items = []` to `CSNavigationMenu`/`CsNavigationMenu`; added `CSCardSlotModel` (`csCardHeaderClass`, `csCardTitleClass`, `csCardSubtitleClass`, `csCardBodyClass`, `csCardFooterClass`, `csCardShowsTitle`, `csCardShowsSubtitle`), added `children` slot to `CSCardHeader`/`CsCardHeader`, and defaulted `title`/`text` to `""`; and added `CSToastStackModel` (`csToastStackRegionRole`, `csToastStackRootClass`) and defaulted `children`/`content` on `CsToastStack`.

- `swift test --package-path examples/native/swiftui --filter testCatalogRulesMatchTheWebComponents` and `node _audit/ci/test-native-samples.mjs` passed.

## Next concrete step

Continue the second-pass audit of the 120 native components in `Remainder` against all web `components/**/*.jsx` files and `test/component-behaviors.test.mjs`, closing any remaining behavioral or prop parity gaps.

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
