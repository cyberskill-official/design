# CI/CD — automating the gate board

**Release how-to (authoritative):** [`docs/release-runbook.md`](./release-runbook.md) — trigger → version → tag → npm OIDC → Vercel; SBOM + Scorecard; nightly failure alerting.

**Gate CI** (this workflow) still treats the design system as a static tree: serve the repo, open `_audit/run.html` headlessly, read verdict globals. No product bundler is required for gates.

**Host deploy** (Vercel, separate from this workflow) does run `npm install` + `npm run build:site` so Storybook ships as the product surface at `/` — see `docs/deploy.md` and `docs/storybook.md`. That host packaging path is not required for consuming projects or for the gate jobs below.

## Badge

[![Design System Gates](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml/badge.svg)](https://github.com/cyberskill-official/design/actions/workflows/design-system-gates.yml)

## What's wired up (`.github/workflows/design-system-gates.yml`)

1. **`fast-gates`** — `npm ci` + cached Playwright Chromium, serves the repo, opens `_audit/run.html` headlessly (`_audit/ci/run-gates.mjs`), fails on any hard-gate failure. Uploads import-report on failure. New rows added to the board (the Jul 2026 hardening added 8: token-format-parity, version-stamp, support-runtime-identity, package-exports-integrity, template-lang-parity, dtcg-typing, design-md-parity, bundle-freshness) are picked up automatically — the runner reads `window.__run`, not a job-side gate list.
2. **`token-provenance`** — browser-free Node check that natives + `provenance.json` match DTCG source sha-256.
3. **`unit-tests`** — `npm run test:unit` (11 plain-Node contract tests; wired into CI by the Jul 2026 hardening — previously local-only). Includes `test-element-packs` (`node scripts/generate-element-packs.mjs --check` freshness).
4. **`node-prechecks`** — browser-free Node authorities: `_audit/ci/check-bundle-freshness.mjs` (the bundle-freshness source of truth — full source discovery incl. new/deleted files; the board row only re-hashes header-recorded files), `scripts/generate-design-md.mjs --check` (root `DESIGN.md` byte-equals regeneration), `scripts/flatten-styles.mjs --check` + `scripts/generate-contrast-report.mjs --check` (FIND-026), and `_audit/ci/check-manifest-coverage.mjs` (FIND-078).
4b. **`storybook-build`** — `npm run build:storybook` then `test-storybook-freshness.mjs --require` (FIND-074 / FIND-075). A Storybook break fails CI before deploy.
5. **`docs-consistency-blocker`** — `docs-consistency` + `bilingual-parity` merge blockers.
6. **`whole-set-audits`** — owner decision B: every push/PR, plus nightly `0 3 * * *` and `workflow_dispatch` (responsive + language + theme overflow, ~15–20 min).
7. **`figma-variables-push`** — on `main` push + manual. **Empty `FIGMA_TOKEN` / `FIGMA_FILE_KEY` soft-skip** (exit 0 + report — same honesty as Code Connect). Owner decision A (non-Enterprise): Variables REST also **soft-skips on API 403** (and related plan/scope failures) after secrets prove file open. Soft-skip ≠ live Variables sync. See `docs/figma.md`.
8. **`code-connect`** — on PR + `main` + manual. Decision 1C: dry-run always (config + 105 mappings); publish soft-skips when `FIGMA_TOKEN` / `FIGMA_FILE_KEY` missing or API 403/404/429. See `docs/figma.md`.
9. **`regenerate-tokens`** (pull requests) + **`regenerate-tokens-push`** (push to `main` / schedule / manual) — path filter covers element seeds/packs (`element-seeds.json`, `elements.css`, JSON/JS/DTCG mirrors, `generate-element-packs.mjs`) plus natives / `VERSION`. Regeneration runs `npm run tokens:elements` then `node _audit/ci/generate-native-tokens.mjs`. On a **pull request** the job runs with `contents: read`, never pushes, and **exits 1** on drift: run both locally and commit (PR-required freshness). Only the push/schedule/manual twin holds `contents: write` and may auto-commit with `PUSH_TOKEN` (or `github.token`). Auto-commits **do not** use `[skip ci]` — the pushed tip re-enters the gate board (FIND-021 / TASK-IMP-008); a deterministic second pass is a no-op.
10. **`npm-hello-smoke`** — registry consumer proof for `@cyberskill/design@$VERSION` (**fail-closed**, FIND-087): `examples/npm-hello` → registry `npm install` + `npm run smoke`. If the exact VERSION is **not** on the registry, the job **fails** (no soft-skip pack proof on `cyberskill-official/design`). Forks may opt into local-pack proof only by setting repo variable **`NPM_HELLO_ALLOW_LOCAL_PACK=true`**. Path-filtered on push/PR when `examples/npm-hello/**`, package publish surface, or this workflow changes; always on schedule / `workflow_dispatch`.

Separate workflow **`version`** (`.github/workflows/version.yml`): on push to `main`, Conventional-Commit bump of `VERSION` + stamp shippable artifacts; then regenerates natives/provenance hashes and `npm run build:bundle` so tip stays gate-clean; commits `chore(release): X.Y.Z`, pushes, and tags `vX.Y.Z`. Skips its own release commits (loop-safe). Owner can force a level via `workflow_dispatch` or a `Release-As:` trailer. Needs `contents: write`. Checkout uses `secrets.PUSH_TOKEN || github.token` — if branch protection requires status checks (or blocks `github.token`), set repository secret **`PUSH_TOKEN`** (fine-grained PAT with Contents: Read and write); otherwise the bump computes but the push soft-warns and does not land.

Separate workflow **`npm-publish`** (`.github/workflows/npm-publish.yml`): `workflow_dispatch` + `v*` tags (normally created by `version.yml`); pack dry-run always; publish via **npm Trusted Publishing (OIDC)** (`id-token: write`, no `NPM_TOKEN` on the publish step). Soft-skips only **`already_published`** and true **non-GHA** `missing_secrets`. On tag / `workflow_dispatch`, **ENEEDAUTH** / **404** / **402** / **403** / **EOTP** **fail closed**. Post-publish asserts `npm view @cyberskill/design@VERSION` **and** `dist-tags.latest === VERSION` (FIND-094). License **UNLICENSED**. Trusted Publisher on npmjs must match workflow filename `npm-publish.yml` for repo **`cyberskill-official/design`** (FIND-088). Package Publishing access is **Require 2FA and disallow tokens** (OIDC still works; classic tokens rejected).

Separate workflow **`native-store`** (`.github/workflows/native-store.yml`): PR + `main` (path-filtered) + `workflow_dispatch`; scaffold dry-run always; signed-release check soft-skips without `ASC_KEY_ID` / `ASC_ISSUER_ID` / `ASC_KEY_P8` / `PLAY_SERVICE_ACCOUNT_JSON`. **Never submits** to App Store / Play — samples remain samples. See `examples/native/README.md`.

Node **22** on runners (avoids Node 20 action deprecation). Playwright browser cache key: `package-lock.json`.

## Runner install pattern (Playwright jobs)

```yaml
- run: npm ci
- uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}-chromium
- run: npx playwright install --with-deps chromium
```

## Token auto-commit permissions

`regenerate-tokens-push` and `version.yml` request `permissions: contents: write` and check out with `secrets.PUSH_TOKEN || github.token`. The pull-request twin `regenerate-tokens` stays on `contents: read` and never pushes. If rulesets/branch protection require status checks before push (or lock the default Actions token), set repository secret **`PUSH_TOKEN`** (fine-grained PAT, Contents: Read and write on this repo) or allow GitHub Actions to bypass the ruleset. Without that, bot pushes soft-warn and exit 0; content drift is still hard-failed by `token-provenance` / fast-gates / `node-prechecks`.

## Branch protection (recommended) — NV-18.1 out-of-band

**NV-18.1 (assessment):** which checks are **required** to merge to `main`, whether administrators are included, and whether CODEOWNERS / review / conversation-resolution are enforced are **GitHub settings, not in the repo**. Observed state from a clone alone: **unknown / confirm out-of-band**. Do not invent live ruleset values from workflow YAML.

**Recommended** (documentation only — apply in GitHub Settings → Branches / Rulesets, or via admin `gh api`):

- `fast-gates`
- `docs-consistency-blocker`

Optional: `whole-set-audits` (long).

## Running locally

```bash
npx serve -l 8080 .
npx playwright install --with-deps chromium
node _audit/ci/run-gates.mjs http://127.0.0.1:8080/_audit/run.html
node _audit/ci/check-token-provenance.mjs
node _audit/ci/check-bundle-freshness.mjs
node scripts/generate-design-md.mjs --check
npm run test:unit
node _audit/ci/run-single-gate.mjs http://127.0.0.1:8080/_audit/docs-consistency.html __docs
npm run tokens:elements
node scripts/generate-element-packs.mjs --check
node _audit/ci/generate-native-tokens.mjs
```

## What this does NOT auto-fail (by design)

- **Side-by-side visual / component baseline rows** — advisory only (drift judged by eye). Playwright `%` pixel compare is a **hard** gate (`pixel-diff` job + board Pixel CI row).
- **Figma Variables** — soft-skip when secrets missing (same honesty as Code Connect) or Variables write hits non-Enterprise / API **403**; report artifact records the skip. Soft-skip ≠ live sync.
- **Code Connect publish** — soft-skip when secrets missing or API 403/404/429 (Decision 1C).
- **npm publish** — Trusted Publishing (OIDC) on `npm-publish.yml`; soft-skip on `already_published` / non-GHA `missing_secrets` only; on GHA release **ENEEDAUTH** / **404** / **402** / **403** / **EOTP** fail closed + post-publish version **and** `dist-tags.latest` check (Decision §7 / FIND-020 / FIND-094).
- **Native store signed release** — soft-skip when `ASC_*` / `PLAY_SERVICE_ACCOUNT_JSON` absent (Decision 1C); store submit stays disabled.
- **npm-hello registry smoke** — **fail-closed** (`examples/npm-hello` → registry install + `npm run smoke`); missing `@cyberskill/design@$VERSION` fails the job (FIND-087). Local-pack proof is fork opt-in only (`NPM_HELLO_ALLOW_LOCAL_PACK`).

A green `figma-variables-push` or `code-connect` job still exits 0 on Decision 1C soft-skip, but FIND-095 makes the outcome visible on the public run page via `$GITHUB_STEP_SUMMARY` plus a distinct annotation (`::error::` on schedule/main, `::warning::` elsewhere) — soft-skip is never identical silent green to a live publish. Report artifacts (`figma-push-report.json` / `code-connect-report.json`) still carry detail.

## Soft-skip dry-runs (local)

```bash
npm run code-connect:dry-run          # config + ≥105 mappings; no secrets
node _audit/ci/code-connect-publish.mjs   # without secrets → SOFT SKIP missing_secrets
npm run npm:pack-dry-run              # tarball inventory; no auth
node _audit/ci/npm-publish.mjs        # GHA OIDC; else SOFT SKIP (tokens disallowed on package)
npm run native:store-dry-run          # Fastlane scaffolds + metadata; no ASC_*/Play JSON
node _audit/ci/native-store-dry-run.mjs   # without secrets → SOFT SKIP missing_secrets
```
