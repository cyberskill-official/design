# Báo cáo contrast — cặp elemental (APCA)

Tạo 2026-07-26 · quét tại pin VERSION 1.0.0.

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
| tho · sand | text-accent on white (bold labels) | #8B7D4A / #FFFFFF | 68.1 | ✓ |
| tho · sand | text-accent on tint (bold labels) | #8B7D4A / #F5F2E6 | 60.2 | ✓ |
| tho · sand | accent-bright on ink (headings) | #F7ECC1 / #2E2915 | 91.6 | ✓ |
| tho · sand | accent-on on accent-bright (CTA text) | #2E2915 / #F7ECC1 | 89.9 | ✓ |
| tho · sand | accent-bright on dark panel (dark labels) | #F6ECC1 / #221710 | 93.9 | ✓ |
| tho · clay | text-accent on white (bold labels) | #4C3201 / #FFFFFF | 97.1 | ✓ |
| tho · clay | text-accent on tint (bold labels) | #4C3201 / #FFEFD8 | 88.7 | ✓ |
| tho · clay | accent-bright on ink (headings) | #F6C06B / #382503 | 70.3 | ✓ |
| tho · clay | accent-on on accent-bright (CTA text) | #382503 / #F6C06B | 70.2 | ✓ |
| tho · clay | accent-bright on dark panel (dark labels) | #FDC672 / #221710 | 76.4 | ✓ |
| hoa | text-accent on white (bold labels) | #C36036 / #FFFFFF | 68.1 | ✓ |
| hoa | text-accent on tint (bold labels) | #C36036 / #FFEEE7 | 60 | ✓ |
| hoa | accent-bright on ink (headings) | #FFCAB5 / #431C0B | 77.9 | ✓ |
| hoa | accent-on on accent-bright (CTA text) | #431C0B / #FFCAB5 | 77.3 | ✓ |
| hoa | accent-bright on dark panel (dark labels) | #FFCAB6 / #221710 | 80.2 | ✓ |
| hoa · plasma | text-accent on white (bold labels) | #B65E6D / #FFFFFF | 69.9 | ✓ |
| hoa · plasma | text-accent on tint (bold labels) | #B65E6D / #FFECEE | 61.2 | ✓ |
| hoa · plasma | accent-bright on ink (headings) | #FFE3E6 / #3F1D23 | 90.4 | ✓ |
| hoa · plasma | accent-on on accent-bright (CTA text) | #3F1D23 / #FFE3E6 | 88.8 | ✓ |
| hoa · plasma | accent-bright on dark panel (dark labels) | #FFE3E6 / #221710 | 92.6 | ✓ |
| hoa · lava | text-accent on white (bold labels) | #572A03 / #FFFFFF | 97.2 | ✓ |
| hoa · lava | text-accent on tint (bold labels) | #572A03 / #FFEEE4 | 88.9 | ✓ |
| hoa · lava | accent-bright on ink (headings) | #FFB98B / #421E02 | 69.9 | ✓ |
| hoa · lava | accent-on on accent-bright (CTA text) | #421E02 / #FFB98B | 69.8 | ✓ |
| hoa · lava | accent-bright on dark panel (dark labels) | #FEC39C / #221710 | 76.4 | ✓ |
| thuy | text-accent on white (bold labels) | #408693 / #FFFFFF | 68.5 | ✓ |
| thuy | text-accent on tint (bold labels) | #408693 / #E6F5F8 | 60.8 | ✓ |
| thuy | accent-bright on ink (headings) | #ACE2EE / #122D33 | 79.8 | ✓ |
| thuy | accent-on on accent-bright (CTA text) | #122D33 / #ACE2EE | 79 | ✓ |
| thuy | accent-bright on dark panel (dark labels) | #ACE2ED / #221710 | 82.2 | ✓ |
| thuy · mist | text-accent on white (bold labels) | #468689 / #FFFFFF | 68.6 | ✓ |
| thuy · mist | text-accent on tint (bold labels) | #468689 / #E7F5F5 | 60.9 | ✓ |
| thuy · mist | accent-bright on ink (headings) | #C3F7F8 / #142E2E | 92.4 | ✓ |
| thuy · mist | accent-on on accent-bright (CTA text) | #142E2E / #C3F7F8 | 90.6 | ✓ |
| thuy · mist | accent-bright on dark panel (dark labels) | #C3F7F8 / #221710 | 95 | ✓ |
| thuy · ocean | text-accent on white (bold labels) | #063E4F / #FFFFFF | 96.3 | ✓ |
| thuy · ocean | text-accent on tint (bold labels) | #063E4F / #E1F6FF | 88.8 | ✓ |
| thuy · ocean | accent-bright on ink (headings) | #8AD7F4 / #012E3C | 71.9 | ✓ |
| thuy · ocean | accent-on on accent-bright (CTA text) | #012E3C / #8AD7F4 | 71.6 | ✓ |
| thuy · ocean | accent-bright on dark panel (dark labels) | #8DDAF7 / #221710 | 76.4 | ✓ |
| moc | text-accent on white (bold labels) | #668741 / #FFFFFF | 68.2 | ✓ |
| moc | text-accent on tint (bold labels) | #668741 / #ECF5E5 | 60.4 | ✓ |
| moc | accent-bright on ink (headings) | #C6E3AA / #212E12 | 80.1 | ✓ |
| moc | accent-on on accent-bright (CTA text) | #212E12 / #C6E3AA | 79.2 | ✓ |
| moc | accent-bright on dark panel (dark labels) | #C6E3AA / #221710 | 82.7 | ✓ |
| moc · bamboo | text-accent on white (bold labels) | #7C8345 / #FFFFFF | 67.7 | ✓ |
| moc · bamboo | text-accent on tint (bold labels) | #7C8345 / #F1F4E5 | 60.1 | ✓ |
| moc · bamboo | accent-bright on ink (headings) | #EAF1BD / #292B13 | 91.9 | ✓ |
| moc · bamboo | accent-on on accent-bright (CTA text) | #292B13 / #EAF1BD | 90.2 | ✓ |
| moc · bamboo | accent-bright on dark panel (dark labels) | #EAF1BD / #221710 | 94.4 | ✓ |
| moc · forest | text-accent on white (bold labels) | #09450E / #FFFFFF | 95.5 | ✓ |
| moc · forest | text-accent on tint (bold labels) | #09450E / #E6F8E5 | 88.4 | ✓ |
| moc · forest | accent-bright on ink (headings) | #A1DDA0 / #133114 | 72.9 | ✓ |
| moc · forest | accent-on on accent-bright (CTA text) | #133114 / #A1DDA0 | 72.5 | ✓ |
| moc · forest | accent-bright on dark panel (dark labels) | #A1DDA0 / #221710 | 75.8 | ✓ |
| kim | text-accent on white (bold labels) | #897B65 / #FFFFFF | 68.4 | ✓ |
| kim | text-accent on tint (bold labels) | #897B65 / #F5F1EB | 60.3 | ✓ |
| kim | accent-bright on ink (headings) | #E1D6C2 / #2D281F | 78.8 | ✓ |
| kim | accent-on on accent-bright (CTA text) | #2D281F / #E1D6C2 | 78.1 | ✓ |
| kim | accent-bright on dark panel (dark labels) | #E1D6C2 / #221710 | 81.1 | ✓ |
| kim · titanium | text-accent on white (bold labels) | #8F7867 / #FFFFFF | 68.6 | ✓ |
| kim · titanium | text-accent on tint (bold labels) | #8F7867 / #F6F0EC | 60.3 | ✓ |
| kim · titanium | accent-bright on ink (headings) | #FBE7D8 / #302720 | 90.9 | ✓ |
| kim · titanium | accent-on on accent-bright (CTA text) | #302720 / #FBE7D8 | 89.2 | ✓ |
| kim · titanium | accent-bright on dark panel (dark labels) | #FBE7D8 / #221710 | 93.2 | ✓ |
| kim · steel | text-accent on white (bold labels) | #134040 / #FFFFFF | 96.2 | ✓ |
| kim · steel | text-accent on tint (bold labels) | #134040 / #EAF4F4 | 88.4 | ✓ |
| kim · steel | accent-bright on ink (headings) | #AFD3D3 / #1B2C2D | 72 | ✓ |
| kim · steel | accent-on on accent-bright (CTA text) | #1B2C2D / #AFD3D3 | 71.8 | ✓ |
| kim · steel | accent-bright on dark panel (dark labels) | #B2D6D6 / #221710 | 76.2 | ✓ |

