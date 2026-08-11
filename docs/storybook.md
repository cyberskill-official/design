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
- **Maintainer/** stories for portable HTML surfaces (Motion, templates, kitchen-sink, AI cluster, RTL; Atomic View buried for gates)
- Same `styles.css` as production
- Addons: `@storybook/addon-docs` + `@storybook/addon-a11y` (essentials folded into core in SB10)

## Config

- `.storybook/main.js` — ESM Storybook 10 config, Vite + `@cs` → `components/` alias, **`base: '/'`** for domain-root assets
- `.storybook/manager-head.html` — OG / canonical meta for the production `/` surface
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
```

## Map

Portable HTML surfaces iframed from Maintainer/* are listed in `docs/live-hub.md`. Status embeds `_audit/run.html` (auto-run on first load; **Re-run** on demand).
