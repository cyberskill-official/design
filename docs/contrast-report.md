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
| tho | text-accent on white (bold labels) | #6E3B0E / #FFFFFF | 90.7 | ✓ |
| tho | text-accent on tint (bold labels) | #6E3B0E / #FBF4E9 | 84.6 | ✓ |
| tho | accent-bright on ink (headings) | #F4BA17 / #45210E | 66.3 | ✓ |
| tho | accent-on on accent-bright (CTA text) | #45210E / #F4BA17 | 66.3 | ✓ |
| tho | accent-bright on dark panel (dark labels) | #FEC42C / #221710 | 75 | ✓ |
| tho · sand | text-accent on white (bold labels) | #625431 / #FFFFFF | 85.7 | ✓ |
| tho · sand | text-accent on tint (bold labels) | #625431 / #FBF7EA | 80.9 | ✓ |
| tho · sand | accent-bright on ink (headings) | #F6EBCC / #292414 | 92.3 | ✓ |
| tho · sand | accent-on on accent-bright (CTA text) | #292414 / #F6EBCC | 90.8 | ✓ |
| tho · sand | accent-bright on dark panel (dark labels) | #F6EBCC / #221710 | 93.8 | ✓ |
| tho · clay | text-accent on white (bold labels) | #201300 / #FFFFFF | 104.8 | ✓ |
| tho · clay | text-accent on tint (bold labels) | #201300 / #FFF6E7 | 100 | ✓ |
| tho · clay | accent-bright on ink (headings) | #DEC7A2 / #2D220E | 71.7 | ✓ |
| tho · clay | accent-on on accent-bright (CTA text) | #2D220E / #DEC7A2 | 71.8 | ✓ |
| tho · clay | accent-bright on dark panel (dark labels) | #E4CDA8 / #221710 | 76.7 | ✓ |
| hoa | text-accent on white (bold labels) | #793B20 / #FFFFFF | 88.9 | ✓ |
| hoa | text-accent on tint (bold labels) | #793B20 / #FFF4F0 | 83.6 | ✓ |
| hoa | accent-bright on ink (headings) | #FED3C3 / #381B10 | 82.8 | ✓ |
| hoa | accent-on on accent-bright (CTA text) | #381B10 / #FED3C3 | 82.1 | ✓ |
| hoa | accent-bright on dark panel (dark labels) | #FED3C3 / #221710 | 84.2 | ✓ |
| hoa · plasma | text-accent on white (bold labels) | #66504B / #FFFFFF | 85.9 | ✓ |
| hoa · plasma | text-accent on tint (bold labels) | #66504B / #FEF4F2 | 80.6 | ✓ |
| hoa · plasma | accent-bright on ink (headings) | #FCE6DF / #2C211E | 91.8 | ✓ |
| hoa · plasma | accent-on on accent-bright (CTA text) | #2C211E / #FCE6DF | 90.4 | ✓ |
| hoa · plasma | accent-bright on dark panel (dark labels) | #FCE6DF / #221710 | 93.2 | ✓ |
| hoa · lava | text-accent on white (bold labels) | #280D00 / #FFFFFF | 104.7 | ✓ |
| hoa · lava | text-accent on tint (bold labels) | #280D00 / #FFF4EF | 99.4 | ✓ |
| hoa · lava | accent-bright on ink (headings) | #F1BEA4 / #361D0F | 71 | ✓ |
| hoa · lava | accent-on on accent-bright (CTA text) | #361D0F / #F1BEA4 | 71.2 | ✓ |
| hoa · lava | accent-bright on dark panel (dark labels) | #F8C4AA / #221710 | 76.2 | ✓ |
| thuy | text-accent on white (bold labels) | #035763 / #FFFFFF | 88 | ✓ |
| thuy | text-accent on tint (bold labels) | #035763 / #E7FBFF | 83.4 | ✓ |
| thuy | accent-bright on ink (headings) | #99EEFF / #012A30 | 85.3 | ✓ |
| thuy | accent-on on accent-bright (CTA text) | #012A30 / #99EEFF | 84.3 | ✓ |
| thuy | accent-bright on dark panel (dark labels) | #99EEFF / #221710 | 87.2 | ✓ |
| thuy · mist | text-accent on white (bold labels) | #2E5E64 / #FFFFFF | 85 | ✓ |
| thuy · mist | text-accent on tint (bold labels) | #2E5E64 / #EBFAFC | 80.3 | ✓ |
| thuy · mist | accent-bright on ink (headings) | #CDF4F9 / #13282B | 93.1 | ✓ |
| thuy · mist | accent-on on accent-bright (CTA text) | #13282B / #CDF4F9 | 91.5 | ✓ |
| thuy · mist | accent-bright on dark panel (dark labels) | #CDF4F9 / #221710 | 94.7 | ✓ |
| thuy · ocean | text-accent on white (bold labels) | #011A21 / #FFFFFF | 104.5 | ✓ |
| thuy · ocean | text-accent on tint (bold labels) | #011A21 / #EAFAFF | 99.8 | ✓ |
| thuy · ocean | accent-bright on ink (headings) | #A8D3E0 / #10282F | 72.7 | ✓ |
| thuy · ocean | accent-on on accent-bright (CTA text) | #10282F / #A8D3E0 | 72.6 | ✓ |
| thuy · ocean | accent-bright on dark panel (dark labels) | #ABD6E3 / #221710 | 76.1 | ✓ |
| moc | text-accent on white (bold labels) | #38570C / #FFFFFF | 88.4 | ✓ |
| moc | text-accent on tint (bold labels) | #38570C / #EFFCE3 | 84 | ✓ |
| moc | accent-bright on ink (headings) | #C5ED9C / #182A00 | 85.2 | ✓ |
| moc | accent-on on accent-bright (CTA text) | #182A00 / #C5ED9C | 84.2 | ✓ |
| moc | accent-bright on dark panel (dark labels) | #C5ED9C / #221710 | 86.9 | ✓ |
| moc · bamboo | text-accent on white (bold labels) | #505C3A / #FFFFFF | 84.8 | ✓ |
| moc · bamboo | text-accent on tint (bold labels) | #505C3A / #F4F9ED | 80.1 | ✓ |
| moc · bamboo | accent-bright on ink (headings) | #E5F1D2 / #212617 | 93 | ✓ |
| moc · bamboo | accent-on on accent-bright (CTA text) | #212617 / #E5F1D2 | 91.4 | ✓ |
| moc · bamboo | accent-bright on dark panel (dark labels) | #E5F1D2 / #221710 | 94.5 | ✓ |
| moc · forest | text-accent on white (bold labels) | #051D00 / #FFFFFF | 104.4 | ✓ |
| moc · forest | text-accent on tint (bold labels) | #051D00 / #ECFDE7 | 100.2 | ✓ |
| moc · forest | accent-bright on ink (headings) | #B0D8A3 / #162A0E | 73.2 | ✓ |
| moc · forest | accent-on on accent-bright (CTA text) | #162A0E / #B0D8A3 | 73.2 | ✓ |
| moc · forest | accent-bright on dark panel (dark labels) | #B0D8A3 / #221710 | 75 | ✓ |
| kim | text-accent on white (bold labels) | #65460B / #FFFFFF | 89.4 | ✓ |
| kim | text-accent on tint (bold labels) | #65460B / #FFF5E7 | 84.2 | ✓ |
| kim | accent-bright on ink (headings) | #FDD89F / #312002 | 83.5 | ✓ |
| kim | accent-on on accent-bright (CTA text) | #312002 / #FDD89F | 82.8 | ✓ |
| kim | accent-bright on dark panel (dark labels) | #FDD89F / #221710 | 85 | ✓ |
| kim · titanium | text-accent on white (bold labels) | #67543D / #FFFFFF | 85 | ✓ |
| kim · titanium | text-accent on tint (bold labels) | #67543D / #FDF5ED | 79.7 | ✓ |
| kim · titanium | accent-bright on ink (headings) | #FBE8D2 / #2B2217 | 92 | ✓ |
| kim · titanium | accent-on on accent-bright (CTA text) | #2B2217 / #FBE8D2 | 90.6 | ✓ |
| kim · titanium | accent-bright on dark panel (dark labels) | #FBE8D2 / #221710 | 93.4 | ✓ |
| kim · steel | text-accent on white (bold labels) | #1F1400 / #FFFFFF | 104.8 | ✓ |
| kim · steel | text-accent on tint (bold labels) | #1F1400 / #FEF6E7 | 99.8 | ✓ |
| kim · steel | accent-bright on ink (headings) | #DCC8A2 / #2D220E | 71.8 | ✓ |
| kim · steel | accent-on on accent-bright (CTA text) | #2D220E / #DCC8A2 | 71.9 | ✓ |
| kim · steel | accent-bright on dark panel (dark labels) | #DFCBA5 / #221710 | 75.1 | ✓ |

