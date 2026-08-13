# Conventions — authoring the CyberSkill DS

For humans and agents *extending this system*. (Consumers: read `SKILL.md`.) Expansion and verification doctrine: `docs/doctrine.md`. The compiler is the source of truth for counts; prose describes shape, never numbers. Published on Storybook **Docs** at `design.cyberskill.world`.

## The expansion rule

**When anything grows, everything updates in the same change.** A new element/variant, icon, component, token role, language, or template pattern must propagate to: tokens/source → specimen cards (guidelines + the component group card) **and related guideline pages** → component contract trio (`.jsx` + `.d.ts` + `.prompt.md`) → **all** templates (tweak enums and maps) → Storybook toolbar / Atomic View → docs (README counts, SKILL, **and every related document the change touches** — kit READMEs, registry, contrast report regenerated after token changes). **`VERSION` auto-bumps on push to `main`** (Conventional Commits); owner may still force a bump. **Do not maintain a changelog** — `VERSION` (auto-bump on `main`). Continuity is git history plus curated **Release Notes** (`docs/release-notes.md` / Storybook). Gate every expansion with the compiler check **and a grep for the old enum/list** — nothing ships half-propagated. Documented scope boundaries (doctrine, not gaps): UI-kit pages stay pixel-faithful Thổ recreations (axes demoed in Storybook toolbar and Atomic View); every template is bilingual EN·VN and English-default (client/media collateral stays English-primary), and language variants render **fully separated** — see the decision log.

## The four axes

Every rendered surface resolves four orthogonal scopes — never encode one axis inside another:
| Axis | Attribute | Owns | Packs live in |
|---|---|---|---|
| **Theme** | `data-theme="dark\|system"` | light / dark / system (OS) | `tokens/colors.css` |
| **Element** (Ngũ Hành) | `data-cs-element` + `data-cs-variant` | hue identity per product | `tokens/elements.css` |
| **Language** | `lang` / Language tweak | EN · VI copy | component registry + template props |
| **Style** | `data-cs-style` (optional; absent ≡ `liquid-glass`) | surface material pack | `tokens/styles.css` |

Style’s sole pack today is **liquid-glass**. Immutable under all axes: Umber/Ochre anchors, voice, type families, semantic status colors, the composite focus indicator (text-primary contour + ochre halo), APCA floors, ≥44px targets.

## Naming grammar

- Tokens: `--cs-<layer>-<role>[-<state>]` (`--cs-color-text-muted`). Element role layer: `--cs-accent-*` (10-token contract including `--cs-accent-on-strong` for text on strong fills — see `tokens/elements.css` header).

- Classes: `.cs-<block>[-<part>][--modifier]`. Data attributes: `data-theme`, `data-cs-element`, `data-cs-variant`, `data-cs-style`.

- Files: `tokens/<concern>.css` · `base/<concern>.css` (concern names, never changelog names — "interaction", not "refinements2") · `components/<group>/<Name>.{jsx,d.ts,prompt.md}` · `templates/<dept>-<artifact>/` · `guidelines/<group>-<topic>.html`.

- Template display names: `<Group> · <Artifact>` ("Finance · Invoice").

## Checklists

**New component** — `Name.jsx` + `Name.d.ts` + `Name.prompt.md` in `components/<group>/`; add to the group's card html (resolve the bundle namespace **by prefix** — `const CS = window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k))]` — never a hardcoded `…_<projectId>` suffix); add to readme's group line. Consume tokens only; no hex literals except inside `tokens/`.

