# Manual assistive-technology matrix (E1 / CDS-QA-002)

**Status:** Scheduled — **not executed**. Do not treat empty slots as passes.  
**Owner:** Stephen Cheng (operator)  
**Related plan:** `docs/plans/ux-audit-2026-08-08.md` · Task `TASK-UX-AUDIT-20260808`  
**Created:** 2026-08-08

## Purpose

Convert automated axe / a11y-gate confidence into **Confirmed** AT evidence for NVDA (Windows) and VoiceOver (macOS). Code cannot invent these results.

## Schedule (proposed)

| Window | Surface set | AT | Operator | Status |
|--------|-------------|-----|----------|--------|
| Week of 2026-08-11 | Components: Dialog, AlertDialog, Drawer, Menu, Combobox, DataGrid, Cascader, Tabs | NVDA + Firefox | Stephen Cheng | ☐ pending |
| Week of 2026-08-18 | Same component set | VoiceOver + Safari | Stephen Cheng | ☐ pending |
| Week of 2026-08-25 | Product kits: Status Hub, Website home, Auth template | NVDA + VoiceOver | Stephen Cheng | ☐ pending |
| Week of 2026-09-01 | Decks + one VN legal instrument (`vn-disciplinary-schedule`) | VoiceOver | Stephen Cheng | ☐ pending |
| Buffer | Retest failures only | As needed | Stephen Cheng | ☐ pending |

## How to run (checklist)

1. Build/serve the repo (`python3 -m http.server` or Storybook / Atomic View).
2. Start AT (NVDA or VoiceOver) with speech + browse/focus modes as usual for the platform.
3. For each row below: perform the script, note pass/fail + notes, paste AT version + browser version.
4. File failures as tasks or fold into `docs/decisions.md` waivers only when the owner accepts residual risk.
5. When a row is truly done, replace `☐` with `☑` and fill **Result** / **Notes** — never mark pass without a human session.

## Matrix

### A. Core overlays & menus

| ID | Component / flow | Script (short) | NVDA | VO | Result | Notes |
|----|------------------|----------------|------|-----|--------|-------|
| AT-01 | Dialog | Open from trigger → name/description announced → Tab trap → Esc restores | ☐ | ☐ | | |
| AT-02 | AlertDialog | Destructive confirm preferred → Esc cancels | ☐ | ☐ | | |
| AT-03 | Nested Alert in Dialog | Esc closes alert first; second Esc closes dialog | ☐ | ☐ | | |
| AT-04 | Drawer | Open → label → Esc restores | ☐ | ☐ | | |
| AT-05 | Menu / Menubar | Arrow roving → open submenu → Esc | ☐ | ☐ | | |
| AT-06 | CommandPalette | Open → type filter → Esc closes | ☐ | ☐ | | |

### B. Forms & complex widgets

| ID | Component / flow | Script (short) | NVDA | VO | Result | Notes |
|----|------------------|----------------|------|-----|--------|-------|
| AT-07 | Combobox | Expand → activedescendant follows arrows → select | ☐ | ☐ | | |
| AT-08 | Cascader | Open → arrows move options → Esc restores field | ☐ | ☐ | | |
| AT-09 | TreeSelect | Open tree → Esc closes | ☐ | ☐ | | |
| AT-10 | DataGrid | Sort announces; selection checkbox named | ☐ | ☐ | | |
| AT-11 | Tabs / Status Hub lenses | Arrow keys move selection; one tabbable tab | ☐ | ☐ | | |

### C. Product surfaces

| ID | Surface | Script (short) | NVDA | VO | Result | Notes |
|----|---------|----------------|------|-----|--------|-------|
| AT-12 | Auth template | Landmarks/skip → fields labeled → reset link announced | ☐ | ☐ | | |
| AT-13 | Website kit home | One primary CTA story; skip to main | ☐ | ☐ | | |
| AT-14 | Status Hub settings | Tablist + labeled switches | ☐ | ☐ | | |
| AT-15 | Marketing page (VN) | No EN residual strings in browse | ☐ | ☐ | | |
| AT-16 | vn-disciplinary-schedule | HT codes legible + announced | ☐ | ☐ | | |

## Environment log (fill when executing)

| Date | AT + version | Browser | OS | Operator |
|------|--------------|---------|-----|----------|
| | | | | Stephen Cheng |

## Non-goals

- Do not mark rows green from axe-smoke alone.
- Do not assign this matrix to another named owner without an operator decision.