**Failures: 0.** All text pairings pass Lc ≥ 60.

## Element-pack link contrast (WCAG AA · body text)

`--cs-color-link` is scored at **4.5:1** (regular-weight body). `--cs-color-text-accent` remains on the APCA Lc ≥ 60 bold-label floor above.

Rows use the declared light or dark `--cs-color-link` colour. White, reference-page, reference-raised and reference-dark-panel backgrounds are fixed literals; element surface roles use `color-mix()` and are not measured by these rows. Rendered surface, preference and interaction checks have separate scopes.
| Scope | Pairing | fg / bg | Ratio | Verdict |
|---|---|---|---|---|
| tho | link on white (body) | #644A05 / #FFFFFF | 8.32:1 | ✓ |
| tho | link on reference page (body) | #644A05 / #FFFDF8 | 8.19:1 | ✓ |
| tho | link on tint (body) | #644A05 / #FBF4E9 | 7.62:1 | ✓ |
| tho | link on reference raised cream (body) | #644A05 / #FBF4E9 | 7.62:1 | ✓ |
| tho | link on reference dark panel (body) | #FED57C / #221710 | 12.54:1 | ✓ |
| tho · sand | link on white (body) | #625431 / #FFFFFF | 7.42:1 | ✓ |
| tho · sand | link on reference page (body) | #625431 / #FFFDF8 | 7.29:1 | ✓ |
| tho · sand | link on tint (body) | #625431 / #FBF7EA | 6.92:1 | ✓ |
| tho · sand | link on reference raised cream (body) | #625431 / #FBF4E9 | 6.79:1 | ✓ |
| tho · sand | link on reference dark panel (body) | #F6EBCC / #221710 | 14.75:1 | ✓ |
| tho · clay | link on white (body) | #201300 / #FFFFFF | 18.19:1 | ✓ |
| tho · clay | link on reference page (body) | #201300 / #FFFDF8 | 17.89:1 | ✓ |
| tho · clay | link on tint (body) | #201300 / #FFF6E7 | 16.97:1 | ✓ |
| tho · clay | link on reference raised cream (body) | #201300 / #FBF4E9 | 16.65:1 | ✓ |
| tho · clay | link on reference dark panel (body) | #EED7B1 / #221710 | 12.51:1 | ✓ |
| hoa | link on white (body) | #793B20 / #FFFFFF | 8.54:1 | ✓ |
| hoa | link on reference page (body) | #793B20 / #FFFDF8 | 8.40:1 | ✓ |
| hoa | link on tint (body) | #793B20 / #FFF4F0 | 7.91:1 | ✓ |
| hoa | link on reference raised cream (body) | #793B20 / #FBF4E9 | 7.81:1 | ✓ |
| hoa | link on reference dark panel (body) | #FED3C3 / #221710 | 12.79:1 | ✓ |
| hoa · plasma | link on white (body) | #66504B / #FFFFFF | 7.46:1 | ✓ |
| hoa · plasma | link on reference page (body) | #66504B / #FFFDF8 | 7.34:1 | ✓ |
| hoa · plasma | link on tint (body) | #66504B / #FEF4F2 | 6.91:1 | ✓ |
| hoa · plasma | link on reference raised cream (body) | #66504B / #FBF4E9 | 6.83:1 | ✓ |
| hoa · plasma | link on reference dark panel (body) | #FCE6DF / #221710 | 14.63:1 | ✓ |
| hoa · lava | link on white (body) | #280D00 / #FFFFFF | 18.30:1 | ✓ |
| hoa · lava | link on reference page (body) | #280D00 / #FFFDF8 | 18.00:1 | ✓ |
| hoa · lava | link on tint (body) | #280D00 / #FFF4EF | 16.94:1 | ✓ |
| hoa · lava | link on reference raised cream (body) | #280D00 / #FBF4E9 | 16.74:1 | ✓ |
| hoa · lava | link on reference dark panel (body) | #FED1BB / #221710 | 12.56:1 | ✓ |
| thuy | link on white (body) | #035763 / #FFFFFF | 8.24:1 | ✓ |
| thuy | link on reference page (body) | #035763 / #FFFDF8 | 8.11:1 | ✓ |
| thuy | link on tint (body) | #035763 / #E7FBFF | 7.71:1 | ✓ |
| thuy | link on reference raised cream (body) | #035763 / #FBF4E9 | 7.54:1 | ✓ |
| thuy | link on reference dark panel (body) | #99EEFF / #221710 | 13.38:1 | ✓ |
| thuy · mist | link on white (body) | #2E5E64 / #FFFFFF | 7.24:1 | ✓ |
| thuy · mist | link on reference page (body) | #2E5E64 / #FFFDF8 | 7.12:1 | ✓ |
| thuy · mist | link on tint (body) | #2E5E64 / #EBFAFC | 6.76:1 | ✓ |
| thuy · mist | link on reference raised cream (body) | #2E5E64 / #FBF4E9 | 6.62:1 | ✓ |
| thuy · mist | link on reference dark panel (body) | #CDF4F9 / #221710 | 14.94:1 | ✓ |
| thuy · ocean | link on white (body) | #011A21 / #FFFFFF | 17.93:1 | ✓ |
| thuy · ocean | link on reference page (body) | #011A21 / #FFFDF8 | 17.64:1 | ✓ |
| thuy · ocean | link on tint (body) | #011A21 / #EAFAFF | 16.75:1 | ✓ |
| thuy · ocean | link on reference raised cream (body) | #011A21 / #FBF4E9 | 16.41:1 | ✓ |
| thuy · ocean | link on reference dark panel (body) | #B6E1EF / #221710 | 12.52:1 | ✓ |
| moc | link on white (body) | #38570C / #FFFFFF | 8.28:1 | ✓ |
| moc | link on reference page (body) | #38570C / #FFFDF8 | 8.14:1 | ✓ |
| moc | link on tint (body) | #38570C / #EFFCE3 | 7.77:1 | ✓ |
| moc | link on reference raised cream (body) | #38570C / #FBF4E9 | 7.58:1 | ✓ |
| moc | link on reference dark panel (body) | #C5ED9C / #221710 | 13.33:1 | ✓ |
| moc · bamboo | link on white (body) | #505C3A / #FFFFFF | 7.16:1 | ✓ |
| moc · bamboo | link on reference page (body) | #505C3A / #FFFDF8 | 7.04:1 | ✓ |
| moc · bamboo | link on tint (body) | #505C3A / #F4F9ED | 6.69:1 | ✓ |
| moc · bamboo | link on reference raised cream (body) | #505C3A / #FBF4E9 | 6.55:1 | ✓ |
| moc · bamboo | link on reference dark panel (body) | #E5F1D2 / #221710 | 14.89:1 | ✓ |
| moc · forest | link on white (body) | #051D00 / #FFFFFF | 17.76:1 | ✓ |
| moc · forest | link on reference page (body) | #051D00 / #FFFDF8 | 17.47:1 | ✓ |
| moc · forest | link on tint (body) | #051D00 / #ECFDE7 | 16.72:1 | ✓ |
| moc · forest | link on reference raised cream (body) | #051D00 / #FBF4E9 | 16.26:1 | ✓ |
| moc · forest | link on reference dark panel (body) | #BDE5B0 / #221710 | 12.52:1 | ✓ |
| kim | link on white (body) | #65460B / #FFFFFF | 8.63:1 | ✓ |
| kim | link on reference page (body) | #65460B / #FFFDF8 | 8.49:1 | ✓ |
| kim | link on tint (body) | #65460B / #FFF5E7 | 8.00:1 | ✓ |
| kim | link on reference raised cream (body) | #65460B / #FBF4E9 | 7.90:1 | ✓ |
| kim | link on reference dark panel (body) | #FDD89F / #221710 | 12.94:1 | ✓ |
| kim · titanium | link on white (body) | #67543D / #FFFFFF | 7.21:1 | ✓ |
| kim · titanium | link on reference page (body) | #67543D / #FFFDF8 | 7.09:1 | ✓ |
| kim · titanium | link on tint (body) | #67543D / #FDF5ED | 6.68:1 | ✓ |
| kim · titanium | link on reference raised cream (body) | #67543D / #FBF4E9 | 6.60:1 | ✓ |
| kim · titanium | link on reference dark panel (body) | #FBE8D2 / #221710 | 14.67:1 | ✓ |
| kim · steel | link on white (body) | #1F1400 / #FFFFFF | 18.13:1 | ✓ |
| kim · steel | link on reference page (body) | #1F1400 / #FFFDF8 | 17.83:1 | ✓ |
| kim · steel | link on tint (body) | #1F1400 / #FEF6E7 | 16.88:1 | ✓ |
| kim · steel | link on reference raised cream (body) | #1F1400 / #FBF4E9 | 16.59:1 | ✓ |
| kim · steel | link on reference dark panel (body) | #ECD8B2 / #221710 | 12.55:1 | ✓ |

