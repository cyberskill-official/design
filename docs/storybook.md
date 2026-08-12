# Storybook — product surface at `/` (host)

Storybook **10** is the **product site** for operators on `design.cyberskill.world` (`/`). It is still **not** part of the portable consumer contract. Published on Storybook **Docs** at `design.cyberskill.world`.

## URL

| Context | Path |
|---|---|
| Production | `https://design.cyberskill.world/` |
| Local packaged site | `/` after `npm run build:site` (serve `.vercel-static/`) |
| Local dev | `npm run storybook` → http://localhost:6006 |
| Legacy | `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*` → `/` |

## What it includes

- Full component CSF with **Default + deep control matrices** (`Matrix` / `AllVariants`)
- **CSF bar (exhaustive where axes exist):**
  - `AllSizes` whenever `argTypes.size` exists (token ramp or representative numeric sizes)
  - `States` (or a Matrix subsection) covering `disabled` / `loading` / `error` / `busy` when those argTypes exist
  - Every discrete `size` / `variant` enum option mounted in a matrix-family story
  - `FullMatrix` when ≥1 of {size enums, variant enums, state keys} exist — the size × variant × key-state product via shared helpers in `stories/lib/matrix.jsx`
- Toolbar globals: Theme (light · dark · **system**) × Element × Language × Style (same axes as templates / Atomic View). Element lists **all 15** Ngũ Hành packs (`tokens.elements` / template EL maps / Storybook toolbar) — not a subset. Style’s sole pack is **liquid-glass**.
- **Docs/** published operator documentation — nested **Start / Guides / Maintainers**, curated MDX for high-traffic pages, one sidebar story per tracked markdown page, and a Documentation Library iframe of `/docs/viewer.html` (EN·VI). Canonical prose remains `docs/*.md`; Storybook is the live reading surface. **Release Notes/** curated product prose (**no CHANGELOG.md**); **Status/** embeds `_audit/run.html` full-bleed
- **Templates/** public starting points — Gallery (Atomic View Templates tier + kitchen-sink/playground) and every manifest template under Atomic View categories (including **HR** / `vn-*`). Regen CSF with `node scripts/generate-template-stories.mjs` after template renames
- **Pages/** public UI kits (Status Hub, Marketing site, Slide deck)
- **Maintainer/** stories for portable HTML surfaces (Motion, kit mirrors, template demos, AI cluster, RTL; Atomic View for gates)
- Same `styles.css` as production
- Addons: `@storybook/addon-docs` + `@storybook/addon-a11y` (essentials folded into core in SB10)

## Config

- `.storybook/main.js` — ESM Storybook 10 config, Vite + `@cs` → `components/` alias, **`base: '/'`** for domain-root assets
- `.storybook/manager-head.html` — OG / canonical meta for the production `/` surface
- `.storybook/preview.jsx` — `storySort` order: Docs · Foundations · Components · **Templates** · **Pages** · A11y · I18n · Release Notes · Status · Maintainer
- Autodocs via `tags: ['autodocs']` on CSF meta (no `docs.autodocs` in main)

## What consumers still use (unchanged)

| Audience | Consume |
|---|---|
| Static / any framework | `styles.css` + `.cs-*` |
| React production | `styles.css` + `_ds_bundle.js` |
| ESM (bundler) | `_esm/react.mjs` (default / `@cyberskill/design/react`) |
| ESM (browser legacy) | `_esm/cs.mjs` (`@cyberskill/design/legacy`) |
| Tokens | `tokens/*` |
| DC-capable authoring | `templates/**/*.dc.html` |

## Commands

```bash
npm install
npm run storybook
npm run build:storybook    # → storybook-static/ (base `/`)
npm run build:site         # packages Storybook at .vercel-static/ root
npm run test:storybook-contract
node scripts/generate-template-stories.mjs   # refresh Templates/{Category} CSF from manifest
```

## Map

Public Templates/Pages and Maintainer iframes are listed in `docs/live-hub.md`. HR Suite Word originals mapping: `docs/hr-suite-sources.md`. Status embeds `_audit/run.html` (auto-run on first load; **Re-run** on demand).
