# Conventions — authoring the CyberSkill DS

For humans and agents *extending this system*. (Consumers: read `SKILL.md`.) Expansion and verification doctrine: `docs/doctrine.md`. Use the generated manifest for current inventory; its component and token fields have the generator ownership described below. Declaration counts are not counts of unique tokens or supported components. Published on Storybook **Docs** at `design.cyberskill.world`.

## The expansion rule

**When anything grows, everything updates in the same change.** A new element/variant, icon, component, token role, language, or template pattern must propagate to: tokens/source → specimen cards (guidelines + the component group card) **and related guideline pages** → component contract trio (`.jsx` + `.d.ts` + `.prompt.md`) → **all** templates (tweak enums and maps) → Storybook toolbar / Atomic View → docs (README counts, SKILL, **and every related document the change touches** — kit READMEs, registry, contrast report regenerated after token changes). **`VERSION` auto-bumps on push to `main`** (Conventional Commits); owner may still force a bump. **Do not maintain a changelog** — `VERSION` (auto-bump on `main`). Continuity is git history plus curated **Release Notes** (`docs/release-notes.md` / Storybook). Gate every expansion with the compiler check **and a grep for the old enum/list** — nothing ships half-propagated. Documented scope boundaries (doctrine, not gaps): UI-kit pages stay pixel-faithful Thổ recreations (axes demoed in Storybook toolbar and Atomic View); bilingual EN·VN covers emails plus team, legal and finance documents; client/media collateral is English-first. Where language variants are supported, render them **fully separated** — see the decision log.

## The four axes

Every rendered surface resolves four orthogonal scopes — never encode one axis inside another:
| Axis | Attribute | Owns | Packs live in |
|---|---|---|---|
| **Theme** | `data-theme="dark\|system"` | light / dark / system (OS) | `tokens/colors.css` |
| **Element** (Ngũ Hành) | `data-cs-element` + `data-cs-variant` | hue identity per product | `tokens/elements.css` |
| **Language** | `lang` / Language tweak | EN · VI required; `ja` spike (BCP-47 primary subtags) | component registry + template props — see `docs/decisions/locale-architecture.md` |
| **Style** | `data-cs-style` (optional; absent ≡ `liquid-glass`) | surface material pack | `tokens/styles.css` |

Style’s sole pack today is **liquid-glass**. Immutable under all axes: Umber/Ochre anchors, voice, type families, semantic status colors, the composite focus indicator (text-primary contour + ochre halo), APCA floors, ≥44px targets.

## Naming grammar

- Tokens: `--cs-<layer>-<role>[-<state>]` (`--cs-color-text-muted`). Element role layer: `--cs-accent-*` (10-token contract including `--cs-accent-on-strong` for text on strong fills — see `tokens/elements.css` header).

- Classes: `.cs-<block>[-<part>][--modifier]`. Data attributes: `data-theme`, `data-cs-element`, `data-cs-variant`, `data-cs-style`.

- Files: `tokens/<concern>.css` · `base/<concern>.css` (concern names, never changelog names — "interaction", not "refinements2") · `components/<group>/<Name>.{jsx,d.ts,prompt.md}` · `templates/<dept>-<artifact>/` · `guidelines/<group>-<topic>.html`.

- Template display names: `<Group> · <Artifact>` ("Finance · Invoice").

## Checklists

**New component** — `Name.jsx` + `Name.d.ts` + `Name.prompt.md` in `components/<group>/`; add to the group's card html (resolve the bundle namespace **by prefix** — `const CS = window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k))]` — never a hardcoded `…_<projectId>` suffix); add to readme's group line; **add `Name` to `components/lifecycle.json`** with `status: stable|preview|deprecated` (CDS-COV-001 / TASK-IMP-028 — gated by `test-component-lifecycle`). Consume tokens only; no hex literals except inside `tokens/`.

## Component lifecycle status (CDS-COV-001)

Machine-readable registry: **`components/lifecycle.json`**. Every `_ds_manifest.json` export has a `status`:

| Status | Meaning |
|---|---|
| `stable` | Declared API stability; verify the support record for the intended environment and scope |
| `preview` | Shipable but may change; document caveats in `note` |
| `deprecated` | Do not adopt in new work; removal needs a follow-up task |

**Surfacing (v1):** Storybook Docs → Conventions (this section) + the JSON registry. Atomic View / CSF stories do **not** yet render a badge — consumers and agents read the registry (or Conventions). Do not invent React props for lifecycle. Editor is `preview` while the HTML value model is schema-allowlisted and contentEditable remains (TASK-IMP-029).

Each export also has a separate `support` record, mirrored without inference into `components/api-index.json`: review state, owner, environment/axis scope, dated and hashed evidence, review date/reviewer, known limitations and optional deprecation/migration guidance. All 123 records are `reviewed` (`118` stable components, `1` preview component `Editor`, `3` stable constants, and `1` preview constant `EDITOR_SCHEMA`); Stephen Cheng is the assigned owner and reviewer (`2026-10-17T02:54:39.000Z`). Where a support record uses `unreviewed` in fixtures or future additions, null review fields and empty scope/evidence arrays mean **not recorded**, not unsupported and not no tests. Existing scoped tests remain separate evidence. No maturity label was changed by reviewing these fields.

`test-component-lifecycle` and API-index generation reject a claimed review without an owner, reviewer, date, explicit environment/axis scope and matching evidence files. They also reject changed or escaping evidence paths; deprecated entries require migration guidance. These are record-integrity checks, not authentication of a reviewer or automatic human acceptance. Assigning owners, approving the support policy and reviewing each scope remain human work; `stable` alone is not a whole-platform quality verdict.

**Support and maintenance policy — approved by Stephen Cheng, 14 October 2026; per-export bounded support records approved 17 October 2026.** Stephen is the accountable design-system owner and interim maintainer. Authorized agents may implement changes and collect evidence; Stephen decides support scope, product visual acceptance, exceptions, release and deprecation. Agent or automated review is recorded as such and does not supply human assistive-technology evidence or an independent human reviewer. The 17 October 2026 per-export support review records bounded environment/axis scope, source-bound evidence and explicit manual-AT/physical-device limitations while preserving maturity labels (`Editor` and `EDITOR_SCHEMA` remain `preview`).

Support follows the exact export, environment, axes and dated source/artifact evidence in its reviewed support record. `stable` declares API maturity; it does not certify every browser, locale, native toolchain, agent host or design tool. Missing fields remain unrecorded. Preview and experimental limitations remain visible. There is no new response-time guarantee, expanded platform promise, removal or deprecation.