**Responsive** — reflow is global (`base/responsive.css`, loaded last): media never overflows, print docs relax padding, `.cs-sheet` tables scroll, `.cs-sidebar` collapses, inline fixed-column grids collapse (3+→2 tablet, →1 phone), unbreakable long tokens (write-on `______` lines, long URLs/IDs) get `overflow-wrap: anywhere` on doc surfaces so they can't prop a phone column open, the app-shell shell grid collapses to one column with `main{min-width:0}`+`.cs-table-wrap` scroll, and fixed-geometry export canvases (`class="cs-canvas-desk"`: decks, social) **always** `overflow-x:auto` so a slide wider than the window scrolls inside the desk rather than pushing the page wide. **Width stops must match the token scale** in `tokens/spacing.css` (`xs` · `phone` 360 · `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536) — `docs-consistency` fails off-scale `@media`/`@container` widths in `base/` (FIND-007). Verified whole-set at 390 by `_audit/responsive-overflow.html` (all 85 = 0 document overflow). **Two hard gotchas:** (1) the DC runtime compiles inline `style="…"` into React objects, so the rendered attribute is *spaced* — any `[style*=…]` responsive selector must match `grid-template-columns: repeat(4, 1fr)` (colon-space, comma-space), never the authored no-space form; (2) a global CSS rule can only override a property the template sets **inline** via an **attribute** selector (`[style*="grid-template-columns: 248px 1fr"]`) — a **class** selector loses to the inline style. Prefer fixing overflow in the template source (add `min-width:0`, `flex-wrap:wrap` inline) over fighting inline from the stylesheet.

**New template** — `templates/<slug>/<Slug>.dc.html` with `<!-- @template name description -->` first; `ds-base.js` stays single-entry (`styles.css` only — the one-line rebind was validated end-to-end Jul 2026 from a deeper path; the test scaffold has since been removed) and publishes the id-independent `window.CyberSkillDS` alias on bundle load, so mount DS components via `component-from-global-scope="CyberSkillDS.…"` — **never** a hardcoded `CyberSkillDesignSystem_<projectId>` suffix (it changes on re-import; enforced by `_audit/namespace-portability.html`); inline styles only; 1–3 tweaks (never plain copy/color — in-place editing covers those); printable docs add the `@page` + `.cs-desk`/`.cs-sheet` print block and carry **no dark tweak** (print is light-only).

**New element variant** — stay inside the element's oklch envelope; set the 10 `--cs-accent-*` contract tokens (incl. `--cs-accent-on-strong` ≥4.5:1 on `-strong`) plus `--cs-color-text-accent`/`--cs-color-link` (APCA-check both); the aurora wash inherits from the element via `.cs-aurora-wash` (override the class rule only if the variant truly needs its own image); gradient partner (`grad-b`) must follow Tương sinh.

**Ship check** — run the compiler check until clean, then run `_audit/docs-consistency.html` **and** `_audit/namespace-portability.html` (both must be green). VERSION **1.7.0** (auto-bumps on `main`).

## Decision log (owner-approved)

- Elements fully replace Ochre inside product scopes; plasma's hot-pink edge approved (Jul 2026).

- Axes are Theme × Element × Language × Style. Style pack is liquid-glass (sole pack; absent ≡ default).

- Product registry is **locked** (Jul 2026) — eight portfolio mappings in `docs/products.md`; do not invent new product → element assignments.

- Text never sits on the mid-tone `-accent` — codified after the APCA sweep (see `docs/contrast-report.md`).

- **The display face is a token role, not a second default (Jul 2026).** `--cs-font-family-display` ships Space Grotesk (variable 300–700, Vietnamese subset) self-hosted alongside Be Vietnam Pro and JetBrains Mono, so a product with a headline face — `cyberskill.world` / Lumi — consumes a DS role instead of maintaining its own `@font-face` exception. **Nothing in the DS points at it**: `--cs-heading-family` still resolves to `--cs-font-family-ui`, every template and UI kit is unchanged, and a scope opts in with `.cs-display-face` (`base/typography.css`), which retargets `--cs-heading-family` only — body copy stays on the UI face. Space Grotesk has no 800, so the extrabold heading weight clamps to 700 within that family (CSS does not hop to Be Vietnam Pro for a missing weight). Adding a family means adding its faces to `tokens/fonts.css` **and** its files to `fonts/` **and** its entries to `_ds_manifest.json` `fonts[]`/`brandFonts[]` — `_audit/font-face-integrity.html` fails on any of the three being out of step, and on any family missing the Vietnamese subset. This changes no product → element mapping; `docs/products.md` stays locked.

