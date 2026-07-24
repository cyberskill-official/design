# Quality gates — the benchmark reference

Every deterministic quality gate in the system, what it asserts, its pass criterion, whether it blocks (hard) or informs (advisory), and where it runs.

**Where gates run.** *Fast board CI* = the `fast-gates` job in `.github/workflows/design-system-gates.yml`, which serves the repo and drives `_audit/run.html` headless via `_audit/ci/run-gates.mjs` (every push/PR + nightly + manual) — new board rows are picked up automatically. Two gates additionally run standalone as *merge blockers* (`docs-consistency-blocker` job, via `_audit/ci/run-single-gate.mjs`). *Whole-set CI* = the `whole-set-audits` job (every push/PR + nightly — owner decision B). *Unit test* = `npm run test:unit` in the `unit-tests` job (plain Node, no browser). *Node pre-checks* = the `node-prechecks` job (browser-free authorities: bundle freshness, DESIGN.md freshness) plus the `token-provenance` job. Every browser gate publishes a verdict global (`window.__*`) that the headless runners read.

## Fast board — 31 gates in `_audit/run.html`

| Gate | File | What it asserts | Pass criterion | Type | Where it runs |
|---|---|---|---|---|---|
| Contrast guard | `_audit/contrast-guard.html` | No base rule paints umber on a themeable surface without a dark override; every semantic text×surface pair scores in light and dark | 0 unshielded rules and 0 failing pairs (`__contrastguard`) | Hard | Fast board CI |
| Three-axes guard | `_audit/axis-guard.html` | No live source reintroduces the retired Expression/Density product surface | 0 hits across manifest-indexed sources (`__axisguard`) | Hard | Fast board CI |
| Manifest CSS paths | `_audit/manifest-css-guard.html` | Every `_ds_manifest.json` `globalCssPaths` entry exists as raw CSS; every `styles.css` `@import` is listed | 0 missing / 0 unlisted (`__cssguard`) | Hard | Fast board CI |
| Docs consistency | `_audit/docs-consistency.html` | Every count claim in README/SKILL/llms.txt matches the compiler manifest; `VERSION` + `package.json` pinned 1.0.0; no changelog-file reference; stale-phrase blacklist (the retired suite/pack counts the Jul 2026 audit removed) clean across README/SKILL/llms + `docs/*.md` (historical notes under `_audit/archive/` are not scanned); `DESIGN.md` exists with front-matter version = `VERSION`; agent routing honesty — Claude path cites `_esm/cs.mjs` + bundle prefix; Stitch path forbids `*.dc.html` as SoT; package name `@cyberskill/design` | 0 mismatched claims, 0 blacklist hits, pin + stamp + routing intact (`__docs`) | Hard | Fast board CI + merge blocker |
| Docs language parity | `_audit/docs-lang-parity.html` | Every operator-facing EN `docs/*.md` has a `docs/vi/` counterpart; VI is not an empty/TODO stub (≥40% EN length); stale-phrase blacklist clean on both EN and VI (historical notes under `_audit/archive/` are not tracked) | 0 missing pairs, 0 stubs, 0 blacklist hits (`__docslangparity`) | Hard | Fast board CI |
| DESIGN.md parity | `_audit/design-md-parity.html` | The root `DESIGN.md` (Stitch open-spec surface) byte-equals an in-browser regeneration from `tokens.dtcg.json` + `_ds_manifest.json` + `VERSION` via the shared `scripts/design-md-lib.mjs`; every one of the 138 token rows re-checked individually | Byte-identical + 0 drifted rows (`__designmd`) | Hard | Fast board CI |
| Version stamp | `_audit/version-stamp.html` | `package.json`, `tokens.json`/`tokens.js` metas, DTCG `$extensions`, `provenance.json` release + dtcgStamp, and `DESIGN.md` front matter all equal `VERSION` (1.0.0 pin) | All 8 stamps equal (`__versionstamp`) | Hard | Fast board CI |
| Namespace portability | `_audit/namespace-portability.html` | No manifest-indexed source hardcodes the compiler's project-id bundle suffix | 0 hardcoded suffixes (`__nsguard`) | Hard | Fast board CI |
| Token contract | `_audit/token-contract.html` | All 15 element×variant scopes resolve all 9 `--cs-accent-*` roles; core semantic tokens resolve | 0 missing roles, 0 missing core tokens (`__contract`) | Hard | Fast board CI |
| Token pipeline | `_audit/token-pipeline-test.html` | Every DTCG-derived constant appears verbatim in all three `tokens/native/` targets; provenance sha-256 matches the DTCG source | 0 drifted constants, hash match (`__tokenpipe`) | Hard | Fast board CI |
| Token format parity | `_audit/token-format-parity.html` | Every `--cs-*` declaration in `tokens/*.css` equals its mirror in `tokens.json`, `tokens.js` (live ESM deep-equal), and DTCG (ext-css string or typed transform) — base `:root` + dark/system themes + 15 element packs + 15 dark packs; the 4 `_ds_manifest.json` durations equal `motion.css` (guards the reduced-motion 0ms compiler bug) | 0 diffs across all scopes (`__tokenformat`) | Hard | Fast board CI |
| DTCG typing | `_audit/dtcg-typing.html` | Every DTCG `$value` leaf carries a W3C `$type`; every `{alias}` resolves (chains followed, no cycles); every shadow token is a structured object/array with full layer fields; byType counts equal `provenance.json` | 0 untyped / dangling / string shadows (`__dtcgtyping`) | Hard | Fast board CI |
| Story coverage | `_audit/story-coverage.html` | Every primary bundle export has an Atomic View story (`guidelines/atomic-view.html`) | 0 missing stories (`__storycov`) | Hard | Fast board CI |
| Consumer smoke test | `_audit/consumer-smoke-test.html` | The external consumer path works: `styles.css` + `_ds_bundle.js` mount real components and brand tokens reach a rendered Button | Mount + token assertions all pass (`__smoke`) | Hard | Fast board CI |
| Bundle freshness | `_audit/bundle-freshness.html` | Every source recorded in the `_ds_bundle.js` header re-hashes to the header's sha-256 (browser replication of `ci/check-bundle-freshness.mjs`; the Node script stays the CI authority and additionally discovers new files); manifest component sources ⊆ header | 0 drifted / missing sources (`__bundlefresh`) | Hard | Fast board CI (+ Node authority in `node-prechecks`) |
| ESM smoke test | `_audit/esm-smoke-test.html` | `_esm/cs.mjs` imports without a build, re-exports every manifest component, and a mounted Button receives brand tokens | Export/manifest parity + token check (`__esm`) | Hard | Fast board CI |
| Package exports integrity | `_audit/package-exports-integrity.html` | Every `package.json` `files` entry and every `module`/`style`/`exports` target exists; every entry-point target is covered by `files` (pack-safe); `_esm/cs.mjs` is ESM-shaped and its `CS.*` re-exports ⊆ the bundle header's exposed exports | 0 missing / uncovered / unknown (`__pkgexports`) | Hard | Fast board CI |
| Component children | `_audit/component-children-test.html` | Void-element components (Checkbox, Radio, Switch, SearchField, NumberField, Slider, Divider, TextField) mount with stray children without throwing React #137 | 0 throws (`__result.anyThrew === false`) | Hard | Fast board CI |
| Component behavior | `_audit/component-behavior-test.html` | 35 real interaction assertions — toggles, controlled selection, palette filtering, overlay open/close, Form rules, Tree/Splitter/keyboard | 35/35 assertions pass (`__behavior`) | Hard | Fast board CI |
| A11y interactions | `_audit/a11y-gate.html` | Focus management (Dialog/Drawer trap + restore + Escape), roving tabindex, combobox `aria-activedescendant`, role/label contracts | All keyboard/ARIA assertions pass (`__a11y`) | Hard | Fast board CI |
| A11y CSSOM | `_audit/a11y-harness.html` | Every interactive `.cs-*` control meets its documented touch-target floor under coarse pointer; focus-ring, reduced-motion, and contrast rules proven in source CSS | 0 floor violations, all source proofs found (`__a11ycss`) | Hard | Fast board CI |
| Template schema v2 | `_audit/template-schema-test.html` | Every `content-schema.json` sidecar validates against the JSON Schema and every declared slot id resolves to a real `{{ hole }}` in its template | 0 invalid sidecars, 0 dangling slot ids (`__schemav2`) | Hard | Fast board CI |
| Support runtime identity | `_audit/support-runtime-identity.html` | All `templates/*/support.js` copies (one per template, 84) are byte-identical: sha-256 via SubtleCrypto, exactly one unique hash, copy count == manifest template count | 1 unique hash, count match (`__supportid`) | Hard | Fast board CI |
| Bilingual parity | `_audit/bilingual-parity.html` | Every component in `components/_i18n/strings.js` has en + vi tables with equal key sets and no empty values | 0 missing/extra keys, 0 empty values (`__bilingual`) | Hard | Fast board CI + merge blocker |
| Template language parity | `_audit/template-lang-parity.html` | Static source scan of all 84 `.dc.html`: en/vi hole-map key sets identical and non-empty (21 map templates); `sc-if` `isEN`/`isVN` branches paired (24 branch templates); every `language`-tweak template has a bilingual mechanism; EN-leak lexicon (Unsubscribe · View in browser · Preferences · All rights reserved · Manage subscription · Sent with) never appears outside `isEN` guards / the `en` map. VN-first stacked instruments (37 `vn-*` + 3 `doc-*`) are leak-exempt by design — both languages always render | 0 key drifts, 0 unpaired branches, 0 leaks (`__langparity`) | Hard | Fast board CI |
| APCA dark packs | `_audit/apca-dark-preview.html` | All 15 element×variant packs hold their APCA targets in dark (bright-as-text ≥ 75, accent UI ≥ 60, ink-on-accent ≥ 75, ink-on-tint ≥ 75) | 0 current failures (`__apcaPreview.currentFail === 0`) | Hard | Fast board CI |
| Visual baselines | `_audit/visual-diff.html` | Template baselines exist and are loadable for side-by-side / overlay comparison | Baselines present; drift judged by eye (`__visualdiff`) | Advisory | Fast board CI |
| Component baselines | `_audit/component-visual-diff.html` | 12 curated component crops anchor the atomic tiers for visual comparison | Crops render + baselines present (`__componentVisualDiff`) | Advisory | Fast board CI |
| Axe smoke | `_audit/axe-smoke.html` | axe-core 4.10.0 (vendored at `_audit/vendor/axe.min.js`) serious/critical rules on a mounted bilingual component cluster | 0 serious/critical findings (`__axesmoke`) | Hard | Fast board CI |
| Print smoke | `_audit/print-smoke.html` | Document templates declare the print-ownership meta and `@page` CSS hooks the export path relies on | 0 documents missing print hooks (`__printsmoke`) | Hard | Fast board CI |
| Pixel CI | `_audit/pixel-ci.html` + `_audit/ci/pixel-diff.mjs` | 15 curated baselines exist; Playwright capture script performs real % pixel compare; last report must be clean (`drifted[]` empty) | Contract + clean compare (`__pixelci.pass`); drift or missing report fails | Hard | Fast board CI (compare step feeds the row) + `pixel-diff` job |