| Trigger | Accountable action | Required record |
|---|---|---|
| Each relevant source change | Maintainer updates affected contracts, bilingual guidance and generated outputs and runs applicable maintained checks | Exact change, source identity, terminal results and unresolved scope |
| Before release or deployment | Stephen reviews current candidate evidence, notices, acceptance and migration/rollback plans against the release runbook | Separate explicit authorization for the specific action |
| Monthly | Maintainer reviews dependency advisories, vendor/font/media origins and notices, broken links, support-record drift and pilot resource regressions | Dated findings, disposition and next owner action |
| Quarterly, and before support expansion | Stephen reviews support scopes, experimental integrations, unresolved exceptions and consuming-product feedback | Dated decisions and evidence; no automatic reclassification |

Before accepting a reviewed support record, retain source/package identity, applicable contract and runtime results, known limitations and required owner/manual evidence. Failed, stale, unavailable and soft-skipped results remain distinct. The local Practice FAQ budget applies only to that pilot's decoded-body measurements. This cadence establishes responsibilities; it does not create scheduled automations, contact anyone or authorize deployment.

Each exception records affected paths/exports and hashes, requested scope, reason, impact, evidence, accountable owner, decision date, review date and migration/rollback route. It stays pending until Stephen explicitly decides it. Changed inputs or an elapsed review date require another decision. An exception cannot manufacture missing rights, human evidence or a passing test; accepted limited scope stays explicit in consumer guidance and release decisions.

The current revision stays **Unreleased** until release acceptance and publication are separately established. Bilingual notes retain dated failures and remaining native/manual, provenance, host and owner boundaries. The support policy and per-export support review do not approve release notes, publication or a VERSION change.


Editor HTML is parsed inertly through the same pinned parser in Node and browsers,
then reconstructed with allowlisted tags and no attributes. Paste/drop sanitize
before insertion; plain text is escaped. Keyboard toolbar actions preserve the
selection. `unsafeHtml` remains a trusted-only initial seed. Sanitized output is
only for HTML element content, never URL, attribute, CSS or script contexts.

**Responsive** — reflow is global (`base/responsive.css`, loaded last): media never overflows, print docs relax padding, `.cs-sheet` tables scroll, `.cs-sidebar` collapses, inline fixed-column grids collapse (3+→2 tablet, →1 phone), unbreakable long tokens (write-on `______` lines, long URLs/IDs) get `overflow-wrap: anywhere` on doc surfaces so they can't prop a phone column open, the app-shell shell grid collapses to one column with `main{min-width:0}`+`.cs-table-wrap` scroll, and fixed-geometry export canvases (`class="cs-canvas-desk"`: decks, social) **always** `overflow-x:auto` so a slide wider than the window scrolls inside the desk rather than pushing the page wide. **Width stops must match the token scale** in `tokens/spacing.css` (`xs` · `phone` 360 · `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536) — `docs-consistency` fails off-scale `@media`/`@container` widths in `base/` (FIND-007). Opt-in CQ hosts (`.cs-cq` or kit `.container` / `.wrap`) let children size from parent width via `@container cs` — see `docs/decisions/container-query-migration.md`. Verified whole-set at 390 by `_audit/responsive-overflow.html` (all 85 = 0 document overflow). **Two hard gotchas:** (1) the DC runtime compiles inline `style="…"` into React objects, so the rendered attribute is *spaced* — any `[style*=…]` responsive selector must match `grid-template-columns: repeat(4, 1fr)` (colon-space, comma-space), never the authored no-space form; (2) a global CSS rule can only override a property the template sets **inline** via an **attribute** selector (`[style*="grid-template-columns: 248px 1fr"]`) — a **class** selector loses to the inline style. Prefer fixing overflow in the template source (add `min-width:0`, `flex-wrap:wrap` inline) over fighting inline from the stylesheet.

**New template** — `templates/<slug>/<Slug>.dc.html` with `<!-- @template name description -->` first; `ds-base.js` stays single-entry (`styles.css` only — the one-line rebind was validated end-to-end Jul 2026 from a deeper path; the test scaffold has since been removed) and publishes the id-independent `window.CyberSkillDS` alias on bundle load, so mount DS components via `component-from-global-scope="CyberSkillDS.…"` — **never** a hardcoded `CyberSkillDesignSystem_<projectId>` suffix (it changes on re-import; enforced by `_audit/namespace-portability.html`); inline styles only; 1–3 tweaks (never plain copy/color — in-place editing covers those); printable docs add the `@page` + `.cs-desk`/`.cs-sheet` print block and carry **no dark tweak** (print is light-only).

**New element variant** — stay inside the element's oklch envelope; set the 10 `--cs-accent-*` contract tokens (incl. `--cs-accent-on-strong` ≥4.5:1 and body APCA75 on `-strong`) plus `--cs-color-text-accent`/`--cs-color-link` (APCA-check both); the aurora wash inherits from the element via `.cs-aurora-wash` (override the class rule only if the variant truly needs its own image); gradient partner (`grad-b`) must follow Tương sinh.

**Ship check** — run the compiler check until clean, then run `_audit/docs-consistency.html` **and** `_audit/namespace-portability.html` (both must be green). VERSION **1.7.2** (auto-bumps on `main`).

## Decision log (owner-approved)

- Elements fully replace Ochre inside product scopes; plasma's hot-pink edge approved (Jul 2026).

- Axes are Theme × Element × Language × Style. Style pack is liquid-glass (sole pack; absent ≡ default).

- Product registry is **locked** (Jul 2026) — eight portfolio mappings in `docs/products.md`; do not invent new product → element assignments.

- Text never sits on the mid-tone `-accent` — codified after the APCA sweep (see `docs/contrast-report.md`).

- **The display face is a token role, not a second default (Jul 2026).** `--cs-font-family-display` ships Space Grotesk (variable 300–700, Vietnamese subset) self-hosted alongside Be Vietnam Pro and JetBrains Mono, so a product with a headline face — `cyberskill.world` / Lumi — consumes a DS role instead of maintaining its own `@font-face` exception. **Nothing in the DS points at it**: `--cs-heading-family` still resolves to `--cs-font-family-ui`, every template and UI kit is unchanged, and a scope opts in with `.cs-display-face` (`base/typography.css`), which retargets `--cs-heading-family` only — body copy stays on the UI face. Space Grotesk has no 800, so the extrabold heading weight clamps to 700 within that family (CSS does not hop to Be Vietnam Pro for a missing weight). Adding a family means adding its faces to `tokens/fonts.css` **and** its files to `fonts/` **and** its entries to `_ds_manifest.json` `fonts[]`/`brandFonts[]` — `_audit/font-face-integrity.html` fails on any of the three being out of step, and on any family missing the Vietnamese subset. This changes no product → element mapping; `docs/products.md` stays locked.

