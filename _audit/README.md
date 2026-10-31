# `_audit/` — verification dev tools (not compiled)

Diagnostic harnesses for **deep** verification (owner doctrine: whole-set checks, never surface spot-checks). They are not `@dsCard`-tagged, are not compiled into `_ds_bundle.js`, and export no tokens. The npm package excludes `_audit/`; the public host includes only diagnostics explicitly listed in `scripts/public-site-policy.json`. Open with a browser/preview; they iframe or mount real templates/components.

`npm run test:element-geometry-text` runs the actual Element geometry gate and
measures all 13 generated success rows plus a failure-class fixture against the
APCA75 body floor across all element variants, themes, densities, contrast scopes
and OS preferences in Chromium, Firefox and WebKit. It checks that the legibility
fixture preserves the gate verdict. Opaque text on its declared solid body surface
is covered; arbitrary compositing, native and manual acceptance remain separate.

## Harnesses

- **`responsive-harness.html`** — the user-facing **Responsive preview**: manifest-driven, lists **every** template (grouped + filterable) and renders the selected one live at **390 / 768 / 1280 px** side by side. Media queries respond to each iframe's actual width; this is a browser layout preview, not physical-device validation. Fresh iframes per selection. Reach into the same-origin frames to read computed styles (e.g. confirm a 4-col grid collapses 4→2→1).

- **`responsive-overflow.html`** — whole-set horizontal-overflow gate: loads all <!-- cs-count:templates -->85<!-- /cs-count --> templates (manifest-driven) in **fresh single-navigation iframes** and fails if any has document-level horizontal overflow at mobile **390**. Canvas decks/social legitimately scroll *inside* `.cs-canvas-desk` (0 document overflow, flagged ◇). `window.__overflow.pass` must be `true`. **Method note:** reuse of one iframe across many `src` swaps races the `@import`ed `responsive.css` and produces false positives — always use a fresh iframe per template (single navigation).

- **`language-overflow.html`** — whole-set **language** gate (owner doctrine: language gets its own pass). Loads **all <!-- cs-count:templates -->85<!-- /cs-count -->** templates in fresh single-navigation iframes, applies `Tiếng Việt` only to templates declaring that switch, and counts static-content templates separately. Fails on measured document horizontal overflow or text clipping (fixed-height / `nowrap` boxes) @390; switchable templates must visibly apply Vietnamese. `window.__language.pass` must be `true`. Run the gate for a current verdict; an old pass does not certify the current source.

- **`theme-overflow.html`** — whole-set theme gate for every manifest template at 390px. Declared dark themes must apply; overflow, stable solid-background leaf-text failures and loading/measurement errors block `window.__theme.pass`. No template-wide waivers. All stable failures count; six examples per row are displayed. The scan includes leaf `div` text and compares DOM identity plus full text, not truncated labels. Light-only print/legal templates remain n/a; image/gradient paint remains skipped. Companion token proofs: `contrast-guard.html`, `apca-dark-preview.html`, `docs/contrast-report.md`.

- **`vn-overflow.html`** — loads every toggle-able template in sequence, forces **Tiếng Việt** via `window.__dcSetProps(rootName, {language:"Tiếng Việt"})`, and measures clipping / horizontal overflow (VN text is longer — the real risk is fixed-geometry deck slides and `nowrap` pills). Results collect on `window.__vn`. **Superseded as the whole-set gate by `language-overflow.html`** (the full current manifest, fresh iframes, pass/fail); kept for per-element diagnostics in language-switchable templates.

- **`a11y-harness.html`** — a11y CSSOM gate (in the fast runner, promoted from a manual-inspection page): declared coarse-pointer floors and focus/reduced-motion/high-contrast source rules, plus actual naming checks on its 20 mounted native fixture controls using pinned local axe. Static source checks do not prove rendered focus or effective hit areas; naming does not establish complete WCAG or screen-reader acceptance. `window.__a11ycss.pass` must be true. Companion to `a11y-gate.html` (keyboard/ARIA interaction — this one is static CSS).

