# Native-store workflow input scope

The `native-store` workflow applies the same eight reviewed native-source path patterns to pull requests and pushes to `main`. Manual dispatch remains available. This avoids invoking native sample packaging for unrelated document, template or component edits while retaining native sample/token, font-recipe, dry-run/verdict/test, workflow and root package inputs.

The change adds only `pull_request.paths`; the existing job, signing-secret soft-skip contract, read-only permissions and report upload remain unchanged. This workflow checks sample packaging and never submits to a store. Path-filtered workflows must not become unconditional required checks for unrelated changes: GitHub may leave a skipped workflow check pending.

Run `node _audit/ci/test-native-store-paths.mjs` to verify exact PR/push parity and mutation controls for missing/broad/drifted paths and disabled/tolerated native checks. This is a source contract check; hosted Actions trigger behavior and store acceptance are separate evidence.