- Language variants render **fully separated**: switching the Language tweak yields a complete single-language artifact — no partial translation left in headings, labels, helper text, footers, or body. The only bilingual-by-design elements are the CyberSkill name + slogan lockup (`Hiện Thực Hoá Ý Chí · Turn Your Will Into Real`, the canonical form — never a lone half) and the A4 legal identity block (company legal name + state motto). Everything else swaps with the tweak — including skip links and doc-type eyebrows (FIND-125). Catalog `<title>` / `@template name` strings stay English for the template index and are not language-mode chrome; `_audit/template-lang-parity.html` masks them when scanning the EN-leak lexicon (Jul 2026; FIND-125 follow-up).

- **Namespace is resolved, never hardcoded** — the compiler names the bundle global `window.CyberSkillDesignSystem_<projectId>`, and that 6-hex suffix is derived from the project id, so it changes whenever the system is imported into another project. Templates read the stable `window.CyberSkillDS` alias that `ds-base.js` publishes on bundle load; cards, UI-kit pages, the standalone email, and audit harnesses resolve by prefix (`window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k))]`). `_ds_bundle.js`/`_ds_manifest.json` and the frozen `_audit/exports/` snapshot legitimately carry the real suffix (they *define* it). Enforced by `_audit/namespace-portability.html`, which scans every manifest-indexed source — keeps re-import **zero-touch** (Jul 2026).

- Verification uses the `_audit/` dev harnesses (see `_audit/README.md`): `responsive-harness.html` (the user-facing Responsive preview — **every** template at 390/768/1280), `responsive-overflow.html` (whole-set horizontal-overflow gate at 390 — **use a fresh iframe per template; reusing one races the `@import` CSS and gives false positives**), and `vn-overflow.html` (forces VN across every template, measures clipping). Force states from a frame's own context: `__dcSetProps(__dcRootName(), {language:"Tiếng Việt"})`, theme via `postMessage({type:"__dc_theme",theme:"dark"})`. `_audit/` is dev-only — not compiled, not a card. Never pass a value to `TextField` as **children** (crashes React #137 on re-render — the input is a void element); use `default-value` (Jul 2026).

## Export paths (per archetype)

Every template exports; the right path depends on the archetype. All paths preserve Vietnamese Unicode (verified by unzipping PPTX slide XML / DOCX `word/document.xml` and probing the standalone bundle — VN diacritics survive as native text, see `_audit/exports/` and `_audit/ci/test-doc-export.mjs`).
| Archetype | Path | Notes |
|---|---|---|
| Deck (`*-deck`, `slide-deck`) | **PPTX (editable)** | `gen_pptx` at 960×540; force VN per-slide with `showJs: __dcSetProps(__dcRootName(),{language:'Tiếng Việt'})`. Text exports as native runs; only the Logo is an image. |
| Document (any with `@page{size:…}` / `<meta name="omelette-owns-print">`) | **PDF + editable DOCX** | One **Tải / Download** control (`data-omelette-chrome`, print-stripped) from `templates/_vendor/doc-export.js` via `ds-base.js`, with a PDF \| DOCX menu. Both formats are built from the live `.cs-sheet` so the file matches the HTML preview. **PDF** = raster of the rendered sheet (JPEG pages, fallback: print a same-origin sheet clone — not the Storybook URL); CI still uses Playwright `page.pdf`. **DOCX** = editable OOXML walked from that same sheet (tables, bilingual cell paras, umber headings, VN Unicode; running header is the short brand line, not a duplicated lockup); ZIP via `CompressionStream` — no CDN. Decks stay PPTX. |
| Email / product page / any DC | **Standalone offline HTML** | The DC loads CSS + bundle dynamically via `ds-base.js`, which `super_inline_html` can't see. To bundle: make a `*-standalone.html` copy **in the same folder** (keeps `./support.js` relative) with **static** `<link rel="stylesheet" href="../../styles.css">` + `<script src="../../_ds_bundle.js">` in the raw `<head>` (both inlinable) instead of `ds-base.js`, plus a `<template id="__bundler_thumbnail">`. Bake the target language into the props default. Then `super_inline_html`. |
| Any | **Editor-native + Claude Code handoff** | The whole project is dev-handoff-ready (compiled bundle + `.d.ts` + `prompt.md` per component); generate the package on request via the handoff skill. |

