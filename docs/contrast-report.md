# Contrast report — elemental pairings (APCA)

Generated · sweep at VERSION 1.7.2.

Published on Storybook **Docs** at `design.cyberskill.world`.

**Doctrine encoded by this sweep:** text uses `-bright` or `-tint`, or a `-strong` fill paired with `--cs-accent-on-strong`; never the mid-tone `-accent` — at any size. The accent is for bars, borders, progress fills, and non-text fills only. Read the pairing and floor recorded for each row; `test:strong-text-contrast` separately checks rendered body text on strong fills. (Rule stated in `tokens/elements.css` and conventions.)

Packs are generated from `tokens/element-seeds.json` (soft / middle / deep ladder, light↔dark hue lock). Geometry gate: `_audit/element-geometry.html`.
| Scope | Pairing | fg / bg | Lc | Verdict |
|---|---|---|---|---|
| root (Thổ default) | text-accent on white (bold labels) | #6E3B0E / #FFFFFF | 90.7 | ✓ |
| root (Thổ default) | text-accent on tint (bold labels) | #6E3B0E / #FBF4E9 | 84.6 | ✓ |
| root (Thổ default) | accent-bright on ink (headings) | #F4BA17 / #45210E | 66.3 | ✓ |
| root (Thổ default) | accent-on on accent-bright (CTA text) | #45210E / #F4BA17 | 66.3 | ✓ |
| root (Thổ default) | accent-bright on dark panel (dark labels) | #F4BA17 / #221710 | 69.2 | ✓ |

**Failures: 0.** All text pairings pass Lc ≥ 60.

## Element-pack link contrast (WCAG AA · body text)

`--cs-color-link` is scored at **4.5:1** (regular-weight body). `--cs-color-text-accent` remains on the APCA Lc ≥ 60 bold-label floor above.

Rows use the declared light or dark `--cs-color-link` colour. White, reference-page, reference-raised and reference-dark-panel backgrounds are fixed literals; element surface roles use `color-mix()` and are not measured by these rows. Rendered surface, preference and interaction checks have separate scopes.
| Scope | Pairing | fg / bg | Ratio | Verdict |
|---|---|---|---|---|

**Link failures: 0.**

## Strong callout text (body APCA)

Pair `--cs-accent-strong` with `--cs-accent-on-strong`: both light and dark packs must meet body Lc ≥ 75 (generator target 78) and WCAG ≥ 4.5:1. Dark primary buttons consume this paired foreground. Brand anchors and the other eight accent roles retain their values.
| Scope | Mode | fg / bg | Lc | Verdict |
|---|---|---|---|---|

**Strong body failures: 0.** Static declared-pair calculation; the browser regressions and actual template/raster checks establish their separate scopes. Opacity, gradients, transitions and arbitrary overlaps are not implied by this table.

## Dark pack APCA floors (gate twin)

Proposal targets in `_audit/apca-dark-preview.html`: bright ≥ 75 · accent ≥ 60 · on-strong/strong ≥ 75 · ink-on-tint ≥ 75. Accent and bright are not unrestricted regular-body roles.
| Pack | bright | accent | on | ink |
|---|---|---|---|---|

