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

- **Detail drawer** — opens from a board card or the table's project button with meta, tasks, and a risk callout. A native modal dialog moves focus inside, prevents background interaction, closes with Escape, the close button or the desktop backdrop, and restores the opener. Browser chrome remains reachable through native keyboard navigation.

## Files
- `index.html` — entry; loads `styles.css` (design tokens) + `status.css` (product layer), React, and the app.

- `login.html` — split sign-in (brand panel + form; dark toggle).

- `settings.html` — Tabs, form controls, switches, danger zone (dark toggle).

- `project.html` — full project detail view: breadcrumb, KPI stats, tasks, `cs-steps`, `cs-timeline`, `cs-dl` (dark toggle).


- `status.css` — product component styles ported from the real status-hub stylesheet; **tokens come from the design system**, not redeclared.

- `data.js` — fictional, on-brand sample data (`window.SH_DATA`).

- `StatusHub.jsx` — the interactive app (`window.StatusHub`).

## Fidelity notes
This React prototype uses fictional data from data.js and product styles bound to the design-system tokens. Search and status/KPI filters operate on the in-memory sample collection; the table provides no sorting control. Search matches the raw project name, key and English blurb, including while Vietnamese copy is displayed. The mock dates, release notes and “Now shipping” callout describe sample content rather than current release status.

The main app starts in English and switches its UI copy and selected sample fields to Vietnamese. Project names, keys and task titles remain sample data; the main-app language toggle does not control the separate Login, Settings and Project previews. Those pages have local EN/VI controls for their built-in UI copy and accessible names; proper/project/task/date sample data retain their supplied values. English task and release descriptions on Project have explicit English scope. Lens arrows wrap, Home/End reach the ends, and native Tab/Enter/Space operates buttons. Drawer behavior uses native showModal rather than the shared React Drawer component. Theme, lens, filter and language state reset on reload.

Source evidence: StatusHub.jsx and data.js define those behaviors. The raw kit-entrypoint and status-kit-dialog checks cover finite asset, navigation and modal cases; they do not establish production data, current upstream product fidelity, all-page locale/IME, speech, visual or operator acceptance.

Static preview controls: Login uses the form-state selector to demonstrate default/loading/error/invalid states; no authentication request is sent. Password recovery, Lumi and access-request controls are unavailable samples. Language changes preserve entered email/password and the selected state; invalid email has a stable label and a separate error description. On mobile the demo state bar sits in page flow so it does not cover form/theme controls.

Settings language selection changes the page copy while retaining native field values. Cancel resets the native profile/notification fields and language to their initial English sample; theme and the active tab remain independent. Save and workspace deletion are unavailable in this local preview. Tabs retain native click/keyboard behavior and intentional narrow-screen scrolling. Project describes illustrative data rather than current verified release status; Share is unavailable, and Open board navigates to the actual kit board. All three previews start in English on reload and do not persist account changes.

The finite static-page browser regression checks these controls in Chromium, Firefox and WebKit. Geometry checks cover 320×568, 320×900, 390×844 and 1280×900, EN/VI and light/dark, including native tab scrolling and Login control overlap. These results do not establish every element/density/contrast combination, actual authentication/account data, a current release, real OS IME, screen-reader speech, device runtime or visual/operator acceptance.

The named contrast regression also covers the Project title prefix and regular task codes using the theme primary text role in three engines, 320/390/1280 widths and light/dark EN/VI, at APCA 75. Decorative breadcrumb slashes remain visible and are hidden from speech. This finite solid-surface check does not certify every badge/body/image/filter/glyph or human visual/accessibility acceptance.