**Failures: 0.** All text pairings pass Lc ≥ 60.

## Dark pack APCA floors (gate twin)

Targets match `_audit/apca-dark-preview.html`: bright ≥ 75 · accent ≥ 60 · on/strong ≥ 75 · ink-on-tint ≥ 75.
| Pack | bright | accent | on | ink |
|---|---|---|---|---|
| tho | 75 | 69.2 | 75.6 | 75.3 |
| tho · sand | 93.9 | 93.9 | 75.8 | 92.3 |
| tho · clay | 76.4 | 60.2 | 87.8 | 75 |
| hoa | 80.2 | 67.9 | 75.2 | 78.8 |
| hoa · plasma | 92.6 | 92.6 | 75.6 | 91.3 |
| hoa · lava | 76.4 | 60.5 | 87.9 | 77.2 |
| thuy | 82.2 | 71.1 | 75.5 | 80.5 |
| thuy · mist | 95 | 95.2 | 75.8 | 93.2 |
| thuy · ocean | 76.4 | 60 | 87.2 | 76.4 |
| moc | 82.7 | 71.6 | 75.4 | 81 |
| moc · bamboo | 94.4 | 94.8 | 75.2 | 92.7 |
| moc · forest | 75.8 | 61.1 | 86.5 | 75.8 |
| kim | 81.1 | 69.5 | 75.8 | 79.6 |
| kim · titanium | 93.2 | 93.2 | 75.9 | 91.8 |
| kim · steel | 76.2 | 61.8 | 87 | 76.2 |

