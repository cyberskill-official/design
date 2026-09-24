# @cyberskill/web-components

Demand-led custom elements used by two non-React pilots:

- `apps/wc-pilot-checkout` — form + pay button
- `apps/wc-pilot-settings` — labeled field + save

Quality and performance criteria (CI: `_audit/ci/test-wc-pilots.mjs`):

- `cs-button` and `cs-text-field` upgrade
- keyboard/focus reaches the host control
- submit/save updates a live region
- no page errors
- custom-element define time under 250 ms
