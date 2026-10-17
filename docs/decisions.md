# Decisions (maintainer)

Owner choices that shape CI, Figma sync, and distribution. How-tos live in `docs/figma.md` and `docs/ci-cd.md` — this file is the decision record only. Not a consumer guide. Published on Storybook **Docs** at `design.cyberskill.world`.

## 1. Whole-set audits on every PR

**Owner choice: B — Enable on every PR** (Jul 2026)

`whole-set-audits` runs on push, pull_request, schedule (`0 3 * * *`), and `workflow_dispatch`. Plan ~15–20 minutes for that job.

## 2. Pixel-threshold CI auto-fail

**Owner choice: enabled — hard gate** (Jul 2026)

Playwright `%` pixel compare (`_audit/ci/pixel-diff.mjs`) is a hard gate. Drift above threshold fails the Pixel CI board row and the `pixel-diff` CI job (no `continue-on-error`). Side-by-side visual / component baseline review pages remain advisory (drift judged by eye). After intentional redesigns, refresh `_audit/baselines/` with `--update` and commit the PNGs.

## 3. Figma / Tokens Studio

**Owner choice: A — non-Enterprise for now** (Jul 2026)

Stay on the current Figma plan. Variables REST API is Enterprise-only — write jobs **soft-skip** (exit 0 + report) when the plan or secrets cannot complete the write. That soft-skip is **not** a live Variables sync — do not treat CI green as proof that Figma Variables were updated. Colour sync = hand-sync and/or Tokens Studio from `tokens/tokens.dtcg.json`. See `docs/figma.md`.

## 4. Live hub = Storybook only

**Owner choice: Storybook is the single live hub** (Jul 2026)

