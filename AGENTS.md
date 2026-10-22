<!-- BEGIN GENERATED ENTRY LANGUAGE ROUTE v1 -->
**Tiếng Việt:** [Đọc hướng dẫn đầy đủ](docs/vi/entrypoints/AGENTS.md) · **English:** full original guidance follows below.
<!-- END GENERATED ENTRY LANGUAGE ROUTE v1 -->

# AGENTS.md

Shared design-system entrypoint: [SKILL.md](SKILL.md). Read it for runtime routing, source authority and capability limits before following task-specific design guidance.

Design-system doctrine: [docs/doctrine.md](docs/doctrine.md). Use the user's task scope, source-bound verification records, and documented npm/browser checks for repository work.

## Generated guidance and inventories

`docs/doctrine.md` remains normative. Edit its policy sections or `scripts/guidance-source.json` routing metadata, then run `node scripts/generate-guidance.mjs`; use `--check` for read-only freshness. This updates the machine contract and owned host blocks. Hand edits outside generated blocks remain authored. Run `node _audit/ci/test-portable-guidance.mjs` for authority and weakening mutations.

README component groups/compositions and Atomic View export bindings derive from `_ds_manifest.json` and the actual authored Atomic stories. After catalog or story changes, run `node scripts/generate-component-inventory.mjs`, then `node scripts/generate-atomic-story-index.mjs`; each has `--check`. The inventory generator preserves authored renderers and controls and never invents a component tier.

## Portable repository setup

This is an HTML-first, static design system (Node 22, npm). There is no application server or database — the "app" is (a) a **Storybook** playground and (b) the raw repo **served statically** with the `_audit/*.html` gate board on top. There is no `lint` npm script; the equivalent static checks are the audit gate board plus the Node freshness prechecks below.

Services and how to run them (standard commands live in `package.json` / `.github/workflows/design-system-gates.yml`):

- **Storybook dev server** — `npm run storybook` (serves on `http://127.0.0.1:6006`). Primary interactive surface for browsing components/templates and editing them live via the Controls panel.
- **Static audit board** — serve the repo root, e.g. `node scripts/npm.mjs run verify:serve` (port 8765), then open `http://127.0.0.1:8765/_audit/run.html`. Run headless with `node _audit/ci/run-gates.mjs http://127.0.0.1:8765/_audit/run.html`.
- **Unit/contract tests** — `npm run test:unit`.

Non-obvious gotchas:

- **Playwright Chromium, Firefox and WebKit are required** for the complete `npm run test:unit` suite. Install with `npx playwright install --with-deps chromium firefox webkit`; the fast board and pixel comparison use Chromium. Python 3 is also used by font audits and the local static server; see `docs/quality-gates.md`.
- The maintained static server keeps `.html` paths; use the explicit board URL in local and CI checks.
- **The "Pixel CI" hard gate fails on a cold checkout** until `node _audit/ci/pixel-diff.mjs http://127.0.0.1:8765` has been run once — it generates `_audit/ci/pixel-diff-report.json` that the board reads. Run `pixel-diff.mjs` before `run-gates.mjs` (this mirrors CI job ordering).
- The `ghost`/`secondary` Button variants render with no fill, so on Storybook's white canvas they can look "invisible" — that is expected styling, not a crash.

For token changes, edit the CSS source and authored `tokens/base-inventory.json` membership/type metadata, then run `npm run tokens:generate` followed by `npm run tokens:check`. These commands regenerate and verify derived outputs; do not patch generated mirrors independently.

<!-- BEGIN PINNED TOOLCHAIN BOOTSTRAP -->
Before the source-repository `npm ci` or `npm run` commands, use Node >=22.12.0 and run `node scripts/bootstrap-toolchain.mjs` directly. This installs the audited, lockfile-pinned npm11.21.1 fixture with lifecycle scripts disabled; it works from the npm bundled with Node and does not install npm globally. Add `_audit/ci/fixtures/npm-cli/node_modules/.bin` to PATH, or run `node scripts/npm.mjs ci` and use `node scripts/npm.mjs` in place of `npm` for later commands. Source `devEngines` rejects another npm version. Published-package consumers keep their own package manager; this guard is not an installation lifecycle hook. See [toolchain details](docs/decisions/toolchain-reproducibility.md).

Trước các lệnh `npm ci` hoặc `npm run` trong kho nguồn, dùng Node >=22.12.0 và chạy trực tiếp `node scripts/bootstrap-toolchain.mjs`. Lệnh cài fixture npm11.21.1 có lockfile đã audit, tắt lifecycle scripts và không cài npm toàn cục. Thêm `_audit/ci/fixtures/npm-cli/node_modules/.bin` vào PATH, hoặc dùng `node scripts/npm.mjs ci`; các lệnh sau dùng `node scripts/npm.mjs` thay cho `npm`. `devEngines` chỉ ràng buộc dự án nguồn; người dùng gói đã phát hành giữ package manager của họ. [Chi tiết toolchain](docs/decisions/toolchain-reproducibility.md).
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
| Style pack | liquid-glass (sole pack; absent ≡ default) |

- **static-html** — `styles.css`; [guide](DESIGN.md). Use .cs-* classes; .dc.html additionally requires the shipped interpreter or a verified grammar-aware runtime.
- **react** — `@cyberskill/design`; [guide](docs/consuming.md). Compiled ESM with peer React; explicit @cyberskill/design/source is raw JSX. CommonJS is not promised.
- **legacy-browser** — `_esm/cs.mjs`; [guide](docs/consuming.md). Browser-only; resolve the CyberSkillDesignSystem_ global by prefix, not a fixed suffix. Not an SSR entry.
- **document-templates** — `templates/_vendor/support.js`; [guide](docs/template-grammar.md). Serve relative resources. Browser preview, declared controls/content and PDF/DOCX have scoped checks; host authoring tools, PPTX and super_inline_html remain external.
<!-- END PORTABLE GUIDANCE CONTRACT -->
