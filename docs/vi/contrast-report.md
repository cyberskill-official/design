# Báo cáo contrast — cặp elemental (APCA)

Tạo 2026-07-25 · quét tại pin VERSION 1.0.0.

**Doctrine của sweep này:** chữ ngồi trên `-bright` hoặc `-tint`, không bao giờ trên mid-tone `-accent`. Accent chỉ cho bar, border, progress, fill không chữ. (Rule trong `tokens/elements.css` và conventions.)

Pack được generate từ `tokens/element-seeds.json` (thang soft / middle / deep, khóa hue light↔dark). Gate hình học: `_audit/element-geometry.html`.
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
| tho · sand | text-accent on white (bold labels) | #977933 / #FFFFFF | 68.2 | ✓ |
| tho · sand | text-accent on tint (bold labels) | #977933 / #F9F1E2 | 60.3 | ✓ |
| tho · sand | accent-bright on ink (headings) | #FFE9BB / #33270C | 91.3 | ✓ |
| tho · sand | accent-on on accent-bright (CTA text) | #33270C / #FFE9BB | 89.6 | ✓ |
| tho · sand | accent-bright on dark panel (dark labels) | #FFE9BB / #221710 | 93.6 | ✓ |
| tho · clay | text-accent on white (bold labels) | #5C4301 / #FFFFFF | 91.3 | ✓ |
| tho · clay | text-accent on tint (bold labels) | #5C4301 / #FBF1DD | 83.4 | ✓ |
| tho · clay | accent-bright on ink (headings) | #E8C67F / #352603 | 71 | ✓ |
| tho · clay | accent-on on accent-bright (CTA text) | #352603 / #E8C67F | 70.8 | ✓ |
| tho · clay | accent-bright on dark panel (dark labels) | #EBC982 / #221710 | 75.1 | ✓ |
| hoa | text-accent on white (bold labels) | #C36036 / #FFFFFF | 68.1 | ✓ |
| hoa | text-accent on tint (bold labels) | #C36036 / #FFEEE7 | 60 | ✓ |
| hoa | accent-bright on ink (headings) | #FFCAB5 / #431C0B | 77.9 | ✓ |
| hoa | accent-on on accent-bright (CTA text) | #431C0B / #FFCAB5 | 77.3 | ✓ |
| hoa | accent-bright on dark panel (dark labels) | #FFCAB6 / #221710 | 80.2 | ✓ |
| hoa · plasma | text-accent on white (bold labels) | #BB606C / #FFFFFF | 68.6 | ✓ |
| hoa · plasma | text-accent on tint (bold labels) | #BB606C / #FFEDEE | 60.3 | ✓ |
| hoa · plasma | accent-bright on ink (headings) | #FEE4E6 / #401C21 | 90.7 | ✓ |
| hoa · plasma | accent-on on accent-bright (CTA text) | #401C21 / #FEE4E6 | 89.1 | ✓ |
| hoa · plasma | accent-bright on dark panel (dark labels) | #FEE4E6 / #221710 | 92.9 | ✓ |
| hoa · lava | text-accent on white (bold labels) | #7A2B01 / #FFFFFF | 91.5 | ✓ |
| hoa · lava | text-accent on tint (bold labels) | #7A2B01 / #FFEEE7 | 83.4 | ✓ |
| hoa · lava | accent-bright on ink (headings) | #FCB89E / #411D0E | 69.6 | ✓ |
| hoa · lava | accent-on on accent-bright (CTA text) | #411D0E / #FCB89E | 69.6 | ✓ |
| hoa · lava | accent-bright on dark panel (dark labels) | #FFC0A8 / #221710 | 75.7 | ✓ |
| thuy | text-accent on white (bold labels) | #408693 / #FFFFFF | 68.5 | ✓ |
| thuy | text-accent on tint (bold labels) | #408693 / #E6F5F8 | 60.8 | ✓ |
| thuy | accent-bright on ink (headings) | #ACE2EE / #122D33 | 79.8 | ✓ |
| thuy | accent-on on accent-bright (CTA text) | #122D33 / #ACE2EE | 79 | ✓ |
| thuy | accent-bright on dark panel (dark labels) | #ACE2ED / #221710 | 82.2 | ✓ |
| thuy · mist | text-accent on white (bold labels) | #54838D / #FFFFFF | 68.8 | ✓ |
| thuy · mist | text-accent on tint (bold labels) | #54838D / #E9F4F7 | 61.1 | ✓ |
| thuy · mist | accent-bright on ink (headings) | #CDF3FC / #1A2C30 | 92 | ✓ |
| thuy · mist | accent-on on accent-bright (CTA text) | #1A2C30 / #CDF3FC | 90.2 | ✓ |
| thuy · mist | accent-bright on dark panel (dark labels) | #CDF3FB / #221710 | 94.3 | ✓ |
| thuy · ocean | text-accent on white (bold labels) | #05515D / #FFFFFF | 90.2 | ✓ |
| thuy · ocean | text-accent on tint (bold labels) | #05515D / #E7F5F8 | 82.6 | ✓ |
| thuy · ocean | accent-bright on ink (headings) | #A3D4DF / #142D32 | 71.8 | ✓ |
| thuy · ocean | accent-on on accent-bright (CTA text) | #142D32 / #A3D4DF | 71.5 | ✓ |
| thuy · ocean | accent-bright on dark panel (dark labels) | #A6D7E1 / #221710 | 76 | ✓ |
| moc | text-accent on white (bold labels) | #668741 / #FFFFFF | 68.2 | ✓ |
| moc | text-accent on tint (bold labels) | #668741 / #ECF5E5 | 60.4 | ✓ |
| moc | accent-bright on ink (headings) | #C6E3AA / #212E12 | 80.1 | ✓ |
| moc | accent-on on accent-bright (CTA text) | #212E12 / #C6E3AA | 79.2 | ✓ |
| moc | accent-bright on dark panel (dark labels) | #C6E3AA / #221710 | 82.7 | ✓ |
| moc · bamboo | text-accent on white (bold labels) | #6B8354 / #FFFFFF | 68.9 | ✓ |
| moc · bamboo | text-accent on tint (bold labels) | #6B8354 / #EEF4E8 | 61.1 | ✓ |
| moc · bamboo | accent-bright on ink (headings) | #DEF4CB / #232C1A | 92.3 | ✓ |
| moc · bamboo | accent-on on accent-bright (CTA text) | #232C1A / #DEF4CB | 90.5 | ✓ |
| moc · bamboo | accent-bright on dark panel (dark labels) | #DFF4CA / #221710 | 94.8 | ✓ |
| moc · forest | text-accent on white (bold labels) | #365110 / #FFFFFF | 90.4 | ✓ |
| moc · forest | text-accent on tint (bold labels) | #365110 / #EDF5E6 | 82.9 | ✓ |
| moc · forest | accent-bright on ink (headings) | #BAD5A1 / #212D14 | 72.2 | ✓ |
| moc · forest | accent-on on accent-bright (CTA text) | #212D14 / #BAD5A1 | 71.9 | ✓ |
| moc · forest | accent-bright on dark panel (dark labels) | #BDD8A4 / #221710 | 76.4 | ✓ |
| kim | text-accent on white (bold labels) | #897B65 / #FFFFFF | 68.4 | ✓ |
| kim | text-accent on tint (bold labels) | #897B65 / #F5F1EB | 60.3 | ✓ |
| kim | accent-bright on ink (headings) | #E1D6C2 / #2D281F | 78.8 | ✓ |
| kim | accent-on on accent-bright (CTA text) | #2D281F / #E1D6C2 | 78.1 | ✓ |
| kim | accent-bright on dark panel (dark labels) | #E1D6C2 / #221710 | 81.1 | ✓ |
| kim · titanium | text-accent on white (bold labels) | #867C6B / #FFFFFF | 68.3 | ✓ |
| kim · titanium | text-accent on tint (bold labels) | #867C6B / #F4F1ED | 60.1 | ✓ |
| kim · titanium | accent-bright on ink (headings) | #F2EADC / #2C2822 | 91.1 | ✓ |
| kim · titanium | accent-on on accent-bright (CTA text) | #2C2822 / #F2EADC | 89.5 | ✓ |
| kim · titanium | accent-bright on dark panel (dark labels) | #F2EADC / #221710 | 93.4 | ✓ |
| kim · steel | text-accent on white (bold labels) | #3E4A4A / #FFFFFF | 91.2 | ✓ |
| kim · steel | text-accent on tint (bold labels) | #3E4A4A / #EFF2F2 | 83.1 | ✓ |
| kim · steel | accent-bright on ink (headings) | #C2CDCD / #252A2A | 71.3 | ✓ |
| kim · steel | accent-on on accent-bright (CTA text) | #252A2A / #C2CDCD | 71.1 | ✓ |
| kim · steel | accent-bright on dark panel (dark labels) | #C5D0D1 / #221710 | 75.5 | ✓ |

