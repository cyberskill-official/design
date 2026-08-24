# Assistive-technology handoff — current state (updated 2026-08-24)

**Owner:** Stephen Cheng (operator)  
**Related:** [`ux-audit-2026-08-08/at-matrix-ux-audit-2026-08-08.md`](./ux-audit-2026-08-08/at-matrix-ux-audit-2026-08-08.md) · [`ux-audit-2026-08-23/roadmap.md`](./ux-audit-2026-08-23/roadmap.md)

Agents **cannot** invent NVDA/VoiceOver pass results. This file separates what automation already proves from what still needs a human AT session.

## Automated-green (code / CI — not AT)

These prove keyboard models, contrast, overflow, and artifact head — they are **not** screen-reader confirmation.

| Surface | Evidence | Status |
|---|---|---|
| Mentions / Sortable / Rating / Tree / Toolbar APG keyboard | `_audit/a11y-gate.html` fixtures | Automated green |
| Auth `formState` error/invalid UI | Auth template + kit demos | Automated green |
| Overlay focus trap / Escape (Dialog, Drawer) | a11y-gate + component tests | Automated green |
| Light contrast whole-set | `light-contrast` probe ×85 | Automated green |
| 320 reflow / VN overflow / zoom+text-spacing | audit-probe suite | Automated green |
| Artifact head (`title` + `lang` + main landmark) | `_audit/artifact-head.html` + `ds-base` | Automated green (post UX-032) |
| Skip links (`.cs-skip`) on product shells + kits | markup + `base/reset.css` | Code landed — AT still human |

## Clearance minimum already accepted (2026-08-09)

Operator VoiceOver run against the **clearance subset** only — see prior section history below. That acceptance does **not** close the broader AT matrix.

| Surface | Result (2026-08-09) |
|---------|---------------------|
| Mentions | **PASS** (operator) |
| Sortable | **PASS** (operator) |
| Rating / Tree / Toolbar | **PASS** (operator) |
| Auth error/invalid | **PASS** (operator) |
| Dialog focus | **PASS** (operator) |

## Still needs human AT — remaining ☐ rows

Canonical matrix: [`at-matrix-ux-audit-2026-08-08.md`](./ux-audit-2026-08-08/at-matrix-ux-audit-2026-08-08.md). Every row below is still ☐ for both NVDA and VoiceOver unless you fill it.

### Priority 1 — overlays & menus

| ID | Surface | Script (short) | NVDA | VO |
|----|---------|----------------|------|-----|
| AT-01 | Dialog | Open → name/description → Tab trap → Esc restores | ☐ | ☐ |
| AT-02 | AlertDialog | Destructive confirm preferred → Esc cancels | ☐ | ☐ |
| AT-03 | Nested Alert in Dialog | Esc closes alert first; second Esc closes dialog | ☐ | ☐ |
| AT-04 | Drawer | Open → label → Esc restores | ☐ | ☐ |
| AT-05 | Menu / Menubar | Arrow roving → submenu → Esc | ☐ | ☐ |
| AT-06 | CommandPalette | Open → type filter → Esc closes | ☐ | ☐ |

### Priority 2 — forms & complex widgets

| ID | Surface | Script (short) | NVDA | VO |
|----|---------|----------------|------|-----|
| AT-07 | Combobox | Expand → activedescendant → select | ☐ | ☐ |
| AT-08 | Cascader | Open → arrows → Esc restores field | ☐ | ☐ |
| AT-09 | TreeSelect | Open tree → Esc closes | ☐ | ☐ |
| AT-10 | DataGrid | Sort announces; selection named | ☐ | ☐ |
| AT-11 | Tabs / Status Hub lenses | Arrows move selection; one tabbable tab | ☐ | ☐ |

### Priority 3 — product surfaces

| ID | Surface | Script (short) | NVDA | VO |
|----|---------|----------------|------|-----|
| AT-12 | Auth template | Landmarks/skip → labeled fields → reset announced | ☐ | ☐ |
| AT-13 | Website kit home | Primary CTA; skip to `#main` | ☐ | ☐ |
| AT-14 | Status Hub settings | Tablist + labeled switches | ☐ | ☐ |
| AT-15 | Marketing page (VN) | No EN residual in browse | ☐ | ☐ |
| AT-16 | `vn-disciplinary-schedule` | HT codes legible + announced | ☐ | ☐ |

### How to execute

```bash
cd /Users/stephencheng/Projects/CyberSkill/design
npm run storybook
# → http://localhost:6006  (Components + Templates)

# or portable kits/templates:
python3 -m http.server 8790 --bind 127.0.0.1
# → http://127.0.0.1:8790/ui_kits/website/
# → http://127.0.0.1:8790/ui_kits/status-hub/
# → http://127.0.0.1:8790/guidelines/atomic-view.html
```

1. Start NVDA (Windows/Firefox) or VoiceOver (macOS/Safari) with speech on.
2. For each ☐ row: run the script, note pass/fail + AT version + browser version.
3. Replace ☐ with ☑ and fill **Result** / **Notes** in the matrix file — never green from axe alone.

## Operator report — 2026-08-09 (clearance minimum only)

- Status: **received · clearance minimum PASS**
- Operator: `@stephencheng`
- Environment: macOS · VoiceOver · Safari/Chrome
- Storybook tip at acceptance: `d9f15dd` / `1.3.0`

Defects on that subset: none reported. Broader matrix remains open (AT-001 on the Aug-23 roadmap).
