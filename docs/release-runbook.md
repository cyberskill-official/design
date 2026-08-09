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
  → npm-publish.yml  (OIDC Trusted Publishing; post-publish npm view)
  → Vercel (host)  (build:site → .vercel-static; headers from vercel.json)
  → sbom.yml on tag  (CycloneDX artifact)
```

Scorecard runs on a weekly schedule + `main` pushes (`.github/workflows/scorecard.yml`).

## Success signals

1. GitHub Actions: `version` green; `npm-publish` green (not soft-skip) with registry presence check.
2. `npm view @cyberskill/design version` equals root `VERSION`.
3. Production: `/` is Storybook; `/VERSION` is plain semver; `/_audit/run.html` fast board green.
4. Artifacts: `cyclonedx-sbom` on the tag run; Scorecard SARIF on Security / Actions artifacts.
5. Post-deploy Health protocol in `docs/deploy.md`.

## Failure / recovery

| Symptom | Action |
|---------|--------|
| `npm-publish` 403 / EOTP | Fail-closed (FIND-020). Fix Trusted Publisher / 2FA / OIDC; re-run on the tag. |
| Soft-skip `missing_secrets` / already-published | Expected no-op — confirm registry; do not treat as success if you intended a new version. |
| `version.yml` push soft-warn | Set `PUSH_TOKEN` or allow Actions to push past branch protection (see `docs/ci-cd.md`). |
| Nightly `design-system-gates` red | GitHub notifies the default workflow subscribers; see “Scheduled-job alerting” below. Re-run `workflow_dispatch`. |
| Partial Vercel deploy | Re-run deploy; follow Health re-run protocol; do not invent live header claims without `curl -sSI`. |

## Scheduled-job alerting (area 27)

- Nightly cron `0 3 * * *` on `design-system-gates.yml`.
- On schedule failure the workflow’s `notify-schedule-failure` job emits an Actions error annotation and fails, which triggers **GitHub’s native workflow-failure email** to repository watchers / the last actor as configured under Settings → Notifications.
- Optional: add a repo Actions variable / secret for Slack webhook later; do not require it for green CI.
- Operators should watch the Actions badge in `docs/ci-cd.md` and enable “Actions” notification for failed workflows.

## Product vs CyberOS

See `docs/decisions.md` §13. The npm package and portable tree are the product; `.cyberos/` is orchestration only.
