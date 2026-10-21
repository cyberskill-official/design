# Release Notes

Curated product highlights for operators. This is **not** a git log and **not** a `CHANGELOG.md` — the design system does not maintain a changelog file. source checkout VERSION **<!-- cs-source-version:checkout -->1.7.2<!-- /cs-source-version -->** identifies the repository version. This page supplies Storybook **Release Notes**; local edits do not establish what is deployed at `design.cyberskill.world`.

## Unreleased revision — local implementation, acceptance pending

These changes belong to the current revision working tree. They are not a published package, deployed site or accepted release. The exact dated Practice FAQ and DOCX pilot artifacts have separate owner acceptance. Changed builds and unreviewed scopes need their own verdict. VERSION remains the repository version.

- Component repairs cover Editor HTML handling, declared types and state ownership, IME-safe submission, nested dismissal/focus, Carousel hidden-slide focus, Tooltip descriptions, and scoped theme/language behavior. Each result is limited to its recorded test scope; native input and assistive-technology checks remain separate.
- Portable package and public-site checks cover asset closure, private-file exclusions and build freshness. Generated token declarations preserve source conditions; generated native files alone do not prove native rendering parity.
- Status Hub project details now use a modal dialog with keyboard opening, Escape dismissal and focus return. This kit repair is not evidence of adoption in a consuming product.

- The DOCX exporter retains supported flat ancestor and table-cell backgrounds, keeping white header text visible and allowing explicit white cells to reset inherited shading. The original document repair and scoped three-browser checks are retained as dated evidence. Gradients, background images and group opacity are outside this paint contract; compare the required export in its target application.
- DOCX exports preserve browser-resolved grid-column proportions so wide callout prose does not collapse into equal-width cells. Three-engine regression cases and dated English/Vietnamese office renders retain the evidence; unresolved syntax and broader CSS layout fidelity remain outside this contract. Fractional rounding also keeps narrow trailing columns nonnegative while conserving the table width.
- The current local Practice FAQ pilot uses an exact retained package, with rollback and migration records. Its dated checks cover 36 browser cases, 18 flat-body contrast scopes, 12 coarse-pointer axe scans and four cold resource trials against approved local ceilings. Those results do not establish field performance, human speech behavior, visual acceptance or production deployment.

- Historical snapshot: Stephen Cheng approved the support policy on 14 October 2026; the 17 October record listed 123 reviewed exports. That dated review does not approve changed evidence. Current source hashes and review states in `components/lifecycle.json` determine whether fresh review is required; visual, manual accessibility and release acceptance remain separate.

- Destructive AlertDialogs initially focus Cancel; ordinary confirmations initially focus Confirm. The existing `tone`/`variant` precedence, callbacks, Escape dismissal and focus return are retained. This operator-approved policy still requires its current browser and assistive-technology evidence.
- Custom popup form controls (`Combobox`, `DatePicker`, `TimePicker`, `ColorPicker`, `Cascader`, and `TreeSelect`) accept `"aria-labelledby"` on both the trigger control and open popup surface so external field headings can name them without duplicate `aria-label` strings.

### Before adopting this revision

