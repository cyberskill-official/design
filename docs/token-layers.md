# Token layers

Primitive → semantic → component → state. Published on Storybook **Docs** at `design.cyberskill.world`.

## Model

`tokens/layers.json` is the machine-readable map. CSS custom properties remain the runtime source. Generated CSS, TypeScript, native, Figma, and docs must stay in lockstep with `tokens/tokens.dtcg.json` (existing provenance gates).

| Layer | Role |
|---|---|
| Primitive | Literal values (hex, px, ms, stacks) |
| Semantic | Role aliases that stay stable while themes change |
| Component | Component-scoped aliases |
| State | Hover, focus, disabled, invalid |

Do not treat deep `--cs-*` literals as a public API. Prefer semantic roles.

## Theme provider

`ThemeProvider` (exported from the overlay module and `@cyberskill/themes`) applies `data-theme` (`light` | `dark` | `system`) and `data-cs-contrast` (`normal` | `high`). Call `getThemeInitScript()` in the document head for SSR no-flash.

High contrast is a theme/contrast switch — not a fifth product axis. Density remains retired (`axis-guard`).

## Related

- Layers file: `tokens/layers.json`
- High contrast: `base/high-contrast.css`
- Scoped root: `base/scope.css` and `styles.scoped.css`
