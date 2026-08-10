# npm hello — first **browser** consumer (`@cyberskill/design@1.3.5`)

Minimal **registry** consumer for a locked portfolio product. Uses the published package name (not a relative monorepo path). This example exercises the **legacy browser entry** (`_esm/cs.mjs` via import map) — not the bundler-native React path.

| | |
|---|---|
| **Product** | **Lumi** — wish assistant |
| **Identity** | Hỏa · fire · `plasma` (`docs/products.md`) |
| **Markup** | `data-cs-element="hoa" data-cs-variant="plasma"` |
| **Grant** | `docs/consumer-grant.md` (CyberSkill portfolio; package remains UNLICENSED) |
| **Entry** | Legacy browser: `_esm/cs.mjs` (`exports["./legacy"]`) |

## Install & run

```bash
cd examples/npm-hello
npm install
npm run smoke          # proves package name + dual exports resolve
npm start              # http://127.0.0.1:8766/
# open http://127.0.0.1:8766/
```

Copy-paste for product apps:

```bash
npm install @cyberskill/design@1.3.5
```

Then:

1. Link styles: `@cyberskill/design/styles.css` (or `./node_modules/@cyberskill/design/styles.css`).
2. **Next / Vite / SSR:** `import { Button } from "@cyberskill/design"` (default → `_esm/react.mjs`; peer `react` + `react-dom`). See `docs/consuming.md`.
3. **Browser / no-build (this example):** map or import `@cyberskill/design/legacy` → `_esm/cs.mjs`.
4. Scope the product root with the locked Markup row above.

CI publishes via **npm Trusted Publishing (OIDC)**; package Publishing access **disallows tokens**. See `docs/release-notes.md` and `docs/consuming.md`.

## Status Hub variant

Same install. Swap body attributes to Status Hub’s locked row (`data-cs-element="thuy"`) — do not invent new product → element mappings.