## Whole-set audits — every template, every axis

| Gate | File | What it asserts | Pass criterion | Type | Where it runs |
|---|---|---|---|---|---|
| Responsive overflow | `_audit/responsive-overflow.html` | Every template (84) + 3 UI kits render at 390 px without horizontal document overflow | 0 overflowing surfaces (`__overflow`) | Hard | Whole-set CI (every PR + nightly) |
| Language overflow | `_audit/language-overflow.html` | Same set forced to Tiếng Việt: VN applies, no overflow, no clipped text in fixed/nowrap boxes | 0 over/clip, 0 VN-not-applied (`__language`) | Hard | Whole-set CI (every PR + nightly) |
| Theme overflow | `_audit/theme-overflow.html` | Same set forced dark: dark applies, no document overflow, and no reproducible solid-bg leaf-text WCAG fails outside `REVIEWED_OK` | Dark applied + 0 overflow + 0 open contrast (`__theme`) | Hard (allowlisted near-misses only) | Whole-set CI (every PR + nightly) |

## Node pre-checks (browser-free)

| Gate | File | What it asserts | Pass criterion | Type | Where it runs |
|---|---|---|---|---|---|
| Token provenance | `_audit/ci/check-token-provenance.mjs` | `tokens/native/` + `tokens/provenance.json` are in lockstep with `tokens/tokens.dtcg.json` (same sha-256 drift authority as the token-pipeline gate) | Exit 0 on hash match | Hard | CI `token-provenance` job |
| Bundle freshness (authority) | `_audit/ci/check-bundle-freshness.mjs` | The committed `_ds_bundle.js` was built from the component sources as they exist now — full source discovery (walks `components/`, `ui_kits/`, root sources), so new/deleted files are caught too, which the browser row cannot do | Exit 0, 0 drifted/new/deleted sources | Hard | CI `node-prechecks` job |
| DESIGN.md freshness | `scripts/generate-design-md.mjs --check` | The root `DESIGN.md` byte-equals a fresh regeneration from DTCG + manifest + `VERSION` | Exit 0 on byte match | Hard | CI `node-prechecks` job |

