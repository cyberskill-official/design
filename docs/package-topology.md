# Package topology

Workspace split and the `@cyberskill/design` compatibility facade. Published on Storybook **Docs** at `design.cyberskill.world`.

## Workspaces

```
packages/tokens        @cyberskill/tokens
packages/primitives    @cyberskill/primitives
packages/react         @cyberskill/react
packages/themes        @cyberskill/themes
packages/icons         @cyberskill/icons
packages/templates     @cyberskill/templates
packages/eslint        @cyberskill/eslint-plugin
packages/codemods      @cyberskill/codemods
apps/storybook         host docs (not a runtime install)
apps/consumer-canary   React 18/19 + SSR smoke
```

Root `@cyberskill/design` remains the install name during a six-month migration window. New products should import `@cyberskill/react` + `@cyberskill/tokens` (or the facade, which re-exports them).

## Budgets

`docs/package-budgets.json` plus `_audit/ci/test-package-budgets.mjs` block size regressions. Slim workspace packages must not ship templates, compiler runtimes, or `_audit/` fixtures. The facade still includes the portable tree for existing consumers.

## Changesets

`.changeset/` records package-level semver. Release binding (`scripts/release-bind.mjs`) refuses npm publish when tag, `VERSION`, HEAD SHA, and tarball digest do not match.

## Related

- Consuming: `docs/consuming.md`
- Release: `docs/release-runbook.md`
- Governance: `docs/governance.md`
