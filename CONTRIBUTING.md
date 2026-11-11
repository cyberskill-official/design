<!-- BEGIN GENERATED ENTRY LANGUAGE ROUTE v1 -->
**Tiếng Việt:** [Đọc hướng dẫn đầy đủ](docs/vi/entrypoints/CONTRIBUTING.md) · **English:** full original guidance follows below.
<!-- END GENERATED ENTRY LANGUAGE ROUTE v1 -->

# Contributing

One-page onboarding for extending the CyberSkill Design System. Normative rules live in [`docs/doctrine.md`](docs/doctrine.md) (expansion, verification, immutables). Authoring grammar lives in [`docs/conventions.md`](docs/conventions.md). Consumer orientation lives in [`SKILL.md`](SKILL.md). Published reading surface: Storybook **Docs** at `design.cyberskill.world`.

## When to use

You are adding a component, token, template, language string, or documentation page. Follow doctrine first, then the recipes below.

## Non-goals

This file does not replace doctrine, the product registry, or the consume guide.

## Non-negotiables

- **Anchors follow the source-derived doctrine table below.** One accent per surface (Ochre on core; a product's element accent inside its `data-cs-element` scope). Every neutral warmed toward umber — no cold grey.
- **Vietnamese-first & bilingual** — ship EN + VN, preserve diacritics, VN-safe line-heights. Every bilingual template carries a root `lang` (see conventions → Screen-reader language).
- **Accessibility floor** — preserve the composite focus indicator (text-primary contour plus Ochre halo); ≥44px touch targets on coarse pointers; body text APCA Lc ≥ 75; honour `prefers-reduced-motion`/`prefers-contrast`. Focus styles live in `base/reset.css` and the component CSS; `base/a11y.css` covers coarse-pointer sizing and preference safety nets. Verify the rendered focus state after changes.
- **Grammar** — Theme × Element × Language × Style are independent axes. Style packs are `liquid-glass` (default; absent ≡ default) and `matte-paper`.
- **Voice** — warm / direct / honest / respectful. Products are "wishes" Lumi helps grant. Lumi stays golden in every element.

## Expansion and verification

The expansion rule and verification-depth requirement are in **[`docs/doctrine.md`](docs/doctrine.md)**. In short: when anything grows, update every deliverable in the same change; verify the whole set, not a sample. Gate: `_audit/run.html` green + `npm run test:unit` (sessions with the external compiler additionally run `check_design_system`; it is not a repository command).

## Adding things — quick recipes

- **Component** — `components/<group>/<Name>.{jsx,d.ts,prompt.md}` + a `.cs-*` style block in the matching `base/*.css` + add to the group's `*.card.html`. Void-element components (`<input>`/`<hr>`) must destructure `children` out of `...props` (React #137 rule). Correct ARIA roles/labels.
- **Token** — add to the right `tokens/*.css`; if it's a semantic/surface token, give it a `[data-theme="dark"]` (+ system) override and verify contrast on `#221710`. Regenerate `tokens/tokens.json`/`.js`. New element/variant sets all 10 `--cs-accent-*` roles (`_audit/token-contract.html` checks this).
- **Template** — `templates/<slug>/<Slug>.dc.html` (DC) with `<!-- @template … -->` first + `ds-base.js`. Bilingual with a Language tweak + root `lang`. Docs get `@page{size}` + `<meta name="omelette-owns-print">`. Element ×15 tweaks. DC files render with the shipped browser interpreter (`support.js`); see `docs/template-grammar.md`. Host tweak panels and PPTX export require separate external tooling. Plain static consumers can use `styles.css` + `.cs-*`.
- **Card / guideline** — `.html` with `<!-- @dsCard group="…" … -->` first line.
- **Documentation** — EN + VI for every `docs/*.md`; add the page to the Storybook Docs sidebar (catalog + story) and `docs/viewer.html`. `docs-storybook-coverage` fails if the page exists only in git.

## Setup, running, benchmark & release workflow

- **1. Toolchain & local servers** — Run `node scripts/bootstrap-toolchain.mjs` and `node scripts/npm.mjs ci` on Node >=22.12.0. Start Storybook via `node scripts/npm.mjs run storybook` (`http://127.0.0.1:6006`) or serve the static repository via `node scripts/npm.mjs run verify:serve` (`http://127.0.0.1:8765/_audit/run.html`). Before running the headless gate board on a cold checkout, generate the pixel receipt with `node _audit/ci/pixel-diff.mjs http://127.0.0.1:8765`, then run `node _audit/ci/run-gates.mjs http://127.0.0.1:8765/_audit/run.html`.
- **2. 20-Dimension (`D1`–`D20`) live browser benchmark** — Run `node scripts/npm.mjs run test:audit-regression` (`node _audit/ci/verify-audit-benchmarks-browser.mjs`) to verify all `129/129` `D1`–`D20` checks (`_audit/ci/fixtures/benchmark-20d.html`), `64/64` baseline checks (`_audit/ci/fixtures/benchmark-baseline.html`), `192/192` non-text contrast cells across 32 `Theme × Element × Variant` scopes, and `3/3` Generation-2 stress-test product screens (`_audit/ci/fixtures/benchmark-gen2.html`). To add a new dimension (`D21+`) or complex screen check, update `_audit/ci/lib/benchmark-checks.mjs` and the corresponding fixture under `_audit/ci/fixtures/`.
- **3. External AI design benchmark loop (Google Stitch & Claude Design)** — Feed `DESIGN.md` to Google Stitch and `@cyberskill/design` + `DESIGN.md` to Claude Design with multi-axis product stress-test prompts (e.g., dense data tables, nested split-panes, mobile coarse-pointer drawers, dark elemental themes). Inspect rendered outputs in headless Chromium for contrast, overflow, invalid-state parity, and Vietnamese diacritic clearance. Patch root causes in `tokens/*.css`, `base/*.css`, `components/`, or `scripts/design-md-lib.mjs`, lock the new rule into `_audit/ci/lib/benchmark-checks.mjs`, and delete temporary external benchmark HTML/screenshots so the repository stays clean.
- **4. Fast local CI, GitHub Pages & npm OIDC release** — Run `node scripts/npm.mjs run build:check` for full freshness and unit verification, or `node scripts/run-act-ci.mjs --stamp-current --with-status` to record commit-bound `ci/act/*` receipts. Pushes to `main` automatically publish the static site (`npm run build:site` → `.vercel-static/` with `.nojekyll` and `CNAME`) to `https://design.cyberskill.world/` via `.github/workflows/pages.yml`. To cut an npm release, run `node scripts/prepare-release.mjs --version X.Y.Z --source-sha <SHA> --write`, commit, tag `vX.Y.Z`, and push so `.github/workflows/npm-publish.yml` publishes `@cyberskill/design` with OIDC provenance.

Maintainer identities and the contribution path are recorded in [MAINTAINERS.md](MAINTAINERS.md). `.github/CODEOWNERS` routes review to the existing appointed owner; it does not enable remote approval rules or grant release authorization.

## Agent workflow

The tracked `.mcp.json` has no required servers. Follow `AGENTS.md` and the generated portable contract below for current workflow, retired orchestration and acceptance boundaries. Historical task records retain their original context.

## Documented scope boundaries (not gaps)

UI-kit pages remain Thổ-faithful recreations; bilingual EN·VN covers emails + team/legal/finance docs (client/media collateral is EN-first); text never sits on the mid-tone `-accent`; email-safe send variants are exemplars in `templates/email-safe/` (others convert on request).

For token changes, edit the CSS source and authored `tokens/base-inventory.json` membership/type metadata, then run `npm run tokens:generate` followed by `npm run tokens:check`. These commands regenerate and verify derived outputs; do not patch generated mirrors independently.

<!-- BEGIN PINNED TOOLCHAIN BOOTSTRAP -->
Before the source-repository `npm ci` or `npm run` commands, use Node >=22.12.0 and run `node scripts/bootstrap-toolchain.mjs` directly. This installs the audited, lockfile-pinned npm11.21.1 fixture with lifecycle scripts disabled; it works from the npm bundled with Node and does not install npm globally. Add `_audit/ci/fixtures/npm-cli/node_modules/.bin` to PATH, or run `node scripts/npm.mjs ci` and use `node scripts/npm.mjs` in place of `npm` for later commands. Source `devEngines` rejects another npm version. Published-package consumers keep their own package manager; this guard is not an installation lifecycle hook. See [validation and toolchain guidance](docs/validation.md).

Trước các lệnh `npm ci` hoặc `npm run` trong kho nguồn, dùng Node >=22.12.0 và chạy trực tiếp `node scripts/bootstrap-toolchain.mjs`. Lệnh cài fixture npm11.21.1 có lockfile đã audit, tắt lifecycle scripts và không cài npm toàn cục. Thêm `_audit/ci/fixtures/npm-cli/node_modules/.bin` vào PATH, hoặc dùng `node scripts/npm.mjs ci`; các lệnh sau dùng `node scripts/npm.mjs` thay cho `npm`. `devEngines` chỉ ràng buộc dự án nguồn; người dùng gói đã phát hành giữ package manager của họ. [Hướng dẫn kiểm tra và toolchain](docs/vi/validation.md).
<!-- END PINNED TOOLCHAIN BOOTSTRAP -->

Instruction-language maintenance: author complete entry translations under `docs/vi/entrypoints/`. For component prompts, preserve the English guidance and code examples; review every changed prose block in `scripts/prompt-language-source.json`, then run `node scripts/generate-prompt-languages.mjs`. After reviewing entry source and mirror changes, update `scripts/entrypoint-language-source.json` and run `node scripts/generate-entrypoint-languages.mjs`. Both producers support `--check`; run `node _audit/ci/test-prompt-languages.mjs --current` and `node _audit/ci/test-entrypoint-languages.mjs --current`. Source hashes bind reviewed text; never refresh a hash alone to bypass a stale translation. Public entry pairs and repository-only host mirrors keep distinct publication scopes. The generated `DESIGN.md` and `docs/vi/entrypoints/DESIGN.md` pair comes from one model: run `npm run build:design-md` and `node _audit/ci/test-design-languages.mjs --current`; do not hand-edit either projection.

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
| Style pack | liquid-glass (default; absent ≡ default) · matte-paper |

- **static-html** — `styles.css`; [guide](DESIGN.md). Use .cs-* classes; .dc.html additionally requires the shipped interpreter or a verified grammar-aware runtime.
- **react** — `@cyberskill/design`; [guide](docs/consuming.md). Compiled ESM with peer React; explicit @cyberskill/design/source is raw JSX. CommonJS is not promised.
- **legacy-browser** — `_esm/cs.mjs`; [guide](docs/consuming.md). Browser-only; resolve the CyberSkillDesignSystem_ global by prefix, not a fixed suffix. Not an SSR entry.
- **document-templates** — `templates/_vendor/support.js`; [guide](docs/template-grammar.md). Serve relative resources. Browser preview, declared controls/content and PDF/DOCX have scoped checks; host authoring tools, PPTX and super_inline_html remain external.
<!-- END PORTABLE GUIDANCE CONTRACT -->
