# Decisions (maintainer)

Owner choices that shape CI, Figma sync, and distribution. How-tos live in `docs/figma.md` and `docs/ci-cd.md` — this file is the decision record only. Not a consumer guide.

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
- No separate Live View page exists in the tree.
- Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` redirect to `/`.
- Portable Atomic View and other static HTML remain for zero-build gates and consumers; they are not the site product entry.
- Surface map: `docs/live-hub.md`.

## 5. Dual token JSON sources

**Owner choice: keep both `tokens.json` and `tokens.dtcg.json`** (Jul 2026)

| File | Role |
|---|---|
| `tokens/tokens.dtcg.json` | W3C DTCG interchange / native regen |
| `tokens/tokens.json` | CSS-oriented grouped export |
| `tokens/*.css` + `styles.css` | Runtime UI |

## 6. Code Connect — path shipped; **deferred** on free Figma

**Status: provisional / soft-skip — not a live library publish** (Jul 2026; deferred Jul 2026)

- CI job `code-connect` + `figma.config.json` + 105 `*.figma.tsx` mappings are in-repo (import snippets use `@cyberskill/design`).
- Publish soft-skips when secrets are missing or the API returns 403/404/429. Soft-skip ≠ successful Code Connect publish.
- **Owner deferral:** stay on **Figma free / non-Org** for now — do not pursue live Code Connect until an Org/Enterprise seat with a published team library is available. Then replace synthetic `9999:*` stubs in `code-connect/node-map.json` with real `nodeId`s. See `docs/figma.md`.

## 7. npm publish — live via Trusted Publishing (OIDC)

**Status: `@cyberskill/design@1.0.0` is on the registry; CI publish uses npm Trusted Publishing; tokens disallowed** (Jul 2026)

- `package.json` is `private: false`; package name **`@cyberskill/design`** (`publishConfig.access: public`); `repository.url` matches this GitHub repo for provenance.
- Workflow `.github/workflows/npm-publish.yml`: `id-token: write` + GitHub-hosted runner; **no** `NPM_TOKEN` / `NODE_AUTH_TOKEN` on the publish step (OIDC). npm Trusted Publisher must list workflow filename **`npm-publish.yml`** for `cyberskill-official/design-system`. Soft-skip on auth / 403 / 404 / EOTP / version conflict.
- Package **Publishing access** on npmjs: **Require two-factor authentication and disallow tokens** (OIDC Trusted Publishing still works; classic / granular publish tokens are rejected). Long-lived `NPM_TOKEN` secrets are revoked.
- License stays **UNLICENSED**; version stays **1.0.0**. Approved use is recorded in **`docs/consumer-grant.md`** (CyberSkill portfolio products). Registry install alone is not a public license.

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
- **Code Connect** — **skipped while on Figma free**; revisit only after Org + published library + real `nodeId`s (decision §6). Soft-skip ≠ publish.
- **npm** — **`@cyberskill/design@1.0.0` published**; CI uses **Trusted Publishing (OIDC)** via `npm-publish.yml`; npmjs **disallow tokens**; consumer grant in force at `docs/consumer-grant.md` (decision §7). Default package entry is bundler-native `_esm/react.mjs` (React peer); browser path is `@cyberskill/design/legacy` → `_esm/cs.mjs` (decision §10).

## 10. Bundler-native React export (Next / SSR)

**Owner choice: ship `_esm/react.mjs` as default `exports["."]`** (Jul 2026)

- React / react-dom are **peerDependencies**; the entry re-exports source JSX (consumer transpiles — e.g. Next `transpilePackages`).
- Browser / no-build keeps `_esm/cs.mjs` at `exports["./legacy"]` (CDN self-ensure + `_ds_bundle.js`).
- Alias `@cyberskill/design/react` mirrors the default entry. VERSION stays **1.0.0**; republish via Trusted Publishing after merge.
- Docs: `docs/consuming.md` (+ VI); gates: `package-exports-integrity` + `test:react-entry`.

## Maintainer tasks (open)

Operational follow-ups — not product marketing, not a backlog surface:

1. **Code Connect** — deferred (Figma free). When upgrading to Org: replace `9999:*` stubs in `code-connect/node-map.json` with real published-library node IDs.

~~2. npm consumer grant~~ — **done** (Jul 2026): Trusted Publishing + `docs/consumer-grant.md` (+ VI) for CyberSkill portfolio products.

~~3. Finalize products registry~~ — **done** (Jul 2026): see decision §9; `docs/products.md` is locked.

~~4. First registry consumer path~~ — **done** (Jul 2026): `examples/npm-hello/` installs `@cyberskill/design@1.0.0` for locked **Lumi** identity; documented in `docs/consuming.md` (+ VI) and `docs/release-notes.md`.

5. **Native token drift on PRs is fail-closed** (Jul 2026) — `regenerate-tokens` runs read-only on pull requests and exits 1 instead of pushing; only `regenerate-tokens-push` (main / schedule / manual) holds `contents: write`. When a PR fails it, run `node _audit/ci/generate-native-tokens.mjs` and commit the natives. See `docs/ci-cd.md`.

6. **Shadcn gap / Wave 2** (Jul 2026) — CyberSkill already covers ~53 of shadcn’s 62 primitives as CS-native (forms / overlays / nav / data). Shipped: pilot `ScrollArea`, `Collapsible`, `AspectRatio`; Wave 2 `AlertDialog` (vs Popconfirm), `Item` row primitive, `NativeSelect`. Residual shadcn gaps are intentional non-ports (blocks, Tailwind, Radix CLI). Do **not** port those — map patterns to existing `templates/` + `ui_kits/`.

7. **Element colour geometry** (Jul 2026) — Element packs are generated from `tokens/element-seeds.json` (`npm run tokens:elements`): soft / middle / deep intensity ladder, Thổ middle pinned to logo ochre, light↔dark hue lock, APCA dark floors. Public variant names unchanged. Hard gate: `_audit/element-geometry.html`. Benchmark rubric: `docs/benchmark-rubric.md`.

8. **Style axis (`data-cs-style`)** (Jul 2026) — Fourth product axis with sole pack **liquid-glass** (absent ≡ liquid-glass; no visual change vs prior fixed treatment). Contract: `tokens/styles.css` + hard gate `_audit/style-contract.html`. Storybook toolbar, playground, Atomic View, and Identity Lab expose a sole-pack Style control (`liquid-glass` only). Further Style packs follow the Expansion Rule checklist in `docs/benchmark-rubric.md` — do not invent packs casually.

Storybook `FullMatrix` is required whenever a public primary has ≥1 of {size enums, variant enums, state keys} (contract floor ≥28 stories). Schema sidecars remain complete for content-hole templates; axis-only templates omit by design. See `docs/quality-gates.md` and `docs/storybook.md`.

## How to change a decision

Edit the **Owner choice** line here. Implementer rewires CI and related docs in the same change.