## Unit tests — `npm run test:unit` (8)

| Test | File | What it asserts | Pass criterion | Type | Where it runs |
|---|---|---|---|---|---|
| Nav model | `_audit/ci/test-nav-model.mjs` | The shipped `guidelines/nav-model.js` classify/group logic behaves (drives the real module) | All assertions pass (exit 0) | Hard | Unit test |
| Health/Tokens UI contract | `_audit/ci/test-health-tokens-contract.mjs` | Structural contracts of the Health + Tokens HTML entry points hold | All assertions pass (exit 0) | Hard | Unit test |
| Form paths | `_audit/ci/test-form-paths.mjs` | Form path helpers behave (drives the shipped `Form.jsx` via dynamic import) | All assertions pass (exit 0) | Hard | Unit test |
| Storybook contract | `_audit/ci/test-storybook-contract.mjs` | Live hub is Storybook only; SB10 ESM main + addon-docs/a11y; complete CSF for every public primary; Matrix/AllVariants + AllSizes when `argTypes.size`; States/Matrix cover disabled/loading/error/busy; every discrete size/variant enum mounted; FullMatrix required when ≥2 of {size, variant, state} axes exist | All assertions pass (exit 0) | Hard | Unit test |
| Figma push helpers | `_audit/ci/test-figma-push-helpers.mjs` | Pure helpers in `push-figma-variables.mjs` behave (no network, no secrets) | All assertions pass (exit 0) | Hard | Unit test |
| Code Connect helpers | `_audit/ci/test-code-connect.mjs` | 99 primaries, node-map/render helpers, soft-skip classifiers, committed `figma.config.json` + high-traffic `.figma.tsx` | All assertions pass (exit 0) | Hard | Unit test |
| Native samples | `_audit/ci/test-native-samples.mjs` | SwiftUI / Compose / Flutter sample apps each have ≥ 3 screens, reference generated token constants, and ship Fastlane store scaffolds (submit disabled) | All assertions pass (exit 0) | Hard | Unit test |
| Subtree consume | `_audit/ci/test-subtree-consume.mjs` | Portable copy of `styles.css` + `base/` + `tokens/` + `fonts/` + `_esm/` + `_ds_bundle.js` (no full clone) still resolves tokens/fonts and mounts a Button via ESM — Stitch/Claude subtree-copy path | All assertions pass (exit 0) | Hard | Unit test |

