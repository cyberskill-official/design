# Governance — owners, maturity, deprecation

How CyberSkill stewards the public design-system API. Published on Storybook **Docs** at `design.cyberskill.world`.

## Design System Council

The council is the directly responsible group for package and stable-component decisions: design, frontend, accessibility, localization/content, security, product, and release. Named seats live in `docs/export-registry.json` (`council`).

## Owners

Every public export has an `owner` and `backup` in the machine-readable registry `docs/export-registry.json`. GitHub review routing is `.github/CODEOWNERS`. A component cannot move to **Stable** without design and engineering review plus accessibility and content sign-off recorded on the change.

Regenerate the registry after adding or renaming a public export:

```bash
node scripts/generate-export-registry.mjs
```

## Maturity

| Level | Promise |
|---|---|
| Experimental | API may change; no compatibility promise |
| Beta | Production pilots allowed; migration notes required |
| Stable | Semver guarantee, complete docs, owner, support window |
| Deprecated | Replacement, warning period, and removal date required |

`_audit/ci/test-export-registry.mjs` fails if any public export is missing owner, maturity, support, deprecation, or package fields.

## Deprecation

Deprecated exports keep a `deprecation` object: `{ replacement, since, removeAfter }`. Warn in the facade during the six-month `@cyberskill/design` migration window. Do not remove a Stable export in a minor release.

## RFC

New components, tokens, themes, or breaking changes need an RFC in `docs/decisions.md` (or a linked ADR). Required sections:

1. User / problem evidence
2. Alternatives considered
3. Proposed API
4. Accessibility impact
5. Localization / content impact
6. Responsive / browser impact
7. Security impact
8. Adoption plan
9. Telemetry
10. Deprecation plan

A component cannot become Stable without design and engineering review plus a11y/content sign-off recorded on that RFC.

## Related

- Support and browsers: `docs/support-matrix.md`
- Component contract: `docs/component-contract.md`
- Package split: `docs/package-topology.md`