- Language variants render **fully separated**: switching the Language tweak yields a complete single-language artifact — no partial translation left in headings, labels, helper text, footers, or body. The only bilingual-by-design elements are the CyberSkill name + slogan lockup (`Hiện Thực Hoá Ý Chí · Turn Your Will Into Real`, the canonical form — never a lone half) and the A4 legal identity block (company legal name + state motto). Everything else swaps with the tweak — including skip links and doc-type eyebrows (FIND-125). Catalog `<title>` / `@template name` strings stay English for the template index and are not language-mode chrome; `_audit/template-lang-parity.html` masks them when scanning the EN-leak lexicon (Jul 2026; FIND-125 follow-up).

- **Namespace is resolved, never hardcoded** — the compiler names the bundle global `window.CyberSkillDesignSystem_<projectId>`, and that 6-hex suffix is derived from the project id, so it changes whenever the system is imported into another project. Templates read the stable `window.CyberSkillDS` alias that `ds-base.js` publishes on bundle load; cards, UI-kit pages, the standalone email, and audit harnesses resolve by prefix (`window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k))]`). `_ds_bundle.js`/`_ds_manifest.json` and the frozen `_audit/exports/` snapshot legitimately carry the real suffix (they *define* it). Enforced by `_audit/namespace-portability.html`, which scans every manifest-indexed source — keeps re-import **zero-touch** (Jul 2026).

