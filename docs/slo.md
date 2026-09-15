# Accessibility and performance SLOs

Release-blocking service levels for Stable packages. Published on Storybook **Docs** at `design.cyberskill.world`.

## Accessibility

- External baseline: WCAG 2.2 AA
- Internal body text: APCA Lc ≥ 75
- Zero critical axe violations on Stable stories in CI
- Zero critical keyboard or landmark regressions on the inclusive matrix
- Manual AT protocol (`docs/at-protocol.md`) recorded before a Stable promotion

## Performance

Budgets live in `docs/package-budgets.json` and fail CI on regression.

- Interaction latency p95 target: under 100 ms for primary Button / TextField / Dialog open, measured on compiled `@cyberskill/react` (`_audit/high-risk-at.html` plus product hosts)
- React entry (`_esm/react.mjs`) and `dist/styles.min.css` stay under published byte caps
- Slim workspace tarballs exclude templates, `_audit/`, and raw JSX

## Adoption

Council tracks live production uptake out of band. In-repo evidence is `docs/adoption-ledger.json` plus `apps/product-fixtures/render.mjs` (compiled `@cyberskill/react` / `@cyberskill/tokens`) and `docs/governance-review.json` (token-drift zero, deprecation-migration rate). The telemetry hook remains `reportAdoption` from `@cyberskill/primitives` (opt-in `globalThis.CS_TELEMETRY`). Target: ≥80% of registered products on Stable packages within two quarters. Live traffic outside this repo is not invented.

## Related

- Telemetry: `docs/telemetry.md`
- Support matrix: `docs/support-matrix.md`
- Package topology: `docs/package-topology.md`
