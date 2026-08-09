# Static hello

Minimal consumer of the design system with no build step.
1. Serve the monorepo root (so `../../dist/styles.min.css` resolves). Ensure `dist/styles.min.css` exists (`npm run` flatten / prepublish path if missing).
2. Open `examples/static-hello/index.html`.
3. Toggle `data-theme="dark"` or `data-cs-element="thuy"` on `<body>` to re-skin.

Production static default is the flattened stylesheet (`dist/styles.min.css` / `@cyberskill/design/styles.min.css`). Use `styles.css` only as the readable source/dev `@import` manifest.
