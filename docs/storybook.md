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
- **Docs/** published operator documentation — nested **Start / Guides / Maintainers**, curated MDX for high-traffic pages, one sidebar story per public catalog markdown page, and a Documentation Library iframe of `/docs/viewer.html` (EN·VI). Canonical prose remains `docs/*.md`; Storybook is the live reading surface. **Release Notes/** curated product prose (**no CHANGELOG.md**); **Status/** embeds `_audit/run.html` full-bleed
- **Templates/** public starting points — Gallery (Atomic View Templates tier + kitchen-sink/playground) and every manifest template under Atomic View categories (including **HR** / `vn-*`). Regen CSF with `node scripts/generate-template-stories.mjs` after template renames
- **Pages/** public UI kits (Status Hub, Marketing site, Slide deck)
- **Maintainer/** stories for portable HTML surfaces (Motion, kit mirrors, template demos, AI cluster, RTL; Atomic View for gates)
- Same `styles.css` as production
- Addons: `@storybook/addon-docs` + `@storybook/addon-a11y` (essentials folded into core in SB10)

The Documentation Library uses its own EN/VI selector. Fresh UI defaults to Vietnamese; a saved English selection is retained when local storage is available. Browsing and switching language still work when persistence is unavailable. The UI, loading/search/error feedback and selected-button state follow that choice. Entrance Markdown/llms pages remain English and carry English content/snippet language metadata; guides select their EN or VI source. These markup/behavior checks do not certify translation quality or screen-reader speech.

On coarse pointers, the Documentation Library gives its language buttons, search field, navigation/results and rendered article links a 44px minimum target. The maintained touch test visits every declared EN/VI route at 320/390/1280px in both themes and densities; it checks clipped geometry, inset DOM ownership, native event targeting and keyboard navigation. Fine-pointer controls keep their original dimensions. This does not certify continuous edge ownership, OS touch adjustment, external destinations or human accessibility acceptance.

## Config

- `.storybook/main.js` — ESM Storybook 10 config, Vite + `@cs` → `components/` alias, **`base: '/'`** for domain-root assets
- `.storybook/manager-head.html` — OG / canonical meta for the production `/` surface
- `.storybook/preview.jsx` — `storySort` order: Docs · Foundations · Components · **Templates** · **Pages** · A11y · I18n · Release Notes · Status · Maintainer
- Autodocs via `tags: ['autodocs']` on CSF meta (no `docs.autodocs` in main)

## What consumers still use (unchanged)

| Audience | Consume |
|---|---|
| Static / any framework | `styles.css` + `.cs-*` |
| Legacy React browser (no build) | `styles.css` + `_ds_bundle.js` |
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

## Build freshness

Run `npm run build:storybook`, then `node _audit/ci/test-storybook-freshness.mjs --require`. The build wrapper fingerprints inputs before and after the successful build and refuses to stamp a changing source tree. `scripts/storybook-inputs.mjs` supplies the same root-file and static-directory lists to Storybook and verification. The hash includes components, stories, configuration, styles/tokens, docs, templates, fonts, binary/hidden assets, vendored inputs, the package lock, build scripts and Node/OS/architecture identity. Output hashes detect missing or modified build files; this is integrity evidence, not a visual or accessibility verdict.

A source/toolchain change, an old stamp or altered output requires a rebuild. Standalone restamping is refused. An absent build is reported as SKIP locally and fails with `--require`; missing declared inputs and symbolic links fail closed. The verifier regression suite checks relevant input mutation, addition/removal, output tampering and mid-build changes in disposable fixtures.

Run validation before the final build when it regenerates audit reports copied into the site; changed report bytes invalidate freshness too.

## Public hosting inventory

`scripts/public-site-policy.json` lists each publishable source file with its audience and purpose. Storybook stages those files in `.storybook-public/`; adding a file under an existing directory does not publish it. Review and add required resources explicitly. Restart the dev server after policy changes; edits to existing listed files are watched. Generated directory indexes keep allowed source directories navigable on static hosts.

`npm run build:site` builds Storybook, verifies source/output freshness and packages only classified output into `.vercel-static/`. Its `public-site-manifest.json` records audience, purpose, byte size and SHA-256 for every output except the manifest itself. Unknown output, missing required inputs and symlinks fail closed. Workflow files, task/audit/revision records, lockfiles and private maintenance scripts are excluded. Public locale/theme decision records remain linked documentation; inventory inclusion does not establish licensing or human acceptance.

After installing Playwright Chromium, run `npm run test:public-site`. It serves only the packaged directory, checks exact manifest closure and bytes, private-path 404s, the Storybook shell and ten documentation, consumer, accessibility, behavior, QR and template-schema browser gates, plus visual-review rendering, under the configured deployment headers. CI requires this check. The unit policy test verifies unlisted files cannot enter staging. These checks do not certify deployment or replace full visual/accessibility gates.
