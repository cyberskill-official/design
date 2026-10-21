# CI/CD — automating the gate board

**Gate CI** (this workflow) treats the design system as a static tree: serve the repo, open `_audit/run.html` headlessly, read verdict globals. No product bundler is required for gates. Published on Storybook **Docs** at `design.cyberskill.world`.

**Host deploy** (Vercel, separate from this workflow) does run `npm install` + `npm run build:site` so Storybook ships as the product surface at `/` — see `docs/deploy.md` and `docs/storybook.md`. Consumers do not need host packaging; the `storybook-build` job below exercises this exact public packaging path.

## Badge

[![Design System Gates](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml/badge.svg)](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml)

## What's wired up (`.github/workflows/design-system-gates.yml`)

1. **`fast-gates`** — `npm ci` + cached Playwright Chromium, serves the repo, opens `_audit/run.html` headlessly (`_audit/ci/run-gates.mjs`), fails on any hard-gate failure. Uploads import-report on failure. New rows added to the board (the Jul 2026 hardening added 8: token-format-parity, version-stamp, support-runtime-identity, package-exports-integrity, template-lang-parity, dtcg-typing, design-md-parity, bundle-freshness) are picked up automatically — the runner reads `window.__run`, not a job-side gate list.
2. **`token-provenance`** — browser-free Node check that natives + `provenance.json` match DTCG source sha-256.
3. **`unit-tests`** — `npm run test:unit` (the canonical package-script suite of Node contracts and headless browser cases; wired into CI by the Jul 2026 hardening — previously local-only). Includes `test-element-packs` (`node scripts/generate-element-packs.mjs --check` freshness).
4. **`node-prechecks`** — browser-free Node authorities: `_audit/ci/check-bundle-freshness.mjs` (the bundle-freshness source of truth — full source discovery incl. new/deleted files; the board row only re-hashes header-recorded files), `scripts/generate-design-md.mjs --check` (root `DESIGN.md` byte-equals regeneration), `scripts/flatten-styles.mjs --check` + `scripts/generate-contrast-report.mjs --check` (FIND-026), and `_audit/ci/check-manifest-coverage.mjs` (FIND-078).
4b. **`storybook-build`** — `npm run build:site`, `npm run test:public-site`, then `test-storybook-freshness.mjs --require`. CI builds and checks the isolated public webroot before deployment.
5. **`docs-consistency-blocker`** — `docs-consistency` + `bilingual-parity` merge blockers.
6. **`whole-set-audits`** — owner decision B: every push/PR, plus nightly `0 3 * * *` and `workflow_dispatch` (responsive + language + theme overflow, ~15–20 min).
7. **`figma-variables-push`** — on `main` push + manual. **Empty `FIGMA_TOKEN` / `FIGMA_FILE_KEY` soft-skip** (exit 0 + report). Owner decision A keeps this integration optional. With credentials, only the Variables access and API-unavailability responses documented in `docs/figma.md` may soft-skip. File-preflight scope errors, ordinary write-permission failures and invalid local token data remain hard failures. Soft-skip does not establish live Variables sync.
8. **`pixel-diff`** — Playwright Chromium screenshot comparison (`_audit/ci/pixel-diff.mjs`) against the 15 curated baselines in `_audit/baselines/*.png`; uploads `pixel-baselines-linux` and `_audit/ci/pixel-diff-report.json`.
9. **`regenerate-tokens`** (pull requests) + **`regenerate-tokens-push`** (push to `main` / schedule / manual) — path filter covers element seeds/packs (`element-seeds.json`, `elements.css`, JSON/JS/DTCG mirrors, `generate-element-packs.mjs`) plus natives / `VERSION`. Regeneration runs `npm run tokens:generate`, including the complete token exports, native copies and dependent outputs/catalog. On a **pull request** the job runs with `contents: read`, never pushes, and **exits 1** on drift: run this pipeline locally and prepare the reviewed diff (PR-required freshness). Only the push/schedule/manual twin holds `contents: write` and may auto-commit with `PUSH_TOKEN` (or `github.token`). Auto-commits **do not** use `[skip ci]` — the pushed tip re-enters the gate board (FIND-021 / TASK-IMP-008); a deterministic second pass is a no-op.
10. **`npm-hello-smoke`** — registry consumer proof for `@cyberskill/design@$VERSION` (**fail-closed**, FIND-087): `examples/npm-hello` → registry `npm install` + `npm run smoke`. If the exact VERSION is **not** on the registry, the job **fails** (no soft-skip pack proof on `cyberskill-official/design`). Forks may opt into local-pack proof only by setting repo variable **`NPM_HELLO_ALLOW_LOCAL_PACK=true`**. Path-filtered on push/PR when `examples/npm-hello/**`, package publish surface, or this workflow changes; always on schedule / `workflow_dispatch`.
11. **`notify-schedule-failure`** — emits an error annotation and exits 1 when a scheduled nightly run fails; it does not create or update an issue.

