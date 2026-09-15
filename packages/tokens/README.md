# @cyberskill/tokens

Canonical token package. `npm run build:workspaces` copies CSS/DTCG/JS into `dist/`. New consumers should depend on this name; `@cyberskill/design/tokens/*` remains the facade path.

- `@cyberskill/tokens/css` — layered runtime (`@layer primitive, semantic, component, state`: type/space/motion/elevation/fonts, then colors/elements/theme attributes, then component tokens, then the liquid-glass style axis).
- `@cyberskill/tokens/css/style-axis` — liquid-glass pack only (`dist/styles.css`). Not a substitute for the color/type layers.
- `@cyberskill/tokens/css/high-contrast` — high-contrast pack (`data-cs-contrast="high"`).
- `@cyberskill/tokens/css/scope` — opt-in `.cs-root` scope (`dist/scope.css`).
