# Handoff: 29 Oct 2026 audit remediation

Updated: 2026-11-01, after the glass-materials-classes checkpoint. Goal is still active. Do not mark it complete.

Operator instruction for this checkpoint: commit and push, then record the behavior hash and push that note. Do not publish, deploy, or merge.

## Resume from

- Repo: `/Users/stephencheng/Projects/CyberSkill/design`
- Branch: `main`, tracking `origin/main`
- Audit baseline before this work: `b935f72be11c464603f533a694b043c52f90e747` (`v2.0.0`)
- Checkpoint commit: see the latest commit that touches this file. The first push of this handoff records that hash in the section below after the commit exists.
- Previous checkpoint: `93c2fcb1806714b3fc8abdece1ff118db22a5378`, with the hash note in `fcdeb41f`
- Checkpoint commit hash: `b6d9b82ed99dc9249197a4f3c71f39d3b3f7875c`
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

Last run after the Liquid Glass material compositions and classes: the catalog test passed in about 0.005s, and `test-native-samples.mjs` printed `PASS`. Compose and Flutter were not compiled. There is no `ANDROID_HOME`, no Flutter SDK, and no `javac`.

`_audit/ci/test-publication-validation.mjs` fails on Node 24 before any command runs. That failure is environmental. CI uses Node 22. Do not loosen the check.

## Latest checkpoint

Liquid Glass material compositions (`CSGlassMaterial` / `CsGlassMaterial`, `CSGlassSurfaceBase` / `CsGlassSurfaceBase`, `CSGlassShadow` / `CsGlassShadow`, `CSGlassModel` / `csGlass*`) and `CSCard` / `CsCard` material support now compose the five materials (`whisper`, `light`, `standard`/`glassCard`, `heavy`, `solid`/`matte`) with surface base (`page`/`panel`/`raised`), opacity (`60%`, `70%`, `80%`, `90%`, `100%`), backdrop blur (`8px`, `12px`, `16px`, `24px`, `0px`), saturation (`110%`, `130%`, `150%`, `180%`, `100%`), border mix (`0%`, `50%`, `60%`, `80%`, `100%`), border width (`0px` for whisper, `1px` otherwise), shadow (`none`, `none`, `sm`, `lg`, `none`), and `overlaySurfaceClass` precedence (`["cs-surface-matte", "cs-surface-solid", "cs-surface-heavy", "cs-surface-standard", "cs-glass-card", "cs-surface-light", "cs-surface-whisper"]`), matching `base/glass.css` lines 10–53 and `components/_utils/use-overlay-surface.js` line 8.

- Compose and Flutter were not compiled.
- Swift catalog test and `node _audit/ci/test-native-samples.mjs` passed.

## Next concrete step

Style Liquid Glass lens edge, depth utilities, accessibility/capability fallbacks, brand aurora wash, and modal overlay backing rules (`CSGlassModel` / `csGlass*`) in `base/glass.css` lines 54–129: `135deg` `1px` lens edge on `standard`/`heavy`/`glassCard` (`30%` `#fff` at `0%..30%` to `15%` `--cs-color-brand-umber` at `70%..100%`), depth utilities (`bg` `0`, `section` `5`, `card` `10`, `nav` `50` sticky, `modal` `100`, `toast` `200`), reduced-transparency / forced-colors / print / unsupported-backdrop-filter fallbacks, `.cs-aurora` wash (`--cs-color-brand-umber` base, `#fff` ink, three radial gradients), and `.cs-overlay-surface` backing suppression. Re-read `base/glass.css` lines 54–129 before editing.

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