Separate workflow **`native-store`** (`.github/workflows/native-store.yml`): PR + `main` (path-filtered) + `workflow_dispatch`; scaffold dry-run always; signed-release check soft-skips without `ASC_KEY_ID` / `ASC_ISSUER_ID` / `ASC_KEY_P8` / `PLAY_SERVICE_ACCOUNT_JSON`. **Never submits** to App Store / Play — samples remain samples. See `examples/native/README.md`.

Gate jobs use Node **22**. The Playwright cache key includes `package-lock.json` and the required engines.

## Runner install pattern (Playwright jobs)

```yaml
- run: npm ci
- uses: actions/cache@v6
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}-chromium-firefox-webkit
- run: npx playwright install --with-deps chromium firefox webkit
```

## Token auto-commit permissions

`regenerate-tokens-push` requests `permissions: contents: write` and checks out with `secrets.PUSH_TOKEN || github.token`. The pull-request twin `regenerate-tokens` stays on `contents: read` and never pushes. If rulesets/branch protection require status checks before push (or lock the default Actions token), set repository secret **`PUSH_TOKEN`** (fine-grained PAT, Contents: Read and write on this repo) or allow GitHub Actions to bypass the ruleset. Without that, bot pushes soft-warn and exit 0; content drift is still hard-failed by `token-provenance` / fast-gates / `node-prechecks`.

## Branch protection (recommended) — NV-18.1 out-of-band

**NV-18.1 (assessment):** which checks are **required** to merge to `main`, whether administrators are included, and whether CODEOWNERS / review / conversation-resolution are enforced are **GitHub settings, not in the repo**. Observed state from a clone alone: **unknown / confirm out-of-band**. Do not invent live ruleset values from workflow YAML.

**Recommended** (documentation only — apply in GitHub Settings → Branches / Rulesets, or via admin `gh api`):

- `fast-gates`
- `docs-consistency-blocker`

Optional: `whole-set-audits` (long).

## Running locally

Run the static server in a separate terminal and the checks in another. Pixel comparison requires the matching renderer/baseline; retain cross-environment failures as evidence and do not automatically update baselines. After changing token inputs, run `npm run tokens:generate` before validation.

```bash
npx serve -l 8080 .
npx playwright install --with-deps chromium firefox webkit
node _audit/ci/pixel-diff.mjs http://127.0.0.1:8080
node _audit/ci/run-gates.mjs http://127.0.0.1:8080/_audit/run.html
node _audit/ci/check-token-provenance.mjs
node _audit/ci/check-bundle-freshness.mjs
node scripts/generate-design-md.mjs --check
npm run test:unit
node _audit/ci/run-single-gate.mjs http://127.0.0.1:8080/_audit/docs-consistency.html __docs
npm run tokens:generate
node scripts/generate-element-packs.mjs --check
node _audit/ci/check-token-provenance.mjs
```

## What this does NOT auto-fail (by design)

- **Side-by-side visual / component baseline rows** — advisory only (drift judged by eye). Playwright `%` pixel compare is a **hard** gate (`pixel-diff` job + board Pixel CI row).
- **Figma Variables** — missing secrets, documented Variables access restrictions or API unavailability produce an explicit skip report. File-preflight scope errors, ordinary write-permission failures and invalid local token data fail. See `docs/figma.md` for endpoint/status boundaries; a skip does not prove live sync.
- **Native store signed release** — soft-skip when `ASC_*` / `PLAY_SERVICE_ACCOUNT_JSON` absent (Decision 1C); store submit stays disabled.
- **npm-hello registry smoke** — **fail-closed** (`examples/npm-hello` → registry install + `npm run smoke`); missing `@cyberskill/design@$VERSION` fails the job (FIND-087). Local-pack proof is fork opt-in only (`NPM_HELLO_ALLOW_LOCAL_PACK`).

A green `figma-variables-push` job still exits 0 on Decision 1C soft-skip, but FIND-095 makes the outcome visible on the public run page via `$GITHUB_STEP_SUMMARY` plus a distinct annotation (`::error::` on schedule/main, `::warning::` elsewhere) — soft-skip is never identical silent green to a live publish. Report artifacts (`figma-push-report.json`) still carry detail.

## Soft-skip dry-runs (local)

```bash
npm run test:pack-hygiene             # tarball inventory; no auth
npm run native:store-dry-run          # Fastlane scaffolds + metadata; no ASC_*/Play JSON
node _audit/ci/native-store-dry-run.mjs   # without secrets → SOFT SKIP missing_secrets
```

The complete `npm run test:unit` suite requires Chromium, Firefox and WebKit. `node _audit/ci/check-ci-browser-prerequisites.mjs` checks explicit installation commands before the CI entrypoint; `npm run test:ci-browser-prerequisites` also launches all three engines. Local YAML checks do not establish successful hosted Linux execution. Jobs that only run Chromium gates still require only Chromium.

## Pinned npm before dependency caching

Every `actions/setup-node` step disables both explicit npm caching and its automatic package-manager cache. The shared npm setup action first bootstraps the locked CLI, then discovers the cache path through `node scripts/npm.mjs config get cache` and restores npm downloads with the existing pinned cache action. `devEngines` and exact-version checks remain enforced. The bundled npm can bootstrap in the isolated CLI fixture; it must not run project cache discovery before the required npm version is active.
