# Adoption telemetry

Opt-in deprecation and adoption events for council dashboards. Published on Storybook **Docs** at `design.cyberskill.world`.

## Contract

`@cyberskill/primitives` exports `reportAdoption` and `reportDeprecation`. They no-op unless the host assigns `globalThis.CS_TELEMETRY`. The design-system package never opens a network socket.

```js
globalThis.CS_TELEMETRY = (event) => {
  // host sink — DataDog, OpenTelemetry, or a log drain
};
```

## Events

- `type: "adoption"` — product, package name, version (in-repo ledger: `docs/adoption-ledger.json`)
- `type: "deprecation"` — export name and replacement (rate in `docs/governance-review.json`)

Do not send PII. Facades may call `reportDeprecation("@cyberskill/design", "@cyberskill/react")` once per session if the host sink exists.

## Related

- SLOs: `docs/slo.md`
- Consuming: `docs/consuming.md`
- Primitives package: `packages/primitives`
