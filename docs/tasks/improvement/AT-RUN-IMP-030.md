---
task: TASK-IMP-030
recorded_at: 2026-09-15
---

# AT run log — TASK-IMP-030

Protocol: `docs/at-protocol.md`. Empty cells are **not** passes.

| Surface | NVDA+FF | JAWS+Chrome | VO+Safari macOS | VO+Safari iOS | TalkBack | IME Telex/VNI |
|---|---|---|---|---|---|---|
| Dialog | — | — | — | — | — | n/a |
| AlertDialog | — | — | — | — | — | n/a |
| Menu | — | — | — | — | — | n/a |
| Combobox | — | — | — | — | — | — |
| DataGrid | — | — | — | — | — | n/a |
| Sortable | — | — | — | — | — | n/a |
| Editor | — | — | — | — | — | — |
| Carousel | — | — | — | — | — | n/a |
| DatePicker | — | — | — | — | — | n/a |
| TimePicker | — | — | — | — | — | n/a |
| Image preview | — | — | — | — | — | n/a |

Machine evidence (not a screen-reader pass): `_audit/ci/test-high-risk-at.mjs` plus `_audit/a11y-gate.html` (Dialog, AlertDialog, Menu, Combobox, DataGrid, Sortable, Editor, Carousel, DatePicker, TimePicker, Image preview), axe inventory, inclusive-matrix Chromium (320 / zoom / RTL / forced-colors / reduced-motion / pseudo-locale), trusted-HTML tests. Empty NVDA/JAWS/VO/TalkBack/IME cells remain **not** passes. A dated operator AT session is still required before claiming production AT clearance.
