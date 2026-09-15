# @cyberskill/tokens

Canonical token package. `npm run build:workspaces` copies CSS/DTCG/JS into `dist/`. New consumers should depend on this name; `@cyberskill/design/tokens/*` remains the facade path.

- `@cyberskill/tokens/css` — layered runtime (`colors`, type, space, motion, elevation, fonts, elements, theme attributes, component tokens, then the liquid-glass style axis).
- `@cyberskill/tokens/css/style-axis` — liquid-glass pack only (`dist/styles.css`). Not a substitute for the color/type layers.
- `@cyberskill/tokens/css/high-contrast` — high-contrast pack (`data-cs-contrast="high"`).