**Link failures: 0.**

## Strong callout text (body APCA)

Pair `--cs-accent-strong` with `--cs-accent-on-strong`: both light and dark packs must meet body Lc ≥ 75 (generator target 78) and WCAG ≥ 4.5:1. Dark primary buttons consume this paired foreground. Brand anchors and the other eight accent roles retain their values.
| Scope | Mode | fg / bg | Lc | Verdict |
|---|---|---|---|---|
| tho | light | #FFFFFF / #916D10 | 78.4 | ✓ |
| tho | dark | #FFFFFF / #73560B | 88.5 | ✓ |
| tho · sand | light | #FFFFFF / #80724E | 78.3 | ✓ |
| tho · sand | dark | #FFFFFF / #665A37 | 88.5 | ✓ |
| tho · clay | light | #FFFFFF / #201300 | 106.9 | ✓ |
| tho · clay | dark | #FFFFFF / #1F1300 | 107.0 | ✓ |
| hoa | light | #FFFFFF / #A46146 | 78.5 | ✓ |
| hoa | dark | #FFFFFF / #8A4A30 | 88.0 | ✓ |
| hoa · plasma | light | #FFFFFF / #856E68 | 78.4 | ✓ |
| hoa · plasma | dark | #FFFFFF / #6F5750 | 87.9 | ✓ |
| hoa · lava | light | #FFFFFF / #280D00 | 106.9 | ✓ |
| hoa · lava | dark | #FFFFFF / #280D00 | 106.9 | ✓ |
| thuy | light | #FFFFFF / #0B7E8E | 78.2 | ✓ |
| thuy | dark | #FFFFFF / #046270 | 88.9 | ✓ |
| thuy · mist | light | #FFFFFF / #4B7B81 | 78.1 | ✓ |
| thuy · mist | dark | #FFFFFF / #316167 | 88.8 | ✓ |
| thuy · ocean | light | #FFFFFF / #011A21 | 106.7 | ✓ |
| thuy · ocean | dark | #FFFFFF / #011A21 | 106.7 | ✓ |
| moc | light | #FFFFFF / #528003 | 78.0 | ✓ |
| moc | dark | #FFFFFF / #416501 | 88.3 | ✓ |
| moc · bamboo | light | #FFFFFF / #6B7754 | 78.6 | ✓ |
| moc · bamboo | dark | #FFFFFF / #54603E | 88.2 | ✓ |
| moc · forest | light | #FFFFFF / #051D00 | 106.6 | ✓ |
| moc · forest | dark | #FFFFFF / #061D00 | 106.6 | ✓ |
| kim | light | #FFFFFF / #996A08 | 78.2 | ✓ |
| kim | dark | #FFFFFF / #795303 | 88.5 | ✓ |
| kim · titanium | light | #FFFFFF / #847058 | 78.3 | ✓ |
| kim · titanium | dark | #FFFFFF / #6B573E | 88.7 | ✓ |
| kim · steel | light | #FFFFFF / #1F1400 | 106.9 | ✓ |
| kim · steel | dark | #FFFFFF / #1F1400 | 106.9 | ✓ |

