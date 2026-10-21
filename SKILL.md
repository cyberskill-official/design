---
name: cyberskill-design
description: Build and maintain CyberSkill interfaces and branded artifacts using this repository's components, tokens, assets and templates. Use for CyberSkill design-system consumption or revision across static HTML, React and supported document workflows.
---

<!-- BEGIN GENERATED ENTRY LANGUAGE ROUTE v1 -->
**Tiếng Việt:** [Đọc hướng dẫn đầy đủ](docs/vi/entrypoints/SKILL.md) · **English:** full original guidance follows below.
<!-- END GENERATED ENTRY LANGUAGE ROUTE v1 -->

# CyberSkill design

Read [README.md](README.md) for brand and system orientation, then load only the references relevant to the requested work. This file is the shared design-system entrypoint for agent hosts; [docs/doctrine.md](docs/doctrine.md) governs expansion, verification and immutables. [docs/consuming.md](docs/consuming.md) defines consumer setup. Component source, declarations and adjacent `.prompt.md` files establish implementation details; inspect all three when changing a public contract.

For repository maintenance, follow [CONTRIBUTING.md](CONTRIBUTING.md), repository-only AGENTS.md and the documented npm/browser checks. The generated portable contract below carries retirement, validation and operator-approval boundaries.

## Choose the supported path

This root file is the shared repository router. Discoverable task skills live under `.agents/skills/` and `.cursor/skills/` and route here. For skill maintenance, run `npm run test:repository-skills` to validate YAML metadata, linked local resources and adapter parity. These checks do not prove successful loading or behavior in every agent host.

| Task | Source and runtime |
|---|---|
| Static HTML, including Stitch | [DESIGN.md](DESIGN.md), [styles.css](styles.css), `.cs-*` classes and [kitchen-sink](templates/kitchen-sink.html). For plain HTML use `.cs-*`; `.dc.html` additionally uses the shipped browser interpreter described in [template grammar](docs/template-grammar.md). |
| Bundler React, including Next/Vite/SSR | `@cyberskill/design` resolves to compiled ESM at `dist/esm/_esm/react.mjs` with peer React and linked source maps. Explicit `@cyberskill/design/source` retains raw JSX for source-aware bundlers. Follow [consumer setup](docs/consuming.md) and load CSS. |
| Legacy no-build browser | [_esm/cs.mjs](_esm/cs.mjs) loads [_ds_bundle.js](_ds_bundle.js). Resolve `window.CyberSkillDesignSystem_*` by prefix, never a fixed compiler suffix. This entry is browser-only, not an SSR entry. |
| Browser templates and exports | Serve `templates/<slug>/<Name>.dc.html` with its relative resources: shipped `support.js` interprets the grammar, `__dcSetProps` changes declared controls, and document templates offer browser PDF/DOCX. See [template grammar](docs/template-grammar.md) and [export conventions](docs/conventions.md). Host tweak panels, PPTX and `super_inline_html` require external tooling. |
| System revision | [Doctrine](docs/doctrine.md), [conventions](docs/conventions.md), [audit instructions](_audit/README.md) and the user's task scope. Preserve source/generated-artifact relationships. |

Generated [DESIGN.md](DESIGN.md) is refreshed by `npm run build:design-md`; do not hand-edit it. CSS tokens live in [tokens](tokens/); machine exports include `tokens.json`, `tokens.js` and `tokens.dtcg.json`. Their presence does not establish complete format conformance or native-platform support: verify the required value types, axes and consuming toolchain. Use [VERSION](VERSION) and [release notes](docs/release-notes.md) for release identity rather than copying version/count claims into instructions.

## Design constraints

