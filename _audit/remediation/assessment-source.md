# CyberSkill design system: assessment and roadmap

Date: 2026-10-20. Repository: `@cyberskill/design` at commit 2ed516c7 (VERSION 1.7.2, branch main, clean tree). Goal under assessment: a production-ready, agent-agnostic design system that humans and different AI agents can understand, use and extend without depending on any single agent, vendor or proprietary workflow.

No repository file was modified during this assessment. Every command run was read-only, and the working tree was checked clean after each phase.

## 1. Verdict

The system is far stronger than its own documentation admits, and that gap is the first thing to fix. The engineering substance is unusual for a one-person project: 106 React components, each with a declaration and a prompt file; a token pipeline where every derived artifact regenerates deterministically with a byte-exact check; an overlay manager that owns stacking, inert, Escape and focus restore for 27 components; a built-in string registry with enforced EN/VI parity; focus-indicator and touch-target checks that measure rendered pixels across every element, theme and density; three-engine Playwright coverage; SHA-pinned CI with OIDC publishing; and 85 document templates that render, switch language and export DOCX with nothing but a static server and a browser.

What stands between this and an agent-agnostic system is mostly not missing code. It is that the knowledge an agent needs is held in prose, in one person, and in a few vendor-shaped conventions:

- The agent router (`SKILL.md`), `README.md`, `CONTRIBUTING.md`, `llms.txt`, `docs/consuming.md` and the generated template inventory all state that the 85 `.dc.html` templates require a proprietary "Design Components compiler". The repository ships its own runtime that renders all 85 in Chromium, Firefox and WebKit in CI. Six independent verifiers confirmed this. Any agent that trusts the router will refuse to use 97 percent of the templates.
- There is no machine-readable component contract beyond prop types. Anatomy, states, slots, keyboard behavior, ARIA requirements, CSS hooks and defaults exist only as free prose and inside the JSX.
- Validation is enormous (249 test scripts, 43 gate rows) but is driven by a 228-command shell string that stops at the first failure, an HTML page as the merge authority, Linux-only pixel baselines, and no single `verify` command with a machine-readable result.
- Governance is built for exactly one person. The lifecycle gate hard-fails on any owner name other than "Stephen Cheng", main accepts direct pushes of 1,600-file commits with zero reviews, the auto-bump workflow was deleted on 2026-10-17 while five documents still promise it, the "1.7.2" label now identifies four different artifacts, and the package is UNLICENSED with a grant that no partner is party to.
- The npm package ships raw JSX as its default entry, a 15.9 MB tarball of which roughly 60 to 78 percent is not library code, no `engines` field, no typed token export, and no bundler example.

None of these require a rewrite. The roadmap in section 9 is ordered so that the first two weeks remove the false statements and the single-person locks, the next quarter converts prose into checkable specs, and the longer horizon addresses packaging, CSS architecture and templates.

### Scorecard

| Dimension | State today | Main blocker for the agent-agnostic goal |
|---|---|---|
| Tokens and theming | Strong: deterministic generators, byte-exact checks, seed-driven element packs with encoded contrast floors | Adding one token fails with an undocumented remedy; every mode exists only inside a vendor extension of the DTCG export |
| Component APIs | Solid at the file level (props and declarations never drift) | No written API grammar; no ref policy; 59 components accept only `className`; one real runtime defect |
| Interaction and accessibility | Above average foundation (focus, overlay stack, i18n, touch) | Forced-colors leaves Switch, Tabs and SegmentedControl state invisible; six other APG deviations; no per-component a11y contract |
| CSS and responsiveness | Disciplined where gated; tokenized breakpoints and typography | No cascade layers or override contract, no browser floor, no CSS lint, no component-to-stylesheet map |
| Templates and content | 85 templates run in-repo; content schema is formal and gated | Docs deny the runtime exists; no headless render CLI; content is hard-coded, not data-bound; `html lang` never syncs |
| Build and distribution | Reproducible bundle, tarball-based consumer tests, OIDC publish | Raw-JSX entry, oversized tarball, write-mode `prepublishOnly`, no engines or build graph |
| Testing and CI | Vast coverage, hardened workflows | No machine-readable results, HTML board as merge gate, Linux-only baselines, no `npm run verify` |
| Documentation | Strong doc tooling (parity, authority and count gates) | 26,000-word hedged chain, rules restated in four to seven files, vendor-keyed guidance, references to documents that do not exist |
| Storybook and site | Complete CSF3 coverage, freshness fingerprint, allowlisted host | Zero interaction tests; boilerplate hides component docs; no static HTML snippets |
| Governance | Decision log, hashed support records, branch protection on two checks | Single hard-coded owner; no required review; release drift; unclear license |
| Architecture | Generated artifacts fresh; bundle and template runtime rebuildable in-repo | Read-modify-write generator chain; overlay singleton; three APCA implementations; monolith with 252 npm scripts |

## 2. Method and coverage

Eleven independent audits ran, one per dimension, each with read-only access and permission to run existing check scripts. Because the first two runs were interrupted, seven dimensions were audited twice by independent agents; where both passes agree, that is noted. Every DEFECT and every medium-or-high GAP (122 items) was then handed to an adversarial verifier instructed to reproduce the cited evidence, look for an existing test or decision record that already covers it, and judge whether it matters for the stated goal. A final critic looked for areas no auditor inspected and reconciled contradictions between auditors.

Totals: 181 findings. 60 defects hold (18 with severity lowered by the verifier), 1 defect was refuted, 55 gaps hold (17 lowered), 42 improvements and 16 unverified items were recorded without verification. Refuted and lowered claims appear in appendix B rather than being silently dropped.

What was run: every generator `--check` twin (all pass), the fast Node checks (`test:api-index`, `test:token-declarations`, `test:token-coverage`, `test:repository-skills`, `test:docs-lang-parity`, `test:types`, `test:card-metadata`, `test:manifest-coverage`, `test:pack-hygiene`, `test:guidance-authority`, `test:health-claims`, `test:ci-verdict`, `test-base-hex-allowlist`, `test-docs-consistency`, `test-runtime-props`, `test-prop-parity`, `test-storybook-contract`, `test-storybook-freshness`, `test-component-lifecycle`, all pass), `npm pack --dry-run`, `npm view`, the GitHub API for branch protection and releases, single-template Playwright bootstraps, and scratch reproductions (NumberField `defaultValue`, ref forwarding under React 19, `html lang` sync, forced-colors emulation, a consumer `.card` override at 320 px, adding one CSS token to a fixture copy).

What was not run: the full `npm run test:unit` (multi-hour, three engines), Storybook builds, native toolchains, visual pixel comparison, any screen reader, any legacy browser. Claims that depend on those are marked unverified in appendix B.

## 3. Strengths to preserve

These are the parts of the system any roadmap should build on rather than replace.

- Deterministic token pipeline. `tokens/*.css` plus `tokens/element-seeds.json` regenerate `elements.css`, `tokens.json`, `tokens.js`, `tokens.dtcg.json`, `declarations.json`, `provenance.json`, three native files and the contrast report, each with a byte-exact `--check`. The element pack generator encodes WCAG 4.5 and APCA 78 floors and a hue-lock self-check (`scripts/generate-element-packs.mjs`).
- Theme composition in CSS alone. `scripts/lib/theme-resolver.mjs` binds every public token under one `:is()` selector with private light and dark channels, so theme, element, density and contrast compose without JavaScript and without `!important`.
- File-level contract integrity. Every destructured runtime prop must be declared (`test-runtime-props`), every declared prop must appear in a story (`test-storybook-contract`), declarations compile strictly against React 18 and 19 types from the packed tarball (`test-types`), and all 106 prompt files share the same five-part shape.
- One overlay engine. `components/overlays/OverlayManager.jsx` handles stacking by DOM containment, background inert, a single Escape owner with IME guards, nested focus traps and focus restore, and is consumed by 27 components. Its document-wide scope is documented honestly.
- Accessibility measurement rather than declaration. The focus-indicator test parses every `:focus*` selector in `base/`, renders a fixture for each, and measures contrast across 16 variants, 3 themes, 2 densities and pointer modes. Touch-target tests probe hit regions at three widths, two languages, two densities and two themes. axe runs 424 scans across 106 primaries in both languages.
- Built-in component strings are centralized and gated: 64 namespaces, 141 keys per locale, zero drift, a parser-level guard against hard-coded English in JSX, and a currency formatting contract with mutation tests. (This covers `components/` only; templates carry their own copies, see G58.)
- Templates are self-contained. `templates/_vendor/support.js` (generated from `scripts/template-runtime/primitives/support.js`) renders every `.dc.html` with vendored React; `doc-export.js` writes DOCX with hand-built OOXML and no CDN; the print contract covers all 62 document templates across three engines.
- The component bundle is rebuilt in-repo. `scripts/build-bundle.mjs` reproduces `_ds_bundle.js` byte-identically with esbuild alone, and `check-bundle-freshness` confirms 118 source hashes.
- Consumer tests use the real tarball. `test-packed-ssr` renders from `npm pack` output under React 18 and 19 including streaming; `test-subtree-consume` copies the portable list into three browsers with external requests blocked; `test-packed-assets` crawls every reference.
- Supply chain hygiene. Every workflow action is pinned to a full SHA, default permissions are read-only, publishing uses OIDC with provenance, Scorecard and Dependabot run weekly, vendored React and Babel carry hash-verified provenance, and the Editor's HTML trust boundary is typed, documented and tested.
- Vietnamese documentation is real, not stubbed. Every `docs/*.md` has a `docs/vi` twin with matching heading counts and same-day freshness; the critic checked translation density and found no near-identical copies.
- Honest scope statements. Release notes, lifecycle records and conventions consistently separate automated evidence from human visual and assistive-technology acceptance.

Two strengths need caveats. The "CSP-safe runtime" claim is about the bundle avoiding `eval`; the served policy in `vercel.json` and `_headers` still allows `script-src 'unsafe-inline'`. The lifecycle integrity checks are real, but what they validate is single-owner by construction (D22).

## 4. Verified defects

A defect is verified wrong behavior, a broken contract, or a documented claim contradicted by code. Severity is the post-verification value. "Confirmed" means the batched verifier reproduced the evidence; "lowered" means it held with reduced weight; "single auditor" means it was reported with concrete evidence but not independently re-verified.

### 4a. Documentation that contradicts the code

