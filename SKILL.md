---
name: cyberskill-design
description: Build and maintain CyberSkill interfaces and branded artifacts using this repository's components, tokens, assets and templates. Use for CyberSkill design-system consumption or revision across static HTML, React and supported document workflows.
---

# CyberSkill design

Read [README.md](README.md) for brand and system orientation, then load only the references relevant to the requested work. This file is the shared design-system entrypoint for agent hosts; [docs/doctrine.md](docs/doctrine.md) governs expansion, verification and immutables. [docs/consuming.md](docs/consuming.md) defines consumer setup. Component source, declarations and adjacent `.prompt.md` files establish implementation details; inspect all three when changing a public contract.

For repository maintenance, follow the repository-only `AGENTS.md`, the active revision plan and documented npm/browser checks. CyberOS orchestration and its two acceptance gates were retired by operator decision on 2026-10-08; no local CyberOS installation is required. Preserve product visual review and manual accessibility acceptance. Never push, deploy or merge without explicit operator instruction.

## Choose the supported path

This root file is the shared repository router. Discoverable task skills live under `.agents/skills/` and `.cursor/skills/` and route here. For skill maintenance, run `npm run test:repository-skills` to validate YAML metadata, linked local resources and adapter parity. These checks do not prove successful loading or behavior in every agent host.

| Task | Source and runtime |
|---|---|
| Static HTML, including Stitch | [DESIGN.md](DESIGN.md), [styles.css](styles.css), `.cs-*` classes and [kitchen-sink](templates/kitchen-sink.html). Stitch/static consumers must not treat `*.dc.html` as source of truth; those templates require the Design Components compiler. |
| Bundler React, including Next/Vite/SSR | `@cyberskill/design` resolves to [_esm/react.mjs](_esm/react.mjs), which imports source JSX and uses peer React. Follow [consumer setup](docs/consuming.md), including transpilation and CSS loading. |
| Legacy no-build browser | [_esm/cs.mjs](_esm/cs.mjs) loads [_ds_bundle.js](_ds_bundle.js). Resolve `window.CyberSkillDesignSystem_*` by prefix, never a fixed compiler suffix. This entry is browser-only, not an SSR entry. |
| DC authoring and exports | Use the selected template's source and supporting files only after confirming the compiler/export tools are available. See [export conventions](docs/conventions.md). A clone alone does not establish compiler availability. |
| System revision | [Doctrine](docs/doctrine.md), [conventions](docs/conventions.md), [audit instructions](_audit/README.md) and the active task specification. Preserve source/generated-artifact relationships. |

Generated [DESIGN.md](DESIGN.md) is refreshed by `npm run build:design-md`; do not hand-edit it. CSS tokens live in [tokens](tokens/); machine exports include `tokens.json`, `tokens.js` and `tokens.dtcg.json`. Their presence does not establish complete format conformance or native-platform support: verify the required value types, axes and consuming toolchain. Use [VERSION](VERSION) and [release notes](docs/release-notes.md) for release identity rather than copying version/count claims into instructions.

## Design constraints

- Preserve Umber `#45210E`, Ochre `#F4BA17`, the official logo assets, golden Lumi, and the bilingual slogan: “Turn Your Will Into Real” / “Hiện Thực Hoá Ý Chí”.
- Theme × Element × Language × Style are intended independent axes; defaults are `light · tho · vi · liquid-glass`. Test actual scope composition for the requested use. Use the 10-role `--cs-accent-*` pack including `on-strong`; product assignments are in [docs/products.md](docs/products.md). Semantic statuses and the composite focus indicator (text-primary contour + ochre halo) are never elemental.
- Liquid-glass is the sole style pack. Reuse existing components and tokens before introducing a new visual vocabulary or framework. Generic skills bundled under `.cursor/skills` do not override this contract or authorize framework installation.
- Keep the voice warm, direct, honest and respectful. UI is Vietnamese-first with EN/VI pairs and preserved diacritics. Check the documented language scope of business templates before claiming bilingual coverage.
- Consume font-family tokens for Be Vietnam Pro, JetBrains Mono and the opt-in display face; use official assets rather than recreating them. Copy required resources with standalone artifacts and verify their relative paths offline.
- Preserve focus visibility, at least 44px touch targets, reduced-motion and contrast preferences; body text must meet APCA Lc ≥ 75. Verify contrast on actual surfaces and interaction states. A theme name or passing token matrix is not proof that every rendered pairing passes.

## Verify the delivered scope

For repository changes, run the relevant targeted regressions and `npm run test:unit`; follow [_audit/README.md](_audit/README.md) for browser gates and pixel-check prerequisites. Apply doctrine's whole-set checks when a shared contract changes. Identify tested source/runtime, state, language, theme and viewport coverage, plus any unavailable tools or manual checks.

For a consumer artifact, exercise its actual imports, referenced assets, interactions and export path. Validate exported output separately from the source view. Compiler-only tools such as `gen_pptx` and `super_inline_html` are conditional capabilities, not assumed commands. Do not infer editable PPTX/DOCX, offline HTML, native, Figma or deployed support from a scaffold or file extension.

Keep confirmed defects, proposed improvements, local test success and human acceptance distinct. Historic audits and generic bundled references are supporting evidence, not current normative instructions.

## Declared API lookup

`components/api-index.json` is generated from the public TypeScript declarations. Find an export by name, then resolve each `props[].definition` through `propDefinitions` for its declared type, optionality and documentation, including inherited native props. Source/declaration paths and hashes locate the authoritative contracts. Type display strings can retain aliases or abbreviate complex types. Lifecycle labels are copied declarations, not proven support, assigned ownership or human acceptance. Regenerate with `npm run build:api-index`; check with `npm run test:api-index`.

For template content, read `docs/template-schema-v2.md`: sidecar slots describe source holes, not automatically writable runtime props. Inspect `data-props` and `renderVals()` before using `__dcSetProps`; computed values can override supplied props. Edit authorized source content and verify preview/export unless an explicit runtime binding is declared and tested.

For token maintenance, run `npm run tokens:coverage` alongside
the declaration graph: base typed membership, scoped literal colors, unresolved
expressions and style metadata have different portability boundaries. Preserve
selectors/conditions; never promote a scoped value to a root default solely to
complete a token count. See `docs/conventions.md` for regeneration and checks.

Use [the generated reference catalog](docs/reference-catalog.json) for declared counts and public document roles. It identifies routing authority, guides and evidence without treating inventory or historical reports as current capability acceptance.

Semantic status fills use `--cs-color-semantic-{role}` with their matching `-fg`; text on page/panel/raised uses `--cs-color-semantic-{role}-text`. Muted text and regular body links must clear the body floor on each actual surface. Fixed white print sheets start an explicit Light scope and declare their own primary text color; adaptive sheets follow their theme.

Strong callouts pair `--cs-accent-strong` with `--cs-accent-on-strong`; both mode packs clear body APCA75 (generator target78) and WCAG4.5. Dark primary buttons consume `on-strong`. Preserve the two brand anchors and the other eight accent roles. Mark purely decorative separators explicitly hidden from the accessibility tree while preserving their visible glyphs.
