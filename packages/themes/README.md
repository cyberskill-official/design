# @cyberskill/themes

Compiled SSR-safe ThemeProvider (`dist/provider.js`) plus contrast/dir helpers. Density is a Theme attribute, not a product axis.

Theme packs (Phase 4):

- `@cyberskill/themes/high-contrast` — `data-cs-contrast="high"` / `prefers-contrast: more`
- `@cyberskill/themes/brand-packs` — registry of the 15 elemental identity packs; CSS runtime stays `@cyberskill/tokens/css`
- `applyBrandPack(name, root)` — sets `data-cs-element` / `data-cs-variant` (middle intensity drops variant). `ThemeProvider` accepts the same `element` and `variant` props.