- The generated doctrine table below owns brand, slogan, voice, accessibility, axes and style immutables. Preserve the official logo assets and golden Lumi.
- Theme × Element × Language × Style are intended independent axes; defaults are `light · tho · vi · liquid-glass`. Test actual scope composition for the requested use. Use the 10-role `--cs-accent-*` pack including `on-strong`; product assignments are in [docs/products.md](docs/products.md). Semantic statuses and the composite focus indicator (text-primary contour + ochre halo) are never elemental.
- Liquid-glass is the sole style pack. Reuse existing components and tokens before introducing a new visual vocabulary or framework. Generic skills bundled under `.cursor/skills` do not override this contract or authorize framework installation.
- Preserve Vietnamese diacritics. Check the documented language scope of business templates before claiming bilingual coverage.
- Consume font-family tokens for Be Vietnam Pro, JetBrains Mono and the opt-in display face; use official assets rather than recreating them. Copy required resources with standalone artifacts and verify their relative paths offline.
- Follow the source-derived accessibility floor below and preserve reduced-motion and contrast preferences. Verify contrast on actual surfaces and interaction states. A theme name or passing token matrix is not proof that every rendered pairing passes.

## Verify the delivered scope

For repository changes, run the relevant targeted regressions and `npm run test:unit`; follow repository-only _audit/README.md for browser gates and pixel-check prerequisites. Apply doctrine's whole-set checks when a shared contract changes. Identify tested source/runtime, state, language, theme and viewport coverage, plus any unavailable tools or manual checks.

For a consumer artifact, exercise its actual imports, referenced assets, interactions and export path. Validate exported output separately from the source view. Host-only tools such as `gen_pptx`, `super_inline_html` and `check_design_system` are conditional capabilities, not repository commands. The portable repository gate is `npm run test:unit` plus the fast audit board; the external compiler check is supplemental when available. Do not infer editable PPTX/DOCX, offline HTML, native, Figma or deployed support from a scaffold or file extension.

Keep confirmed defects, proposed improvements, local test success and human acceptance distinct. Historic audits and generic bundled references are supporting evidence, not current normative instructions.

## Declared API lookup

`components/api-index.json` is generated from the public TypeScript declarations. Find an export by name, then resolve each `props[].definition` through `propDefinitions` for its declared type, optionality and documentation, including inherited native props. Source/declaration paths and hashes locate the authoritative contracts. Type display strings can retain aliases or abbreviate complex types. Lifecycle labels are copied declarations, not proven support, assigned ownership or human acceptance. Regenerate with `npm run build:api-index`; check with `npm run test:api-index`.

`components/prompt-api.json` and the fenced Declared API sections in component prompts project authored prop/default references from the canonical declaration and runtime inventories. `components/specifications.json` separates exact JSX observations, bounded reviewed semantics and mapped test assertions from unverified coverage. Candidate slots, observed key literals and passing fixture references do not establish a complete behavior or accessibility specification. Run `npm run build:prompt-api` then `npm run build:component-specifications` after rebuilding the canonical API/contracts; runtime evidence is captured and verified separately with `npm run test:component-behavior-evidence`. The repository decision `docs/decisions/component-specification-evidence.md` records these limits.

For template content, read `docs/template-schema-v2.md`: sidecar slots describe source holes, not automatically writable runtime props. Inspect `data-props` and `renderVals()` before using `__dcSetProps`; computed values can override supplied props. Edit authorized source content and verify preview/export unless an explicit runtime binding is declared and tested. Adopted plain-text slots use `__dcSetContent`, separately from control props; see the schema guide for validation and rollout scope.

For token maintenance, run `npm run tokens:coverage` alongside
the declaration graph: base typed membership, scoped literal colors, unresolved
expressions and style metadata have different portability boundaries. Preserve
selectors/conditions; never promote a scoped value to a root default solely to
complete a token count. See `docs/conventions.md` for regeneration and checks.

Use [the generated reference catalog](docs/reference-catalog.json) for declared counts and public document roles. It identifies routing authority, guides and evidence without treating inventory or historical reports as current capability acceptance.

Semantic status fills use `--cs-color-semantic-{role}` with their matching `-fg`; text on page/panel/raised uses `--cs-color-semantic-{role}-text`. Muted text and regular body links must clear the body floor on each actual surface. Fixed white print sheets start an explicit Light scope and declare their own primary text color; adaptive sheets follow their theme.

