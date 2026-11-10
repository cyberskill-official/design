# Upstream verification & reconciliation — cyberskill-official/design · v2.5.0

Status: **Merged into `main` (`v2.5.0`–`v2.6.0`)**.
Verified live in browser: **69/69** `D1`–`D10` checks (`10.0 / 10`), **64/64** baseline checks (`10.0 / 10`), and **146/146** pages rendering cleanly across authored, forced dark, and high-contrast modes (`0 watch` items).

## 1 · Shipped fixes

| File | Change | Why |
|---|---|---|
| `dist/styles.css` | Flattened `styles.css` closure in one file (25 sheets, same order, `url()` paths `../fonts`, `../assets`), linked by cards, guidelines, and UI kits. | Card renderers and consumers that do not follow `@import` chains get fonts + tokens on first paint. Regenerated via `node scripts/flatten-css.mjs` (`npm run build:css`). |
| `base/a11y.css` | Removed the shadowed `@media (prefers-contrast: more)` custom-property overrides. | The `tokens/elements.css` resolver (`:is(:root, [data-theme], …)`, specificity `0,3,0`) already outranks them and produces the identical high-contrast values. |
| `tokens/elements.css` | `prefers-contrast: more` toggle flip simplified to `:root { --_cs-standard: ; --_cs-high: initial; }`. | Same cascade result (explicit `[data-cs-contrast]` rules share `0,1,0` and follow in source order); lets token tooling register the toggles cleanly. |
| `guidelines/guideline-language.js` | Early-return when `window.CS_GuidelinesLanguage` exists or no guideline surface matches; default language **en** (`?language=vi` for Vietnamese). | Prevents bundlers that evaluate every `.js` from throwing on non-guideline surfaces. |
| `guidelines/atomic-view.html` | Destructure `Image: CsImage`, `Comment: CsComment` and use the aliases in Molecule rows. | Avoids shadowing `window.Image` / `window.Comment` when external tooling calls `new Image()`. |
| `ui_kits/status-hub/static-locale.js` | Return early unless the page has `[data-preview-language-toggle]` / `[data-preview-language-select]`. | Safely no-ops when evaluated on pages that do not own the locale switch. |
| `components/feedback/feedback.card.html` | `.frame { flex: 1 1 100%; min-width: 0 }` | Prevents the toast demo frame from collapsing to zero width inside the flex row. |
| `components/logo/logo.card.html` | Lockup wordmark `color: var(--cs-color-text-primary)`. | Ensures the wordmark remains visible in dark mode. |

## 2 · Automated verification suite (`_audit/ci/`)

| File | Purpose |
|---|---|
| `_audit/ci/verify-audit-benchmarks-browser.mjs`, `_audit/ci/lib/benchmark-checks.mjs` | Automated CI/prepublish live-browser benchmark gate (`npm run test:audit-regression`): scores **10.0 / 10** (`129/129` across 20 dimensions `D1`–`D20`), core baseline suite **64/64** (`10.0 / 10`), 192/192 cells in the 32×6 non-text contrast matrix (`≥ 3.0:1`), 3/3 Generation-2 complex stress-test screens, and **0 watch** items. |
| `_audit/ci/fixtures/benchmark-20d.html`, `_audit/ci/fixtures/benchmark-baseline.html`, `_audit/ci/fixtures/benchmark-gen2.html` | Current-tree DOM fixtures exercising 32 Theme × Element × Variant scopes, 14 form controls, Vietnamese diacritic metrics, container queries, print/glass rules, and complex multi-scope enterprise/AI/mobile screens against `/dist/styles.css` and `/styles.css`. |

## 3 · Host-specific items excluded from upstream

- `OverlayManager` → `OverlayProvider` file/export rename and the `LocaleProvider.useMessages` alias (specific to external host bundle namespace rules).
- `window.DesignSystem_52f6e2` namespace in cards (templates accept both host-prefixed globals and `CyberSkillDS`).
- Host-specific DC runtime copies and sandbox metadata (`thumbnail.html`, `github.md`).

## 4 · Recorded notes

- Dark default-scope tint ink: `.cs-item.is-selected` measures **10.54:1**, `.cs-result__icon` measures **8.42:1** — both comfortably clear WCAG AA (`4.5:1`).
- `.cs-item.is-selected` applies `--cs-color-text-accent` to `border-color` while keeping primary text ink (`#F5EAD9`) by design.
- Carousel dots are measured for fine pointers on desktop; under `(pointer: coarse)`, `base/a11y.css` replaces the `::before` dot with a `44px` radial-gradient target in `--cs-color-text-accent`.
