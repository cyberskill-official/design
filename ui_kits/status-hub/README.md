# Status Hub — UI kit

A high-fidelity recreation of **CyberSkill Status Hub** (`status-hub@2`): the single-page portfolio dashboard. One page, three lenses. (Gate / Health browsing for operators is Storybook **Status** / `_audit/run.html` — not this kit.)

## What it demonstrates
- **Umber header** with the official Logo mark on an Ochre tile, the product title, and a warm-dark theme toggle (`data-theme` on the root — flip it to see the whole surface re-theme).

- **Deck**: clickable KPI stats (filter the board by status), a segmented progress bar with legend, and a velocity spark chart.

- **"Now shipping"** Ochre callout.

- **Command bar** (sticky, Light-Glass-adjacent): search, a segmented **Board / Table / Releases** lens switcher, a status facet, and a live count.

- **Board lens** — project cards with segmented mini-bars, status pills, and mono task chips.

- **Table lens** — dense, solid-surface data table.

- **Releases lens** — a shipped/now timeline.

- **Detail drawer** — slides in on card/row click with meta, tasks, and a risk callout.

## Files
- `index.html` — entry; loads `styles.css` (design tokens) + `status.css` (product layer), React, and the app.

- `login.html` — split sign-in (brand panel + form; dark toggle).

- `settings.html` — Tabs, form controls, switches, danger zone (dark toggle).

- `project.html` — full project detail view: breadcrumb, KPI stats, tasks, `cs-steps`, `cs-timeline`, `cs-dl` (dark toggle).

- `identity-lab.html` — live Theme × Element switching on a product surface (15 element-variant pills · light/dark).

- `status.css` — product component styles ported from the real status-hub stylesheet; **tokens come from the design system**, not redeclared.

- `data.js` — fictional, on-brand sample data (`window.SH_DATA`).

- `StatusHub.jsx` — the interactive app (`window.StatusHub`).

## Fidelity notes
This is a cosmetic recreation: search/sort/filter are shallow and data is fake. Colours, spacing, pills, chips, radii, and the warm-dark theme are taken verbatim from the source token vocabulary. The real product is vanilla HTML+CSS (no React); this kit uses light React only for lens/drawer state.
