# CyberSkill Core Design System Enterprise Readiness Audit

**Repository audited:** `cyberskill-official/design`  
**Revision:** `792b503` (`v1.7.2\), 13 September 2026  
**Audience:** CyberSkill design, engineering, product, security, and delivery leads  
**Assessment stance:** Evidence-first. “Confirmed” means observed in the checked repository or by a command run against it. “Validate” means a material claim that needs a live consumer, browser, assistive-technology, or operator check.

## Executive summary

CyberSkill has a substantial and unusually opinionated foundation: 106 React component modules, an HTML-first CSS/token pipeline, 15 elemental identity packs, bilingual EN/VI primitives, 85 templates, Storybook documentation, native token samples, Figma/Code Connect scaffolding, SBOM generation, CSP/no-eval checks, and whole-set responsive/language/theme harnesses. The repository shows strong craft and a clear brand doctrine.

It is not yet an enterprise-grade platform. The largest constraints are packaging and API boundaries, release proof, type and browser contracts, component lifecycle governance, and verification portability. The product is published as one package that includes runtime code, raw JSX, templates, docs, fonts, vendor runtimes, and audit tooling. There is no explicit `engines`, browserslist, TypeScript compilation gate, lint gate, or cross-browser CI matrix. The generic CyberOS gate is red because `npm test` is absent; the project-specific unit suite stops locally when Playwright Chromium is not installed; the committed Storybook static build is stale. These are delivery-system defects even though many individual contract tests pass. The checked `main` is three commits behind `origin/main`; later remote work reportedly adds Japanese locale, density/contrast, lifecycle metadata, editor schema hardening, and AT automation, so those changes require a separate re-audit before this baseline is generalized.

The recommended direction is a compatibility-preserving monorepo split:

- `@cyberskill/tokens`: canonical W3C DTCG source, semantic aliases, generated CSS/TypeScript/native/Figma artifacts.
- `@cyberskill/primitives`: framework-neutral behavior, focus, overlay, and ARIA state machines.
- `@cyberskill/react`: styled React components with compiled declarations and explicit public API registry.
- `@cyberskill/themes`, `@cyberskill/icons`, optional web-component/framework adapters, and a DevEx package containing ESLint/stylelint rules and codemods.
- A Storybook site and documentation package that are versioned with the code but are not shipped inside every runtime install.
- A compatibility facade at `@cyberskill/design` during migration.

The first 90 days should make the current system safe to consume: publish support and maturity policies, define owners, fix the test entry point and reproducible browser setup, compile declarations against React 18/19 and TypeScript, add bundle/package budgets, close stale Storybook output, and make releases bind a protected commit, gates, tarball digest, and registry version. Foundational work then moves tokens to primitive→semantic→component/state layers, introduces an SSR-safe theme provider and high-contrast/RTL/pseudo-locale support, and splits packages. Enterprise capabilities follow: canary consumer upgrades, codemods, deprecation telemetry, accessibility SLOs, provenance attestations, and a continuously refreshed browser/assistive-technology matrix.

## Current-state assessment

### Architecture and repository shape

Confirmed structure:

- `components/` contains 106 JSX components; each currently has a matching `.d.ts` and `.prompt.md`. Runtime helpers bring the bundle source graph to 112 files.
- `tokens/` contains CSS, JSON, DTCG JSON, JavaScript, provenance, native Swift/Kotlin/Dart outputs, and element packs.
- `styles.css` is a 24-import manifest. `dist/styles.min.css` is approximately 151 KB; `_ds_bundle.js` is approximately 281 KB; the React entry and legacy entry are generated.
- `templates/` contains 85 copyable templates. The repository also carries 152 Storybook stories, 57 component cards, 122 manifest exports, docs, guidelines, UI kits, fonts, assets, Figma files, and audit harnesses.
- `package.json` publishes one package, `@cyberskill/design@1.7.2`, with React 18/19 peer dependencies and exports for React, legacy browser code, raw component paths, styles, tokens, bundle, and manifest.
- `npm pack --dry-run` reports roughly 5.51 MB compressed, 15.88 MB unpacked, and 1,044 files. The package deliberately ships source JSX, contracts, templates, docs, fonts, vendor runtimes, and audit material.

The architecture is coherent for a small, HTML-first system, but the public contract is inferred. The bundle builder is a custom line-based import/export rewriter; its grammar assumptions are brittle and it emits a React barrel that re-exports raw JSX rather than compiled distribution code. `scripts/build-bundle.mjs` discovers capitalized exports and generates the barrel; there is no hand-reviewed API registry that distinguishes stable, beta, experimental, internal, and deprecated exports. Raw JSX in the published package requires consumers such as Next.js to configure transpilation. A monolithic package also couples template changes, audit fixtures, fonts, and runtime components to one install and one semver blast radius.

### Tokens, theming, and visual foundations

Confirmed strengths:

- DTCG JSON is generated from CSS sources and includes provenance and version metadata.
- Theme, element, language, and style are modeled as independent scopes.
- Fifteen element packs implement a ten-role accent contract; dark/system overrides and APCA-oriented contrast reports are present.
- Native token samples exist for Swift, Compose, and Flutter; current tests validate scaffold shape, not native app builds or runtime conformance.
- Bare-hex and token-provenance checks exist, along with contrast, freshness, and manifest gates.
- Typography, spacing, motion, elevation, surfaces, semantic colors, and component tokens are represented.

Risks and gaps:

- The current token set mixes primitive values, semantic roles, component roles, and state roles without a separately enforced layer model. Consumers can reach literal CSS custom properties through deep paths.
- Theme rules are duplicated across colors, elevation, components, forms, navigation, and element CSS. Duplication increases drift risk as more brand themes are added.
- The style axis currently has one pack (liquid-glass), so multi-brand adoption still requires custom token work.
- `color-mix`, backdrop-filter, and CSS fallbacks are present, but there is no declared browser capability policy or generated fallback matrix.
- Responsive overrides depend in places on serialized inline-style substring selectors. That couples CSS behavior to compiler serialization and is fragile under formatting changes.
- Localization covers EN/VI strings, date, number, and currency helpers. The resolver currently maps any non-Vietnamese locale to English and formatters hard-code `vi-VN`/`en-US`; plural rules, locale negotiation, timezone/date-time policy, RTL content QA, and pseudo-locales are not first-class contracts.

Target token architecture should be primitive → semantic → component → state aliases. Roles, descriptions, allowed values, theme coverage, contrast expectations, and deprecation metadata should be machine-readable. Generated CSS, TypeScript, native outputs, Figma variables, and docs should be produced from one source and checked for byte-level provenance.

### Component quality and API consistency

The breadth is a strength and a risk. Forms, navigation, overlays, data display, AI-native controls, templates, and document exports are all present. Contract files beside components improve discoverability. However, a 106-component surface needs explicit maturity and ownership to remain coherent.

Confirmed residual concerns:

- `test-prop-parity` checks structural parity but does not compile declarations. A prior plan records strict TypeScript failures; this must be revalidated at v1.7.2.
- Controlled/uncontrolled state, ref forwarding, slots, callback naming, and native prop passthrough are not proven consistent across the whole set.
- `Image` uses a role=button span and an ad hoc lightbox; focus trapping, inert background, restore-focus behavior, and screen-reader announcement require direct verification.
- `Sortable` has move buttons, but drag semantics and live announcements are not evident from source.
- `Carousel` uses small visual dots with pseudo hit areas; slide semantics and keyboard behavior need browser and AT verification.
- `Editor` sanitizes scripts, event attributes, and several embedded elements, but permits broad HTML and URL schemes. The trust boundary must be explicit for enterprise consumers.
- `Logo` injects static SVG through `dangerouslySetInnerHTML`; the title is escaped and the artwork is repository-controlled, but the pattern should be isolated and documented as trusted static markup.
- Global CSS targets body, headings, anchors, and broad classes. Without cascade layers or a root scope, embedding in host products can create leakage and specificity conflicts.

Adopt a component contract that requires: semantic element choice, `forwardRef`, controlled/uncontrolled rules, slots, event and keyboard model, focus restoration, localization keys, RTL behavior, responsive states, SSR behavior, deprecation metadata, and an API compatibility test.

### Accessibility and inclusive design

Confirmed strengths:

- A global accessibility layer provides visible focus, coarse-pointer target sizing, reduced-motion and increased-contrast handling.
- Components use ARIA attributes and an overlay manager provides focus/escape/scroll-lock behavior.
- Storybook includes the a11y addon and inventory-locked axe fixtures.
- Whole-set harnesses cover responsive overflow, forced Vietnamese, forced dark theme, language parity, token/contrast rules, and docs parity.
- The doctrine sets APCA Lc ≥75 for body text, persistent focus rings, and ≥44 px touch targets.

Important gaps to close:

- The repository has no repeatable NVDA, JAWS, VoiceOver, TalkBack, or IME test evidence. Manual AT is explicitly left to human review.
- WCAG 2.2 AA should be the external compliance baseline even where APCA is used internally; define mappings for text, non-text contrast, focus appearance, target size, reflow, and text spacing.
- Require 200% and 400% zoom, text-spacing overrides, forced-colors/high-contrast, keyboard-only traversal, and screen-reader announcements in CI fixtures.
- Standardize landmarks and skip-link behavior across all templates. Current inspection found only a subset of templates with `<main>` and skip links.
- Test every interactive state and every axis combination for complex widgets; a green inventory count is not proof of behavior quality.

Fluent’s official guidance is a useful floor: WCAG AA, 4.5:1 normal text, 3:1 large text and non-text UI, managed focus, and reflow to 400% zoom ([Fluent accessibility](https://fluent2.microsoft.design/accessibility)). Carbon similarly bases component guidance on WCAG AA, Section 508, and European standards ([Carbon accessibility](https://carbondesignsystem.com/guidelines/accessibility/overview/)).

### Responsiveness, browser support, and performance

Confirmed:

- Breakpoint values are mostly aligned to the token scale.
- Container queries are available through an opt-in `.cs-cq` class.
- Responsive, language, and theme overflow harnesses exercise the whole template set.
- Aurora assets were converted to WebP and an asset budget gate exists.
- The package ships large vendor assets and a full CSS import chain; no per-component chunks are published.
- No `engines`, browserslist, or support matrix was found. CI visual testing is Chromium-only; Firefox and WebKit are absent.

Requirements:

- Publish a support policy: latest two Chrome/Edge/Firefox, Safari 2 versions, current iOS/Android, and an explicit unsupported list. Refresh quarterly.
- Treat 400% zoom and 320 px width as acceptance cases; include reduced-motion, forced-colors, print, and RTL.
- Add CSS cascade layers and a scoped root option to reduce host leakage.
- Publish flat CSS plus per-package/per-component ESM; measure install size, parsed JS, CSS, and runtime render budgets.
- Define performance budgets with blocking thresholds (for example: React entry gzip, CSS gzip, critical component render, and interaction latency p95), then report trends per release.
- Avoid shipping Babel/React vendored runtimes in the default runtime package; keep compiler and audit tooling in a development package.

### Documentation and developer experience

Confirmed:

- README, SKILL, conventions, doctrine, consuming, release, quality-gate, Storybook, Figma, product registry, contrast, and Vietnamese mirror docs exist.
- Storybook is the published docs surface and includes addon-docs/a11y.
- Component cards, prompts, templates, examples, docs viewer, and generated DESIGN.md provide multiple entry points.
- Docs language/storybook/link parity checks are implemented.

Gaps:

- Storybook static output is stale: freshness check reports stamp `d8cf494b` versus live tree `da7c2fb0`.
- Documentation is broad but not yet a stable-component contract. Every stable page should include anatomy, usage/do/don’t, states, content, keyboard/AT behavior, tokens, responsive/RTL/dark/high-contrast behavior, code, SSR, and migration notes.
- No formal owner registry, CODEOWNERS, maturity dashboard, support matrix, or deprecation catalog is present in this checkout. GitHub branch-protection and required-review settings are out-of-band and unverified. Status pages also embed older version/head metadata than the package, weakening release traceability.
- The package’s raw source and template content inflate consumer installs and make DevEx noisy.
- Migration support is mainly prose. Add codemods, versioned upgrade guides, and a consumer-canary app.

### Testing and verification

Current test assets are more mature than the release plumbing:

- `npm run test:unit` runs extensive Node contract checks, docs parity, token checks, Storybook contracts, a11y coverage, native samples, packaging, and export checks.
- Browser-free tests through code-connect/npm-publish pass in the local run.
- Local `npm run test:unit` fails at `test-subtree-consume.mjs` because Playwright Chromium is not installed. CI installs browsers, so local and CI prerequisites differ.
- `bash .cyberos/cuo/gates/run-gates.sh` is RED because the generic gate autodetects `npm test`, but `package.json` has no `test` script.
- `npm audit --omit=dev --audit-level=high` is currently clean.
- Storybook freshness is currently failing as described above.
- There is no direct unit-test framework, TypeScript compile gate, lint gate, or Firefox/WebKit Playwright job. A strict local declaration compile fails in `components/forms/Slider.d.ts` with TS1109, confirming that declaration quality is currently a release blocker.

Recommended pyramid:

1. Pure unit tests for token transforms, state machines, locale formatting, and sanitization.
2. React Testing Library tests using roles, labels, keyboard events, and user-visible outcomes.
3. Integration tests for providers, SSR/hydration, theme switching, RTL, locales, overlays, and forms.
4. Storybook stories as fixtures with axe and interaction tests.
5. Visual regression across light/dark/high-contrast, all elements, EN/VI/pseudo-locale, 320/390/768/1280/400% zoom, reduced-motion, and print.
6. Playwright Chromium/Firefox/WebKit plus mobile emulation.
7. Manual AT smoke tests for dialogs, menus, comboboxes, grids, sortable, editor, carousel, and date/time controls.
8. Contract tests for package exports, declarations, tree shaking, side effects, SSR, and consumer upgrade.
9. Nightly whole-set matrix; fast deterministic subset per pull request.

### Security, licensing, and supply chain

Confirmed strengths:

- Static package with no backend or authenticated API.
- CSP/no-eval checks, support-runtime identity, third-party checks, SBOM generation, Scorecard workflow, npm OIDC trusted publishing, 2FA/token restrictions, and pack-hygiene checks exist.
- `npm audit` production tree is clean at this revision.

Risks requiring governance:

- `private:false`, public publish configuration, and `UNLICENSED` are a legal and adoption blocker for enterprise consumers even though a separate consumer grant exists. Decide whether the package is private, internally licensed, or published under a clear permissive/proprietary license with notices.
- Any `v*` tag or manual dispatch path must be bound to a protected main commit, passing gate run, exact package version, tarball digest, and generated provenance. Current workflow comments describe this intent, but a tested fail-closed binding is required. The token regeneration workflow also has write permission and can auto-commit generated files; constrain this to reviewed automation or a bot branch.
- `Editor` needs an explicit trusted-content/sanitizer contract, URL scheme allowlist, and CSP guidance for consumers.
- `THIRD-PARTY-NOTICES.md` records unresolved provenance/license status for at least one vendored deck runtime; resolve before enterprise distribution.
- Publicly shipped audit harnesses increase attack surface and can expose assumptions about tooling; keep them clearly separated from runtime packages.

## Benchmark against mature systems

| System | Observed mature practice | CyberSkill implication |
|---|---|---|
| Material UI | `ThemeProvider` centralizes palette, typography, spacing, breakpoints, and component overrides; CSS variables and light/dark/system schemes include SSR guidance ([theming](https://mui.com/material-ui/customization/theming/), [dark mode](https://mui.com/material-ui/customization/dark-mode/), [CSS variables](https://mui.com/material-ui/customization/css-theme-variables/usage/)). Testing guidance uses Testing Library and visual regression ([testing](https://mui.com/material-ui/guides/testing/)). | Provide a typed provider API, SSR no-flash initialization, CSS-variable themes, and user-outcome tests. |
| Carbon | Role-based tokens keep roles stable while values vary by theme; four default themes and inline theming are documented ([themes](https://carbondesignsystem.com/elements/themes/overview/)). Components have usage/style/code/accessibility documentation and a staged product lifecycle ([documentation](https://carbondesignsystem.com/contributing/documentation/), [PDLC](https://carbondesignsystem.com/contributing/product-development-lifecycle/)). | Enforce semantic token roles, nested themes, complete docs anatomy, and Experimental/Beta/Stable tracks. |
| Fluent 2 | Global-to-alias token architecture, CSS custom properties, light/dark/high-contrast/brand themes, and 400% reflow guidance ([tokens](https://fluent2.microsoft.design/design-tokens), [accessibility](https://fluent2.microsoft.design/accessibility)). | Add primitive→semantic aliases, high-contrast/brand themes, raw-value lint, and 400% zoom gates. |
| Polaris | Monorepo ecosystem includes components, tokens, tooling, and docs; contribution and release practices use tests, Storybook, Changesets, prerelease/snapshot releases, and consumer top-hat upgrades ([getting started](https://polaris-site-prod-kit.shopify.prod.shopifyapps.com/getting-started), [contributing](https://github.com/Shopify/polaris-react-archive/blob/main/.github/CONTRIBUTING.md)). | Adopt workspaces, Changesets, canary consumer upgrades, and migration automation. Treat legacy token packages as a warning to define ownership and migration. |
| Atlassian Design System | Foundations explicitly combine tokens, accessibility, content, spacing, grid, color, typography, iconography, elevation, borders, and radius ([foundations](https://atlassian.design/foundations)). Semantic tokens, runtime theme setup, lint rules, codemods, and SSR guidance are documented ([use tokens in code](https://atlassian.design/foundations/tokens/use-tokens-in-code/)). | Add semantic token lint/codemods, explicit content/localization ownership, and app-level accessibility review. |

CyberSkill already matches or exceeds these systems in brand-axis experimentation and whole-set audit intent. It trails them in package boundaries, typed API guarantees, lifecycle governance, browser/AT evidence, and release confidence.

## Target-state architecture

### Package topology

Use a workspace monorepo while preserving a compatibility facade:

```
packages/
  tokens/       DTCG source, transforms, CSS vars, TS/native/Figma outputs
  primitives/   focus, overlay, keyboard, collection, interaction state machines
  react/        styled React components; compiled JS and declarations
  themes/       light, dark, system, high-contrast, brand, RTL, reduced-motion
  icons/        icon data and React/web exports
  templates/    optional copyable templates and document exporters
  eslint/       token/API/accessibility rules
  codemods/     migration transforms
apps/
  storybook/    versioned docs and visual fixtures
  consumer-canary/ React 18/19 + SSR + Vite/Next smoke app
```

The existing `@cyberskill/design` package becomes a facade with deprecation warnings and a six-month migration window. Runtime packages must not ship raw JSX, compiler runtimes, or audit fixtures. Export maps should expose documented entry points only; deep imports should fail.

### Governance

Create a Design System Council with design, frontend, accessibility, localization/content, security, product, and release representatives. Assign a directly responsible owner and backup for every package and stable component. Add CODEOWNERS and a public owner/maturity registry.

Require an RFC for new components, tokens, themes, or breaking changes. The RFC records user/problem evidence, alternatives, API, accessibility/localization/responsive/security impact, adoption plan, telemetry, and deprecation plan. A component cannot become Stable without design and engineering review plus a11y/content sign-off.

Use maturity levels:

- **Experimental:** API may change; no compatibility promise.
- **Beta:** production pilots allowed; migration notes required.
- **Stable:** semver guarantee, complete docs, cross-browser/AT evidence, performance budget, owner, and support window.
- **Deprecated:** replacement, codemod or recipe, warning period, and removal date.

### Versioning and release

Use Changesets (or an equivalent generated release manifest) for package-level semver. Every release must produce:

- source commit SHA and protected branch status;
- gate report, browser matrix, and visual baseline identifiers;
- reproducible tarball and SHA-256 digest;
- SBOM and provenance attestation;
- generated release notes and migration guide;
- npm registry verification and rollback procedure.

Release automation must refuse publication when tag, package version, tarball digest, and passing commit do not match. Separate prerelease/canary channels from stable. Never publish from an arbitrary manual tag.

## Prioritized backlog

| Priority | Work item | Owner | Dependencies | Acceptance criteria |
|---|---|---|---|---|
| P0 | Repair gate contract: add `npm test` alias to `test:unit`, document browser bootstrap, regenerate Storybook static output | Release engineer | None | CyberOS gate green; `npm run test:unit` reproducible from clean checkout; freshness check passes |
| P0 | Decide package licensing and distribution posture; resolve vendored notices | Legal + maintainer | Consumer inventory | License/grant documented in package, notices complete, enterprise procurement sign-off |
| P0 | Add CODEOWNERS, owner registry, maturity metadata, support matrix, deprecation policy | Council | Governance charter | 100% stable exports have owner, maturity, support and deprecation fields |
| P0 | Compile declarations and consumer fixtures for React 18/19, TypeScript strict, SSR | Platform engineer | API inventory | Strict compile and SSR smoke pass for both React versions; no raw JSX required |
| P0 | Add package size/install budgets and raw-source/vendor exclusion plan | DevEx | Package topology decision | CI blocks budget regressions; runtime package excludes templates/compiler/vendor runtimes |
| P1 | Establish layered DTCG tokens and typed theme provider with SSR no-flash | Token architect | Inventory, type fixtures | Generated CSS/TS/native/Figma parity; light/dark/system/high-contrast demos pass |
| P1 | Normalize component contracts: refs, slots, state, events, ARIA, localization, RTL | Component leads + a11y/content | Primitives package | Stable component checklist complete; contract tests cover all exports |
| P1 | Add Firefox/WebKit, mobile, 320/400% zoom, forced-colors, reduced-motion, RTL, pseudo-locale CI | QA + a11y | Browser policy | Nightly full matrix and PR smoke; zero critical axe/overflow failures |
| P1 | Harden Editor/Image/Sortable/Carousel/dialog behavior and trusted HTML policy | Component owners + security | Primitive focus/overlay layer | Keyboard/AT tests, sanitizer URL allowlist, focus restoration and live announcements verified |
| P1 | Storybook documentation template and docs coverage dashboard | Docs lead | Maturity registry | Every Stable component has anatomy, usage, states, keyboard/AT, tokens, code, SSR, migration, design status |
| P2 | Split workspaces and publish compatibility facade | Platform | P1 token/API contracts | Tree-shakable packages, no deep-import dependence, consumer-canary green |
| P2 | Changesets, prerelease channel, canary consumer upgrade, codemods | Release + DevEx | Workspace split | Upgrade rehearsal and rollback under 15 minutes; migration completion tracked |
| P2 | Figma variables/Code Connect and native parity as release artifacts | Design tooling | Token source | Generated artifacts and links match release SHA; soft-skips are explicit |
| P3 | Web Components/framework adapters where demand is proven | Platform council | Stable primitive semantics | Two non-React consumer pilots pass quality and performance criteria |
| P3 | Adoption telemetry, accessibility/performance SLOs, quarterly browser refresh | Council + observability | Release telemetry | ≥80% products on Stable packages in two quarters; p95 interaction <100 ms; zero critical regressions |

## Phased roadmap

### Phase 0 — Stabilize evidence (weeks 0–2)

**Deliverables:** green local/CI gate contract, fresh Storybook build, ownership/maturity/support policy, license decision, browser bootstrap, baseline package and visual metrics.

**Risks:** changing the gate entry point can hide real failures; mitigate by retaining `test:unit` as the authoritative suite and publishing both reports.

**Success indicators:** 100% clean-checkout reproducibility; no stale generated artifacts; all public exports catalogued.

### Phase 1 — Foundations and contracts (weeks 3–8)

**Deliverables:** layered DTCG model, typed provider/themes, primitive behavior package, strict declaration fixtures, API registry, 400%/RTL/pseudo-locale harnesses, component contract template.

**Dependencies:** Phase 0 ownership and package decisions.

**Acceptance:** all Stable components consume semantic tokens; SSR theme switch has no visible flash; strict TypeScript and React 18/19 fixtures pass; no unallowlisted raw colors.

### Phase 2 — Component hardening and docs (weeks 9–16)

**Deliverables:** risk-ordered remediation for overlays/forms/data widgets, Storybook anatomy and interaction stories, manual AT protocol, cross-browser matrix, sanitizer and trusted-content policy.

**Dependencies:** primitives, provider, and browser matrix.

**Acceptance:** ≥90% Stable component story/a11y coverage; zero critical axe violations; dialogs/menus/comboboxes/grids/sortable/editor/carousel pass keyboard and AT checks; 320 px and 400% zoom pass.

### Phase 3 — Packaging and adoption (weeks 17–24)

**Deliverables:** workspace packages, compatibility facade, Changesets, canary channel, codemods, migration guides, consumer-canary app, tarball/provenance release binding.

**Dependencies:** Phase 1 API and token contracts.

**Acceptance:** runtime package install and gzip budgets met; canary products upgrade from facade; rollback rehearsal <15 minutes; registry artifact matches tested digest.

### Phase 4 — Enterprise scale (month 7 onward)

**Deliverables:** high-contrast and brand theme packs, native/Figma release integration, demand-led adapters, adoption/performance/a11y telemetry, quarterly governance review.

**Acceptance:** ≥80% CyberSkill products use Stable packages within two quarters; token drift incidents remain zero; deprecation migrations exceed 90%; support tickets and duplicate component count trend downward.

## Exact next actions

1. Add a `test` script alias and a documented `npx playwright install` bootstrap; rerun `bash .cyberos/cuo/gates/run-gates.sh` and `npm run test:unit`.
2. Rebuild Storybook and run `node _audit/ci/test-storybook-freshness.mjs --require`.
3. Create a machine-readable export registry with owner, maturity, support, deprecation, and package fields; add CODEOWNERS.
4. Decide licensing/distribution posture and resolve the unestablished vendored runtime notice before recruiting external enterprise consumers.
5. Add a browserslist/engines policy and CI jobs for Firefox/WebKit, mobile emulation, forced-colors, 400% zoom, RTL, and pseudo-locales.
6. Build strict TypeScript/React 18/19/SSR consumer fixtures and make declaration compilation a required gate.
7. Define and implement the primitive→semantic→component/state token layers plus an SSR-safe theme provider.
8. Publish package-size budgets and split runtime, tokens, icons, templates, docs, and audit tooling; retain `@cyberskill/design` as a time-boxed facade.
9. Run focused manual AT and security reviews for Editor, Image preview, Sortable, Carousel, dialogs, menus, comboboxes, grids, and date/time controls.
10. Adopt Changesets or an equivalent release manifest and enforce tag/version/SHA/gate/tarball-digest binding before npm publication.

## Confirmed findings versus assumptions requiring validation

**Confirmed in this audit:** repository structure and counts; package metadata and exports; token/build pipeline; Storybook/addon presence; test scripts; local command outcomes; package size; absence of `engines`, browserslist, TypeScript and lint gates; OIDC/SBOM/security workflows; public `UNLICENSED` metadata; stale Storybook stamp; missing local Playwright executable; component source patterns described above.

**Validate before treating as production claims:** strict declaration compatibility at current tip; actual behavior of every widget under keyboard and screen readers; live browser support on Safari/Firefox/WebKit and mobile; SSR dark-mode flash behavior; Figma/Code Connect synchronization in the enterprise workspace; email-client and print hardware fidelity; production npm/Vercel release binding; legal acceptability of the current grant/license; consumer adoption, bundle impact, and runtime performance under representative CyberSkill products.

## Sources

1. Material UI, “Theming,” https://mui.com/material-ui/customization/theming/
2. Material UI, “Dark mode,” https://mui.com/material-ui/customization/dark-mode/
3. Material UI, “CSS theme variables,” https://mui.com/material-ui/customization/css-theme-variables/usage/
4. Material UI, “Testing,” https://mui.com/material-ui/guides/testing/
5. Carbon Design System, “Themes,” https://carbondesignsystem.com/elements/themes/overview/
6. Carbon Design System, “Accessibility,” https://carbondesignsystem.com/guidelines/accessibility/overview/
7. Carbon Design System, “Documentation,” https://carbondesignsystem.com/contributing/documentation/
8. Carbon Design System, “Product development lifecycle,” https://carbondesignsystem.com/contributing/product-development-lifecycle/
9. Microsoft Fluent 2, “Design tokens,” https://fluent2.microsoft.design/design-tokens
10. Microsoft Fluent 2, “Accessibility,” https://fluent2.microsoft.design/accessibility
11. Shopify Polaris, “Getting started,” https://polaris-site-prod-kit.shopify.prod.shopifyapps.com/getting-started
12. Shopify Polaris React archive, “Contributing,” https://github.com/Shopify/polaris-react-archive/blob/main/.github/CONTRIBUTING.md
13. Atlassian Design System, “Foundations,” https://atlassian.design/foundations
14. Atlassian Design System, “Use tokens in code,” https://atlassian.design/foundations/tokens/use-tokens-in-code/
15. CyberSkill repository, `README.md`, `CONTRIBUTING.md`, `docs/doctrine.md`, `docs/quality-gates.md`, `docs/release-runbook.md`, `package.json`, `.github/workflows/`, and `_audit/ci/` at revision `792b503`.