**Font behavior on export.** Brand fonts are self-hosted (`Be Vietnam Pro` UI, `Space Grotesk` opt-in display, mono). PPTX/DOCX keep the brand-font **names** but do not embed the files — on a machine without them Word/PowerPoint substitutes a fallback (VN Unicode text is preserved; shapes may reflow slightly). For a fully self-contained hand-off, either tell the recipient to install the fonts, or export with a web-safe swap (`fontSwaps:[{from:'Be Vietnam Pro',to:'Arial'}]` — Arial covers Vietnamese). Standalone HTML **embeds** the fonts (inlined `@font-face` from `styles.css`), so it is always faithful offline (Jul 2026). PDF pagination follows the browser print engine; Word may reflow page breaks.

## Async data states (FIND-020 — thin pattern)

Collection surfaces that own a fetch must distinguish **loading · error · empty · idle-with-data**. Do not render the empty message while a request is in flight.

| State | Compose | Notes |
|---|---|---|
| **loading** | `Skeleton` (table rows / lines) + polite status text | `aria-busy` on the region; keep column headers when possible |
| **error** | `Result status="error"` (or a custom `errorState`) | `role="alert"`; offer retry in the host |
| **empty** | `emptyState` / `EmptyState` | Only after a successful idle response with zero rows |
| **idle** | Normal rows | Default — omit `state` for static specimens |

**Reference API:** `DataTable` accepts `state?: "idle" \| "loading" \| "error"` plus optional `loadingState` / `errorState` / `loadingRows`. Other collection components (`DataGrid`, `TreeTable`, …) should follow the same triad when they gain async ownership — do not invent a parallel loading API per surface. Long operations that are not tabular still use `Spinner` (`role="status"`) or `ProgressBar` with a real `aria-label`; pair decorative `Skeleton` (`aria-hidden`) with a live status string.

## Accessibility (base/a11y.css + component ARIA)

- **Focus rings are systematic** — global `:where(:focus-visible)` in `base/reset.css` is a **composite** indicator: 2px `text-primary` contour (≥3:1 non-text contrast on light and dark) plus a 5px ochre brand halo. Wrapper controls (`SearchField`, `NumberField`, `PromptInput`, `Terminal`, `CommandPalette`) mirror that via `:focus-within`. Never set `outline: none` on a focusable control without a paired wrapper/replacement ring.

- **Touch targets** — `base/a11y.css` guarantees 44px on `@media (pointer: coarse)` (tabs, pagination, menu items, stepper, checkbox/radio; segmented 40px in its padded track). Desktop mouse density is preserved. `pointer: coarse` is used deliberately over a width breakpoint — a touch laptop at 1280px still needs 44px. Button carries its own coarse block in `components.css`.

- **Reduced motion** — `base/a11y.css` honours `prefers-reduced-motion: reduce` globally (near-zero animation/transition durations); component-level exceptions (spinner slow-spin, status pulse off) already existed.

- **Screen-reader language** — every bilingual template carries a root `lang`: the 37 Vietnamese instruments (`vn-*`) are static `lang="vi"`; the 44 tweakable bilingual templates bind `lang="{{ langAttr }}"` to the Language tweak (`langAttr = language === "Tiếng Việt" ? "vi" : "en"`, injected into `renderVals`). Dual-block templates additionally wrap each `sc-if isVN` block in `<div lang="vi" style="display:contents">` (layout-neutral) so VN text is marked `vi` even in **Both** mode where the root is the primary `en`. Result: correct pronunciation in every language mode.

