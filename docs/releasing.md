# Preparing a release

Releases use explicit manual preparation. `VERSION`, the package manifest and the lockfile identify the repository candidate; they do not establish publication or acceptance. The current repository version remains unchanged until an operator explicitly prepares a new candidate.

## What the workflow does

`.github/workflows/release.yml` runs only through `workflow_dispatch`. Supply a proposed stable `major.minor.patch`, the exact commit SHA of the selected workflow ref, and an explicit acknowledgement that you checked the required source-bound support, visual and manual acceptance evidence. The acknowledgement does not create support approval records or waive missing evidence.

The workflow checks out that exact source with persisted credentials disabled, installs Node 22 and locked npm dependencies, and installs Chromium, Firefox and WebKit from the locked Playwright dependency. It enforces the existing lifecycle approval gate, prepares version files and generated stamps in its disposable checkout, runs `npm run verify`, then runs `npm run verify:browser` on Linux. The browser command runs pixel comparison before the unchanged gate board. No baseline refresh or failing-gate bypass is part of preparation.

It uploads a plan, candidate receipt, exact binary patch and validation reports. A final check compares the patch hash after validation with the prepared receipt. A failed job can still upload a diagnostic patch; an uploaded artifact is not a successful verification verdict.

The workflow has only `contents: read`. It never creates a commit, tag, pull request or GitHub Release, pushes a branch, deploys, or publishes to npm. It does not dispatch the separate npm publication workflow. Preparing this workflow locally does not run it.

## Inspect a plan locally

From a reviewed clean checkout, inspect a proposal without writing repository files:

```sh
node scripts/prepare-release.mjs --version 1.7.3 --source-sha "$(git rev-parse HEAD)"
```

The version above is an example. The default JSON plan reports `readyToPrepare` and all detected blockers. A readable plan can exit successfully while reporting blockers; inspect that field. Malformed versions, inconsistent version files and a source-SHA mismatch fail immediately. Stable versions only are supported because the existing legacy export generator currently rejects prerelease suffixes.

Planning checks that `VERSION`, `package.json`, `package-lock.json` and its root package agree; the proposal increases the version; the source SHA equals HEAD; the checkout is clean; the proposed `v<version>` tag is absent from fetched local refs; and every declared export has fresh, authorized support evidence. Local absence of a tag is not a global reservation or a check of npm availability.

## Prepare files for review

Use `--write` only in a disposable clean checkout after explicitly authorizing that local preparation:

```sh
node scripts/prepare-release.mjs --version 1.7.3 --source-sha "$(git rev-parse HEAD)" --write
```

This updates version files and current consumer/version stamps, then runs the existing `tokens:generate` chain. Historical published release-note sections retain their original versions and claims. There is no automatic release-note promotion. The script rejects any rewrite of `components/lifecycle.json` and rechecks evidence after regeneration. Changed approved bytes require fresh support review; the script never refreshes an approval hash or supplies a reviewer.

If generation fails, inspect or discard that disposable checkout. Preparation can leave proposed local changes on failure; it never rolls back unrelated files or modifies the source commit. A prepared-file receipt has `candidateValidated: false` until the workflow's separate checks succeed.

## Verify the exact candidate

Retain the JSON emitted by `--write`, run every command in its `requiredValidation` list, then check the unchanged candidate using that receipt:

```sh
node scripts/prepare-release.mjs --version 1.7.3 --source-sha "$(git rev-parse HEAD)" --check-candidate /absolute/path/release-candidate.json
```

The check rejects source, version, patch, support-evidence or tag conflicts. It does not infer test success from the receipt or authorize publication. Retain the actual job verdict, tool/platform scope, source SHA, patch hash and human acceptance records together. The present unreviewed support records remain a hard blocker until their owners complete fresh review.

## Later release authorization

Applying the reviewed patch, committing a candidate, merging, tagging, creating a GitHub Release and publishing the package are separate consequential actions requiring explicit operator authorization. The existing npm publication workflow remains a separate surface; preparation never invokes it. License/usage rights and product/manual acceptance remain independent requirements.

After an independently authorized candidate commit and tag exist, a read-only identity check is available:

```sh
node scripts/prepare-release.mjs --version 1.7.3 --source-sha "EXACT_CANDIDATE_COMMIT_SHA" --verify-tag
```

It requires a clean checkout whose version files agree and whose `v<version>` tag resolves to that exact commit, with fresh support evidence. It checks fetched Git identity only; it does not prove remote registry contents, publication provenance, deployment, manual acceptance or permission to release. Revalidate the exact candidate commit before any later publication.

## Exact-source npm publication

`.github/workflows/npm-publish.yml` treats a GitHub Release event as validation only. Publication requires a separate manual dispatch on the exact version tag and explicit acknowledgement of the source-bound support, visual and manual acceptance evidence. The acknowledgement creates no approval and does not waive lifecycle or compatibility notice requirements.

The read-only validation job checks the clean tagged commit, matching version files, fresh authorized support records and release compatibility. It runs the fixed command list in `scripts/lib/publication-validation.mjs`: both dependency audits, build, complete verification, Linux pixel/board checks, site build, all three Storybook engines and dedicated owned story plays with their accessibility checks, the complete three-engine site CSP test and pack hygiene. Inherited `CS_*` suite selection and evidence overrides are cleared; only the pinned `CS_PDF_PYTHON` interpreter and explicit per-command browser selection are retained. Commands are source-owned and cannot be supplied by a receipt.

After all gates pass, the job packs once and records the commit/tree, support/maintainer/notice hashes, command results and exact tarball digest. A separate OIDC job downloads that same immutable artifact ID, verifies the receipt against the validation job's digest and rechecks source identity, approval freshness, compatibility and tarball bytes. It publishes the exact validated tarball with scripts disabled; it does not rebuild a different package or execute new source hooks with publication credentials. Only an actual registry `E404` proves version absence; authentication, service and malformed responses stop the workflow. An existing version is skipped, never overwritten.

This is a repository enforcement contract. Local fixture tests do not establish a hosted workflow run, successful publication, human acceptance, registry provenance or configured environment reviewers. Retain the actual exact-source run and acceptance evidence before authorizing a release.