- **`component-children-test.html`** — mounts the void-element components (TextField, Checkbox, Radio, Switch, SearchField, NumberField, Slider, Divider) **with a stray child** — the React #137 trigger — inside error boundaries. `window.__result.anyThrew` must be `false`. It loads `_ds_bundle.js`; after editing source, run `npm run build:bundle`, check `node _audit/ci/check-bundle-freshness.mjs`, then reload the harness.

- **`component-behavior-test.html`** — behavior smoke test beyond mount for its declared interaction fixtures (overlays, forms, AI gates, shell chrome, media/copy). Read its live total/results; this smoke does not certify every state or export. `window.__behavior.pass` must be `true`. Also loads `_ds_bundle.js`; rebuild and verify bundle freshness before reloading after source edits.

- **`token-contract.html`** — runtime contract test: applies each of the 15 element×variant scopes to a probe and asserts all 10 accent role tokens, including `on-strong`, resolve non-empty (plus core text/semantic tokens). `window.__contract.pass` must be `true` (`elementFails === 0` and `coreMissing` empty). Complements the static tokens+base scan (element role-token completeness + no undefined no-fallback `var()`).

- **`docs-consistency.html`** — reads `_ds_manifest.json` + `VERSION` and checks complete generated count markers against their named fields in `docs/reference-catalog.json`, including declared-control subsets. Catalog totals and subset sums must agree with the manifest. Selected unmarked whole-inventory count patterns in live prose (README / SKILL / llms) also match the compiler, plus audit prose card-count claims (`_audit/index.html` / this README / namespace-portability) match `manifest.cards`. Also asserts `VERSION` is semver and `package.json` matches it (auto-bumps on main), that live entrance docs do not reintroduce `CHANGELOG.md`, that the **stale-phrase blacklist** (retired suite/pack counts plus three-axis leftovers) stays out of README / SKILL / llms + `docs/*.md`, that the generated root `DESIGN.md` exists with front-matter version = `VERSION`, and that **doctrine matches source** (10 accent roles incl. `on-strong`, full depth scale, default lang `vi`, breakpoint CSS↔JSON, `base/` depth fallbacks). Node twin: `_audit/ci/test-docs-consistency.mjs` (static parity only). Real-gate marker/count/fetch/parse regressions: `npm run test:doc-count-claims`, also included in the unit suite for Chromium, Firefox and WebKit. These checks do not certify every factual assertion or arbitrary count phrasing. `window.__docs.pass` must be `true`. Run after any count-touching change.

- **`asset-weight-budget.html`** — regression ceilings for `assets/aurora-{tho,hoa,thuy,moc,kim}.webp` (≤300 KB each, ≤1.2 MB set, FIND-016). The browser checks those five files, eight named legacy PNG paths (only HTTP 404 proves absence), and the Thổ wash CSS; transport/status errors fail. The Node twin in `ci/test-docs-consistency.mjs` separately scans disk for extra aurora WebPs and legacy PNGs. `window.__assetweight.pass` must be `true`.

- **`docs-lang-parity.html`** — every operator-facing EN `docs/*.md` has a `docs/vi/` counterpart; VI is not an empty/TODO stub (≥40% of EN length); stale-phrase blacklist applies to both EN and VI. Does not duplicate component/template bilingual systems. `window.__docslangparity.pass` must be `true`.

- **`namespace-portability.html`** — fetches every manifest-indexed source (<!-- cs-count:templates -->85<!-- /cs-count --> template `entryPath`s + <!-- cs-count:cards -->58<!-- /cs-count --> card `path`s) plus the bundle-consuming UI-kit pages, and **fails if any hardcodes the compiler's project-id namespace suffix** (`CyberSkillDesignSystem_<6-hex>`, e.g. `…_847b3c`). That suffix is derived from the project id and changes on import into another project, so sources must resolve it by prefix (`window[Object.keys(window).find(k=>/^CyberSkillDesignSystem_[0-9a-f]{6}$/.test(k))]`) or read the `window.CyberSkillDS` alias that `ds-base.js` publishes. Also asserts the alias + the template mount pattern are actually present (not just the bad pattern absent). `window.__nsguard.pass` must be `true`. Keeps the system **zero-touch on re-import** — run after adding any card, template, or bundle-consuming page.

