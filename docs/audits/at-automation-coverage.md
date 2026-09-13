# AT automation coverage map (AT-01…16)

**Purpose:** Map each row in the [manual AT matrix](./ux-audit-2026-08-08/at-matrix-ux-audit-2026-08-08.md) to automated CI proxies and the **human-only remainder** (NVDA + VoiceOver speech/browse). Automated-green ≠ AT pass.

**Updated:** 2026-08-24 · Operator handoff: [`at-operator-handoff-2026-08-09.md`](./at-operator-handoff-2026-08-09.md) · Human scripts: [`at-manual-checklist.md`](./at-manual-checklist.md)

| ID | Matrix row | Automated proxy | Gate / file | What it proves | Human-only remainder (NVDA + VO) |
|----|------------|-----------------|-------------|----------------|----------------------------------|
| AT-01 | Dialog — open, name/desc, Tab trap, Esc restores | Keyboard + focus trap | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) | Focus moves in; Tab wraps; Esc closes; focus restores to trigger | Dialog **name/description announced**; browse vs focus-mode reading order |
| AT-02 | AlertDialog — destructive confirm; Esc cancels | Keyboard + ARIA | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) | `role=alertdialog`, labelledby/describedby, Esc closes, focus restore | **Speech** for title/description; confirm vs cancel preference wording |
| AT-03 | Nested Alert in Dialog — Esc closes alert first | Nested overlay stack | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) (`Overlay stack — nested AlertDialog Escape closes top first`) | First Esc closes alertdialog; second Esc closes dialog | **Announcement order** when alert opens inside dialog |
| AT-04 | Drawer — open, label, Esc restores | Keyboard + focus | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) | Focus in drawer; Esc closes; focus restored | Drawer **label announced**; landmark/navigation quality |
| AT-05 | Menu / Menubar — arrow roving, submenu, Esc | APG keyboard | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) | Menubar roving; ArrowDown opens; Esc closes + restores | **Menu item names** in speech; submenu browse mode |
| AT-06 | CommandPalette — open, type filter, Esc closes | Keyboard + filter + Esc | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) · [`_audit/axe-smoke.html`](../../_audit/axe-smoke.html) | Open palette; type filters list; Esc closes (hard-fail in a11y-gate); axe with overlay open | **Filter results announced**; listbox/combobox role speech |
| AT-07 | Combobox — expand, activedescendant, select | APG combobox | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) | `aria-expanded`, `aria-activedescendant` follows highlight; Esc closes | **Option names** as you arrow; selection confirmation speech |
| AT-08 | Cascader — open, arrows, Esc restores field | Keyboard open/close + arrows | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) | Listbox open; ArrowDown moves; Esc closes | **Multi-level labels** in speech; field value after select |
| AT-09 | TreeSelect — open tree, Esc closes | Keyboard open/close | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) | `aria-haspopup=tree`; expand; Esc closes | **Tree levels** announced; selected value speech |
| AT-10 | DataGrid — sort announces; selection named | ARIA sort + labels | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) | `aria-sort`; checkbox `aria-label`s | **Sort change announced**; row selection speech |
| AT-11 | Tabs / Status Hub lenses — arrows, one tabbable | Roving tabindex | [`_audit/a11y-gate.html`](../../_audit/a11y-gate.html) (Tabs) · [`_audit/at-kit-probe.html`](../../_audit/at-kit-probe.html) (AT-14 tablist) | Arrow/End roving on Tabs; settings `[role=tablist]` present | **Selected tab name** in speech; Status Hub lens labels |
| AT-12 | Auth template — skip, labeled fields, reset link | Product surface probe | [`_audit/at-kit-probe.html`](../../_audit/at-kit-probe.html) · [`_audit/artifact-head.html`](../../_audit/artifact-head.html) | `.cs-skip` → `#main`; labeled inputs; reset mailto accessible name; title/lang/main | **Landmark navigation**; field labels in browse; reset link wording |
| AT-13 | Website kit home — skip, primary CTA | Product surface probe | [`_audit/at-kit-probe.html`](../../_audit/at-kit-probe.html) | Skip link; `#main`; primary CTA focusable + named | **Hero CTA** speech; skip-link activation announcement |
| AT-14 | Status Hub settings — tablist + labeled switches | Product surface probe | [`_audit/at-kit-probe.html`](../../_audit/at-kit-probe.html) | `[role=tablist]`; switches have `aria-label` or visible label association | **Switch on/off state** in speech; tab panel context |
| AT-15 | Marketing page (VN) — no EN residual | VN EN-leak lexicon | [`_audit/at-kit-probe.html`](../../_audit/at-kit-probe.html) · [`_audit/language-overflow.html`](../../_audit/language-overflow.html) | Forced VI on marketing template; no built-in EN leak strings | **Residual EN** in chrome not in lexicon; natural-language quality |
| AT-16 | vn-disciplinary-schedule — HT codes legible | HT cells + contrast | [`_audit/at-kit-probe.html`](../../_audit/at-kit-probe.html) · [`_audit/light-contrast.html`](../../_audit/light-contrast.html) | HT1–HT4 badges present; ochre/umber token contrast ratio ≥ 4.5:1 on sample cell | **HT code pronunciation**; table reading order in browse |

## How to run automated proxies

```bash
# Static server (required for browser gates)
python3 -m http.server 8790 --bind 127.0.0.1

# Full portable suite (unit + zoom + contrast + overflow + language + at-kit)
npm run test:audit-probe

# Single gates
node _audit/ci/run-single-gate.mjs http://127.0.0.1:8790/_audit/a11y-gate.html __a11y 180000
node _audit/ci/run-single-gate.mjs http://127.0.0.1:8790/_audit/at-kit-probe.html __atkitprobe 180000

# Coverage map drift guard (unit)
node _audit/ci/test-at-coverage-map.mjs
```

## What stays human-only

Speech output, browse/focus-mode behavior, announcement wording, reading-order quality, and “does it *sound* right?” — use [`at-manual-checklist.md`](./at-manual-checklist.md) with **both** NVDA and VoiceOver before marking ☑ in the matrix.
