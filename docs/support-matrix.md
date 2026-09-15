# Support matrix

Browsers, engines, assistive technology, and refresh cadence. Published on Storybook **Docs** at `design.cyberskill.world`.

## Engines

`package.json` `engines.node` is `>=20`. Consumers should stay on the latest two Active/Maintenance Node LTS lines. The host CI uses Node 22; npm publish uses Node 24.

## Browserslist

The published `browserslist` is:

- last 2 Chrome versions
- last 2 Edge versions
- last 2 Firefox versions
- last 2 Safari versions
- iOS >= 16
- Android >= 13

Unsupported: Internet Explorer, Opera Mini, pre-Chromium Edge, and browsers that lack CSS custom properties.

Refresh this list quarterly (council review). Last review: **2026-09-15**. Next review due **2026-12-15**. Record the date in `docs/decisions.md` when the matrix changes.

## Acceptance environments

Treat these as acceptance cases, not optional demos:

- 320 px width and 400% zoom (WCAG 1.4.10)
- `prefers-reduced-motion: reduce`
- Forced colors / `forced-colors: active`
- Print
- RTL (`dir="rtl"`)
- Pseudo-locale `en-XA` / `lang="pseudo"` for string expansion QA

CI: `_audit/ci/inclusive-matrix.mjs` plus the existing 320 / zoom / overflow harnesses. The `inclusive-matrix` job installs Chromium, Firefox, and WebKit. PR smoke is Chromium; nightly runs the named browsers.

## Assistive technology

Manual AT remains human-reviewed (NVDA, JAWS, VoiceOver, TalkBack, IME). Empty slots are not passes. Protocol: dialogs, menus, comboboxes, grids, Sortable, Editor, Carousel, and date/time controls.

WCAG 2.2 AA is the external compliance baseline. Internal body text still uses APCA Lc ≥ 75.

## Related

- Quality gates: `docs/quality-gates.md`
- Governance: `docs/governance.md`
