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
| Combobox | — | — | — | — | — | machine |
| DataGrid | — | — | — | — | — | n/a |
| Sortable | — | — | — | — | — | n/a |
| Editor | — | — | — | — | — | machine |
| Carousel | — | — | — | — | — | n/a |
| DatePicker | — | — | — | — | — | n/a |
| TimePicker | — | — | — | — | — | n/a |
| Image preview | — | — | — | — | — | n/a |

Machine evidence (not a screen-reader pass): `_audit/ci/test-high-risk-at.mjs` plus `_audit/a11y-gate.html` (Dialog, AlertDialog, Menu, Combobox, DataGrid, Sortable, Editor, Carousel, DatePicker, TimePicker, Image preview), IME `isComposing` / keyCode 229 guards on Combobox and PromptInput, Chrome accessibility-tree name/role/value on the action-9 gallery, Dialog focus restoration, axe inventory, inclusive-matrix Chromium (320 / 400% zoom / mobile / RTL / forced-colors / reduced-motion / pseudo-locale), trusted-HTML tests. `machine` in the IME column is composition-event evidence, not a human Telex/VNI session. Empty NVDA/JAWS/VO/TalkBack cells remain **not** passes. A dated operator AT session is still required before claiming production AT clearance.
