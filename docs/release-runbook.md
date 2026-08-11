# Release runbook (authoritative)

One page for how a release happens and how to tell it worked. Consolidates areas 21/23. Related detail: `docs/ci-cd.md`, `docs/deploy.md`, `docs/decisions.md` §7 / §13.

## Trigger

| Path | When |
|------|------|
| **Auto** | Push to `main` with Conventional Commits → `version.yml` bumps `VERSION`, stamps artifacts, commits `chore(release): X.Y.Z`, tags `vX.Y.Z` |
| **Force** | `Release-As: X.Y.Z` trailer on a commit, or `workflow_dispatch` on `version.yml` with a level |
| **Manual publish** | `workflow_dispatch` on `npm-publish.yml` (also runs on `v*` tags) |

Never push/deploy/merge without an explicit operator instruction when operating as an agent.

## What fires (happy path)

```
main push (feat/fix/…)
  → version.yml  (bump VERSION + stamps + bundle + tag vX.Y.Z)
  → npm-publish.yml  (OIDC Trusted Publishing; post-publish version + dist-tags.latest)
  → Vercel (host)  (build:site → .vercel-static; headers from vercel.json)
  → sbom.yml on tag  (CycloneDX artifact)
```

Scorecard runs on a weekly schedule + `main` pushes (`.github/workflows/scorecard.yml`).

## Success signals

1. GitHub Actions: `version` green; `npm-publish` green (**not** soft-skip) with registry presence **and** `dist-tags.latest === VERSION` (FIND-094).
2. `npm view @cyberskill/design version` **and** `npm view @cyberskill/design dist-tags.latest` both equal root `VERSION`.
3. `npm-hello-smoke` green on the tip (fail-closed registry install of that VERSION — FIND-087).
4. Production: `/` is Storybook; `/VERSION` is plain semver; `/_audit/run.html` fast board green.
5. Artifacts: `cyclonedx-sbom` on the tag run; Scorecard SARIF on Security / Actions artifacts.
6. Post-deploy Health protocol in `docs/deploy.md`.

## Historical unpublished tags (do not backfill)

| Tag | Status | Operator action |
|-----|--------|-----------------|
| `v1.2.1` | Historical git tag; **not** published to npm as `latest` | Leave unpublished |
| `v1.3.0` | Historical git tag; **not** published to npm as `latest` | Leave unpublished |
| `v1.3.1` (current tip) | **Publish target** when operator instructs | Publish **only** `1.3.1` as `dist-tags.latest` |

Do **not** publish `1.2.1` or `1.3.0` to close registry drift — close FIND-102 by publishing **`1.3.1` only** (operator-gated). npm `latest` may still read `1.2.0` until that publish lands.

## Failure / recovery

| Symptom | Action |
|---------|--------|
| `npm-publish` 403 / EOTP / ENEEDAUTH / 404 / 402 on tag or `workflow_dispatch` | **Fail-closed.** Fix Trusted Publisher binding for repo **`cyberskill-official/design`** (FIND-088) / 2FA / OIDC; re-run on the tag. Soft-skip must **not** report success for these. |
| Soft-skip `already_published` | Expected no-op — confirm registry; do not treat as success if you intended a new version. |
| Soft-skip `missing_secrets` | Expected only **off** GitHub Actions (local). On GHA release this is a hard fail. |
| `version.yml` push soft-warn | Set `PUSH_TOKEN` or allow Actions to push past branch protection (see `docs/ci-cd.md`). |
| `npm-hello-smoke` red (VERSION missing on registry) | Expected until publish lands (FIND-087). Follow **Incident: unpublished release** below — do not set `NPM_HELLO_ALLOW_LOCAL_PACK` on the canonical repo. |
| Nightly `design-system-gates` red | GitHub notifies the default workflow subscribers; see “Scheduled-job alerting” below. Re-run `workflow_dispatch`. |
| Partial Vercel deploy | Re-run deploy; follow Health re-run protocol; do not invent live header claims without `curl -sSI`. |

## Incident: unpublished release (FIND-100 / FIND-101 / FIND-107)

Use when git/`VERSION`/site are ahead of npm `dist-tags.latest` (e.g. tip `1.3.1`, registry still `1.2.0`).

1. **Confirm skew** — `cat VERSION`; `npm view @cyberskill/design version`; `npm view @cyberskill/design dist-tags.latest`; note git tags `v1.2.1` / `v1.3.0` / `v1.3.1` as historical vs publish target.
2. **Do not** treat a green `npm-publish` soft-skip (or a green `npm-hello` local-pack proof) as evidence the version is public — smoke is fail-closed; publish auth errors hard-fail on GHA.
3. **Fix Trusted Publisher** if needed — npm package settings must list org/repo **`cyberskill-official/design`**, workflow **`npm-publish.yml`**, and the correct environment (FIND-088). Classic `NPM_TOKEN` is disallowed. CI uses a clean OIDC userconfig (no empty `_authToken` from `actions/setup-node`) so Trusted Publishing can exchange the GitHub OIDC token.
4. **Operator-gated publish** — only after an explicit instruction: re-run `npm-publish.yml` on tag **`v1.3.1`** (or `workflow_dispatch` at that tip). Publish target is **`1.3.1` only**; do not backfill `1.2.1` / `1.3.0`.
5. **Verify** — `npm view @cyberskill/design@1.3.1 version` and `dist-tags.latest` both `1.3.1`; re-run `npm-hello-smoke` (or wait for the next gates run) to green.
6. **Rollback / deprecate (if a bad version reached `latest`)** — `npm deprecate @cyberskill/design@<bad> "…"` and/or `npm dist-tag add @cyberskill/design@<good> latest`. npm does not allow unpublishing recent public versions in the normal case — prefer deprecate + retag `latest`. Site/Vercel rollback is independent (`docs/deploy.md`).

## Scheduled-job alerting (area 27)

- Nightly cron `0 3 * * *` on `design-system-gates.yml`.
- On schedule failure the workflow’s `notify-schedule-failure` job (`needs` every scheduled job — FIND-108) emits an Actions error annotation and fails when `contains(needs.*.result, 'failure')`, which triggers **GitHub’s native workflow-failure email** to repository watchers / the last actor as configured under Settings → Notifications.
- Optional: add a repo Actions variable / secret for Slack webhook later; do not require it for green CI.
- Operators should watch the Actions badge in `docs/ci-cd.md` and enable “Actions” notification for failed workflows.

## Product vs CyberOS

See `docs/decisions.md` §13. The npm package and portable tree are the product; `.cyberos/` is orchestration only.