The `test:unit` suite is wired into the CI workflow as part of the July 2026 hardening change (it previously only ran locally).

## Sync / distribution jobs (soft-skip)

Soft-skip means the job exits 0 with a report when secrets/plan/API cannot complete the real write — **not** that Code Connect or Figma Variables are live. npm CI publish uses Trusted Publishing; soft-skip covers auth/conflict honesty. Treat remaining maintainer tasks in `docs/decisions.md` as the open list (Code Connect deferred; consumer grant is in `docs/consumer-grant.md`). Schema sidecars and Storybook `FullMatrix` grow opportunistically when a primary already qualifies — not as a mass-add pass.

| Job | Script / workflow | What it asserts | Soft-skip when | Where it runs |
|---|---|---|---|---|
| Figma Variables | `_audit/ci/push-figma-variables.mjs` + `figma-variables-push` job | Secrets open the file; optional Variables write | Soft-skip when secrets missing (same honesty as Code Connect) or non-Enterprise / missing `file_variables:*` scopes / API **403** after secrets are present. Soft-skip ≠ live sync | `main` push + manual |
| Code Connect | `_audit/ci/code-connect-publish.mjs` + `code-connect` job | Config + 99 mappings; optional publish | Missing `FIGMA_TOKEN`/`FIGMA_FILE_KEY` or API 403/404/429 | PR + `main` + manual |
| npm publish | `_audit/ci/npm-publish.mjs` + `npm-publish.yml` | Pack-safe `files`/`exports`; `npm publish` via OIDC Trusted Publishing (tokens disallowed on package) | Auth / 403 / 404 / EOTP / version conflict | `workflow_dispatch` / `v*` tags |
| Native store | `_audit/ci/native-store-dry-run.mjs` + `native-store.yml` | Fastlane scaffolds + metadata; signed-release secrets check | Missing `ASC_*` / `PLAY_SERVICE_ACCOUNT_JSON` (submit always disabled) | PR + `main` (paths) + manual |