- Verification uses the `_audit/` dev harnesses (see `_audit/README.md`): `responsive-harness.html` (the user-facing Responsive preview — **every** template at 390/768/1280), `responsive-overflow.html` (whole-set horizontal-overflow gate at 390 — **use a fresh iframe per template; reusing one races the `@import` CSS and gives false positives**), and `language-overflow.html` (manifest-driven language application and clipping checks, with static-content templates reported separately). Set only states declared by the template, from the frame's own context: `__dcSetProps(__dcRootName(), {language:"Tiếng Việt"})` or `__dcSetProps(__dcRootName(), {theme:"dark"})`; verify the rendered language and `data-theme` root as the corresponding harness does. `__dc_theme` changes the optional authoring canvas background; it does not set the template's theme prop. Report light-only and static-content cases separately. `_audit/` supplies repository diagnostics, not component cards. The npm package excludes it; the website publishes only the diagnostics named in `scripts/public-site-policy.json`. Unlisted audit material remains excluded; a published diagnostic does not establish product acceptance. Never pass a value to `TextField` as **children** (crashes React #137 on re-render — the input is a void element); use `default-value` (Jul 2026).

## Export paths (per archetype)

Select an export path for the template archetype and the tools available in the chosen host. Repository browser/DOCX checks and retained `_audit/exports/` artifacts establish only their recorded producer, source, content and environment. They do not certify every template or export path. Inspect Vietnamese text, assets, editability, pagination and fonts in the actual delivered file and target application.
| Archetype | Path | Notes |
|---|---|---|
| Deck (`*-deck`, `slide-deck`) | **PPTX (compatible host required)** | The static clone does not include a PPTX writer. Confirm the selected host exporter and its capture options before choosing geometry or a `showJs` language hook. Inspect text runs, images, fonts and editability in the resulting file; DOM capture hooks alone do not establish those outcomes. |
| Document (any with `@page{size:…}` / `<meta name="omelette-owns-print">`) | **PDF + editable DOCX** | One **Tải / Download** control (`data-omelette-chrome`, print-stripped) from `templates/_vendor/doc-export.js` via `ds-base.js`, with a PDF \| DOCX menu. Both formats are built from the live `.cs-sheet` so the file matches the HTML preview. **PDF** = one Flate DeviceRGB page of the painted sheet at scale 3 (MediaBox aspect = the card — do not JPEG-blur, slice to A4, or stretch leftover slices); fallback: print a same-origin sheet clone — not the Storybook URL. CI still uses Playwright `page.pdf` for the print path. **DOCX** = editable OOXML walked from that same sheet (header flex as logo\|number table, measured font sizes/colors, tables + colspan, yellow `--cs-doc-fill` blanks, bilingual cell paras, umber headings, VN Unicode; Word header/footer stay empty so the sheet lockup is not duplicated); ZIP via `CompressionStream` — no CDN. Decks stay PPTX. |
| Email / product page / any DC | **Standalone offline HTML** | Confirm the host supplies the DC compiler and export tools. `ds-base.js` waits for React/ReactDOM, loads the bundle, and publishes `window.CyberSkillDS`; a raw bundle script alone does not preserve that sequence or alias. For `super_inline_html`, prepare a compiled standalone copy with explicit assets and peer readiness, preserving the stable alias; use [the no-build script ordering](consuming.md) as a runtime reference, not a DC compiler replacement. Include the support runtime, CSS, fonts, images and any export helpers; resolve dynamic dependencies that the inliner cannot discover. Set the target language and verify the delivered file offline in the actual host/browser. A portable clone or static script list does not certify this export path. |
| Any | **Editor-native + Claude Code handoff** | The whole project is dev-handoff-ready (compiled bundle + `.d.ts` + `prompt.md` per component); generate the package on request via the handoff skill. |

**DOCX grid widths.** Numeric track widths conserve the table total and remain nonnegative by allocating remaining integer twips to the largest fractional remainders. Browser-resolved numeric grid columns retain their relative widths, including unused zero-width slots. Unresolved track syntax keeps the equal-column fallback. Grid placement, spanning, gaps and complete CSS layout fidelity are not covered; inspect the exported document in the target office application. Text preservation alone does not establish layout parity.

**Font behavior on export.** Brand fonts are self-hosted (`Be Vietnam Pro` UI, `Space Grotesk` opt-in display, mono). PPTX/DOCX keep the brand-font **names** but do not embed the files — on a machine without them Word/PowerPoint substitutes a fallback (VN Unicode text is preserved; shapes may reflow slightly). For a fully self-contained hand-off, either tell the recipient to install the fonts, or export with a web-safe swap (`fontSwaps:[{from:'Be Vietnam Pro',to:'Arial'}]` — Arial covers Vietnamese). An offline HTML delivery must include every referenced font, image, stylesheet and runtime byte. Inlining `@font-face` declarations alone does not inline their URL targets or certify offline fidelity. Verify asset closure and render the actual exported artifact without network access. PDF pagination follows the browser print engine; Word may reflow page breaks.

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

- **Touch targets** — `base/a11y.css` sets 44px minimum dimensions on `@media (pointer: coarse)` (tabs, pagination, menu items, stepper, checkbox/radio and segmented buttons). Verify effective clickable regions and spacing in the mounted product states, including clipping and overlapping controls; CSS dimensions alone do not prove activation coverage. Desktop mouse density is preserved. `pointer: coarse` is used deliberately over a width breakpoint — a touch laptop at 1280px still needs 44px. Button carries its own coarse block in `components.css`.

- **Reduced motion** — `base/a11y.css` honours `prefers-reduced-motion: reduce` globally (near-zero animation/transition durations); the global `!important` rule limits Spinner to one near-zero-duration iteration, while status pulse is disabled. Dialog and AlertDialog use a fade entrance so controls retain their dimensions and fixed nested overlays remain viewport-bound. Reduced motion removes the panel entrance. Drawer slides with logical margins rather than a transformed containing block. Filtered modal materials use decorative sibling filter backings; their content remains in its DOM language/token scope.

- **Screen-reader language** — the source inventory contains <!-- cs-count:vietnameseInstrumentTemplates -->38<!-- /cs-count --> Vietnamese-suite instruments (`vn-*`), whose document roots declare `lang="vi"`. Separately, <!-- cs-count:templatesWithLanguageControl -->44<!-- /cs-count --> templates declare a Language control; inspect the chosen template's root and conditional-block `lang` bindings when switching modes. Declared controls do not certify complete translation or spoken-language behavior. Preserve explicit language boundaries in bilingual content and validate pronunciation and reading order in dated screen-reader sessions.

- **Component ARIA contracts** — components provide semantic roles and relationships (Button `aria-busy`; TextField/Textarea error/description wiring; Switch `role=switch`; SearchField `role=searchbox`; Menu `aria-haspopup`/`aria-expanded`/`role=menu(item)`; Pagination `nav`+`aria-current`+prev/next labels; Dialog/Drawer `aria-modal`; Toast `role=status`/`region`; ConfidenceMeter `role=meter`; Accordion `aria-expanded`; Logo `role=img`/`aria-hidden`). Preserve these and supply the labels/content required by each API. Validate accessible names, focus, announcements and dynamic/nested states in the composed product; attribute presence does not establish complete accessibility.

- **Void-element API rule** — components that render a void element (`<input>`/`<hr>`: TextField, Checkbox, Radio, Switch, SearchField, NumberField, Slider, Divider) destructure `children` out of `...props` so a stray child can never spread onto the void element (that crashes React with #137, the bug that hit `settings`). Content always comes from explicit props (`label` / `value` / `defaultValue`), never `children`. Follow this when adding any input-based component (Jul 2026).

- **Dark-theme contrast** — Token-pair and rendered-theme checks cover their declared pairings and visible measured text; inspect advisories, exclusions and material backdrops before applying a result to product content. Semantic colours have dark overrides (`success #4ADE80`, `danger #FC9895`, `warning #FBBF24`, `info #B5D4FD`) because the light-theme semantics failed on dark surfaces (~2.5:1); verify any new semantic pairing on `#221710`/`#2b1e14` (`_audit/` contrast math). The dark hairline border is intentionally subtle (separator, not a 3:1 boundary) (Jul 2026). **Interactive components that set `color`/`border-color: var(--cs-color-brand-umber)` on a themeable surface** (nav-item active, secondary/tertiary/ghost buttons, and the like) MUST ship a `[data-theme="dark"]` override — umber is near-invisible on dark; remap to ochre (emphasis) or `--cs-color-text-primary` (body). Screen-template brand wordmarks use `--cs-color-text-primary` (never hardcoded umber) so they flip in dark; print-doc headers stay umber by design. Table ID/code columns (e.g. `R-26-07`) carry `white-space:nowrap` so a hyphenated code never word-breaks in a narrow column (Jul 2026, user-reported). The umber-on-themeable-surface rule is now **enforced deterministically** by `_audit/contrast-guard.html` (static source lint + a token-pair WCAG matrix scored in light *and* dark) — the reliable gate the DOM-walk theme advisory couldn't be (v2.21.0). The v2.21.1 foreground-only `accent-strong` advisories described older palettes. Current strong fills pair with `--cs-accent-on-strong` and meet body APCA75 and WCAG4.5; that pairing does not make `accent-strong` a general-purpose foreground.

## RTL scope and verification

Many layouts in `base/*.css` use CSS logical properties (`inline-start`/`inline-end`, `margin-inline`, `padding-block`, `border-inline-*`, `inset-inline-*`). This does not establish that every layout or interaction mirrors under `dir="rtl"`. Physical exceptions include the skip link's hidden and focused `left` offsets in `base/reset.css`, the dialog's symmetric `left:50%` + `translate: -50% 0` centering, and the spinner's rotating border detail. The July 2026 kitchen-sink observation is a dated sample, not current whole-product RTL certification. Use logical properties for new directional layouts and verify focus placement, keyboard direction, overflow and nested interactions in the composed RTL states. Supported EN/VI content does not establish an Arabic/Hebrew language contract.

## Real imagery (image-slot retrofit)

Templates lean on `.cs-aurora-wash` gradients by default. For photography, load `<script src="../../image-slot.js"></script>` once through the helmet (path relative to the template), and give each `<image-slot>` a distinct `id` inside a `position:relative` hero. Keep decorative wash/scrim layers noninteractive and content above them. A scrim alone does not establish contrast over arbitrary photos: verify the actual image, text, crop and rendered state.

Follow the current `marketing-page`, `marketing-case-study`, `marketing-social-kit` and `culture-event-invite` implementations for authoring chrome: an opaque token-colored `::part(empty)` caption, reserved space clear of copy, stacking that preserves its hit area, localized hints, and print hiding. Verify empty/filled states and responsive layouts when adapting the pattern; the older four-line layering recipe is insufficient. Standalone reference: `templates/image-slots-demo.html`. Existing `.image-slots.state.json` sidecars are read beside the HTML; saving requires the host's `window.omelette.writeFile` bridge. An ordinary static browser does not provide that persistence bridge. Treat the July 2026 host observations as dated evidence, and verify persistence and asset closure in the actual handoff.

Local image uploads request Canvas WebP encoding after resizing. When the browser cannot encode WebP, Canvas returns PNG; the slot preserves that actual MIME type and transparency. Native WebP encoding is not a cross-browser guarantee. Verify the persisted bytes and longest-side bound in the selected host.

## Vietnamese typography & locale

Vietnamese is the primary language. The July 2026 typography notes describe the intended line-height and locale conventions; they do not certify current shaping, clipping or every template state:
- **Line-heights are VN-safe** — tokens body 1.5 / heading 1.35 / tight 1.15 leave room for stacked diacritics (dấu on top + nặng below). `:where(h1–h6)` defaults to 1.35 + `text-wrap: balance`; `:where(p)` gets `text-wrap: pretty` (both `base/reset.css`). Templates may hardcode a tighter line-height (≈1.0–1.15) **only** on single-line hero display headings; multi-line VN headings keep ≥1.15.

- **Locale formatting** — follow the template's content contract for number separators, dates and currency presentation. Finance Quote, Invoice and Expense retain VND transaction amounts in both languages, with a `₫` prefix and dot/comma grouping in their VI/EN branches; changing Language does not convert the transaction currency. Keep localized date and number examples in the appropriate branches, and verify the actual output. Do not infer `$`, a `₫` suffix, currency conversion or a current whole-template certification from the language setting.

## Whole-set state audits — language · theme · responsive (each its own pass, Jul 2026)

Owner doctrine: language, theme, and responsive each get their OWN whole-set pass; one clean state is not evidence for another. The manifest-driven harnesses use a fresh iframe per template, bounded bootstrap/style/font readiness and explicit measurement failures. Apply declared states through `__dcSetProps` and report tested, static-content, skipped and unsupported cases separately; a completed run is not proof of every state or platform:
- **Language** — `_audit/language-overflow.html` — forces `Tiếng Việt` on templates that declare language switching, checks the resulting content and overflow/clip at 390px, and reports static-content templates separately. It does not certify translation quality or bilingual support for every template.

- **Theme** — `_audit/theme-overflow.html` — forces dark; hard gate = dark-applies + 0 dark overflow @390 + 0 open solid-bg leaf-text contrast fails (no template-wide waivers).

## Theme-overflow contrast is a hard gate (Jul 2026)

`theme-overflow.html` has no template-wide contrast waivers. It fails on every reproducible measured WCAG AA contrast failure, on missing declared dark themes, and on load/bootstrap/stylesheet/measurement errors. It scans all rendered HTML leaf-text elements, matches two measurements by DOM position plus full text, and counts every stable failure even when only six examples are displayed. Image/gradient backgrounds remain explicitly skipped; mixed-content text, group opacity and pseudo-element paint still require complementary visual/assistive review. Light-only print/VN legal documents remain n/a. Use semantic text roles on panels and bright accent text on fixed Umber sections; `--cs-accent-strong` is not a safe general-purpose text color. Token proofs remain `contrast-guard.html`, `apca-dark-preview.html` and `docs/contrast-report.md`.

## Token exports (Jul 2026)

Machine-readable token exports live in `tokens/`: `tokens.json` (category and scope maps), `tokens.js` (ESM), and `tokens.dtcg.json` (`$value`/`$type` with CSS custom-property names). DTCG migration targets the [2025.10 Format](https://www.designtokens.org/tr/2025.10/format/) and [Color](https://www.designtokens.org/tr/2025.10/color/) Community Group reports, which are not W3C Recommendations. All base values use structured values or typed aliases and pass the repository emitted-value profile. Do not assume Tokens Studio or Style Dictionary import compatibility. Scope overrides and raw CSS metadata under `$extensions` require a CyberSkill-aware adapter. CSS remains authoritative; the base, theme and element generators rebuild their documented projections, with format exclusions listed below.

### Nested overlay and modal focus contract

Custom dismissible widgets share one Escape stack, including menus, suggestions, editing mode, previews and help. Escape closes the top child before the parent; IME composition is ignored. Modals keep focus in their active scope and registered portal descendants, make background branches inert, preserve existing inert/scroll values and reactivate their parent when closed. Portal positioning/depth remains the consumer's responsibility. Native select popups remain browser-owned. Automated Chromium/React development StrictMode checks are local evidence; manual assistive-technology and cross-browser acceptance are separate.

### Coarse-pointer hit areas

On coarse pointers, breadcrumb links, segmented buttons, SearchField clear, AI disclosure and the native Slider box provide at least 44×44 CSS pixels in both density modes. Padding on a surrounding track is not part of a child button’s hit area. Checkbox/radio labels provide the extended target; their native glyphs can remain smaller. Browser tests measure actual boxes and tap expanded edges. Native slider thumb rendering remains browser-owned; the input target band is 44px.

Pagination wraps at 320px while retaining the coarse-pointer 44px floor. Mobile browser fixtures assert their actual CSS viewport width; six native OTP inputs also fit that viewport without shrinking targets.

Small and extra-small Button coarse tokens are also 44px. Calendar days use separate 44px columns; narrow calendars scroll internally so dates do not overlap or widen the page. Carousel dots retain their small visual mark inside separate 44px buttons, and the slide viewport reserves enough height for its navigation targets. Toolbar, rating, close actions and disclosed color/choice controls use real control boxes rather than overlapping hit-area pseudo-elements.

`test:touch-inventory` measures all primary smoke fixtures and discovered disclosure/editing states at 320, 390 and 1280 CSS pixels, in EN/VI, both themes and densities. Its ownership check requires 44px rectangular/clipped bounds and searches finite candidate centers with an integer-coordinate 42px disk inside a 1px edge guard. It rejects unrelated native/semantic descendant actions; the guard, fractional/continuous perimeter and native touch adjustment remain unverified by that DOM query. `test:touch-region` checks controlled diagonal obstructions, nested actions, clipped regions, positioned containing blocks, labels and valid off-center regions in three engines. `test:touch-actions` and `test:touch-border` supplement geometry with native taps, including neighboring InputGroup clear/reveal controls. These checks do not certify every prop/content combination or consumer template; complete state and template review remains separate.

Tabs retain intrinsic label widths and scroll within their own container when labels are wider than it, keeping text inside each tab and the entire control height inside the scrollport. On coarse pointers, overlay scrollbars are hidden because they can intercept the lower action area immediately after scrolling; horizontal scrolling and keyboard focus navigation remain available. `test:tabs-touch-clip` checks both Tabs and hand-composed Tab controls, simple/rich scrolling labels, native selection and keyboard focus at 320/360/390px in all three engines. InputGroup action buttons reserve 1px at each inline edge around the required 44px disk on coarse pointers (46px minimum width), preventing neighboring actions/addons from winning fractional border hit tests; fine-pointer dimensions are unchanged. Native border checks use explicit integer coordinates inside the declared disk because flooring a fractional touch coordinate can place the delivered event outside it.

Optional Alert/Toast/Tag dismiss buttons, Image preview close, mention suggestions and DataGrid selection/sort/pin controls also use 44px targets on coarse pointers. DataGrid keeps native checkbox glyphs inside larger labels. Its virtual-window step is at least the natural height of mounted rows and reacts to resizing, ancestor styles, fonts and pointer mode; `rowHeight` remains a minimum estimate for uniform rows, not a cache of every unseen variable-height row. `test:datagrid-touch` checks spacer geometry, scrolling and selection with both pointer modes. `test:touch-optional` checks real dismiss/select edges and preview keyboard focus restoration.

### Density inheritance and system contrast

Density inherits through descendants. Use `data-cs-density="comfortable"` to reset compact spacing and control padding; omitting the attribute inherits rather than resets. Explicit comfortable restores every density-controlled value, and a nested compact scope can opt back in. System theme follows the same OS contrast preference as explicit light/dark. See `docs/decisions/theme-density-contrast.md` for evidence and remaining color-scope limitations.

### Density token exports

CSS in `tokens/theme-attributes.css` owns the density aliases and both compact/comfortable scopes. Run `npm run tokens:generate` to update the JSON/ESM/DTCG projections, declaration graph, manifest, native outputs and references together. Verify with `npm run test:density-exports` and `npm run test:token-declarations`. The theme export generator rebuilds both density projections and the authored dark/system overrides from colors.css, component-tokens.css and elevation.css. Duplicate or missing authored scopes fail before mirrors are written. The declaration generator owns all manifest token rows.

Native base density aliases are resolved dimensions; scoped metrics use `Compact` and `Comfortable` suffixes. Existing non-density native alias strings retain their compatibility shape. DTCG density leaves retain references plus the raw CSS extension. Live design-tool imports and complete scope-extension interoperability remain separate work.

`npm run tokens:generate` rebuilds the complete token-dependent output set (density/element mirrors, native files, manifest projection, bundle, styles, DESIGN.md and EN/VI contrast reports). CI regeneration uses the same command and includes each generated output in its drift check.

DTCG regeneration: `npm run tokens:generate` runs the element/density projections, `tokens:dtcg`, native outputs and reference artifacts. `tokens:dtcg` reads CSS-valued `tokens.json` and the existing semantic type inventory; it rejects missing/extra entries, malformed values and alias cycles before writing. Run `npm run test:dtcg-profile` for generator freshness, invalid-input coverage and browser round trips. All base tokens retain exact CSS in `com.cyberskill.css`; `relativeUnit: em` preserves relative letter spacing as a number, `cssScale: 100` represents percentage ratios, and `nativeFormat` explicitly preserves legacy CSS strings or `Em` constants. These extensions are not portable DTCG modes. Native rem conversion still assumes 16px; color alpha quantizes to an ARGB byte where required. Actual platform builds are a separate acceptance check.

A local Style Dictionary 5.5.5 probe retained all <!-- cs-count:typedBaseTokens -->175<!-- /cs-count --> original base values and per-token extensions, but its default CSS formatter emitted `[object Object]` for four durations and its normalized dictionary omitted root scope metadata. Use neither that formatter nor the normalized dictionary as a lossless CyberSkill export. The repository adapter below repairs that interchange loss; neither probe contacted Figma.

### Style Dictionary adapter (repository maintainers)

Use `createStyleDictionaryAdapter(document)` from `scripts/lib/style-dictionary-adapter.mjs` with the complete original DTCG document before constructing Style Dictionary. Register `adapter.formatDtcg` as a custom formatter; it reconstructs the exported document from every tool-provided `token.original` and retained root/group metadata. It rejects missing/duplicate/changed leaves instead of filling gaps from the source. Changes belong in canonical CSS and generation, not transformed tool values. The adapter snapshots metadata so later input/output mutations cannot alter subsequent exports.

Style Dictionary 5.5.5 is the tested version. Two real import/export cycles preserve all <!-- cs-count:typedBaseTokens -->175<!-- /cs-count --> base leaves and all 36 currently exported scope maps, including aliases and extensions. `adapter.formatBaseCss` preserves exact base CSS expressions (including durations), but is only a `:root` projection; use canonical `styles.css` for runtime scope composition. Retaining the exported maps does not certify coverage of every runtime conditional rule.

`npm run test:dtcg-profile` includes dependency-free adapter failure tests. For the real-tool test, install `style-dictionary@5.5.5` in an isolated directory with scripts disabled, then run `npm run test:dtcg-style-dictionary -- <directory>/node_modules/style-dictionary`. CI performs that separate pinned test. No Style Dictionary package is added to the design-system runtime, and no Figma account is accessed.

### High-contrast projection

`tokens/theme-attributes.css` owns the two high-contrast roles: muted text and default border. The shared generator reader validates the light, dark and system-dark scopes before writing outputs. JSON/ESM `contrasts` and DTCG `com.cyberskill.overrides.contrasts` contain `high-light` and `high-dark` deltas. Apply the selected contrast delta after the selected theme/element values; Standard means no contrast delta. These extension maps are not portable DTCG modes. Native constants use `HighLight` / `HighDark` suffixes; constants alone do not observe OS events.

`npm run test:contrast-exports` changes the authored colors in an isolated fixture, runs the real element/theme/native generators, observes all 15 packs in three browser engines with OS media initialized before navigation, and checks all three native projections. Invalid or ambiguous contrast declarations preserve every output. Live browser media emulation and real native OS events are separate checks; passing this test does not certify native builds, design-tool imports or human acceptance.

### Public export catalog

`npm run build:exports` regenerates the bundle, manifest export catalog, legacy ESM, React entries and DESIGN.md. Export names/source paths come from the current source-derived bundle model; `components/lifecycle.json` supplies explicit `component`/`constant` kinds and lifecycle status. Missing kinds or source mismatches fail generation; no generator promotes a new export to stable. The manifest's historical `components` field contains both kinds: currently <!-- cs-count:components -->119<!-- /cs-count --> component exports and <!-- cs-count:constants -->4<!-- /cs-count --> constants. `EDITOR_SCHEMA` is a preview constant, matching Editor. The browser ESM gate compares the live bundle as well as the manifest and legacy entry, so two matching incomplete inventories cannot pass.

The declaration generator owns the manifest's root and scoped token rows, including all ten root accent roles. Element and density generators no longer write competing manifest projections.

### Token declaration graph

`tokens/declarations.json` records every custom-property declaration reachable from `styles.css`, in import/cascade source order. Each row includes its source location, raw value, `!important`, namespace visibility and complete rule/at-rule context. Private resolver channels remain visible in this maintenance graph but are excluded from the manifest's public token rows. The generated metadata reports current declaration and source-file counts; declaration counts are not unique token or stable-API counts.

Run `npm run tokens:declarations` after CSS edits, or the complete `tokens:generate` chain. `npm run test:token-declarations` checks freshness and compares every row against an independent browser CSSOM traversal. The parser is pinned as a direct development dependency. Import cycles, missing files, remote/qualified imports and imports outside the repository fail rather than losing conditions. Nested selectors and at-rules remain separate context entries; consumers must not treat conditional `:root` rows as defaults. `manifest.tokens` now carries `conditions`, optional `selectorPath`, source order/line and importance. Its `kind` comes from the base typed inventory where known; `css-expression` means no cross-platform type has been established.

JSON/ESM token metadata (`$meta.declarationGraph`) and the DTCG root vendor
extension (`$extensions["com.cyberskill"].declarationGraph`) identify the same
`declarations.json` companion by exact SHA-256, schema version and public/private
counts. Paths are relative to the token document. Run the declaration generator
after any CSS change to refresh all three references. The companion carries
all public names, including the 19 without base typed leaves, and private resolver
declarations with their visibility labels; private rows do not become public API.
It preserves conditions without duplicating the full graph in each runtime file.

For a complete repository-adapter handoff, supply the exact companion text as
`createStyleDictionaryAdapter(document, { declarationsJson })`, then call
`adapter.exportFiles(dictionary)`. The returned `tokens.dtcg.json` and
`declarations.json` must travel together. Missing or stale companion bytes, an
unexpected path or mismatched counts fail. `exportDtcg` alone retains the reference
but does not copy its target; `formatBaseCss` still exports only root values.

This graph describes declarations, not computed cascade results or a dependency solver. Runtime verification still uses the theme/contrast/density matrices. Existing typed base and scope projections remain separate outputs; complete cross-platform conditional-mode support is not implied.

For repository maintenance, `npm run tokens:coverage` separates base
typed membership from source-scoped values for every public-namespace name.
Currently <!-- cs-count:typedBaseTokens -->175<!-- /cs-count --> names have a base DTCG entry; 11 additional names have scoped literal
colors, seven have unresolved glass expressions, and one identifies the style
pack. Literal-color metadata is not a new root token or proof of native support.
Run `npm run tokens:coverage` after source/type inventory changes and
`npm run test:token-coverage` to validate coverage and scope preservation. This
internal inventory is not a public-site asset or a general DTCG interchange file.

Component review discovery is verified via `npm run components:review` after component or test edits, and checked via `npm run test:component-review`. File-level hooks and direct `CS.Name` mentions locate candidate evidence; they do not prove executed behavior, complete state coverage or acceptance. Inspect indirect fixtures and shared source files before classifying a gap.

### Rebuilding Vietnamese font subsets

The Latin face for each shipped style and weight contains the bounded Vietnamese
NFC repertoire and its NFD combining marks. Its CSS range includes both, keeping
base letters and marks in one face for shaping without changing caller text.
The other language subsets retain their previous bytes and coverage.

`fonts/subset-recipe.json` pins upstream commit, source hashes, licenses and the
exact encoded repertoire. With Python fontTools 4.62.1 and Brotli available, run
`python3 scripts/build-font-subsets.py --source-dir /path/to/font-cache --download`
to acquire verified inputs and rebuild, or add `--check` to compare output without
writing fonts. Downloads occur only with `--download`. Preserve the upstream OFL
notices in `fonts/licenses/` and the combined `fonts/OFL.txt`.

After an intentional font change, run `npm run fonts:manifest` to synchronize the manifest's font records, then `npm run build:styles`, `npm run fonts:glyphs`, and
`node _audit/ci/test-font-rendering-browser.mjs`. The browser regression
requires custom-font usage and identical NFC/NFD widths for all 16 declared
family/style/weight cases through both `styles.css` and `dist/styles.min.css`
(64 normalization cases). A stale flattened stylesheet fails before browser checks.
This bounded Chromium check does not establish full
Unicode shaping, other engines, native font installation or visual acceptance.
The repair can change spacing where older subsets broke shaping runs; retain
human typography review and platform pixel comparison as separate acceptance.

### Export applicability and regeneration authority

`tokens:base` projects all <!-- cs-count:typedBaseTokens -->175<!-- /cs-count --> typed base values from unconditional CSS root declarations into the existing category inventory. It preserves aliases and rejects missing, duplicate or unclassified root names; conditional `:root` rules never become defaults. `tokens:elements` owns element seeds and their light/dark projections; `tokens:theme` owns authored theme, density and high-contrast maps. `tokens:generate` runs these before DTCG, declaration metadata, native outputs and dependent references. A changed source value must propagate; retaining a historically correct JSON value is not sufficient evidence of generation.

| Consumer format | Represented values and scope | Non-applicability rule |
|---|---|---|
| Canonical CSS / flattened CSS | All public declarations, conditions, selectors and private resolver channels | Native rendering and OS event handling are outside CSS consumption. |
| Manifest | Every public declaration, including source order, selector, condition and importance | Private channels are excluded from public token rows. |
| JSON / ESM with declaration companion | All typed base values; authored theme, light element, density and high-contrast maps; exact remaining declarations through the hashed companion | Consumers must read the companion for full conditional scope information; the compact maps are not a CSS cascade engine. |
| DTCG with declaration companion | All typed base values; theme, light/dark element, density and high-contrast maps in the vendor extension; all remaining source declarations in the companion | Vendor modes, CSS expressions, selectors and style metadata are not portable DTCG typed values. An importer must support the repository adapter or retain the companion. |
| Swift / Kotlin / Dart | All typed base entries; dark colors and shadow strings; every exported light element value and complete dark counterpart; all compact/comfortable dimensions; four high-contrast role values | These are constants, not a native CSS engine. The app selects OS/theme/density/element state and applies values. CSS material expressions, selectors, reduced-motion/coarse-pointer conditions and font-family stacks need a platform adapter. Shadow/alias strings remain strings and do not establish rendered parity. |

The 19 public-namespace names without base typed leaves remain fully represented in CSS, manifest and the declaration companion. Their exclusion from the base DTCG table and native constants is explicit:

- `--cs-style-pack` identifies the sole style; it is metadata, not a native scalar or color.
- `--cs-glass-whisper-bg`, `--cs-glass-whisper-border`, `--cs-glass-light-bg`, `--cs-glass-light-border`, `--cs-glass-standard-bg`, `--cs-glass-standard-border`, `--cs-glass-heavy-bg`, `--cs-glass-heavy-border` are CSS material recipes. The transparent whisper border stays with that recipe; none is promoted into an independent portable material API.
- `--cs-code-bg`, `--cs-code-border`, `--cs-code-fg`, `--cs-code-muted` apply only to `.cs-code`; `--cs-term-bar`, `--cs-term-bg`, `--cs-term-border`, `--cs-term-dot`, `--cs-term-fg`, `--cs-term-muted` apply only to `.cs-terminal`. Their literal colors are preserved with selectors. The native samples have no equivalent CodeBlock/Terminal component contract, so these are not root defaults or native component tokens.

Native element constants use `<Scope>Light` and `<Scope>Dark` suffixes. Dark packs merge authored dark overrides with inherited light roles; dark element text/link values use their actual dark palette. System theme selects base/light or dark values in the host app; generated constants do not subscribe to OS changes. The three Settings samples exercise density selection, but source checks and computed-browser comparison do not replace native builds, rendered layout checks or human acceptance. `test:native-element-values` compares every exported light/dark pack value with computed CSS; the token pipeline gate checks every generated constant and provenance hash.

## Repository skill validation

`npm run test:repository-skills` parses every nonignored Git-listed `SKILL.md` with YAML, checks required metadata and linked local resources, and checks parity and canonical routing between the `.agents` and `.cursor` adapters. Skill names match discovery-directory names; root `SKILL.md` is a shared router and has no discovery-directory constraint. Fenced examples are excluded from link checks; arbitrary prose paths, remote links and anchor targets are outside this check. Parser success is not host-loading or behavioral acceptance.

Portable template runtime ownership: `scripts/template-runtime/primitives/support.js` is the authored compatibility source. `npm run build:template-primitives` generates `templates/_vendor/support.js`, which is the canonical input for synchronizing template copies. `scripts/template-runtime/ds-base.js` is the canonical design-system loader. The manifest's template folders receive byte-identical generated copies of both files through `npm run sync:template-runtimes`. Do not maintain repository copies independently. A consuming project may adapt its own loader base path as described in the loader, outside this repository's identity contract.

Run `npm run test:template-runtimes` or `node scripts/sync-support-runtime.mjs --check` to reject missing or changed copies without writing them. Generation validates source syntax, the existing support-runtime no-eval policy, declared destinations and symlink boundaries before writing any output. Required per-template copies remain available for portable delivery; byte identity alone does not establish compiler availability, full asset closure or exported-file fidelity. JetBrains Mono retains all separate 400/500/700 weight and Unicode-range declarations, with their byte-identical sources shared under the `jetbrainsmono-400-<subset>.woff2` filenames. The redundant 500/700 source files have been removed; consumers that referenced those raw filenames directly must use the matching 400 file while preserving their CSS weight descriptor.

Run `npm run build:site` before `npm run measure:distributions -- --output /tmp/cs-distribution-costs.json`. The measurement requires a current built website; it measures the nonignored working tree (including pending files), the actual npm tarball and unpacked files, and the classified website, including its manifest. It reports all template folders separately and accounts for their required runtime copies. Folder totals exclude shared resources and compiler/export tools: preserve relative paths and check the delivered asset closure. Logical byte totals differ from disk allocation and network transfer. The full npm tree is a measured portable source envelope, not an exported document. Reports must be saved outside the measured repository to avoid self-reference. `npm run test:distribution-costs` rejects changed website membership/bytes and runtime-copy drift. These measurements are baselines; size ceilings, consumer performance budgets and owner acceptance remain separate decisions.

Declared counts and public document roles are generated in [the reference catalog](reference-catalog.json). `npm run docs:reference` refreshes the catalog and marked counts; `npm run test:reference-catalog` checks freshness. The catalog distinguishes declared inventory, normative sources, guides and evidence; it does not certify capabilities or human acceptance.

Use `--cs-color-semantic-{role}-text` for surface text and pair each semantic fill with its matching `-fg`. The new `test:body-text-contrast` regression measures actual AI disclosure badge pairs, Stat labels, TextField descriptions and regular body links and small bold accent text across page, panel and raised surfaces in all element variants, plus accent text on explicit elemental tints, themes, OS schemes, densities and inherited/explicit contrast preferences in three engines. Its scope does not certify every component or template state. Fixed white print sheets declare `data-theme="light"` and their own primary text color; adaptive sheets retain normal theme composition.

`test:strong-text-contrast` checks real primary Buttons and a regular strong-callout body sample in three engines across all element variants, themes, OS schemes, densities and inherited/explicit contrast modes. It initializes preferences at navigation and verifies CSS/media agreement. Static terminal-state checks disable transitions; arbitrary overlap, animation frames, native/device and manual acceptance remain separate. Preserve visible separator glyphs and exact business/legal copy; use explicit `aria-hidden="true"` only for noninteractive decorations.

`test:paper-text-contrast` traverses all 62 print sources, every declared language and Element option, Light/Dark roots and three engines. It measures rendered direct text, retaining full JSONL traces, applying body APCA75, with APCA60 reserved for text at least 24px and weight700, and rejecting unsupported ancestor paint and unmarked decorative separators. The fixed Light document slate is a body role; it must clear its actual white, fill and elemental table backgrounds. Sibling gradients require separate raster evidence. This regression does not establish export, device, manual AT or operator acceptance.


The authored compatibility renderer recovers table-control structure from the original served HTML when native parsing has moved a loop or condition away from its rows. Raw DC tables with lost structure require an HTTP(S) preview and a retrievable matching source document; unavailable or changed source produces a visible bilingual error. Ordinary and already-materialized non-HTTP documents keep the existing DOM path. This behavior does not certify standalone offline asset closure or an authentic DC host export. `test:template-control-content` checks all six table-control sources, their declared axes, all templates bootstrapping in each engine and conditional/protocol failure controls.