| ID | Severity | Defect | Evidence | Verification |
|---|---|---|---|---|
| D1 | High | Entry docs and the inventory say `.dc.html` templates require the Design Components compiler; the repository renders all 85 without it | `SKILL.md:18,21,39`, `README.md:14,16`, `CONTRIBUTING.md:29`, `docs/consuming.md:35-39`, `llms.txt:22`, `scripts/generate-template-inventory.mjs:30`, `_audit/ci/test-template-inventory.mjs:21` versus `templates/_vendor/support.js`, `_audit/ci/test-template-bootstrap-browser.mjs` (exit 0 on a clean clone) | Confirmed by six verifiers across three dimensions. Correct boundary: preview, axis switching, DOCX and raster PDF are in-repo; PPTX, `super_inline_html`, `check_design_system`, tweak-panel authoring and image-slot persistence are external |
| D2 | Medium | Router and `AGENTS.md` require following "the active revision plan" and "the active task specification", which exist nowhere in the tree | `SKILL.md:10,22`, `AGENTS.md:5`; `git ls-files` finds no such file; the evidence lives in untracked local refs (491 MB) | Confirmed |
| D3 | Medium | `docs/ci-cd.md` says the nightly-failure job opens an issue; the workflow only emits an error annotation and exits 1 | `docs/ci-cd.md:24` versus `design-system-gates.yml:557-581` | Confirmed |
| D4 | Medium | `AGENTS.md` prerequisites are wrong: a non-existent "update script" and "Chromium is required", while 32 scripts need all three engines | `AGENTS.md:21` versus `test-ci-browser-prerequisites.mjs` | Confirmed |
| D5 | Low | The acceptance gate is paraphrased four ways; two name `check_design_system`, defined nowhere | `docs/doctrine.md:26`, `CONTRIBUTING.md:23`, `SKILL.md:37`, `docs/conventions.md:7` | Confirmed, lowered (doctrine supplies a portable equivalent) |
| D6 | Low | Immutables and the CyberOS retirement sentence are restated in four to nine files with drifting wording, and `test-guidance-authority` pins the retirement text in place | `#45210E` in 4 files, APCA floor in 6, `2026-10-08` in 9; `test-guidance-authority.mjs:16-20` | Confirmed, lowered |
| D7 | Low | `README.md` advertises "normative Hard rules" in `SKILL.md`; no such section exists | `README.md:14,28`; `grep -ci hard SKILL.md` = 0 | Confirmed |
| D8 | Low | `SKILL.md` ships in the tarball but links `_audit/README.md` and `AGENTS.md`, which do not | `package.json` files; `npm pack --dry-run` | Confirmed, lowered (maintenance branch only) |
| D9 | Low | `Calendar.prompt.md` says there is no arrow-key navigation; `Calendar.jsx:46-62` implements it and a test exercises it | `components/forms/Calendar.prompt.md`, `_audit/ci/test-calendar-browser.mjs:38-44` | Confirmed |
| D10 | Low | Stale and contradictory CSS comments: `interaction.css` claims to load last; `spacing.css` says mobile-first while every query is `max-width` | `base/interaction.css:2-3`, `styles.css:33-41`, `tokens/spacing.css:24`, `base/responsive.css:3` | Confirmed |
| D11 | Low | Documented class grammar `.cs-<block>[-<part>][--mod]` does not match the code (227 of 466 classes use `__`, 27 `.is-*`/short names undocumented) | `docs/conventions.md:25` versus `base/*.css` | Confirmed |
| D12 | Low | The `generated: 2026-07-23` stamp is a frozen literal that no generator writes; it propagates to `DESIGN.md` and `provenance.json` | `tokens/tokens.json:5`, `tokens/tokens.dtcg.json:7`, `scripts/design-md-lib.mjs:92` | Confirmed, lowered |
| D13 | Low | Element scope keys are spelled `tho.sand` and `tho-sand` in the same DTCG document | `tokens/tokens.dtcg.json` overrides; `generate-element-packs.mjs:471-472` | Confirmed |
| D14 | Low | `docs/quality-gates.md` and `_audit/index.html` drift from the board registry (`at-kit-probe.html` on the board but not indexed; `vn-overflow.html` reachable only from a doc) | `_audit/run.html` 43 gates versus `_audit/index.html` 49 pages | Confirmed, lowered |
| D15 | Medium | README claims each template composes the design-system components; 71 of 85 import only `Logo` and hand-write inline-styled markup (VnLaborContract has 321 `style=` attributes) | `README.md:201`; import census over all 85 files | Single auditor; the second pass recorded the same fact as an improvement |

### 4b. Governance and release identity

| ID | Severity | Defect | Evidence | Verification |
|---|---|---|---|---|
| D16 | High | "1.7.2" identifies four different artifacts: the tag and npm package (2026-08-13), a GitHub release published 2026-10-19 describing October work, and a release-notes section describing the same October work; 13 commits and 1,789 files have landed since the tag with VERSION unchanged | `git tag`, `npm view`, `gh release view v1.7.2`, `docs/release-notes.md:31-33` | Confirmed by two auditors |
| D17 | High | The VERSION auto-bump workflow and stamp scripts were deleted on 2026-10-17; `docs/conventions.md:7,81`, `docs/consuming.md:40`, `docs/quality-gates.md:18,24`, `docs/benchmark-rubric.md:26` and `_audit/docs-consistency.html` still promise auto-bump | `git show --stat f267491a` | Confirmed by three auditors |
| D18 | High | The lifecycle gate hard-codes one name as the only valid owner and reviewer; all 123 records share one timestamp to the millisecond | `_audit/ci/test-component-lifecycle.mjs:36`; `components/lifecycle.json` | Confirmed |
| D19 | High | Branch protection does not enforce admins or require reviews; the largest change in history (1,601 files) was a direct push; the last eight merged PRs have zero reviews | `gh api .../branches/main/protection`; `git show --stat f267491a` | Confirmed |
| D20 | Medium | Evidence hashes in support records are refreshed on every edit while `reviewedAt` and `reviewedBy` stay fixed, so "reviewed" no longer describes the bytes it claims to cover | `git show fd53f7ca -- components/lifecycle.json`: 12 hashes replaced, `reviewedAt` unchanged | Single auditor; the second pass recorded the bulk-stamp question as unverified |
| D21 | Medium | Decision log numbering skips 6, 7, 11, 12; the task list reuses numbers 2 to 9; `consumer-grant.md:39` cites a §7 that does not exist; accepted ADRs accumulate "acceptance pending" work logs | `docs/decisions.md`, `docs/decisions/theme-density-contrast.md:53-95` | Confirmed |
| D22 | Medium | Licensing: the public npm package is UNLICENSED with no LICENSE file; the grant names eight products and no other grantee; four bundled skills declare MIT over an Apache-2.0 LICENSE.txt and are absent from `THIRD-PARTY-NOTICES.md` | `package.json:80`, `docs/consumer-grant.md:34`, `.agents/skills/ui-styling/` | Confirmed |
| D23 | Low | The working tree labelled 1.7.2 differs from the registry 1.7.2 tarball in 427 shipped files; release notes document this as an intentional unreleased revision, so the missing piece is a prerelease identifier | `npm pack --dry-run` shasum versus `npm view` | Confirmed, lowered |
| D24 | Low | `npm-hello-smoke` is fail-closed on the registry, so any VERSION bump turns that job red until publication (not a merge deadlock unless the check is required) | `design-system-gates.yml:475-556` | Confirmed, lowered |

### 4c. Component runtime and API contracts