Strong callouts pair `--cs-accent-strong` with `--cs-accent-on-strong`; both mode packs clear body APCA75 (generator target78) and WCAG4.5. Dark primary buttons consume `on-strong`. Preserve the two brand anchors and the other eight accent roles. Mark purely decorative separators explicitly hidden from the accessibility tree while preserving their visible glyphs.

For token changes, edit the CSS source and authored `tokens/base-inventory.json` membership/type metadata, then run `npm run tokens:generate` followed by `npm run tokens:check`. These commands regenerate and verify derived outputs; do not patch generated mirrors independently.

First-party entry guidance has Vietnamese-first routes to paired translations under `docs/vi/entrypoints/`; every component prompt presents Vietnamese before its preserved English text. Authored operator guides and source-only maintainer decisions keep their declared `docs/vi/` mirrors. Technical identifiers, exact code examples and verbatim third-party materials retain their original language. Source-bound guards check pairing, coverage and freshness; they do not establish human linguistic acceptance or publication of private documents.

Read [current component API grammar](docs/component-api.md) before extending prop ownership, callbacks, enums, refs or forwarding. [Generated component source contracts](components/contracts.json) separate authored/inherited props and locate default expressions, CSS hooks and declared keyboard text; build/check with `npm run build:component-contracts` and `npm run test:component-contracts`. Source facts do not imply a complete semantic or accessibility contract.

<!-- BEGIN PORTABLE GUIDANCE CONTRACT -->
<!-- Generated by scripts/generate-guidance.mjs; edit its authored sources, not this block. -->
Read [SKILL.md](SKILL.md) for runtime routing and [docs/doctrine.md](docs/doctrine.md) for normative expansion, verification depth and immutables. The machine-readable projection is [guidance/agent-contract.json](guidance/agent-contract.json); generated inventories and historical evidence do not grant capabilities or acceptance.

CyberOS orchestration and its two acceptance gates were retired by operator decision on 2026-10-08; no CyberOS installation is required. Product visual review and manual accessibility acceptance remain separate requirements. Never push, deploy or merge without explicit operator instruction.

The portable repository gate is `npm run test:unit` plus the fast [audit board](_audit/run.html); generate the Linux pixel receipt before its board gate. Follow doctrine's whole-set and relevant-state checks. An external compiler check is supplemental when available, not a repository command. State actual source/runtime, language/theme/state/viewport coverage and unavailable/manual checks.

Doctrine immutables (source-derived):

| Immutable | Value |
|---|---|
| Slogan | *Turn Your Will Into Real* / *Hiện Thực Hoá Ý Chí* |
| Primary brand | Umber `#45210E` |
| Primary accent | Ochre `#F4BA17` |
| Voice | warm · direct · honest · respectful (all four at once) |
| Language | Vietnamese-first; every UI string ships an EN + VN pair |
| Accessibility floor | APCA Lc ≥ 75 body text; focus rings never removed; ≥ 44px touch targets |
| Axes | Theme × Element × Language × Style (independent) |
| Style pack | liquid-glass (sole pack; absent ≡ default) |

- **static-html** — `styles.css`; [guide](DESIGN.md). Use .cs-* classes; .dc.html additionally requires the shipped interpreter or a verified grammar-aware runtime.
- **react** — `@cyberskill/design`; [guide](docs/consuming.md). Compiled ESM with peer React; explicit @cyberskill/design/source is raw JSX. CommonJS is not promised.
- **legacy-browser** — `_esm/cs.mjs`; [guide](docs/consuming.md). Browser-only; resolve the CyberSkillDesignSystem_ global by prefix, not a fixed suffix. Not an SSR entry.
- **document-templates** — `templates/_vendor/support.js`; [guide](docs/template-grammar.md). Serve relative resources. Browser preview, declared controls/content and PDF/DOCX have scoped checks; host authoring tools, PPTX and super_inline_html remain external.
<!-- END PORTABLE GUIDANCE CONTRACT -->