- Operators use Storybook at `/` for Theme × Element × Language × Style and component control matrices.
- Public IA follows the atomic browse path: Foundations → Components → **Templates** → **Pages** (Atoms/Molecules/Organisms remain in CSF + Atomic View; Templates/Pages are first-class sidebar groups, including the full VN A4 / HR Suite).
- No separate Live View page exists in the tree.
- Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` redirect to `/`.
- Portable Atomic View and other static HTML remain for zero-build gates and consumers; Atomic View is also linked from **Templates → Gallery**.
- Surface map: `docs/live-hub.md`.

## 5. Dual token JSON sources

**Owner choice: keep both `tokens.json` and `tokens.dtcg.json`** (Jul 2026)

| File | Role |
|---|---|
| `tokens/tokens.dtcg.json` | DTCG 2025.10 interchange / native regen |
| `tokens/tokens.json` | CSS-oriented grouped export |
| `tokens/*.css` + `styles.css` | Runtime UI |

## 8. Native store packaging — scaffolds shipped; submit disabled

**Status: Fastlane path live; signing secrets operator-owned; no store submit** (Jul 2026)

- Scaffolds under `examples/native/{swiftui,compose,flutter}/fastlane/` + listing metadata placeholders.
- Workflow `.github/workflows/native-store.yml`; dry-run always; signed-release checks need `ASC_KEY_ID` / `ASC_ISSUER_ID` / `ASC_KEY_P8` / `PLAY_SERVICE_ACCOUNT_JSON`.
- `upload_store` lanes refuse submit — samples remain samples until product need. See `examples/native/README.md`.

## 9. Products registry — locked

**Owner choice: lock the product → element registry** (Jul 2026)

`docs/products.md` (+ `docs/vi/products.md`) is the **locked** source of truth for the eight portfolio mappings. Agents and kits must use those rows; do not invent new product → element assignments. Changes require an edit to this decision record in the same change.

## Roadmap defaults (distribution unlocks)

Recorded Jul 2026 — unlock defaults (updated as operator steps land):

- **Figma Variables** — stay Tokens Studio / non-Enterprise (decision §3). Soft-skip on Variables REST remains honest.
- **npm** — consumer grant in force at `docs/consumer-grant.md`. Default package entry is bundler-native `_esm/react.mjs` (React peer); browser path is `@cyberskill/design/legacy` → `_esm/cs.mjs` (decision §10).

## 10. Bundler-native React export (Next / SSR)

**Owner choice: ship `_esm/react.mjs` as default `exports["."]`** (Jul 2026; React 19 host Jul 2026)

- React / react-dom are **peerDependencies** (`^18 || ^19`); the entry re-exports source JSX (consumer transpiles — e.g. Next `transpilePackages`). Host Storybook / CI **devDependencies** pin **react@19.2.8** / **react-dom@19.2.8**.
- Browser / no-build keeps `_esm/cs.mjs` at `exports["./legacy"]` (CDN self-ensure + `_ds_bundle.js`). Official React 19 dropped UMD builds — the CDN path loads **`umd-react@19.2.8`** (SRI-pinned) to populate `window.React` / `window.ReactDOM` for `_ds_bundle.js`. Same wrapper-distribution pin is used in audit HTML, specimen cards, UI kits, and the byte-identical `templates/*/support.js` runtime. The retained browser files report React and ReactDOM runtime version `19.2.4`; the wrapper package version is distinct from those reported versions and the `19.2.8` build dependencies.
- Alias `@cyberskill/design/react` mirrors the default entry.
- Docs: `docs/consuming.md` (+ VI); gates: `package-exports-integrity` + `test:react-entry`.

## Maintainer tasks (open)

Operational follow-ups — not product marketing, not a backlog surface:

~~2. npm consumer grant~~ — **done** (Jul 2026): `docs/consumer-grant.md` (+ VI) for CyberSkill portfolio products.

~~3. Finalize products registry~~ — **done** (Jul 2026): see decision §9; `docs/products.md` is locked.

~~4. First registry consumer path~~ — **done** (Jul 2026): `examples/npm-hello/` installs `@cyberskill/design` for locked **Lumi** identity; documented in `docs/consuming.md` (+ VI) and `docs/release-notes.md`. Pin follows repo `VERSION`.

5. **Native + element-pack drift on PRs is fail-closed** (Jul 2026; FIND-021 re-gate Aug 2026) — `regenerate-tokens` runs read-only on pull requests and exits 1 instead of pushing; only `regenerate-tokens-push` (main / schedule / manual) holds `contents: write`. When a PR fails it, run `npm run tokens:generate` and review/commit the complete generated token, native, bundle and reference changes. Auto-commits from `regenerate-tokens-push` **must not** use `[skip ci]` so the tip re-enters the gate board (TASK-IMP-008); PR fail-closed freshness remains the primary contributor path. Branch-protection required-check reality is NV-18.1 (out-of-band). See `docs/ci-cd.md`.

6. **Shadcn gap / Wave 2** (Jul 2026) — CyberSkill already covers ~53 of shadcn’s 62 primitives as CS-native (forms / overlays / nav / data). Shipped: pilot `ScrollArea`, `Collapsible`, `AspectRatio`; Wave 2 `AlertDialog` (vs Popconfirm), `Item` row primitive, `NativeSelect`. Residual shadcn gaps are intentional non-ports (blocks, Tailwind, Radix CLI). Do **not** port those — map patterns to existing `templates/` + `ui_kits/`.

7. **Element colour geometry** (Jul 2026; owner palette bar Jul 2026) — **30** default sets (5 × soft/middle/deep × light/dark) from `tokens/element-seeds.json` (`npm run tokens:elements`): soft = washed pastel, middle = intensity-synced default (Thổ middle pins logo ochre), deep = clearly darker sibling in the same hue family; harmonious role ramps; light↔dark hue lock; APCA dark floors. Geometry gate requires both minΔE and minΔL plus monotonic L. Public variant names unchanged. Hard gate: `_audit/element-geometry.html`. Benchmark rubric: `docs/benchmark-rubric.md`.

8. **Style axis (`data-cs-style`)** (Jul 2026) — Fourth product axis; sole live pack **liquid-glass** (absent ≡ liquid-glass). Contract: `tokens/styles.css` + hard gate `_audit/style-contract.html`. Future Style packs may expand indefinitely, each with its own colour-combination language — only via owner approval + Expansion Rule checklist in `docs/benchmark-rubric.md` (do not invent packs casually).

9. **Identity Lab retired** (Jul 2026) — Owner choice: delete `ui_kits/status-hub/identity-lab.html` and every product/docs/Storybook reference. Axis demos live in the Storybook Theme × Element × Language × Style toolbar, Atomic View, and the Elements Geometry specimen. Theme × Element × Language × Style **axes remain** product infrastructure (templates, tokens, kits Thổ-faithful). Do not revive the Lab under another name without a new decision.

Storybook `FullMatrix` is required whenever a public primary has ≥1 of {size enums, variant enums, state keys} (contract floor ≥28 stories). Schema sidecars remain complete for content-hole templates; axis-only templates omit by design. See `docs/quality-gates.md` and `docs/storybook.md`.

## 13. Product vs CyberOS boundary

**Owner choice: explicit fence** (Aug 2026; assessment area 28)

| Layer | Ships to consumers? | Lives where | Purpose |
|-------|---------------------|-------------|---------|
| **Product design system** | Yes — `@cyberskill/design`, portable tree (`styles.css`, `tokens/`, `components/`, `templates/`, `_audit/` gates, Storybook host) | repo root (non-`.cyberos`) | Tokens, components, templates, kits, deterministic quality gates |
| **CyberOS orchestration** | No (retired) | `.cyberos/` | Historical agent orchestration |

Rules:
- Product acceptance criteria must not require `.cyberos/` to be present for consumers or for `npm` publish.
- Superseding operator decision (2026-10-08): CyberOS orchestration and its two acceptance gates are retired. Agents follow `AGENTS.md` and `SKILL.md`. Product visual review, manual accessibility evidence and explicit push/deploy/merge authorization remain required.
- Do not move product tokens/components into `.cyberos/`; do not publish CyberOS orchestration as part of the npm package.

## 14. Locale architecture beyond EN·VI

**Owner choice: B — third-locale spike (`ja`); Language axis uses BCP-47 primary subtags** (Aug 2026; CDS-I18N-001)

Normative record: [`docs/decisions/locale-architecture.md`](./decisions/locale-architecture.md).

- Language stays a product axis (Theme × Element × Language × Style). Values are primary language subtags (`en` · `vi` · spike `ja`), not a nested locale axis and not full region tags yet.
- Registry keeps required EN·VI pairs; optional spike tables must match `en` keys when present.
- Vietnamese-first default unchanged (`lang` unset → `vi`). Plural/ICU and region variants are follow-on.

## 15. Theme attributes — density + contrast

**Owner choice: C — density and contrast in one wave, as Theme attributes** (Aug 2026; CDS-THEME-002)

Normative record: [`docs/decisions/theme-density-contrast.md`](./decisions/theme-density-contrast.md).

- `data-cs-density` (`comfortable` | `compact`) and `data-cs-contrast` (`standard` | `high`) are **attributes under Theme**, not a fifth product identity axis.
- Product axes remain Theme × Element × Language × Style. APCA body floor Lc ≥ 75 and ≥44px touch targets stay immutable under compact.

## 16. Editor HTML parser — implementation under review

**Status: implemented locally; human review and final acceptance pending.**

The browser-only DOM walk and Node regex policy diverged and allowed executable
descendants under unknown wrappers. The revision uses parse5 8.0.1 in both
environments, then constructs a fresh fragment using only the existing eleven
allowed tags and escaped text. All attributes and foreign/raw-text subtrees are
discarded. This is a deliberately narrow HTML-content policy, not a general URL,
CSS or attribute sanitizer.

The pinned parser and its MIT-licensed dependency are generated into a local
module for the existing no-build consumer path. This adds approximately 153 KB
of minified parser source before HTTP compression. Generation/provenance is checked in unit and
prepublish checks. A DOM-emulation dependency for Node is not required. Paste
and drop are sanitized before insertion; `unsafeHtml` remains trusted-only.

Evidence: adversarial Node/browser parity, a regression demonstration against
the audited source, and browser seed/paste/drop/keyboard tests. This does not
replace the human acceptance gates or claim that a schema editor migration has
been completed. The existing contentEditable/execCommand compatibility surface
remains explicit.

## How to change a decision

Edit the **Owner choice** line here. Implementer rewires CI and related docs in the same change.