| ID | Severity | Defect | Evidence | Verification |
|---|---|---|---|---|
| D25 | High | `NumberField` accepts `defaultValue` in its types but ignores it, renders 0 and logs a React controlled/uncontrolled warning | `NumberField.d.ts:5`, `NumberField.jsx:21,59-64`; reproduced with `renderToStaticMarkup` | Confirmed, reproduced |
| D26 | Medium | Dismissal and open-state callbacks are named and typed inconsistently (Dialog `onClose` with required `open`; AlertDialog `open`/`defaultOpen`/`onOpenChange`; Alert `onDismiss(event)`; Toast `onClose()`) | `Dialog.d.ts:17`, `AlertDialog.d.ts:10-12`, `Alert.d.ts:15`, `Toast.d.ts:16` | Confirmed |
| D27 | Medium | Near-identical collections diverge: DataTable `emptyState` vs DataGrid `empty`; `rowKey` typed against Row vs plain string; `R = any` generics; three `onSelect` shapes; `label` is string in 25 files and ReactNode in 14 | `DataTable.d.ts:29-37`, `DataGrid.d.ts:8-29`, `Tree.d.ts:13` | Confirmed (DataGrid's missing state triad is a documented future step) |
| D28 | Low | `Form.onSubmit` and `FormWizard.onComplete` are typed `=> void` while the runtime awaits a returned promise and the prompt relies on it | `Form.d.ts:14,95`, `Form.jsx:172,363` | Confirmed |
| D29 | Low | AlertDialog exposes `tone` and `variant` for one concept with undocumented precedence; danger/destructive/error vocabularies and size scales differ across components | `AlertDialog.d.ts:21-23`, `AlertDialog.jsx:45` | Confirmed, lowered to an inconsistency |

### 4d. Accessibility

| ID | Severity | Defect | Evidence | Verification |
|---|---|---|---|---|
| D30 | High | Under forced colors (Windows High Contrast) Switch, Tabs and SegmentedControl lose their state indicators entirely; only `base/glass.css:84-91` handles the media query | Chromium `emulateMedia({ forcedColors: 'active' })` probe: identical computed styles for checked and unchecked | Confirmed, reproduced |
| D31 | Medium | Calendar day grid: 31 tab stops, no `grid` role, arrows clamp at month edges, no PageUp/PageDown, selection via `aria-pressed` | `Calendar.jsx:46-66` | Confirmed, reproduced |
| D32 | Medium | DatePicker opens a `role=dialog` popup but leaves focus on the trigger | `DatePicker.jsx:22,33-40` | Confirmed, reproduced |
| D33 | Medium | Virtualized DataGrid exposes only the painted rows with no `aria-rowcount` or `aria-rowindex` | `DataGrid.jsx:75-85,139-198` | Confirmed, reproduced |
| D34 | Low | Menu: trigger ignores ArrowDown/ArrowUp, items all have `tabIndex 0`, no typeahead; Tab leaving the menu open is a documented and CI-locked contract but disagrees with Menubar, which closes on Tab | `Menu.jsx:27-48,80`, `Menu.prompt.md:22`, `test-menu-key-scope-browser.mjs:32-37`, `Menubar.jsx:60` | Confirmed, lowered |
| D35 | Low | Popover renders `role=dialog` with no default accessible name, so default props produce an axe "serious" violation; Menu and Drawer default to a localized name | `Popover.jsx:11,40`; axe `aria-dialog-name` | Confirmed, lowered (no-focus-move is documented) |
| D36 | Low | Menubar has no accessible name; Enter/Space opens a submenu without moving focus | `Menubar.jsx:41,47` | Confirmed |
| D37 | Low | NavigationMenu sets `aria-haspopup="true"` on disclosure buttons whose panel is a plain list of links | `NavigationMenu.jsx:24-34` | Confirmed |
| D38 | Low | Drawer body is always a focusable `div` with no role or name; Tooltip wraps text children in a role-less focusable span | `Drawer.jsx:54`, `Tooltip.jsx:18` | Confirmed |
| D39 | Low | Switch and Toggle fallback names change with state; Calendar day labels use English word order in Vietnamese; two reduced-motion rules are dead under the universal override; Combobox name falls back to placeholder text and "No results" is exposed as an option | `Switch.jsx:14,22`, `Toggle.jsx:19`, `Calendar.jsx:65`, `base/feedback.css:53`, `Combobox.jsx:44-55` | Single auditor |
| D40 | Low | 28 of 30 `guidelines/*.html` declare `lang="en"` and carry 115 inline hex literals outside the hex gate, while the system is Vietnamese-first | Critic census of `guidelines/` | Critic, not re-verified |

### 4e. Templates and CSS behavior

| ID | Severity | Defect | Evidence | Verification |
|---|---|---|---|---|
| D41 | Medium | `ds-base.js` never syncs `<html lang>`: its selector matches the root element itself, so 37 Vietnamese-first instruments ship as `lang="en"` and a language switch never reaches the root | `scripts/template-runtime/ds-base.js` `syncLang`; Playwright probe before and after `__dcSetProps` | Confirmed, reproduced twice |
| D42 | Medium | Unprefixed `.card`, `button.card`, `article.case` with `!important` in the global sheet override any consumer's own `.card` at 360 px and below | `base/responsive.css:158`; reproduced at 320 px | Confirmed, reproduced |
| D43 | Low | Responsive collapse depends on `[style*="grid-template-columns: repeat(3"]` selectors keyed to the compiler's spaced serialization; hand-authored `repeat(3,1fr)` gets no collapse; the rule is in `conventions.md:75` but not in consumer docs | `base/responsive.css:9-12,77-159`; reproduced | Confirmed, lowered |
| D44 | Low | 177 hex literals in 76 templates, several exact copies of token values; no hex gate covers `templates/` | grep census; `test-base-hex-allowlist` scoped to `base/` | Confirmed |

### 4f. Build, testing and architecture

| ID | Severity | Defect | Evidence | Verification |
|---|---|---|---|---|
| D45 | Medium | Token exports and `_ds_manifest.json` are read-modify-written by four or five generators whose order lives only in the `tokens:generate` script string; no test proves clean-state regeneration | `generate-element-packs.mjs:601-604`, `generate-theme-exports.mjs:59-62`, `generate-base-token-exports.mjs:8-13`, `generate-token-declarations.mjs:20-24` | Confirmed, lowered (the orchestrator command exists and CI diffs it) |
| D46 | Medium | Three independent APCA implementations; five CI gates obtain `apcaLc` by string-slicing a JSX story helper between two literals | `scripts/lib/oklch.mjs:91-111`, `stories/lib/live-tokens.jsx:148-162`, five `_audit/ci/test-*-browser.mjs` | Confirmed |
| D47 | Medium | Two defined browser suites (`test:template-touch`, `test:template-touch-actions`) are not in `test:unit:all` or any workflow | `package.json`, `.github/workflows/*.yml` | Confirmed |
| D48 | Low | `prepublishOnly` rebuilds the bundle, React entry and styles instead of checking them, and `npm-publish.yml` runs it explicitly before `npm publish` runs it again | `package.json` scripts; `npm-publish.yml:54` | Confirmed by two auditors |
| D49 | Low | The exports map omits `./base/*`, `./package.json` and `./assets/*` although the files ship and `consuming.md:127` describes importing base sheets individually | `import.meta.resolve` probe | Confirmed, lowered |
| D50 | Low | `OverlayProvider` ignores its own context (always the module singleton), renders a fixed `#cs-overlay-root` id, and inerts the whole document; the limitation is documented but two providers duplicate the id and nothing tests two bundles | `OverlayManager.jsx:219-237` | Confirmed, lowered |
| D51 | Low | The gate board fails on a cold checkout until `pixel-diff.mjs` writes a gitignored report; this is a documented decision, but `verify-local.sh` omits the ordering | `AGENTS.md:23`, `scripts/verify-local.sh:9,12` | Confirmed, lowered |
| D52 | Low | `dist/styles.min.css` is whitespace-collapsed, not minified (3,253 lines); `_ds_bundle.js` is unminified with no map | `scripts/flatten-styles.mjs:32-35` | Confirmed by three auditors |
| D53 | Low | Vercel installs with `npm install` while every CI job uses `npm ci` | `vercel.json` | Confirmed |
| D54 | Low | `_adherence.oxlintrc.json` is a tracked 52 KB config that nothing runs, lints JSX not CSS, and lists 141 token names against 194 public ones (62 missing, 9 stale) | `.gitignore:3,45`; no reference anywhere else | Confirmed by three auditors |
| D55 | Low | Stale packaging statements: notices say vendored runtimes are "not always present" while `files` always ships them; `cs.mjs` reports a React version that contradicts provenance | `THIRD-PARTY-NOTICES.md`, `_vendor/NOTICE.md`, `_esm/cs.mjs:2-3` | Single auditor |

### 4g. Storybook surface

| ID | Severity | Defect | Evidence | Verification |
|---|---|---|---|---|
| D56 | Medium | All 106 story metas set a `docs.description.component`; 89 are the same hosting-policy sentence, which addon-docs prefers over the JSDoc that 100 of 106 components carry, so the Docs tab never shows the real description | `stories/*.stories.jsx`; precedence confirmed in `@storybook/addon-docs` | Confirmed |
| D57 | Low | Callback props are text controls in 16 story files; in 10 of them Default spreads args, so typing into the control throws on interaction | `grep -lE '"on[A-Z]...": \{'`; `RadioGroup.jsx:28` | Confirmed |
| D58 | Low | The Controls panel is inert for 26 components whose Default ignores args, while docs advertise "deep control matrices" | 26 metas without `args` | Confirmed |
| D59 | Low | The coverage tool counts companion exports as covered on import; `FormWizard`, `FormFieldArray` and `Tab` are public API with no story (they do have browser tests) | `storybook-inventory.mjs:85-101` | Confirmed, lowered |

## 5. Gaps for the agent-agnostic goal

A gap is a capability the goal needs that does not exist. Ordered by how much it blocks a new agent on its first task.

### 5a. Machine-readable contract

| ID | Severity | Gap | Evidence |
|---|---|---|---|
| G1 | High | No component manifest. `api-index.json` v1 carries name, optional, type and description per prop; Button lists 293 props of which 7 are authored; no defaults, own-versus-inherited split, anatomy, class hooks, data attributes, states, slots, keyboard map or examples | `components/api-index.json`; `_ds_manifest.json` components entries are `{name, sourcePath, kind}` |
| G2 | High | No per-component accessibility contract; the `Keyboard:` line in all 106 prompt files is enforced by no gate (D9 shows it drifts) | `lifecycle.json` support records have no roles, states or keyboard fields |
| G3 | High | No written API grammar for prop names, enums, ownership triplets, slots, event signatures, passthrough or refs; ownership is described by enumeration in `consuming.md:11-24` | grep of `conventions.md`, `doctrine.md`, `decisions.md` |
| G4 | Medium | `prompt.md` is a de facto fixed format with no published schema and no completeness gate; 84 of 106 omit at least one declared prop | scratch diff over all 106 trios |
| G5 | Medium | Five of six JSON exports have no JSON Schema; the `$schema` URL in `lifecycle.json` returns 404; `_ds_manifest.json` has no version field | `curl` of the schema URL |
| G6 | Medium | The template inventory is computed in memory and never written; its test hard-codes 85, 3, 40 and 512 | `scripts/generate-template-inventory.mjs:59-62` |
| G7 | High | The template grammar (`x-dc`, `x-import`, `helmet`, `sc-if`, `sc-for`, `{{ }}`, `data-props`, `renderVals`, `hint-*`) is documented nowhere outside the runtime source | grep of `docs/`, `SKILL.md`, `README.md` |
| G8 | Medium | No single portable agent contract: rules that tests already enforce are still carried as prose with no marker, and `SKILL.md` never names the 228-command suite that is the de facto contract | `test-docs-consistency.mjs:25-77` versus `SKILL.md:29-35` |
| G9 | Medium | Guidance is keyed by vendor (rows named Claude Code, Claude Design, Google Stitch, Cursor Cloud) and names three commands with no in-repo definition (`gen_pptx`, `super_inline_html`, `check_design_system`) | `docs/consuming.md:34-36`, `AGENTS.md:9-24`, `SKILL.md:39` |
| G10 | Medium | `image-slot.js` ships as a runtime file whose persistence half depends on `window.omelette.writeFile`; it is absent from the exports map and from `consuming.md` | `image-slot.js:8,21`, `docs/conventions.md:152` |
| G11 | Medium | `.agents/skills` and `.cursor/skills` hold 345 tracked files (8.8 MB) of upstream Python and CSV tooling, including shadcn and Tailwind installers the router forbids, with no notices entry and no gate on their content | `shadcn_add.py`, `tailwind_config_gen.py`; `validate-repository-skills.mjs:12-68` checks frontmatter and links only |
| G12 | Low | About 80 distinct ticket codes (TASK-IMP, FIND, UX, CDS, ADOPT) appear in 180 JS, 77 MD and 52 HTML files with no registry that resolves them | git grep census |
| G13 | Low | Bilingual coverage stops at `docs/*.md`; the four decision records, the entry files and prompt files are English-only, and the parity test is non-recursive | `test-docs-lang-parity.mjs:32` |

### 5b. Component architecture

| ID | Severity | Gap | Evidence |
|---|---|---|---|
| G14 | High | No component forwards a ref and no document states a policy; `tsc` rejects `<Button ref>` under both React type majors; behavior differs by React version and by whether a file spreads props | `grep -l forwardRef` = 0; scratch tsc |
| G15 | Medium | 59 of 106 components accept nothing beyond `className` (no `style`, `id`, `data-*`, `aria-*`), including Combobox, DatePicker, Drawer, Popover, DataGrid and Tooltip | grep of `...props` spreads |
| G16 | Medium | Floating panels have no portal and no collision-aware positioning; only `align: start|end` exists; no `placement` prop on any floating component | `createPortal` = 0; `base/shell.css:26` |
| G17 | Medium | Gates verify destructured names, but nothing verifies that declared props are honored at runtime or that union members match defaults and story options (D25 slipped through) | `test-runtime-props.mjs`, `test-prop-parity.mjs:69-103` |
| G18 | Low | Composite inputs (Combobox, DatePicker, NumberField, Cascader, TreeSelect, TagInput, Rating, InputOTP, ColorPicker) have no `description`, `error`, `required` or `name` contract; `FormField` renders an error line but cannot wire `aria-describedby` to a non-native child | survey of `forms/*.d.ts`; `Form.jsx:200-232` |
| G19 | Low | Behavior is React-bound throughout; only `attachFocusTrap` and the `.cs-*` CSS are reusable without React | `OverlayManager.jsx` exports |
| G20 | Low | The string registry cannot be extended or overridden by consumers; `makeT` and `useLang` are not exported | `components/_i18n/i18n.js:9-52` |

### 5c. Accessibility coverage

| ID | Severity | Gap | Evidence |
|---|---|---|---|
| G21 | Low | CommandPalette has no listbox or arrow-key model (documented in its prompt as a boundary) | `CommandPalette.jsx:48-72` |
| G22 | Low | axe scans only default and expanded states; variants, sizes, disabled, error and the 136 stories are never scanned; addon-a11y is installed but unconfigured | `test-axe-scenes-browser.mjs:16-24` |
| G23 | Low | About twelve interactive components (Accordion, Tooltip, NavigationMenu, Pagination, Switch, RadioGroup, TagInput, Transfer, ButtonGroup, ScrollArea, Breadcrumb, Collapsible) have no keyboard-map assertions | cross-reference of components against `_audit/ci/test-*browser*.mjs` |
| G24 | Medium | The manual assistive-technology matrix the board cites (AT-01 to AT-16) does not exist as a file, so "empty slots are not passes" cannot be enforced | `_audit/run.html:105-106`, `docs/quality-gates.md:44,151` (single auditor) |

### 5d. CSS architecture

| ID | Severity | Gap | Evidence |
|---|---|---|---|
| G25 | High | No `@layer`, no documented override contract; bare `*`, `html`, `body`, `img`, `main` rules are unwrapped; `responsive.css` carries 22 `!important` and `a11y.css` 14 | grep `@layer` = 0 |
| G26 | High | No browser support floor while `color-mix()` is used 169 times with no `@supports` guard, plus `@container`, `text-wrap`, `:has`-era features | no browserslist; `base/glass.css:98` guards `backdrop-filter` only |
| G27 | Medium | No CSS lint; the only lint config in the repo is the orphan in D54 | devDependencies |
| G28 | Medium | No component-to-stylesheet map; 59 of 113 blocks span two to four files; `controls.css` holds 53 blocks sectioned by "Batch N (Jul 2026)"; 11 className hooks have no base rule and no gate notices | `CONTRIBUTING.md:27` says "the matching base file" without a mapping |
| G29 | Low | No supported tokens-only or per-component CSS entry; `consuming.md:127` describes a first-party consumer importing sheets individually while `:135` says that is unsupported | exports map |
| G30 | Low | No fluid type, no safe-area insets, `vh` instead of `dvh` in overlays, no hover-media guard, no base print rules | grep census |
| G31 | Medium | Spacing tokens are used 8 times in `base/` against 764 raw px literals; density aliases have zero consumers, so the density axis reaches Button and TextField only; 33 public tokens are never referenced anywhere | two auditors (CSS and tokens) |
| G32 | Low | Whole-set responsive gates stop at 320 and 390; the 768 and 1280 stops where sidebars and grids collapse have no whole-set assertion | `_audit/responsive-overflow*.html` (single auditor) |

### 5e. Tokens

| ID | Severity | Gap | Evidence |
|---|---|---|---|
| G33 | High | Adding one CSS token fails `generate-base-token-exports` with "Unclassified root token" because group membership and `$type` live inside two generated files; no document explains the remedy | reproduced by auditor and verifier in a fixture copy |
| G34 | Medium | Every theme, element, density and contrast mode exists in the DTCG export only as raw CSS strings inside `$extensions.com.cyberskill`; Style Dictionary, Tokens Studio and Figma receive a light-only Tho-middle snapshot (documented limitation, no decision record) | `tokens.dtcg.json:11-40` |
| G35 | Medium | `npm run tokens:generate` is named in no entry document; freshness is spread over eight `--check` invocations with no aggregate `tokens:check` | grep of `SKILL.md`, `AGENTS.md`, `README.md`, `CONTRIBUTING.md` |
| G36 | Medium | Native exports are 605 flat suffixed constants with no typed pack or resolve API; native compilation runs only on `codex/native-validation-*` branches, never on PRs | `tokens/native/CSTokens.swift`, `native-validation.yml:3-6` |

### 5f. Validation and CI

| ID | Severity | Gap | Evidence |
|---|---|---|---|
| G37 | High | No single executable verification entry; `scripts/verify-local.sh` prints instructions and checks one equality; commands are scattered over `docs/ci-cd.md`, `AGENTS.md`, `SKILL.md` and the workflow YAML | `verify-local.sh:4-12` |
| G38 | High | No machine-readable results: the 228-command runner stops at the first failure with no summary; `run-gates.mjs` slices its report to 12,000 characters; verdicts are `window.__*` globals | `run-unit-suite.mjs:38-49`, `run-gates.mjs:21-37` |
| G39 | Medium | The test architecture is 265 shell commands split on `&&`, round-robin sharded with no durations, no framework, no tags; 78 test files contain lines over 400 characters | `run-unit-suite.mjs:7-34` |
| G40 | Medium | The HTML gate board is the merge authority and cannot be invoked without a browser, although many gates have Node twins | `design-system-gates.yml:48`, `docs/quality-gates.md:5` |
| G41 | Medium | Native token compilation is never validated on main or PRs | `native-validation.yml` |
| G42 | Low | No test framework, reporter, coverage metric or component-to-test index (every component is at least rendered and axe-scanned) | devDependencies |
| G43 | Low | No PR-blocking vulnerability check; devDependencies mix caret and exact; no `engines`, `.nvmrc` or `packageManager` (local Node 24, CI Node 22); CI fetches `serve`, `wait-on` and the SBOM tool by version outside the lockfile | `package.json`; workflow `npx --yes` lines |
| G44 | Low | Visual regression: 15 Linux-Chromium frames at one viewport with one dark target; no element, language, density or contrast axis (curated-set boundary is documented) | `_audit/lib/pixel-report-contract.mjs:2-37` |
| G45 | Low | Three npm scripts require Python 3 and a pinned fontTools; no requirements file, no CI job, no mention in any entry doc | `package.json` `fonts:glyphs`, `test:font-glyphs`, `verify:serve` |

### 5g. Packaging and governance

| ID | Severity | Gap | Evidence |
|---|---|---|---|
| G46 | Medium | The default entry is raw JSX with no compiled ESM or CJS build and no sourcemaps; `require()` fails; consumers must configure transpilation (documented, with the legacy bundle as the alternative; the verifier lowered this to low, kept at medium here because it is the first thing every bundler consumer hits) | `_esm/react.mjs:1-12`; `npm pack` has 0 `.map` files |
| G47 | Medium | `_ds_manifest.json` has split ownership: four generators write parts; `templates`, `startingPoints`, `namespace` and `source` have no in-repo generator | `.gitignore:8`, `build-bundle.mjs:158-162` |
| G48 | Low | No single documented build graph; three `generate-*` scripts write nothing; `build-bundle.mjs` lacks `--check` (its twin lives under `_audit/ci`) | `package.json` script chains |
| G49 | Low | No runnable Vite or Next example; `examples/npm-hello` uses the legacy entry and needs a registry install of an UNLICENSED package | `examples/` listing |
| G50 | Medium | No versioning, breaking-change, deprecation-timeline, React support-window or browser-support policy anywhere | grep of `docs/`, `README.md`, `CONTRIBUTING.md`, `package.json` |
| G51 | High | No CODEOWNERS, PR template, issue templates, ADR template, MAINTAINERS or contribution ladder | `find .github -type f` |
| G52 | Medium | The expansion rule is enforced for only part of its deliverables and costs 51 to 56 file touches per component or template | commits `def9546c`, `21843855`, `287584cb` |
| G53 | Medium | Maintenance cadence and the exception process name one human with no delegate | `docs/conventions.md:51-64` |
| G54 | Medium | No performance budgets: no size limit on the 557 KB bundle or 200 KB sheet, no Lighthouse or render measurement; the only budget covers five WebP files | `scripts/measure-*.mjs` headers |
| G55 | Medium | Hand-written `.d.ts` and `.prompt.md` have one-directional drift guards; the API index depends on `typescript/unstable/sync` | `scripts/generate-api-index.mjs:2` |
| G56 | Low | Splitting the monolith into workspaces is possible but relative-path coupling (`../..` in `ds-base.js`, `../../_vendor/react/` in `support.js`, the manifest read in `build-bundle.mjs`) must be cut first; a previous `packages/` tree was removed by July 2026 | `git log --diff-filter=D -- 'packages/*'` |

### 5h. Templates

| ID | Severity | Gap | Evidence |
|---|---|---|---|
| G57 | High | Templates are not data-driven: 45 of 85 have no content schema, 33 return only `{elAttr, vaAttr}`, invoice amounts and party names are hard-coded in duplicated EN and VN blocks, and the 512 sidecar slots are all "not-a-declared-runtime-prop" | `FinanceInvoice.dc.html:29-31,58-60`, `docs/template-schema-v2.md:3,58` |
| G58 | Medium | Template copy and axis maps are duplicated per file: the 15-entry element map in all 85, EN/VI dictionaries in 21, forked markup in 24; nothing uses the component string registry (locale deferral is an owner decision; the shared source is still missing) | grep census |
| G59 | Medium | No Node CLI renders or exports a template; the capability exists only inside two CI tests | `scripts/` listing |
| G60 | Low | PPTX export and host-inlined standalone export depend on tools outside the repository; decks have no portable export | `docs/conventions.md:105-108` |
| G61 | Medium | No per-component static HTML snippet anywhere; `kitchen-sink.html` shows 37 of 145 root classes although `consuming.md:123` calls it the full catalog | grep `class="cs-` over prompt files = 0 |
| G62 | Medium | Storybook: no interaction tests, no per-story render or axe pass, 68 of 106 components stop at Default plus one Matrix, no empty or error stories; VERSION and the template count are hand-coded in MDX with the stamper deleted | `stories/`, `storybook-static/index.json` |

## 6. Architectural limitations and technical debt

The architecture audit ran 16 generator checks (all pass) and found no TODO or FIXME markers in source. The debt is structural. Each item carries an impact and effort estimate.

| Item | Impact | Effort | Notes |
|---|---|---|---|
| Read-modify-write generator chain for tokens and the manifest (D45, G47, G48) | High: an agent that runs one generator produces a different `tokens.json` than the chain | Medium | Collapse into one pure projection; make the manifest fully derived or split authored metadata out |
| Prose-held contract (G1, G2, G3, G7, G8) | High: every extension task starts from reading JSX | High | The component manifest and a11y contract are the largest single investment in the roadmap |
| Validation as shell string plus HTML board (G37 to G40) | High: results are not data; the fast tier needs a browser | Medium | Registry file, JSON output, Node-authoritative gates |
| Single-owner governance (D18, D19, G51, G53) | High: bus factor of one, encoded in a test | Low | Registry, CODEOWNERS, required reviews |
| Release identity (D16, D17, D23, G50) | High: a version string resolves to four artifacts | Low | One release runbook, one bump mechanism, a prerelease label |
| Raw-JSX package and 15.9 MB tarball (G46, G49, D52) | Medium: friction for every bundler consumer | Medium | Compiled dist with maps; tarball diet |
| Global cascade with no layers, no floor, no lint (G25 to G28) | Medium: consumers cannot override safely; agents cannot find where CSS goes | Medium | `@layer`, browserslist, stylelint, stylesheet map |
| Templates as hand-written markup with duplicated maps (G57, G58, G59, D15) | Medium: the most valuable content is the least reusable | High | Grammar, CLI, content binding, document primitives; migrate per archetype |
| Overlay singleton and document-level listeners (D50) | Low today, medium for micro-frontends | Medium | Manager per provider, configurable root |
| Three APCA copies and string-sliced helpers (D46) | Medium: the contrast immutable has three implementations | Low | One module, one parity test |
| Hand-written d.ts and prompt.md (G55, G17) | Medium: semantic drift is invisible | High (TypeScript migration) or Medium (checkJs) | Decision D3 |
| Hand-mirrored EN and VI docs (strength with a cost) | Low: the gate checks presence and heading counts, not meaning | Medium | Generate count-bearing sections; per-section hashes |
| Upstream skill payload in two adapter trees (G11) | Medium: forbidden framework installers under the CyberSkill name; 8.8 MB | Low | Keep seven adapter files; drop or quarantine the rest |
| Proprietary residue: `omelette` bridge, `check_design_system`, `gen_pptx`, `super_inline_html`, CyberOS prose (G9, G10, D6) | Medium: tells a fourth agent it is not the audience | Low | One capability table, one adapter interface for the host bridge |
| Rights status of the reconstructed template runtime | Unknown | Owner decision | `THIRD-PARTY-NOTICES.md:36-41` records reproducibility, not rights approval |

Performance has no regression signal beyond file sizes: no size budget, no Lighthouse run, no render-count measurement for DataGrid, Form or overlays (G54).

## 7. Agent independence, evaluated

The question is whether an agent that has never seen this repository, running under any host, could consume and extend the system correctly on the first attempt. Four lenses.

### Portable instructions

The skeleton is right. `SKILL.md` carries Agent Skills frontmatter, five host shims point at it, the `.agents` and `.cursor` adapters are validated for parity and link integrity, and `test-guidance-authority` pins stated CI facts to the real workflow files.

The content is not yet portable. The nine entry documents total about 26,000 words; `SKILL.md` has 18 negated sentences out of 77, and the chain carries 91 hedge phrases against 1,911 sentences, while instructions such as "test actual scope composition for the requested use" name no command. Immutables and the expansion rule are restated in four to seven files with drifting wording, and the gate is defined four ways (D5, D6). Guidance is keyed by vendor instead of capability (G9). A retired orchestration layer is mentioned 21 times across 12 entry files and a test requires the retirement sentence to stay. The router cites two documents that do not exist (D2). The adapters carry 8.8 MB of upstream material the SKILL files then have to disclaim (G11). Two of three lens verifiers judged the "circular chain" claim overstated: a per-audience order does exist in `README.md:12-22`, and `SKILL.md:8` scopes reading to the task. The residual problem is that the maintainer order lives in a 5.5k-word human document rather than in the router, and `SKILL.md` never links `CONTRIBUTING.md`.

### Machine-readable specifications

What exists: `components/api-index.json`, `components/lifecycle.json`, `docs/reference-catalog.json`, `tokens/tokens.dtcg.json`, `tokens/declarations.json`, `templates/schema/content-schema.schema.json` with 40 validated sidecars, and `_ds_manifest.json`. What is missing is listed in G1 to G7: no component manifest, no a11y contract, no API grammar, one JSON Schema for six exports, an inventory that is never written, an undocumented template grammar, content slots nothing can fill, no typed tokens, and modes hidden inside a vendor extension.

### Tooling interoperability

Works today without any vendor tool: the component bundle, template rendering and axis switching, DOCX and raster PDF export, Storybook, the Style Dictionary round trip in CI, and native token generation. Genuinely bound to external hosts: PPTX export, standalone inline-HTML export, the `check_design_system` gate named in doctrine, the tweak-panel authoring UI, image-slot persistence through `window.omelette.writeFile`, Figma variable push (Enterprise scopes) and store submission. Friction that looks like vendor coupling but is fixable in-repo: the raw-JSX entry, responsive rules keyed to compiler whitespace, no `@layer`, no browser floor, and the DTCG mode packaging.

### Reproducible validation

Strong parts: 20 generator `--check` twins that all pass; tarball-based consumer tests; three-engine browser runs; a CI verdict contract that blocks silent soft-skips; a hermetic loopback fixture. Weak parts: G37 to G45. Net assessment: an agent can run the pieces, but cannot discover the one command that proves a change is safe, cannot read the result as data, and cannot reproduce the visual gate off Linux.

## 8. Recommendations

Each recommendation states why, what, the trade-off, dependencies, and acceptance criteria. IDs in brackets point at the findings it closes.

### R1. Correct the capability statements about templates [D1, G9, G10, G60]

Why: the single cheapest, highest-impact fix. Six verifiers confirmed that the router fences off 85 of 88 templates for any agent without a vendor tool.

What: rewrite `SKILL.md`, `README.md`, `CONTRIBUTING.md`, `llms.txt` and `docs/consuming.md` into a three-tier capability table: (1) preview, axis switching, DOCX and raster PDF are in-repo and CI-gated; (2) a text-layer PDF comes from the browser print path today and from the CLI in R10; (3) PPTX, standalone inline-HTML export, tweak-panel authoring, `check_design_system` and image-slot persistence are external. Change the inventory `runtime` field to name the in-repo runtime and add a separate `hostAuthoring` field. Define the `window.omelette.writeFile(path, json)` bridge as a documented adapter interface any host can implement, or move `image-slot.js` into a templates-only runtime folder. Keep the "compatibility candidate" caveat that `conventions.md:330` already carries.

Trade-off: none technical; the wording must still say the runtime is not a certified DC host export.

Dependencies: none.

Acceptance: a grep for "require the Design Components compiler" across root docs returns nothing; the inventory emits a repository path; the docs-consistency gate asserts both; `image-slot.js` has an exports entry and a consuming section.

### R2. One short agent contract, with enforced rules moved out of prose [D2, D5, D6, D7, D8, G8, G9, G12, G13]

Why: 26,000 hedged words across nine files, with the same rules stated four ways, cannot be held in an agent's working memory beside the code it is editing.

What: shrink `SKILL.md` to roughly 800 words: purpose, a five-row capability table keyed by capability (static CSS only, bundler React, no-build browser, browser automation available, office exporter available) with vendor names in an examples column, the immutables as a table where each row names the test that guards it, a per-task reading order (consume static, consume React, add component, add token, add template), a verify section listing exactly the npm scripts per task, and one boundary paragraph. Add `agent-contract.json` (schema-versioned): immutables with guard-test names, reading order per task, commands per task, generated-artifact ownership map, template capability tiers; add a test that every referenced script and file exists in the packed tarball as well as the tree. Reduce every host shim to one identical generated sentence. Keep `docs/doctrine.md` for immutables, the single gate definition and verification depth, each rule tagged "enforced by <gate>" or "human-judged". Delete the "active revision plan" and "task specification" phrases. Move the CyberOS retirement to one dated ADR line and invert `test-guidance-authority` to assert absence elsewhere. Either add `docs/findings.md` resolving every ticket code or strip the codes, starting with the generated `ds-base.js` (one edit removes 170 occurrences). State the Vietnamese documentation scope explicitly (decision D8). Add tests for the prose-only rules that can be mechanized (no text on mid-tone accent surfaces, slogan literal in the registry, logo asset hashes).

Trade-off: nuance leaves the router; the disclaimers move to one section rather than disappearing.

Dependencies: R1 for content; R6 for the verify commands the contract must name.

Acceptance: a fresh agent given only `SKILL.md` and `agent-contract.json` can name the correct verification commands for each of five task types; hedge-phrase count in `SKILL.md` under 5; shims byte-identical and generated; no root doc references a file that does not exist in the tree or the tarball.

### R3. A component manifest and an accessibility contract per component [G1, G2, G4, G5, G6, G24, D9, D56]

Why: this is the central blocker. Without a structured contract, every agent infers states, keyboard behavior and CSS hooks from 106 JSX files, and no linter can check that a new component is complete.

What: extend `generate-api-index` to schema version 2 with, per export, own versus inherited props, parsed defaults, enum members as arrays, required flags, anatomy and class list (parsed from `cx()` literals), data attributes, states, i18n keys, story and test references. Add `components/<group>/<Name>.contract.json` (or front matter in `.prompt.md`) with: APG pattern, roles per part, required name sources, states, keyboard map, focus behavior (initial, trap, restore), live regions, forced-colors treatment, ownership mode (controlled, dual, uncontrolled with control and default prop names), touch-floor exemptions. Generate the `Keyboard:` and `Localization:` paragraphs of `.prompt.md` and the state-ownership section of `docs/consuming.md` from it; add a gate that every own prop is mentioned in the prompt. Write a generic keyboard-conformance runner that replays each declared keyboard map against the component's story fixture, and a coverage test that fails when an interactive export has no contract. Add `schemas/` with JSON Schema for every JSON export and point `$schema` at repo-relative paths. Write `templates/inventory.json` with a `--check` twin and relax its test to structural invariants. Create `docs/at-review-matrix.md` so the AT rows the board cites exist, with attester, AT and browser pair, date and version. Delete the boilerplate story description so autodocs show the component's own text.

Trade-off: authoring effort for roughly 90 interactive components, partially offset by generating from existing sources. Settle the APG decisions in R5 first so contracts record the intended pattern, not the current one.

Dependencies: R4 for the grammar the manifest encodes; R5 for Menu, CommandPalette and Calendar decisions.

Acceptance: 106 of 106 components carry a schema-valid contract; a sample task ("build a form with validation errors and a confirm dialog") is answerable from contracts alone; the keyboard runner replaces at least the twelve missing keyboard tests; every JSON export validates against its schema in CI.

### R4. Write the API grammar and extract the shared primitives [G3, G14, G15, G16, G17, G18, G20, D25, D26, D27, D28, D29]

Why: sibling components disagree on names and ownership; outside-click dismissal is hand-written in 12 files, roving navigation in 12, controlled-state resolution at 45 sites, the field frame in 4; no component forwards a ref; 59 accept nothing beyond `className`.

What: `docs/api-grammar.md` covering prop names and shared enums (one semantic set: info, success, warning, danger; one size scale), the ownership triplet (`value`/`defaultValue`/`onChange`, `open`/`defaultOpen`/`onOpenChange`), slot names (`icon`, `leading`, `trailing`, `actions`), the event signature rule, passthrough and ref policy, label typing. Add `useControllableState`, `useDismiss`, `useRovingFocus` (with typeahead), a `Field` primitive (ids, describedby, error role) and a `Trigger` helper under `components/_utils`; migrate one overlay family at a time behind the existing gate rows. Decide the ref policy (React 19 `ref` prop plus `forwardRef` for 18) and the root passthrough convention, and apply both. Fix NumberField `defaultValue`; type `onSubmit` and `onComplete` as `void | Promise<unknown>`; deprecate `variant` on AlertDialog. Add one anchored-positioning primitive with a `placement` prop and an optional portal into the overlay root. Export `makeT`, `useLang` and a `registerStrings` API. Add a gate that greps new declarations for the allowed vocabulary and a runtime check that declared props change output.

Trade-off: renames are breaking; they need the deprecation flow from R7 and one minor of grace. The refactor touches about 12 components; acceptance is unchanged gate results plus removed duplicates.

Dependencies: R7 versioning policy.

Acceptance: a ref test covers every component under React 18 and 19; duplicated `mousedown` handlers are gone; `<NumberField defaultValue={5}>` renders 5 in a browser test; `<Drawer data-testid>` reaches the DOM; the grammar gate passes.

### R5. Close the accessibility deviations and add forced-colors support [D30 to D39, G21, G22, G23]

Why: Switch, Tabs and SegmentedControl are invisible under Windows High Contrast, and Calendar, DatePicker, Menu, Popover, DataGrid and CommandPalette are the widgets agents compose most.

What: a `@media (forced-colors: active)` block in `base/a11y.css` that expresses state with geometry and system colors (`ButtonText`, `Highlight`, `SelectedItem`) for Switch, Tabs, SegmentedControl, Checkbox chrome, Slider and ProgressBar, plus a three-engine Playwright pass under `emulateMedia({ forcedColors: 'active' })`. Calendar becomes a grid with one tab stop, arrows crossing months, PageUp and PageDown, `aria-selected`, Vietnamese date labels through `Intl.DateTimeFormat`. DatePicker focuses the selected or current day on open. DataGrid sets `aria-rowcount` and `aria-rowindex` in virtual mode. Popover gets a localized default name or a non-dialog role when unnamed. Menu gets ArrowDown-opens, roving `tabIndex` and typeahead, and either adopts Tab-closes (decision D7) or records the current contract in an ADR so Menu and Menubar agree. CommandPalette becomes combobox plus listbox with `aria-activedescendant`. Menubar gets a name and keyboard focus into submenus; NavigationMenu drops `aria-haspopup`; Drawer body focusability becomes conditional; Switch and Toggle get stable names; the two dead reduced-motion rules go. Extend axe tags to WCAG 2.1 and 2.2 and scan declared variant and state enums rather than default and expanded alone.

Trade-off: the Menu Tab behavior is a visible change locked by a test; that test must change to assert the new contract.

Dependencies: none for the fixes; R3 records the chosen patterns.

Acceptance: forced-colors renders distinguishable Switch states in Chromium, Firefox and WebKit; one tabbable Calendar day; `document.activeElement` is inside the DatePicker popup after open; `aria-rowcount` equals the row total; axe with default Popover props is clean; every AT label on the board resolves to a matrix row.

### R6. Validation as data: one registry, one verify command, machine-readable results [G37 to G45, D3, D4, D14, D47, D51, D53]

Why: nobody can answer "which tests failed and how long did each take" without parsing stdout; one early failure hides the rest; the merge authority is an HTML page; the visual gate cannot pass off Linux; CI fetches tools outside the lockfile.

What: move the suite inventory to `_audit/ci/suite.json` (id, command, engines, lane, tags, estimated ms); make the runner continue on failure and write a JSON summary plus JUnit XML; make the gate registry a JSON file consumed by both `run.html` and `run-gates.mjs`, with Node twins authoritative where they exist; add `npm run verify` (pure Node, every `--check`, api-index, tokens, types, manifest, pack hygiene, docs parity, skills, ci-verdict; under two minutes), `npm run verify:browser` (shardable Playwright lane) and `npm run verify:visual` (serve, pixel diff, gates); make the Pixel CI row platform-aware or move it to `verify:visual`; add `engines`, `.nvmrc`, and `node-version-file` in workflows; add `serve`, `wait-on` and the SBOM tool as exact devDependencies; add a scheduled `npm audit` or OSV scan; generate `components/test-index.json` and gate "every stable component has a behavioral test"; shard by measured duration; run each hard assertion in exactly one job; add the two orphaned touch suites to a lane; run native validation on PRs that touch `tokens/native/`; document the Python prerequisite with a pinned requirements file or port the glyph check to Node; correct `docs/ci-cd.md` and `AGENTS.md`; change Vercel to `npm ci`.

Trade-off: runner work and a registry to maintain; the board stays as the human dashboard. Duration-based sharding needs one cycle of recorded timings first.

Dependencies: none; R2 references the three commands.

Acceptance: fresh clone, `npm ci`, `npm run verify` exits 0 in under two minutes without a browser; a shard with two failures reports both; `run-gates.mjs --json` validates against a schema; Scorecard "Pinned-Dependencies" passes; every test script appears in `suite.json` with a lane.

### R7. Governance for more than one person [D16 to D24, G50 to G53]

Why: all 123 lifecycle records name one owner and the gate rejects any other name; main accepts direct pushes; the release path is undocumented since the bump workflow was deleted; the package is UNLICENSED with a grant that names eight products.

What: `.github/CODEOWNERS` and a small `maintainers.json` with roles (accountable owner, group maintainer, release manager, reviewer) and a named delegate per role; change `test-component-lifecycle` to validate against the registry and let owner differ from reviewer; enable `enforce_admins` and required pull requests with one review (owner self-approval of agent PRs is acceptable, it leaves a diff and a record); a PR template embedding a generated expansion checklist (a script that, given a component name, lists every expected deliverable and which are missing) and a size guard for very large PRs; one ADR format under `docs/decisions/NNNN-slug.md` with Status, Date, Deciders, Context, Options, Decision, Consequences, and `decisions.md` as a generated index with tombstones for 6, 7, 11, 12; freeze accepted ADRs and move follow-on work to new proposals; `docs/versioning.md` (semver mapping for token, class, prop and template changes; deprecation = status plus one minor of grace; React 18 and 19 window; browser matrix); `docs/release-process.md` with either a restored bump workflow or a `workflow_dispatch` release job that bumps, stamps the nine mirrors, tags and creates the release; correct the five documents that claim auto-bump; cut a release from the current tip and move the October bullets out of the 1.7.2 section, or rewrite the GitHub release body to match the August tag; add a prerelease label between releases; decide the outward license (decision D1) and add a LICENSE file; attribute the vendored skills in `THIRD-PARTY-NOTICES.md` or remove them; decide what evidence hashes protect (decision D11) and add a `reviewMethod` field; fix `consumer-grant.md:39`.

Trade-off: review adds latency for a solo owner; the alternative is that a 1,601-file commit is never reviewable by anyone.

Dependencies: none.

Acceptance: `test:unit` passes with a second owner name; branch protection shows required reviews and enforced admins; the release job produces a tag and a publishable tarball in dry run; LICENSE exists; `decisions.md` has contiguous numbering; the GitHub release, tag, npm package and release notes for one version describe the same tree.

### R8. Packaging and build graph [G46 to G49, G54, G55, D12, D45, D48, D49, D52, D55]

Why: the default entry is raw JSX; `require()` fails; no sourcemaps; the tarball is 15.9 MB; `prepublishOnly` rebuilds instead of checking and runs twice; generators read and rewrite each other's output in an order that lives only in a script string.

What: emit `dist/react/index.mjs` and `index.cjs` with sourcemaps via esbuild (external React, automatic JSX, target from browserslist) and point `exports["."]` at them with `import`, `require`, `types` and `default`; keep source JSX under a `./source` subpath; make `prepublishOnly` check-only and remove the duplicate step in `npm-publish.yml`; decide per directory what ships (decision D9) and dedupe the 85 runtime copies if folder portability is not required; generate `tokens/tokens.d.ts`; add `exports["./package.json"]`, `./base/*` and `./assets/*` or document that they are unsupported; collapse the token projection into one pure generator with no read of its own outputs and add a test that deletes every generated token file and reproduces it byte-identically; make `_ds_manifest.json` fully derived or split the authored seed out; write `docs/build-graph.md` and `scripts/build-graph.json`, with `npm run build` in topological order and `npm run build:check` running every twin; add `--check` to the remaining generators and rename the three `generate-*` scripts that only check; add `examples/vite-react` and `examples/next-app` built from the packed tarball in CI; emit minified CSS and bundle with maps beside the readable files; replace the frozen `generated` stamp with VERSION or drop it; unify the `tho.sand` and `tho-sand` key forms; add size budgets for the bundle, the sheet and the consumer fixture; put one APCA implementation in a shared module imported by stories and audit scripts; port `generate-api-index` to the stable TypeScript API or pin the unstable one behind an adapter.

Trade-off: a build step appears for the React entry where there was none; consumers lose the need for `transpilePackages`. Dropping directories from the tarball changes what "portable tree" means and must be documented.

Dependencies: R7 for the versioning policy that governs the export change.

Acceptance: `test-packed-ssr` passes without `transpilePackages`; `require.resolve("@cyberskill/design")` succeeds; unpacked size under about 8 MB with pack hygiene, subtree and asset tests green; `build:check` is the only command `node-prechecks` and `prepublishOnly` call; one APCA module with a Node-versus-browser parity test.

### R9. CSS architecture: layers, support floor, lint, and a stylesheet map [G25 to G32, D10, D11, D42, D43, D44, D54, D40]

Why: no `@layer`, so consumer overrides depend on import order; global `.card` rules override consumers; no browser floor while `color-mix()` appears 169 times unguarded; no CSS lint; 59 of 113 blocks are spread over several files and nothing says where a component's CSS goes; density reaches two components.

What: have `flatten-styles.mjs` emit `@layer cs.reset, cs.tokens, cs.base, cs.a11y, cs.responsive` and wrap each import in its layer, wrap bare element rules in `:where()`, then remove most `!important`; move `.card` and `.case` to the kits; declare a browserslist (roughly Chrome 111, Safari 16.4, Firefox 113) and add `@supports` guards or a down-leveling step; add a `styles` field per component in `lifecycle.json` generated by scanning `base/` for the root class, with a gate for unmapped blocks and hooks, and split `controls.css` by group with concern-named sections; add a CSS lint (stylelint or a Node checker) for the `cs-`/`is-`/`has-` prefix rule, physical properties, a px allowlist, the breakpoint set and `!important` scope, and delete the orphan lint config; introduce `.cs-grid` layout utilities and migrate templates off inline `grid-template-columns`, keeping the `[style*=]` block as a dated compatibility layer documented in `consuming.md`; migrate `controls.css` spacing to tokens so density reaches Menu, Tabs, Table and Field; give the style axis a real switch; use `dvh`, safe-area tokens and a hover-media guard; fix the two contradictory comments and the grammar line; adopt or delete the `.cs-cq-*` helpers and update the decision record; extend the hex gate and link check to `guidelines/` and `templates/`, and set `lang` to match content there.

Trade-off: `@layer` changes cascade outcomes for any consumer that already fights the sheet; test in the three kits first. Removing `[style*=]` rules depends on template migration.

Dependencies: R8 for the build step that applies the browserslist; R10 for the template side of the grid migration.

Acceptance: a plain consumer rule wins over `base/responsive.css` without `!important`; a consumer `.card` keeps its own `min-width`; a test fails on a new feature outside the floor without a guard; `npm run lint:css` runs in CI; JSON can answer "which files style Button"; compact density changes padding on four more components.

### R10. Templates as data [G57 to G61, D15, D41, D44]

Why: templates are the most valuable content and the least reusable. No headless render, content hard-coded in two languages, `<html lang>` never synced, the element map duplicated in 85 files, and the content schema describes slots nothing can fill.

What: `docs/template-grammar.md` plus a JSON Schema for the `data-props` declaration validated in the inventory test; fix `ds-base.js` so the selector skips the root element, regenerate the 85 copies, and assert `documentElement.lang` after a language switch; `scripts/render-template.mjs <slug> --props --content --format html|pdf|docx` using the existing test server, with `page.pdf()` for a text-layer, paginated PDF (keep the in-page raster export as an explicit "image snapshot" option); a content-bound contract where `renderVals` merges validated `content` over its dictionary, with `runtimeBinding` flipping per slot as templates adopt it, starting with invoice, quote and the `vn-*` instruments; expose the element map from the runtime and move template dictionaries to `strings.json` per template validated by the parity gate; document primitives (sheet header, party table, fill-in, clause, signature block, totals) and migrate the 38 `vn-*` instruments first; a static Logo partial so the 50 Logo-only documents can run without React; token the desk and sheet hex in templates and the DOCX exporter; decide on an open PPTX path for the five deck templates or state the boundary once.

Trade-off: a large incremental migration across 85 files; do it per archetype with the inventory tracking adoption.

Dependencies: R6 for the CLI to be part of `verify:browser`; R9 for grid utilities.

Acceptance: a new template written only from the grammar document renders under `support.js`; `npm run template:render -- finance-invoice --content invoice-vi.json --format pdf` produces a text-searchable multi-page PDF in three engines; `html lang` equals the inner scope after `__dcSetProps`; zero templates contain the inline element-map literal; the 38 `vn-*` share one header, party and signature implementation.

### R11. Make the documentation surfaces derive from the specs [G61, G62, D56 to D59]

Why: argTypes are hand-pasted although the API index exists; boilerplate hides the component JSDoc; ten MDX pages are abridged copies of `docs/*.md`; the docs navigation is maintained in four lists; the static HTML path has no per-component snippet; there are zero interaction tests.

What: a helper that maps api-index types to Storybook controls (functions become `control: false`); delete the boilerplate description; replace MDX twins with viewer embeds; generate the nav and `storySort` from the catalog; add an HTML section per component (canonical markup, states, modifiers) rendered in autodocs and the viewer, with a gate that every `.cs-<name>` root class has a snippet; add a Storybook test lane (addon-vitest or test-runner) so every story mounts and addon-a11y reports; add play functions for interactive primaries; require Default stories to accept args; add stories for FormWizard, FormFieldArray and Tab; add `empty` and `errors` to the contract's state keys; read VERSION and counts at build time.

Trade-off: a Storybook test lane adds minutes to the storybook-build job; it replaces a class of manual review.

Dependencies: R3.

Acceptance: no hand-written argTypes block for props the index declares; the Docs tab shows the component's own description; the docs nav has one source; a story that throws on mount fails CI; every root class has a snippet.

### R12. Hygiene [D54, G11, G12, and the critic's small items]

Delete `_adherence.oxlintrc.json`; trim the adapter directories to their seven SKILL files or move the upstream payload to an excluded vendor directory with notices and a gate against install commands; move process history to `docs/history/` outside the npm files list; drop `'unsafe-inline'` from `script-src` by hashing Storybook's fixed inline scripts; extend the asset budget to every file in `assets/` and decide whether the 174 KB `logo-mark.png` is needed beside the 14 KB SVG; reference or remove the root `.thumbnail`; confirm whether `docs/viewer.html` works from `file://` and document the serving requirement if not; `git gc` locally and ignore `_audit/revision/`.

## 9. Roadmap

Ordering principle: remove false statements and single-person locks first, then convert prose into checkable specs, then change packaging, CSS and template architecture. Items within a phase are independent unless noted.

### Phase 0: immediate (first two weeks, no architecture change)

1. R1: correct the template capability statements and the inventory field; document or relocate `image-slot.js`.
2. R7 (part): maintainers registry and lifecycle test; enforced admins and required reviews; correct the five auto-bump sentences; move the October bullets to "Unreleased" or cut a release; LICENSE after decision D1; fix `decisions.md` numbering and the dangling §7.
3. R8 (part): `engines` and `.nvmrc`; check-only `prepublishOnly`; remove the duplicate step in `npm-publish.yml`; pin `serve`, `wait-on` and the SBOM tool; Vercel `npm ci`.
4. Runtime fixes with tests: NumberField `defaultValue`; `ds-base.js` `html lang` sync; dead reduced-motion rules; Switch and Toggle stable names; Calendar Vietnamese label; `.card`/`.case` moved out of `base/`.
5. Tokens: a hand-authored type inventory so adding a token no longer fails; `npm run tokens:check`; name `tokens:generate` and `tokens:check` in `SKILL.md`, `AGENTS.md` and `CONTRIBUTING.md`.
6. Docs truth: delete the "active revision plan" phrases; fix `AGENTS.md` prerequisites and the nightly-issue claim; fix the two CSS comments and the class grammar line; delete the orphan lint config; wire the two orphaned touch suites to a lane; document the Python prerequisite.

### Phase 1: foundational (one to three months)

1. R6: suite registry, continue-on-failure runner with JSON and JUnit, gate registry JSON, `verify`, `verify:browser`, `verify:visual`, platform-aware pixel row, test index and coverage gate, native validation on PRs.
2. R2: the agent contract (`SKILL.md` rewrite, `agent-contract.json`, generated shims, doctrine tagging, CyberOS and ticket-code cleanup, mechanized prose rules). Depends on R1 and R6.
3. R4: API grammar document, shared primitives, ref and passthrough policy, enum unification with deprecations, positioning primitive, string registry API. Depends on the versioning policy from R7.
4. R5: forced-colors support, the APG fixes and the AT matrix file.
5. R3: component manifest schema version 2, per-component contracts, generated prompt sections, keyboard runner, JSON Schemas for every export, written template inventory. Depends on R4 and R5.
6. R8 (rest): compiled dist with exports conditions, typed tokens, tarball diet, pure token projection, derived manifest, build graph with `build` and `build:check`, bundler examples, one APCA module, size budgets.
7. R7 (rest): ADR format, versioning and release process documents, release job, evidence-hash semantics, PR template with generated checklist.

### Phase 2: expansion (three to six months and beyond)

1. R9: cascade layers, browserslist and guards, CSS lint, stylesheet map, `controls.css` split, grid utilities, spacing tokens, style-axis switch, guidelines cleanup.
2. R10: template grammar and schema, render CLI with text-layer PDF, content-bound rendering, shared element map and `strings.json`, document primitives for the `vn-*` set, static Logo partial, locale registration.
3. R11: spec-derived Storybook (controls, descriptions, nav, snippets), interaction tests and a story render lane.
4. Token modes in a tool-readable shape (per-mode DTCG documents or Tokens Studio themes) and typed native packs with a resolve helper.
5. A framework-agnostic core (`components/_core`: overlay manager, focus trap, language resolution, dismiss, roving, controllable state) with React hooks as adapters, and a manager per `OverlayProvider`.
6. A visual regression matrix generated from the manifest (archetype templates by theme, element, language and width) with component crops as hard checks; Lighthouse on the kitchen sink and one template.
7. Consider workspaces (tokens, css, react, templates, docs-site, audit tooling) once the build graph exists; do not split before, since the graph is what makes a split safe.

## 10. Decisions that need your input

Each decision lists the options, the trade-off, and a recommendation. The roadmap assumes the recommended option; a different choice changes the affected items, not the sequence.

### D1. Outward license

Options: (a) keep UNLICENSED and add a partner-grant template to `docs/consumer-grant.md`; (b) a source-available license for code, CSS and tokens with brand assets, logo, Lumi and the slogan reserved; (c) a permissive license for code with the same brand reservation.

Trade-off: (a) blocks any partner or agent that is not one of the eight named products and leaves the public npm package in a contradictory state; (b) lets partners and other agents use the system while keeping identity protected; (c) maximizes reuse but allows forks of the design language.

Recommendation: (b), with a LICENSE file either way, and a written rights decision on the reconstructed template runtime recorded in the same ADR.

### D2. Template strategy

Options: (a) keep the `.dc.html` grammar and in-repo runtime, add the render CLI and content-bound rendering; (b) convert templates to plain HTML plus JSON data plus a small Node renderer and retire the DC grammar.

Trade-off: (a) is incremental and keeps tweak-panel authoring in a DC host possible; (b) is the most portable end state but loses host authoring and is a large one-time migration with regression risk across 85 files and 62 print contracts.

Recommendation: (a) now; revisit (b) per archetype after the content-bound contract and primitives exist, since those make a later conversion mechanical.

### D3. Component source language

Options: (a) move sources to TypeScript and emit `.d.ts`; (b) keep JSX and add JSDoc types with `checkJs`; (c) keep hand-written `.d.ts` and add more drift gates.

Trade-off: (a) gives compiler-verified props, defaults and callback shapes and pairs with the compiled dist in R8, at the cost of TypeScript fluency for contributors; (b) is lighter but weaker; (c) leaves semantic drift (the NumberField case) invisible.

Recommendation: (a), scheduled with the compiled dist so there is one build step rather than two.

### D4. Generated artifacts in git

Options: (a) keep committing generated files with a complete `build:check`; (b) generate at publish and build time only.

Trade-off: (a) keeps the no-build consumer tree and template folders self-contained and makes drift visible; (b) shrinks diffs and the repository but breaks the direct-load paths.

Recommendation: (a), stated explicitly in the build graph document.

### D5. Review and ownership model

Options: (a) required pull requests with one review, owner self-approval allowed for agent-authored PRs, CODEOWNERS with at least one delegate; (b) keep direct pushes and rely on CI.

Trade-off: (a) adds latency and needs a second named person; (b) keeps the bus factor at one and leaves large commits unreviewable.

Recommendation: (a). The second name can be a delegate with limited scope.

### D6. Release mechanism

Options: (a) restore the Conventional Commits auto-bump workflow; (b) a manual `workflow_dispatch` release job that bumps, stamps, tags and creates the GitHub release.

Trade-off: (a) is hands-off but conflicts with the human acceptance gates the release notes describe; (b) makes every release an explicit act.

Recommendation: (b), with a prerelease label between releases so a version string never identifies two trees.

### D7. Menu keyboard contract

Options: (a) adopt the APG menu-button pattern (items are not tab stops, Tab closes, ArrowDown opens); (b) keep the current tested contract where Tab walks items and leaves the menu open, and record it in an ADR so Menu and Menubar agree.

Recommendation: (a); it is what screen-reader users expect and what the contract in R3 should record.

### D8. Vietnamese scope for the entry chain

Options: (a) translate `SKILL.md`, `CONTRIBUTING.md` and `README.md`; (b) declare the entry files EN-only, keep VI mirrors for `docs/*.md`, extend the parity test to `docs/decisions/`.

Recommendation: (b), stated in doctrine and `llms.txt` so nobody claims coverage that does not exist.

### D9. What the npm tarball ships

Options: (a) keep the full portable tree (15.9 MB); (b) drop Babel, thumbnails, group cards and the full API index, keep templates with deduplicated runtimes (roughly 8 MB); (c) split a docs or reference tarball.

Recommendation: (b).

### D10. The expansion rule

Options: (a) keep "update every deliverable in the same change" as prose; (b) replace it with a generated per-task checklist whose items name the gate that verifies them, and relax "all templates" to "templates that declare the affected enum", proven by the inventory.

Recommendation: (b). The rule as written produced 1,601-file commits.

### D11. Evidence hash semantics in lifecycle records

Options: (a) hash only the declaration contract and re-review on contract change; (b) keep whole-source hashes and flip `reviewState` to "unreviewed" automatically when any hash changes, with an explicit re-review command and a `reviewMethod` field.

Recommendation: (b); it is more honest, and the command can be part of the PR checklist.

## Appendix A: optional improvements

Recorded by the auditors without verification, listed so nothing is lost.

- Tokens: 22 camelCase token names break the kebab grammar; `elements.css` ships 21 KB of superseded legacy rules beside the resolver; dark and system override blocks are typed twice in three files; `element-seeds.json` carries a hand-maintained version string.
- Components: story enum arrays duplicate the declarations; 30 components inline their own SVG while an Icon component exists; generic default names ("Menu", "Tooltip", "Slider") hide missing labels; Tree lacks typeahead and `*` expand-all; SegmentedControl reuses `tablist` for a value picker; TreeTable exposes no hierarchy; Accordion omits `aria-controls` and heading wrappers; Carousel lacks slide semantics and a live region.
- CSS: `_cs-light`/`_cs-dark` toggle pattern is documented only in a generated file; dense one-line test files; unprefixed state helpers.
- Templates: every template loads the 557 KB bundle plus 190 KB React, most for a single Logo; the 85 runtime copies cost 1.5 MB per install; email-safe templates are hand-written with brand hex; the inventory marks verification "not-established" where CI proves it; UI kits are parallel implementations that use none of the 106 components except in `chat.html`.
- Build: `_ds_manifest.json` mixes authored inputs and generated outputs; `api-index.json` at 2.4 MB is too large for an agent context (a compact variant would help); consumer cost measurements run but no results are kept; Figma, native-store and native-validation pipelines are optional scaffolds that read as gates.
- Testing: three-engine fan-out and crash retries indicate runner memory pressure; `native-store` runs on every PR without a path filter; publish does not re-run gates for the released SHA; the local git object store holds 491 MB of untracked evidence in tool-created refs.
- Governance: process history dominates `decisions.md`, `release-notes.md` and source comments; `SECURITY.md` lacks a supported-versions table and a response window.
- Storybook: ten MDX pages are hand-written twins of `docs/*.md`; the docs navigation lives in four lists; README group lists and Atomic View arrays duplicate the generated inventory; group-level `card.html` specimens are a third specimen format only the external compiler reads; MDX pages are English-only.
- Security: the served CSP allows `'unsafe-inline'`; the Editor trust boundary itself is sound.

## Appendix B: refuted, downgraded and unverified items

Refuted as a defect:

- "Browser PDF export is a single raster page with no text layer." The behavior is real, but it is designed, documented (`docs/conventions.md:107`) and tested (`test-doc-export.mjs:270-285`); a text-layer PDF exists through the browser print path. Kept as an improvement under R10.

Downgraded by verifiers (held, severity lowered): the circular reading chain (a per-audience order exists in README); the gate definition drift; rule restatement; the tarball `SKILL.md` links; the frozen `generated` stamp; the gate board cold-checkout failure (documented decision); visual regression breadth (documented curated set); the missing test framework (every component is rendered and axe-scanned); the vulnerability audit (Dependabot and Scorecard exist); the raw-JSX entry (documented, with a legacy alternative); the exports map gaps; the npm-hello fail-closed job; the build graph (the `tokens:generate` orchestrator exists); Menu Tab behavior (documented and tested contract); Popover no-focus-move (documented); CommandPalette (documented boundary); axe scope (test-runner absence is documented); keyboard test coverage (two of the named components do have assertions); AlertDialog alias (documented); the field frame (FormField renders errors visually); the framework-agnostic core (a roadmap item, not a blocker); template localization (locale deferral is an owner decision); the bundler example (the bundler path is CI-verified); the read-modify-write generator chain (CI diffs the full chain); the overlay singleton (documented limitation); the monolith split; Storybook interaction tests (Storybook is host-only by decision); companion story coverage (browser tests exist); the ticket codes (noise, not a broken contract).

Unverified (reported, could not be confirmed read-only):

- Whether the 123 support reviews involved per-record human reading (all share one millisecond timestamp).
- Which path published 1.7.0 to 1.7.2 to npm, given that the publish runs show "failure".
- Which checks actually block a PR (the live ruleset was partly read through the API; required reviews are absent).
- Real Windows High Contrast and non-Chromium forced-colors rendering (Chromium emulation only).
- Whether an `inert` polyfill is needed for the supported browser floor.
- Rights status of the reconstructed template runtime and export scaffold.
- Storybook output byte-reproducibility across machines.
- `docs/viewer.html` behavior from `file://`.
- Templates with tables inside control blocks opening from `file://`.
- Where template thumbnails are regenerated.
- PPTX for decks and Word fidelity of complex DOCX.
- Templates executed from an installed `node_modules` copy.
- The deployed site and Figma soft-skip reflecting main.
- Whether `generate-api-index` breaks on other TypeScript versions.
- Whether the `cs.mjs` React version statement matches the vendored file.
- JetBrains Mono weights 500 and 700 declared against `-400-` files (likely a retained variable axis).
- Doctrine item 5 "counts follow the compiler" versus the reference catalog generator.

## Appendix C: per-dimension reports

The eleven audit reports (and the second-pass versions for seven dimensions), the batched verifier reasoning for every verified finding, the critic's report and a tab-separated table of all 181 findings with their verdicts are saved beside this file under `audit/`. Each report lists what it read, what it ran, and what it did not cover.