## Registry consumer smoke (hard)

| Job | Script / workflow | What it asserts | Pass criterion | Where it runs |
|---|---|---|---|---|
| npm-hello smoke | `examples/npm-hello` + `npm-hello-smoke` job | Public registry install of `@cyberskill/design@1.0.0` resolves package name + exports (`npm ci` + `npm run smoke`) | Exit 0 (**hard fail** — not soft-skip) | Path-filtered push/PR + nightly + manual |

## July 2026 hardening — delivered

The eight gates the audit planned (token-format-parity, version-stamp, support-runtime-identity, package-exports-integrity, template-lang-parity, dtcg-typing, bundle-freshness, design-md-parity) are now **implemented** — see their rows in the fast-board and Node-pre-check tables above. All are wired into `_audit/run.html`, `_audit/index.html`, and the CI workflow (`fast-gates` picks the board rows up automatically; `node-prechecks` + `unit-tests` are new jobs). Operators browse Health via Storybook **Status** (full-bleed `_audit/run.html`) and the audit index at `_audit/index.html` — `dashboard.html` is redirect-only and has no Health tab. The docs-consistency gate carries the stale-phrase blacklist (retired suite/pack counts) + `DESIGN.md` stamp extensions described in its row. The docs-lang-parity gate locks the `docs/vi/` mirror.

## Human-reviewed, never automated

- **Brand voice / copy** — warm · direct · honest · respectful is judged by a human, not a regex.
- **Legal template content** — counsel reviews the instruments; gates only check structure, bilingual mechanics, and print geometry.
- **Pixel-diff baselines** — Playwright `%` drift auto-fails (hard). After intentional redesigns, refresh `_audit/baselines/` with `pixel-diff.mjs --update` and commit. Side-by-side visual / component review pages stay advisory (judgment by eye).
- **Component API design review** — prop naming and ergonomics are reviewed by the owner, not asserted.
