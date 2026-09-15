# Package topology

Workspace split and the `@cyberskill/design` compatibility facade. Published on Storybook **Docs** at `design.cyberskill.world`.

## Workspaces

```
packages/tokens        @cyberskill/tokens
packages/primitives    @cyberskill/primitives (focus, overlay, sanitizer, collection/roving)
packages/react         @cyberskill/react
packages/themes        @cyberskill/themes
packages/icons         @cyberskill/icons
packages/templates     @cyberskill/templates
packages/eslint        @cyberskill/eslint-plugin
packages/codemods      @cyberskill/codemods
apps/storybook         host docs (not a runtime install)
apps/consumer-canary   React 18/19 + SSR smoke
```

Root `@cyberskill/design` remains the install name during a six-month migration window. New products should import `@cyberskill/react` + `@cyberskill/tokens` (compiled `dist/`, no raw JSX, no templates). Per-component ESM is on kebab exports such as `@cyberskill/react/button` (compiled `dist/`); deep `@cyberskill/react/components/*` stays off the export map and must fail. Facade consumers that cannot transpile JSX use `@cyberskill/design/stable`. The default facade entry still re-exports source JSX for existing bundlers and emits a deprecation note in its package description. `@cyberskill/themes` ships the high-contrast pack, the 15 elemental brand-pack registry, and `applyBrandPack`; CSS for those packs stays on `@cyberskill/tokens/css`.

## Budgets

`docs/package-budgets.json` plus `_audit/ci/test-package-budgets.mjs` block size regressions. Manual trend snapshots live in `docs/package-budget-trends.json` (not auto-written by `test:unit`). Slim workspace packages must not ship templates, compiler runtimes, or `_audit/` fixtures. The facade still includes the portable tree for existing consumers.

## Changesets

`.changeset/` records package-level semver. Release binding (`scripts/release-bind.mjs`) refuses npm publish when tag, `VERSION`, HEAD SHA, and tarball digest do not match.

## Related

- Consuming: `docs/consuming.md`
- Release: `docs/release-runbook.md`
- Governance: `docs/governance.md`