- **`visual-diff.html`** — visual-regression **review assist** + advisory runner row (drift judged by eye — this environment can't rasterize nested-iframe content; the `baselines/` refs are 909×540). Compares a live template render against its stored baseline side-by-side or as a `mix-blend-mode:difference` overlay; drift is judged by eye. Manifest-driven coverage list; 16 curated baselines anchor high-traffic product/document/deck shells plus the component-state swatches, not every template. Regenerate a baseline after an intentional redesign.

- **`pixel-ci.html`** — hard receipt check for the 16 curated Playwright comparisons. The shared `lib/pixel-report-contract.mjs` requires every result, fixed frame/tolerance/threshold, capture outcomes, renderer identity and source/baseline digests. Empty, legacy, partial, update-only or internally inconsistent reports fail. The board independently derives the input inventory from the current public-site policy and hashes every runtime/authoring input, comparator, receipt consumer, lockfile and baseline. A deployed webroot lacks private comparator inputs and cannot certify this repository check. Run `node _audit/ci/pixel-diff.mjs http://127.0.0.1:8080` against the same repository server before the board. `npm run test:pixel-report` tests malformed/stale receipts in the actual page and real clean/drift/failure CLI captures in disposable fixtures. These checks establish bounded comparison/identity evidence, not CI status or human visual acceptance.

- **`component-visual-diff.html`** — component-tier counterpart to `visual-diff.html`: 12 curated components (Button, Badge, Alert, Toast, Card, DataTable, Accordion, TextField, Avatar, ProgressBar, Switch, Tooltip) rendered **directly** (no nested iframe — sidesteps the html-to-image limitation entirely) against stored 280×160 crops in `baselines/components/`. Advisory runner row checks baseline-file freshness only; drift judged by eye. Exemplars across the atomic tiers, not exhaustive — `guidelines/atomic-view.html` is the full live story set.

- **`contrast-guard.html`** — deterministic dark-contrast safety (token + static CSS; complements the theme-overflow DOM hard gate). (1) **Static source lint**: any base rule setting `color: var(--cs-color-brand-umber)` on a *themeable* surface (surface-*/transparent, or a `color-mix` that includes one) without a matching `[data-theme="dark"]` override **fails** — the nav-item/secondary-button class the user hit. (2) **Token-pair matrix**: every semantic text×surface pairing scored (WCAG) in **light + dark** from `tokens/tokens.json` — no DOM, so no false reads. (3) Screen-template inline umber-in-header is **advisory** (bg unknowable statically). `window.__contrastguard.pass` must be true. Run after touching `base/*.css` or `tokens/`.

- **`story-coverage.html`** — guards `guidelines/atomic-view.html`: every primary export has a story **and** every tweakable primary in `PLAYGROUND_REQUIRED` appears in a live `controls` + `renderC` playground (not specimen-only). Sub-parts excluded. Loads `_ds_bundle.js` (rebuild and check its freshness after source changes). `window.__storycov.pass` must be true.

- **`bilingual-parity.html`** — v3 bilingual-doctrine gate: reads the central registry `components/_i18n/strings.js` and **fails** if any component lacks an `en`/`vi` table, has mismatched key sets across en/vi, any empty value, or an optional spike locale (e.g. `ja`) whose keys drift from `en`. Keeps EN·VI in lockstep as Batch 1 wires components. `window.__bilingual.pass` must be true.

- **`run.html`** — one-click **gate runner**: loads every fast deterministic gate in sequence in fresh iframes, reads each verdict global, and shows a pass/fail board + aggregate `window.__run.pass`. **Row lifecycle:** each gate starts **pending**, only the active gate shows **running**, then **pass/fail/timeout** (advisory rows stay labeled). The three whole-set state audits (`responsive-overflow`, `language-overflow`, `theme-overflow` — ~5 min each) stay on the index, run them separately.

- **`apca-dark-preview.html`** — dark-pack APCA page: since v4.0.0 a **fast-runner gate** (all 15 dark elemental packs must hold bright ≥ 75 · accent ≥ 60 · button ink ≥ 75 · ink ≥ 75; `__apcaPreview.pass` / `currentFail === 0`); still previews derived proposals for future packs.

- **`element-geometry.html`** — Element colour geometry hard gate: soft / middle / deep intensity sync across five elements, variant distinctness, light↔dark hue identity, Thổ middle pinned to logo ochre, packs generated from `tokens/element-seeds.json`. `window.__elementgeometry.pass` must be true. Regenerate packs with `npm run tokens:elements`.

- **`style-contract.html`** — **hard** Style axis allowlist: sole pack `liquid-glass` (absent ≡ default); asserts `tokens/styles.css` import + `--cs-style-pack`. `window.__stylecontract.pass` must be true.
- **`template-schema-test.html`** \u2014 template content-schema v2 gate (in the fast runner): validates every opt-in `templates/<slug>/content-schema.json` sidecar against the JSON Schema (`templates/schema/content-schema.schema.json`) and bidirectionally against the template's real `{{ hole }}`s. It also **gates coverage**: every template exposing an authorable content hole must ship a sidecar, where axis/control-flow holes (`rootTheme`, `langAttr`, `elAttr`, `vaAttr`, `dirAttr`, `true`, `false`, `is*`, numeric literals), boolean tweak holes (`show*`, `hide*`, `has*`, `enable*`, `with*`), and runtime-control holes (`tabs`/`tab`/`lens`/`chatOpen`/`closeChat`, `set*`/`open*` handlers) are excluded by doctrine. `window.__schemav2.pass` must be true; the gate prints the live split (eligible / axis-only / total) rather than a hardcoded count.

- **`esm-smoke-test.html`** — ESM-path gate (in the fast runner): `_esm/cs.mjs` imports (self-ensures React + bundle, prefix-resolved namespace), export list in lockstep with `_ds_manifest.json` (drift guard both directions), Button mounts with brand tokens. `window.__esm.pass` must be true.

- **`token-pipeline-test.html`** — native token parity gate (in the fast runner): re-derives every expected Swift/Kotlin/Dart constant from `tokens.dtcg.json` (rem→px@16, em→`…Em`, rgba→ARGB) and asserts verbatim presence in `tokens/native/`, plus `tokens/provenance.json` integrity (source/target sha-256 pinning is the drift authority — the release stamp is informational, since natives regenerate on *token* change, not on every version bump; counts, zero skipped). `window.__tokenpipe.pass` must be true.

- **`token-format-parity.html`** — cross-format token parity gate (in the fast runner, Jul 2026 hardening): every `--cs-*` declaration in `tokens/*.css` equals its mirror in `tokens.json`, `tokens.js` (live ESM import, deep-equal vs the JSON), and DTCG (via `$extensions["com.cyberskill"].css` else the typed transform) — base `:root` + dark/system themes + 15 element packs + 15 dark packs; plus the manifest's 4 duration values equal `motion.css` (the reduced-motion 0ms compiler-bug guard). `window.__tokenformat.pass` must be true. Run after any token change.

- **`font-face-integrity.html`** — type-layer gate (fast runner): every `@font-face` in `tokens/fonts.css` is self-hosted under `fonts/` (relative `../fonts/*.woff2`, no CDN), subset-split with `font-display: swap`, and resolves to bytes that start with the `wOF2` magic; every family a `--cs-font-family-*` token names first has faces here **including the Vietnamese subset** (`U+1EA0-1EF9` — the brand anchor), and no self-hosted family is nameless; `_ds_manifest.json` `fonts[]` matches the parsed faces entry-for-entry and `brandFonts[]` matches the token-named family set; every family loads for real through `document.fonts`; and `.cs-display-face` retargets `--cs-heading-family` to `--cs-font-family-display` without leaking onto body copy. `window.__fontface.pass` must be true. Run after any change to `tokens/fonts.css`, `fonts/`, or a family token.

- **`dtcg-typing.html`** — emitted-value profile pinned to the DTCG 2025.10 Format and Color Community Group reports. Validates every leaf's value, nested typed aliases, cycles, shadow fields and provenance counts. The profile supports the seven repository-emitted types and sRGB; unsupported types, `$ref` and `$extends` fail explicitly. It is not a general DTCG reader, extension adapter or live import certification. `npm run tokens:validate:dtcg` checks current data and exits nonzero on violations; `npm run test:dtcg-profile` tests the validator and actual browser gate with valid/invalid fixtures. A passing validator regression does not mean the current export passes. Base values now pass the typed profile; F12 live-tool and scope-extension interoperability remain open. The token-format gate also rejects typed-value/CSS-extension mismatches.

- **`version-stamp.html`** — every stamp equals `VERSION` (auto-bumps on main): `package.json`, `tokens.json`/`tokens.js` metas, DTCG `$extensions`, `provenance.json` release + dtcgStamp, and `DESIGN.md` front matter. `window.__versionstamp.pass` must be true.

- **`support-runtime-identity.html`** — fetches all <!-- cs-count:templates -->85<!-- /cs-count --> `templates/*/support.js`, sha-256s each (SubtleCrypto), asserts exactly **one** unique hash + copy count == manifest template count (the DC runtime is byte-identical per compiler contract — a second hash means a hand edit or stale copy). Canonical source: `templates/_vendor/support.js` synced via `node scripts/sync-support-runtime.mjs`. CSP-safe (no Function-constructor / `eval(` — see `_audit/ci/test-support-no-eval.mjs`). `window.__supportid.pass` must be true.

- **`print-smoke.html`** — whole-set print-path gate: every `omelette-owns-print` template must also declare A4/Letter `@page`. Paired with Node export coverage in `_audit/ci/test-doc-export.mjs` (PDF + DOCX under site CSP) and HR DOCX↔DC fixtures in `_audit/ci/test-docx-source-parity.mjs`.

- **`package-exports-integrity.html`** — packaging gate: every `package.json` `files`/`module`/`types`/`style`/`exports` target exists, every entry-point target is pack-covered by `files`, dual ESM entries (`_esm/react.mjs` default + `_esm/cs.mjs` legacy) are ESM-shaped, and their re-exports ⊆ the bundle header's exposed exports. `window.__pkgexports.pass` must be true.

- **`test-subtree-consume.mjs`** (Node unit, `npm run test:subtree-consume`) — copies the declared CSS/font/ESM/bundle subset with `_vendor/react/` and provided notices to a temporary tree. Chromium, Firefox and WebKit mount the legacy ESM consumer and execute the actual EN/VI classic-script recipes with external requests rejected. Missing local runtimes must fail; no intended agent-host behavior or rights acceptance is inferred.

- **`template-lang-parity.html`** — bilingual-source gate over all <!-- cs-count:templates -->85<!-- /cs-count --> `.dc.html`: en/vi hole-map key parity (21 map templates), `sc-if` `isEN`/`isVN` branch pairing (24), every `language`-tweak template has a mechanism, and an EN-leak lexicon (email chrome · Skip to content · Statement of work · Performance improvement plan · Change note · …) must not appear outside `isEN` guards / the `en` map. `<title>` and HTML comments (including `@template name`) are masked as catalog chrome (FIND-125). The 41 VN-first stacked instruments are leak-exempt **by design** (both languages always render — no hidden-language mode). `window.__langparity.pass` must be true.

- **`design-md-parity.html`** — rebuilds the root `DESIGN.md` in-browser via the same `scripts/design-md-lib.mjs` the generator uses (DTCG + manifest + `VERSION` inputs) and asserts **byte equality** plus per-token row matches. Manual edits and stale regenerations fail; fix with `npm run build:design-md`. `window.__designmd.pass` must be true.

- **`bundle-freshness.html`** — browser replication of `ci/check-bundle-freshness.mjs`: re-hashes every source recorded in the `_ds_bundle.js` header and asserts header equality + manifest component sources ⊆ header. The Node script remains the CI authority (it also discovers **new** files by walking the tree). `window.__bundlefresh.pass` must be true.

- **`a11y-gate.html`** — a11y interaction gate (in the fast runner): Dialog/Drawer/AlertDialog focus management (initial focus · Tab trap · restore-on-close · Escape), roving tabindex (Tabs · SegmentedControl · Menubar), combobox `aria-activedescendant`, role/label contracts (Rating · InputOTP · DataGrid `aria-sort` · Carousel · Popconfirm · live regions), plus open-state keyboard/focus for Cascader · TreeSelect · Tour · HoverCard · ContextMenu (pairs with axe force-open surfaces). `window.__a11y.pass` must be true; loads the bundle — rebuild and check its freshness after source changes.

- **`light-contrast.html`** — **hard** light-mode DOM contrast walk (mirrors `theme-overflow`): leaf text over solid backgrounds must meet WCAG AA @1280. `window.__lightcontrast.pass`.

- **`no-third-party.html`** — **hard** product-surface origin gate: templates · kits · Atomic View must not load scripts from CDN; React + Babel vendored under `_vendor/`. `window.__nothirdparty.pass`.

- **`axe-smoke.html`** — **hard** axe-core 4.10.0 gate (vendored at `_audit/vendor/axe.min.js`, no CDN): mounts every public primary via `_audit/lib/axe-fixtures.js` (bilingual EN·VI; Cascader / TreeSelect / Menubar / Combobox expanded before the scan) and fails on any serious/critical WCAG 2 A/AA violation (Storybook a11y enforcement without a separate test-runner). Inventory lock: `_audit/ci/test-axe-coverage.mjs`. `window.__axesmoke.pass` must be true.

- **`qr-scan-test.html`** — **advisory** QR reader-scan sanity: renders `QRCode`, rasterizes with a quiet zone, decodes with pinned local jsQR 1.4.0, asserts exact UTF-8 byte round-trip (incl. Vietnamese). `window.__qrscan`. Hosted regression checks run under deployment CSP without network access. `npm run test:qr` also decodes every supported byte length/version and damaged modules independently.

## Forcing states for verification (from a frame's own context)
- **Language:** `win.__dcSetProps(win.__dcRootName(), { language: "Tiếng Việt" })`

- **Theme:** `win.__dcSetProps(win.__dcRootName(), { theme: "dark" })` (the DC binds `data-theme`; a `postMessage` is overridden by the prop)
- **Any prop:** `win.__dcSetProps(win.__dcRootName(), { element: "Hỏa · ember" })`

Note: these force a live re-render — a good way to catch reconcile bugs (a `TextField` given a value as **children** crashes with React #137 on re-render; pass `default-value`, and see the void-element API rule in `docs/conventions.md`).
Screenshots of iframe-based harness pages don't capture nested-iframe content (html-to-image limitation) — verify by reaching into `iframe.contentDocument`, or load a single template directly and screenshot that.

### Whole-set frame readiness

Responsive, language and theme sweeps share `lib/frame-probe.js`. Each frame waits for the actual mounted DC root, required stylesheets (including imports), font readiness and its gate-specific settling period. Duplicate load events cannot start competing measurements. Every navigation/bootstrap/style/measurement timeout or exception is a failed row with source, phase and root diagnostics; it never becomes a synthetic zero measurement. Empty or invalid manifests fail.

`test-frame-probe.mjs` verifies delayed mount/style readiness, duplicate loads, unavailable bootstrap/styles, cancellation of timed-out work, cleanup and failed manifests/documents. The language sweep separates templates with a Vietnamese language switch from static-content templates, instead of claiming an unsupported switch was applied. Run the full responsive, language and theme sweeps sequentially when diagnosing shared-resource failures; retain original failures and report test environment limits.

- **Style Dictionary interchange** — `test-style-dictionary-adapter.mjs` checks lossless aliases/metadata/scope retention and fail-closed handling of missing/changed leaves. `test-style-dictionary-integration.mjs <package-directory>` runs two real imports against pinned Style Dictionary 5.5.5; CI installs it in an isolated directory with scripts disabled. The optional base CSS formatter is not a replacement for runtime scope composition in `styles.css`.

### Touch targets and sampled hit ownership

`npm run test:touch-inventory` measures the primary component fixtures and their
discovered panels at 320/390/1280 widths, both languages, densities and themes.
It also checks the center and four axial points inset 1px from a centered 44px
square with `elementFromPoint`. The scroll position accounts for DataGrid's
sticky header. Inert backgrounds, the ContextMenu trigger beneath its open menu,
and the original image beneath its modal preview are recorded separately.
Corner samples remain diagnostic because rounded shapes need not own their
bounding-box corners. These finite samples do not certify continuous hit areas,
every prop state, native activation, or human accessibility acceptance.

Use `CS_TEST_BROWSER=firefox` or `CS_TEST_BROWSER=webkit` for the other engines.
Pass `--evidence=<path>.json.gz` to the underlying script to retain compressed
measurements. The separate `test:touch-actions`, optional/supplemental control,
trigger, DataGrid and template action regressions verify actual activation in
their declared scopes.

`npm run test:narrow-forms` checks DatePicker, Transfer and NavigationMenu at the
same three requested widths, with fine and coarse pointers, both languages,
densities and themes. It checks actual document width, both popup edges, live
viewport resizing, panel switching, date/month selection, link activation and
transfers in both directions. Requested, layout and document widths are separate
fields in the hit-inventory evidence so mobile viewport expansion cannot hide
page overflow.

### CI outcome reports

`ci/ci-verdict.mjs --assert-report <report.json>` requires typed, explicit outcome
flags. Executed reports provide `ok: true` or `ok: false`; a skipped report has
`skipped: true` and a nonempty reason. Malformed or contradictory reports fail,
and an explicit failed operation exits 1 with a failure annotation. Successful
dry runs (`dryRun: true`), local packs (`localPack: true`) and readiness checks
`kind: "readiness"` retain distinct labels. Native secret-presence checks are
readiness checks; they do not prove a signed build or store upload.

Decision 1C still allows optional soft-skips to exit 0. Their summary and
annotations remain visibly different from live success, including the existing
protected-ref annotation. `npm run test:ci-verdict` exercises these outcomes and
invalid report shapes across local, pull-request, main and scheduled contexts,
then replays actual isolated native reports without a live
service operation. This local check does not certify remote workflow settings.

- **`npm run test:doc-reader-touch`** — three-engine actual Documentation Library check for all 46 EN/VI routes at 320/390/1280px, both themes and densities. Measures every sidebar, active navigation, article and CyberSkill-result link; requires 44px box/clipped bounds and the existing 42px inset DOM ownership probe, intercepted native center targeting, actual pointer/keyboard route activation, native link-navigation focus (Option-Tab in WebKit), and preserved fine-pointer control dimensions. The 1px guard, continuous/subpixel ownership, OS finger adjustment, destination correctness and human acceptance remain separate. Optional `--evidence=PATH.json.gz` captures the actual scope rows.

- **`npm run test:token-viewer`** — actual public token viewer in Chromium, Firefox and WebKit: both complete source record sets (`tokens/tokens.dtcg.json` and `tokens/tokens.json`, including scoped overrides and densities), every visible authored control at320/390/1280px across light/dark/System and both densities, plus320x568. Requires44px boxes/clipping and the inherited guarded42px DOM disk; exact layout/pointer-mask equality before proof reuse. Verifies every path/value native action at390px, all groups, mode/search/source, focus, computed body/control contrast, source loading/error/stale-response ownership and copy fallback focus. Memory-only clipboard/fallback observers; actual OS popups/clipboard/devices/AT, continuous guard ownership and human acceptance remain separate. Each driver accepts `--evidence=PATH`; the geometry driver also supports gzip.