**Strong body failures: 0.** Static declared-pair calculation; the browser regressions and actual template/raster checks establish their separate scopes. Opacity, gradients, transitions and arbitrary overlaps are not implied by this table.

## Dark pack APCA floors (gate twin)

Proposal targets in `_audit/apca-dark-preview.html`: bright ≥ 75 · accent ≥ 60 · on-strong/strong ≥ 75 · ink-on-tint ≥ 75. Accent and bright are not unrestricted regular-body roles.
| Pack | bright | accent | on | ink |
|---|---|---|---|---|
| tho | 75 | 69.2 | 88.5 | 76.8 |
| tho · sand | 93.8 | 92.7 | 88.5 | 91.5 |
| tho · clay | 76.7 | 60.4 | 107 | 76.2 |
| hoa | 84.2 | 68.2 | 88 | 81.9 |
| hoa · plasma | 93.2 | 91.2 | 87.9 | 90.9 |
| hoa · lava | 76.2 | 61.1 | 106.9 | 75.7 |
| thuy | 87.2 | 72.8 | 88.9 | 84.4 |
| thuy · mist | 94.7 | 94 | 88.8 | 92 |
| thuy · ocean | 76.1 | 60.1 | 106.7 | 75.1 |
| moc | 86.9 | 71.8 | 88.3 | 84.4 |
| moc · bamboo | 94.5 | 93.6 | 88.2 | 92 |
| moc · forest | 75 | 60.8 | 106.6 | 76.3 |
| kim | 85 | 69.2 | 88.5 | 82.6 |
| kim · titanium | 93.4 | 92.1 | 88.7 | 91.1 |
| kim · steel | 75.1 | 60.7 | 106.9 | 76.4 |