- **Component ARIA is complete** — every interactive component ships correct roles/labels (Button `aria-busy`; TextField/Textarea `aria-invalid`+`aria-describedby`+`role=alert`; Switch `role=switch`; SearchField `role=searchbox`; Menu `aria-haspopup`/`aria-expanded`/`role=menu(item)`; Pagination `nav`+`aria-current`+prev/next labels; Dialog/Drawer `aria-modal`; Toast `role=status`/`region`; ConfidenceMeter `role=meter`; Accordion `aria-expanded`; Logo `role=img`/`aria-hidden`). Preserve these when composing.

- **Void-element API rule** — components that render a void element (`<input>`/`<hr>`: TextField, Checkbox, Radio, Switch, SearchField, NumberField, Slider, Divider) destructure `children` out of `...props` so a stray child can never spread onto the void element (that crashes React with #137, the bug that hit `settings`). Content always comes from explicit props (`label` / `value` / `defaultValue`), never `children`. Follow this when adding any input-based component (Jul 2026).

- **Dark-theme contrast** — all text/surface pairings pass WCAG AA body (9–15:1). Semantic colours have dark overrides (`success #4ADE80`, `danger #F87171`, `warning #FBBF24`, `info #7CB2FB`) because the light-theme semantics failed on dark surfaces (~2.5:1); verify any new semantic pairing on `#221710`/`#2b1e14` (`_audit/` contrast math). The dark hairline border is intentionally subtle (separator, not a 3:1 boundary) (Jul 2026). **Interactive components that set `color`/`border-color: var(--cs-color-brand-umber)` on a themeable surface** (nav-item active, secondary/tertiary/ghost buttons, and the like) MUST ship a `[data-theme="dark"]` override — umber is near-invisible on dark; remap to ochre (emphasis) or `--cs-color-text-primary` (body). Screen-template brand wordmarks use `--cs-color-text-primary` (never hardcoded umber) so they flip in dark; print-doc headers stay umber by design. Table ID/code columns (e.g. `R-26-07`) carry `white-space:nowrap` so a hyphenated code never word-breaks in a narrow column (Jul 2026, user-reported). The umber-on-themeable-surface rule is now **enforced deterministically** by `_audit/contrast-guard.html` (static source lint + a token-pair WCAG matrix scored in light *and* dark) — the reliable gate the DOM-walk theme advisory couldn't be (v2.21.0). Note: `accent-strong` (the "accent text on light" role) is APCA-validated but WCAG-borderline (~3.2–4.3) for a few element packs (tho, tho/sand, thuy/mist, moc/bamboo) — reserve it for semibold/large accent text; the guard lists these as advisory and gates only egregious <3.0 (v2.21.1).

## RTL readiness (confirmed Jul 2026)

The system is **RTL-ready** — `base/*.css` is authored almost entirely in CSS **logical properties** (`inline-start`/`inline-end`, `margin-inline`, `padding-block`, `border-inline-*`, `inset-inline-*`), so setting `dir="rtl"` mirrors layouts automatically. Verified by rendering the kitchen-sink at `dir="rtl"` — nav, buttons, right-aligned labels, and mirrored fields/error text all flip correctly. The only physical props left are intentionally direction-agnostic: the dialog's `left:50%`+`translateX(-50%)` centering (symmetric) and the spinner's `border-right-color` (a rotating visual detail). Keep new CSS logical; reserve physical `left`/`right` for genuinely symmetric centering only. (Vietnamese is LTR, so RTL isn't shipped in templates — but the foundation is there for an Arabic/Hebrew tenant.)

## Real imagery (image-slot retrofit)

Templates lean on the `.cs-aurora-wash` gradients by default; to accept **real** photography, drop `<image-slot>` in. Load the component once per template via the helmet (`<script src="../../image-slot.js"></script>` — path relative to the template) and place `<image-slot id="…" shape="rect" style="position:absolute;inset:0;z-index:0">` as the **first** child of a `position:relative` hero, then layer `.cs-aurora-wash` (z-index:1, `pointer-events:none`) and a warm umber scrim (`linear-gradient(90deg,rgba(42,26,13,.86),rgba(42,26,13,.34))`, z-index:1, `pointer-events:none`) above it, with the content at z-index:2. The scrim keeps the empty drop-tile subtle and copy legible over any photo. Verified in `marketing-case-study`; the same 4-line pattern fits `marketing-page`, `marketing-social-kit`, `culture-event-invite`, and an `article` hero (each on request). Standalone reference: `templates/image-slots-demo.html`. Slots persist via a sibling sidecar (Jul 2026).

## Vietnamese typography & locale (verified Jul 2026)

Vietnamese is the primary language; the type system is built for it — verified, no changes needed:
- **Line-heights are VN-safe** — tokens body 1.5 / heading 1.35 / tight 1.15 leave room for stacked diacritics (dấu on top + nặng below). `:where(h1–h6)` defaults to 1.35 + `text-wrap: balance`; `:where(p)` gets `text-wrap: pretty` (both `base/reset.css`). Templates may hardcode a tighter line-height (≈1.0–1.15) **only** on single-line hero display headings; multi-line VN headings keep ≥1.15.

- **Locale formatting** — each language renders its own conventions: **VN** uses `₫` suffix, `DD/MM/YYYY`, dot-thousands (`1.000.000`); **EN** uses `$` prefix, `DD Mon YYYY`, comma-thousands (`1,000,000`). English-format dates live only in English branches — never leak into a VN branch. Confirmed by scan across all templates.

## Whole-set state audits — language · theme · responsive (each its own pass, Jul 2026)

Owner doctrine: language, theme, and responsive each get their OWN whole-set pass; one clean state is not evidence for another. All three are now race-free, manifest-driven, **all-85** pass/fail gates built on the same pattern — a **fresh single-navigation iframe per template** (reusing one iframe across `src` swaps races the `@import`ed CSS and yields false results), state forced via `__dcSetProps`, settle, then measure:
- **Language** — `_audit/language-overflow.html` — forces `Tiếng Việt`; 0 VN overflow/clip @390; also asserts VN actually applied on every template.

- **Theme** — `_audit/theme-overflow.html` — forces dark; hard gate = dark-applies + 0 dark overflow @390 + 0 open solid-bg leaf-text contrast fails outside `REVIEWED_OK`.

## Theme-overflow contrast is a hard gate (Jul 2026)

`theme-overflow.html` fails `window.__theme.pass` on reproducible WCAG AA fails for leaf text over a resolvable solid background, except templates in the page's `REVIEWED_OK` allowlist (today: three canvas decks whose accent-bright eyebrows on accent-strong sit ~4.22:1 — APCA dark packs still pass; do not retune tokens for that WCAG body near-miss). The walker converts oklab/`color-mix` backgrounds via canvas so element-pack surfaces are not mistaken for the light `body` fallback. Gradients / images / branded washes stay skipped (uncomputable). **Filled CTAs on themeable screens** use `background: var(--cs-accent-strong); color: var(--cs-accent-on)` — dark packs set `--cs-accent-on` to cream for `on/strong` (APCA ≥ 75); cream on `--cs-accent-bright` fails. Light-only print / VN legal instruments stay n/a. Companion proofs: `contrast-guard.html`, `apca-dark-preview.html`, `docs/contrast-report.md`.

## Token exports (Jul 2026)

Machine-readable token exports live in `tokens/`: `tokens.json` (grouped by category + scope-override maps), `tokens.js` (ESM), and `tokens.dtcg.json` (**W3C DTCG** — `$value`/`$type`, CSS-var keys for lossless round-trip to `styles.css`, dark/system + element + expression overrides under `$extensions`; for Tokens Studio for Figma / Style Dictionary). All three are generated from `tokens/*.css` via `tokens.json` — regenerate **all** after any token change (Expansion rule).
