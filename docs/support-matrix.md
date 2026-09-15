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

- 320 px width, 200% zoom, and 400% zoom (WCAG 1.4.10)
- `prefers-reduced-motion: reduce`
- Forced colors / `forced-colors: active`
- Print
- RTL (`dir="rtl"`)
- Pseudo-locale `en-XA` / `lang="pseudo"` for string expansion QA

CI: `_audit/ci/inclusive-matrix.mjs` executes 320 px, 200% and 400% zoom, a 390 px mobile viewport, forced-colors, reduced-motion, RTL, and `en-XA`, plus the existing 320 / zoom / overflow harnesses. The `inclusive-matrix` job installs Chromium, Firefox, and WebKit. PR smoke is Chromium; nightly runs the named browsers. Action-9 gallery (`test-high-risk-at.mjs`) repeats 200% and 400% on `#ax-gallery`.

## Assistive technology

Manual AT remains human-reviewed (NVDA, JAWS, VoiceOver, TalkBack, IME). Empty slots are not passes. Protocol: dialogs, menus, comboboxes, grids, Sortable, Editor, Carousel, and date/time controls.

WCAG 2.2 AA is the external compliance baseline. Internal body text still uses APCA Lc ≥ 75.

## WCAG 2.2 AA mapping

Each criterion maps to a machine gate. Empty AT-RUN cells are not screen-reader passes.

| Criterion | Gate |
|---|---|
| 1.4.3 / 1.4.6 Contrast | `_audit/contrast-guard.html`, `scripts/generate-contrast-report.mjs`, doctrine APCA Lc ≥75 |
| 1.4.11 Non-text contrast | contrast-guard, `@cyberskill/themes/high-contrast`, forced-colors in `inclusive-matrix.mjs` |
| 2.4.7 / 2.4.11 Focus appearance | `base/a11y.css` `:focus-visible`, `_audit/a11y-gate.html` |
| 2.5.5 / 2.5.8 Target size | `base/a11y.css` 44px floor |
| 1.4.10 Reflow | 320 px + 200% + 400% in `inclusive-matrix.mjs` and `test-high-risk-at.mjs`; `_audit/zoom-text-spacing.html` |
| 1.4.12 Text spacing | `_audit/zoom-text-spacing.html` |
| 2.1.1 Keyboard / 2.4.3 Focus order | `_audit/a11y-gate.html`, `_audit/high-risk-at.html` |

## CSS capabilities

Browsers outside this matrix are unsupported. Features that need a prefix or a fallback are listed here; `_audit/ci/test-inclusive-matrix.mjs` and `inclusive-matrix.mjs` lock the source and the runtime `CSS.supports` probe.

| Feature | Policy | Fallback |
|---|---|---|
| Custom properties | Required. Browsers without `--cs-*` are out of matrix. | None — fail closed. |
| `@layer` | `packages/tokens/dist/tokens.css` orders `primitive, semantic, component, state`. | Unlayered last-wins is not a supported runtime. |
| `color-mix()` | Progressive wash (aurora / overlays). | Solid `background-color` / `--cs-color-*` remains. |
| `backdrop-filter` | Glass surfaces in `base/glass.css`. | `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` uses `--cs-color-surface-panel`. |
| `-webkit-backdrop-filter` | Paired with the standard property for Safari. | Same `@supports` fallback. |
| Container queries | Host reflow at 320 px / 200% / 400% zoom. | Block layout; no horizontal clip (inclusive-matrix). |

## Related

- Quality gates: `docs/quality-gates.md`
- Governance: `docs/governance.md`