**Failures: 0.** All text pairings pass Lc ≥ 60.

## Dark pack APCA floors (gate twin)

Targets match `_audit/apca-dark-preview.html`: bright ≥ 75 · accent ≥ 60 · on/strong ≥ 75 · ink-on-tint ≥ 75.
| Pack | bright | accent | on | ink |
|---|---|---|---|---|
| tho | 75 | 69.2 | 75.6 | 75.3 |
| tho · sand | 93.6 | 81.1 | 75.6 | 92.1 |
| tho · clay | 75.1 | 60 | 82.7 | 75.3 |
| hoa | 80.2 | 67.9 | 75.2 | 78.8 |
| hoa · plasma | 92.9 | 79.8 | 75.7 | 91.6 |
| hoa · lava | 75.7 | 60.4 | 83 | 76.5 |
| thuy | 82.2 | 71.1 | 75.5 | 80.5 |
| thuy · mist | 94.3 | 82.4 | 75 | 92.6 |
| thuy · ocean | 76 | 60.3 | 81.7 | 76 |
| moc | 82.7 | 71.6 | 75.4 | 81 |
| moc · bamboo | 94.8 | 82.4 | 75 | 93.1 |
| moc · forest | 76.4 | 60.2 | 82 | 76.5 |
| kim | 81.1 | 69.5 | 75.8 | 79.6 |
| kim · titanium | 93.4 | 81.1 | 75.6 | 91.9 |
| kim · steel | 75.5 | 60.6 | 82.6 | 75.8 |

