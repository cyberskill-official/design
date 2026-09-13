# Manual AT checklist — NVDA + VoiceOver only

**Printable scripts** for the human-only remainder after automated proxies ([`at-automation-coverage.md`](./at-automation-coverage.md)). Canonical matrix: [`ux-audit-2026-08-08/at-matrix-ux-audit-2026-08-08.md`](./ux-audit-2026-08-08/at-matrix-ux-audit-2026-08-08.md).

**Rule:** Do not ☑ a row until **both** an NVDA session **and** a VoiceOver session pass. Axe/a11y-gate green is not AT pass.

## Prerequisites

1. Serve the repo:
   ```bash
   python3 -m http.server 8790 --bind 127.0.0.1
   # Storybook alternative: npm run storybook → http://localhost:6006
   ```
2. **NVDA:** Windows + Firefox (or Chrome) · NVDA speech on · browse/focus as you normally test.
3. **VoiceOver:** macOS + Safari · VO on · rotor/landmarks available.
4. Log environment in the matrix **Environment log** table (date, AT version, browser, OS).

---

## A. Core overlays & menus

### AT-01 — Dialog
- Open Dialog from its trigger (Atomic View or component story).
- **Listen:** dialog name and description are announced on open.
- Tab through — focus stays inside; last → first wraps.
- Esc — dialog closes; focus returns to trigger.
- **Pass if:** name/desc/trap/restore all sound correct on **both** ATs.

### AT-02 — AlertDialog
- Open destructive AlertDialog.
- **Listen:** title + description; default action is sensible (Cancel vs Delete).
- Esc — cancels without confirming.
- **Pass if:** destructive tone is clear in speech on **both** ATs.

### AT-03 — Nested Alert in Dialog
- Open Dialog, then trigger nested AlertDialog inside it.
- Esc once — **only** alert closes; dialog stays open.
- Esc again — dialog closes.
- **Pass if:** Esc order matches above and neither layer “loses” focus oddly.

### AT-04 — Drawer
- Open Drawer from trigger.
- **Listen:** drawer has an accessible name.
- Esc — drawer closes; focus restored.
- **Pass if:** label and restore are announced correctly.

### AT-05 — Menu / Menubar
- Focus Menubar; ArrowRight/Left moves top-level items.
- ArrowDown opens submenu; Esc closes submenu and returns focus.
- **Pass if:** roving and submenu names are spoken clearly.

### AT-06 — CommandPalette
- Open CommandPalette (⌘K / story control).
- Type to filter — **listen** to result count or filtered items.
- Esc — palette closes completely.
- **Pass if:** filter feedback and close are sensible in speech.

---

## B. Forms & complex widgets

### AT-07 — Combobox
- Focus combobox; expand list.
- ArrowDown — **listen** to highlighted option name changing.
- Enter or click — value selected; list closes.
- **Pass if:** activedescendant/options are announced.

### AT-08 — Cascader
- Open cascader field.
- Arrow keys move between options; expand child level if shown.
- Esc — popover closes; field keeps focus.
- **Pass if:** levels and labels are spoken.

### AT-09 — TreeSelect
- Open tree select.
- Navigate tree with arrows; Esc closes popover.
- **Pass if:** tree structure audible; close returns to field.

### AT-10 — DataGrid
- Activate column sort — **listen** for sort direction change.
- Toggle row selection — checkbox name includes row context.
- **Pass if:** sort and selection are announced.

### AT-11 — Tabs / Status Hub lenses
- ArrowLeft/Right on tablist — selection moves; only one tab in tab order.
- On Status Hub (`ui_kits/status-hub/`), repeat on lens tabs if present.
- **Pass if:** selected tab name updates in speech.

---

## C. Product surfaces

### AT-12 — Auth template
- URL: `http://127.0.0.1:8790/templates/auth/Auth.dc.html`
- Activate skip link — lands on main content.
- Tab through email, password, remember switch, sign-in, reset link.
- **Listen:** each field label; reset/mailto link purpose.
- **Pass if:** landmarks + labels + reset link are clear.

### AT-13 — Website kit home
- URL: `http://127.0.0.1:8790/ui_kits/website/index.html`
- Skip link → `#main`.
- Tab to primary hero CTA — **listen** to button name.
- **Pass if:** skip and CTA are usable and named.

### AT-14 — Status Hub settings
- URL: `http://127.0.0.1:8790/ui_kits/status-hub/settings.html`
- Tablist — arrows change selected tab.
- Toggle a notification switch — **listen** for on/off state.
- **Pass if:** tab names and switch states are announced.

### AT-15 — Marketing page (VN)
- URL: `http://127.0.0.1:8790/templates/marketing-page/MarketingPage.dc.html`
- Force Language → Tiếng Việt in template tweaks if available.
- Browse page — **listen** for stray English UI chrome not translated.
- **Pass if:** no obvious EN leftovers in user-visible strings.

### AT-16 — vn-disciplinary-schedule
- URL: `http://127.0.0.1:8790/templates/vn-disciplinary-schedule/VnDisciplinarySchedule.dc.html`
- Find HT1–HT4 codes in the schedule table.
- **Listen:** codes and Vietnamese labels are readable; contrast sufficient in speech context (you can see them too).
- **Pass if:** HT codes and penalty names are announced legibly.

---

## After each row

1. Replace ☐ with ☑ in the matrix for NVDA and VO columns separately.
2. Fill **Result** and **Notes** (AT version, browser, any defects).
3. File defects as tasks — do not waive in the matrix without operator decision.

## Quick reference — URLs

| Surface | URL |
|---------|-----|
| Auth | `/templates/auth/Auth.dc.html` |
| Website home | `/ui_kits/website/index.html` |
| Status Hub settings | `/ui_kits/status-hub/settings.html` |
| Marketing page | `/templates/marketing-page/MarketingPage.dc.html` |
| Disciplinary schedule | `/templates/vn-disciplinary-schedule/VnDisciplinarySchedule.dc.html` |

Base: `http://127.0.0.1:8790`