1. Select a reviewed candidate and record its source commit and package hash; retain the previous package or subtree commit for rollback. Do not install a presumed registry version for these unreleased changes.
2. Audit state ownership against [Consuming & upgrading](consuming.md#component-state-ownership): a callback alone no longer makes a dual-mode input controlled. Supply `value`, `checked`, `pressed` or `open` only where declared, and update parent-owned values in response to callbacks. Native wrappers retain native event callbacks.
3. Recheck stored Editor content and paste/drop flows against the declared HTML trust boundary. `unsafeHtml` is not permission to insert executable markup. Verify allowed formatting in the actual editing workflow.
4. Recheck nested overlays, delayed and portalled language scopes, light/dark/system themes, coarse-pointer targets, and error/loading states in the actual product. For documents, compare content, assets, pagination and the required export in its target application. Record the candidate, environment, evidence and owner verdict for both pilots.

Release remains pending human visual acceptance, required native/manual assistive-technology checks, provenance decisions, and acceptance of changed pilot artifacts. Changed support evidence requires fresh review in `components/lifecycle.json`. EN/VI is the intended language scope; Japanese remains a partial spike. No support expansion, deprecation or removal is authorized by this note.

## Release — `@cyberskill/design@1.7.2`

Identity correction (21 October 2026): npm published this package on **2026-08-13T08:50:39.579Z**. The remote annotated tag `v1.7.2` resolves to commit `792b503e71c115d76f26eb4721cc4b04a9b6e6c3`, matching the registry-reported `gitHead`. The GitHub release page reports publication on **2026-10-19T13:32:00Z**; this later page date does not change the package contents. These observations are identity metadata, not independent cryptographic provenance verification.

The October remediation below describes later, unreleased repository work and is not a claim about the August package. The owner selected **`2.0.0-alpha.0`** for preparation; as of this correction it is unpublished and untagged, and preparation remains subject to source review, compatibility and acceptance gates.

Superseded October summary, retained as a historical quotation:

> Independent five-domain audit closure, complete review of all 123 component/constant support records in `components/lifecycle.json`, Linux visual baseline alignment (`_audit/baselines/`), custom form picker `"aria-labelledby"` support, and concurrent three-browser CI execution across Chromium, Firefox and WebKit.

```bash
npm install @cyberskill/design@1.7.2
```

## Release — `@cyberskill/design@1.3.10`

Docs publication follow-through: single VERSION wording on operator surfaces (no separate “pin” / LAUNCH dual lead-in). Historical Release / Patch / LAUNCH sections below stay as dated archive.

## Release — `@cyberskill/design@1.3.9`

Operator docs ship through the Storybook **Docs** sidebar (doctrine home, EN·VI tracked set, docs↔Storybook coverage + link gates). Live Status HTML gates check **published** surfaces only; Node twins still prove CSF/MDX source. Per-page Docs stories pass `?embed=1` so the Documentation Library chrome stays hidden inside Storybook (standalone `/docs/viewer.html` unchanged).

```bash
npm install @cyberskill/design@1.3.9
```

## Release — `@cyberskill/design@1.3.0`

Assessment remediation Phases 0–5 and gap closure (TASK-IMP-001…021): contrast, pack-contract, overlay manager, zoom/CQ gates, and related Storybook / template polish landed as one product line.

## Release — `@cyberskill/design@1.2.0`

`VERSION` tracks the repository release version. Curated continuity stays on this page — still **no** root `CHANGELOG.md`.

## Patch — `@cyberskill/design@1.1.1`

Lockstep republish after the LAUNCH cut: regenerate natives / provenance / `_ds_bundle.js` so registry matches tip, and drop the forbidden root `CHANGELOG.md`. Install:

```bash
npm install @cyberskill/design@1.1.1
```

## LAUNCH — `@cyberskill/design@1.1.0`

Owner **LAUNCH** cut. `VERSION` / `package.json` and every version stamp move from the pre-LAUNCH **1.0.0** pin to **1.1.0**. Publish via **npm Trusted Publishing (OIDC)** on tag `v1.1.0` (or `workflow_dispatch`). Package Publishing access on npmjs **disallows tokens**. Soft-skip on the npm-hello registry install is honest until **1.1.0** is live on the registry — soft-skip ≠ published.

Approved use for CyberSkill portfolio products remains in **`docs/consumer-grant.md`** (+ VI). The package remains **UNLICENSED**. First-consumer browser path: `examples/npm-hello/` (Lumi · Hỏa · plasma) — see `docs/consuming.md`.

```bash
npm install @cyberskill/design@1.1.0
```

## Storybook at the domain root

`design.cyberskill.world/` is the full Storybook product site. Docs, Foundations, Components, Release Notes, and Status live in one sidebar. Legacy `/dashboard` and `/playground` paths redirect to `/`.

Portable consumers: `styles.css`, `_ds_bundle.js`, bundler-native `_esm/react.mjs` (default `exports["."]`; React peer), and browser legacy `_esm/cs.mjs` (`@cyberskill/design/legacy`). Storybook is host-only tooling.

## Quality gates on Status

The **Status** story embeds the fast gate board (`_audit/run.html`). Hard gates fail the board when broken; advisory rows are labelled clearly and do not flip the aggregate pass. Open Status once to auto-run; use **Re-run** for a fresh pass.

## Bilingual docs and templates

Tracked operator docs have EN·VI pairs under `docs/` / `docs/vi/`. Template language capabilities and limitations are declared per template. Registered component strings use the locale contract; consumer-provided content requires its own translation and review.

## Foundations and CSF library

Theme × Element × Language × Style toolbar globals mirror production templates (Theme includes **system** for OS `prefers-color-scheme`). Every public primary ships a Default story plus an honest control matrix; FullMatrix covers every ≥1-axis qualifier. Axe smoke scans all public primaries. Style’s sole pack is **liquid-glass**. Foundations cover colors, typography, spacing, elevation, motion, and the 15 Ngũ Hành element packs.

## Tokens and native mirrors

CSS tokens and generated JSON/DTCG/native outputs have different representational limits. See [conventions](conventions.md) for source conditions and export scope. Generated parity checks do not establish native toolchain or rendering parity. Text contrast must be measured on the actual surface and state; a passing token matrix does not certify every composition.

## What we never ship

- A root **`CHANGELOG.md`** (forbidden by doctrine and docs-consistency)
- Storybook as a consumer dependency
