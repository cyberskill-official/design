# Upstream patch set — cyberskill-official/design · from the v2.5.0 port

Target branch: `main` (v2.5.0). Apply as one commit or split by the headings below.
Everything here was verified live: 50/50 new checks, 64/64 baseline checks, 146/146 pages render (light, dark, high-contrast).

## 1 · Fixes (ship)

| File | Change | Why |
|---|---|---|
| `dist/styles.css` | **New.** The `styles.css` closure flattened into one file (25 sheets, same order, `url()` paths `../fonts`, `../assets`). | Card renderers and any consumer that does not follow `@import` chains get fonts + tokens on first paint. Regenerate after editing `tokens/` or `base/`. |
| `base/a11y.css` | Removed the `@media (prefers-contrast: more)` custom-property overrides (lines ~140–151). | Dead code: the `tokens/elements.css` resolver (`:is(:root, [data-theme], …)`, specificity 0,3,0) already outranks them and produces the same values. A comment points to the resolver. |
| `tokens/elements.css` | `prefers-contrast: more` toggle flip is now plain `:root { --_cs-standard: initial; --_cs-high: ; }` instead of `:root:where(:not([data-cs-contrast]))`. | Same cascade result (explicit `[data-cs-contrast]` rules share 0,1,0 and come later); lets token tooling register the toggles. |
| `guidelines/guideline-language.js` | Early-return when `window.CS_GuidelinesLanguage` exists or no guideline surface matches (was `throw new Error('Unknown guideline language surface')`); default language **en** (`?language=vi` for Vietnamese). | Any bundler that evaluates every `.js` (and the DS host does) took every template down with it. |
| `guidelines/atomic-view.html` | Destructure `Image: CsImage`, `Comment: CsComment` and use the aliases in the Molecule rows. | The page shadowed `window.Image` / `window.Comment`; `new Image()` from any tooling threw “Image is not a constructor”. |
| `ui_kits/status-hub/static-locale.js` | Return early unless the page has `[data-preview-language-toggle]` / `[data-preview-language-select]`. | Script was evaluated on pages that don't own the switch. |
| `components/feedback/feedback.card.html` | `.frame { flex: 1 1 100%; min-width: 0 }` | The toast demo frame collapsed to zero width inside the flex row. |
| `components/logo/logo.card.html` | Lockup wordmark `color: var(--cs-color-text-primary)` (was brand-umber). | Invisible in dark mode. |
| `templates/_ds-base.canonical.js` (+ every `templates/*/ds-base.js`) | Load `dist/styles.css`; treat `namespace.__errors` as a `console.warn`, not a rejection. | One failing helper must not block every template. Propagate to the 85 copies with the existing `scripts/sync-ds-base` step. |

Optional, mechanical: point cards/kits at `dist/styles.css` for faster first paint —
`sed -i 's#href="\.\./styles\.css"#href="../dist/styles.css"#; s#href="\.\./\.\./styles\.css"#href="../../dist/styles.css"#' guidelines/*.html components/*/*.card.html ui_kits/*/*.html templates/kitchen-sink.html`

## 2 · Audit (ship as release evidence)

| File | Change |
|---|---|
| `audit/v2.5.0-verification.html`, `audit/verify-v2.5.0.js`, `audit/fixture-v2.5.0.html` | **New.** Verification Audit & Specimen Workbench: 7 dimensions (P0 tint safety · P1 32-scope 1.4.11 · P2 Umber separation, 13-control invalid parity, VI diacritics · P3 nested glass, DESIGN.md/asset contract), 50 checks × v2.5.0 / v2.4.0 / v2.3.1, 32×6 contrast matrix, edge-case report, JSON export, specimen switcher (version × theme × element × variant). |
| `audit/v2.5.0-verification.json` | **New.** Evidence from a live run (Chrome 156, 2026-11-09): v2.5.0 10.0/10 · 50/50; baseline suite 64/64 (v2.4.0 tag 62/64, v2.3.1 8/64); render health 146/146. |
| `audit/render-health.html` | **New.** Loads every template, card and kit page in hidden frames (as authored / forced dark / high-contrast / any Ngũ Hành scope) and flags unstyled, unresolved, erroring, empty or low-contrast pages. |
| `audit/fixture.html`, `audit/verify.js`, `audit/v2.4.0-verification.html` | Three-version loader (`?v=current|v240|baseline`), third result column + overall box, labels; `audit/baseline-v2.3.1/` → `audit/baseline-2.3.1/`. Check logic unchanged. |
| `audit/baseline-2.4.0/styles.flat.css`, `audit/baseline-2.3.1/styles.flat.css` | **New.** Flattened `styles.css` closures from tags `v2.4.0` and `v2.3.1` (the repo doesn't commit `dist/`). |

## 3 · Not for upstream (host-specific, excluded from the zip)

- `OverlayManager` → `OverlayProvider` file/export rename and the `LocaleProvider.useMessages` alias (bundle namespace rules of the hosting tool).
- `window.DesignSystem_52f6e2` namespace in cards (templates accept both this and `CyberSkillDS`).
- `templates/*/support.js` (host DC runtime), `_ds_*` manifests, `thumbnail.html`, `SKILL.md`, `github.md`.

## 4 · Known watch items (no change proposed)

- Dark default-scope tint ink: `.cs-item.is-selected` 10.54:1, `.cs-result__icon` 8.42:1 — the release notes' “> 9:1” holds for the item, not the icon; both clear AA.
- `.cs-item.is-selected` paints text-accent on the **border**, not the ink (checks adjusted to the source).
- Carousel dots verified for fine pointers only; coarse-pointer branch paints a 44px radial target in text-accent.
