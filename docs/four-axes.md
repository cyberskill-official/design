# The Four Axes

The design system exposes four **independent** axes — the same switches in this Storybook's toolbar (**Theme** · **Element** with all declared packs · **Language** · **Style**):

1. **Theme** — `data-theme` — light (default) · dark · **system** (OS `prefers-color-scheme`)
2. **Element** — `data-cs-element` (+ optional `data-cs-variant`) — Ngũ Hành product identity: Kim · Mộc · Thủy · Hỏa · Thổ, the packs declared by the [current catalog](reference-catalog.json) in the Element toolbar (same set as **Foundations/Elements**, Atomic View, and template EL maps)
3. **Language** — `lang` — `en` · `vi` (see **I18n**)
4. **Style** — `data-cs-style` — sole pack today: `liquid-glass` (absent ≡ liquid-glass)

State them on a container for components that consume these scopes. Template support is declared per template in `docs/reference-catalog.json` (published counts); static print documents, UI kits and fixed-language collateral have documented boundaries. Language changes also require translated content and a renderer that selects it:

```html
<body data-theme="dark" data-cs-element="thuy" data-cs-variant="ocean" data-cs-style="liquid-glass" lang="vi">
  <!-- scoped components; provide content in the selected language -->
</body>
```

Storybook defaults: `light · tho · vi · liquid-glass`.

## Do

- Scope axes on a **container** and let the cascade work
- Consume `--cs-accent-*` for anything element-aware
- Use the EN·VI registry for component UI chrome; supply translated consumer content
- Test combinations that matter — axes multiply independently
- Keep dark-theme overrides in token space
- Keep Style packs on the allowlist (`_audit/style-contract.html`)

## Don't

- Don't hardcode element hex values
- Don't put brand-umber text/borders on themeable surfaces without a dark override
- Don't remap semantic status colours or the Ochre focus halo per element
- Don't mix two element accents as primary + secondary (gradient wash along Tương sinh only)
- Don't inline one-language UI chrome in components
- Don't invent a second Style pack without the Expansion Rule checklist
