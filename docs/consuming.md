# Consuming & upgrading the CyberSkill Design System

How any project — human-driven or agent-driven — adopts this HTML-first design system, and how to take updates safely. Published on Storybook **Docs** at `design.cyberskill.world`.

**Package name:** `@cyberskill/design` (see `package.json`). Do not treat historical `@cyberskill/react` as the install path for this monolith.

## When to use

You are installing, linking, or upgrading the system in another product. Maintainers extending the system start at `docs/doctrine.md`.

## Capability paths (DC-capable vs static)

| Consumer | Start here | Works today | Do not |
|---|---|---|---|
| **Claude Code** | `SKILL.md` → `README.md` → `styles.css` + bundler `@cyberskill/design` / legacy `_esm/cs.mjs` / `_ds_bundle.js` (prefix resolve) | Strong — rules, components, prompts; gates via full clone | Hardcode the bundle suffix; treat Storybook host as the portable contract; import `_esm/cs.mjs` or `@cyberskill/design/legacy` into Next/SSR bundlers |
| **Google Stitch** | `DESIGN.md` → `llms.txt` → `tokens/tokens.dtcg.json` | Strong for doctrine + tokens + static `.cs-*` HTML | Treat `templates/**/*.dc.html` as SoT — no tweaks / `__dcSetProps` / DC compiler |
| **Claude Design** | Full repo + DC compiler | Full fidelity (tweaks, `x-import`, bilingual templates) | Skip the sync loop in `docs/sync.md` |
| **npm** | `@cyberskill/design` | Registry version tracks repo `VERSION` (auto-bump → tag → Trusted Publishing); grant in `docs/consumer-grant.md` | Treat registry install as a public license (still UNLICENSED) |

**Stitch DC rule:** Stitch (and any non-DC tool) must **not** consume `*.dc.html` as source of truth. Use static export patterns, `templates/kitchen-sink.html`, `examples/static-hello/`, and `.cs-*` classes from `styles.css`.

**Release signal:** version is LAUNCHED at **1.1.0**; **pin tracks `VERSION`** (no CHANGELOG). Treat the **git tip SHA** as technical truth; read curated product highlights in `docs/release-notes.md`.

## Quick path for AI agents (DC-capable authoring, or driving one)

**What you get:** `styles.css` (400+ tokens + `.cs-*` classes + Liquid Glass surfaces, `@import`s `tokens/` + `base/`) · `_ds_bundle.js` (compiled React components, no build step) · `_esm/react.mjs` (bundler-native React entry — React as peerDependency; default `exports["."]`) · `_esm/cs.mjs` (browser / no-build legacy via `exports["./legacy"]`) · `_ds_manifest.json` (machine-readable inventory) · per-component `Name.d.ts` (API) + `Name.prompt.md` (usage brief) · `tokens/tokens.dtcg.json` (W3C DTCG) + `tokens.json`/`tokens.js`.

**Repo checkout** — clone or copy the whole tree; everything is relative-path static. Entry points: Storybook on the host site (`/` / `npm run storybook`) · `guidelines/atomic-view.html` (every component live, portable) · `templates/<slug>/` (copyable starting points — DC when a compiler is present; kitchen-sink / `.cs-*` for Stitch / static). Read `SKILL.md` before authoring anything on-brand; Stitch readers start at `DESIGN.md`. Deeper maps live in `llms.txt` (inventory) and this file (full adoption + upgrade guide below).

**After import — prove health.** Open `_audit/run.html`, let the gate board finish (every fast gate). All green = the copy is internally consistent (contrast, docs, portability, tokens, consumer path, behavior, a11y, stories, bilingual parity). Full-clone only — `_audit/` is not in the npm tarball.

**Rules that keep transfer lossless:**
- Never hardcode the bundle namespace suffix (see "Resolve by prefix" below — gate-enforced).

- Never recreate/recolour the logo — use `assets/logo-mark.svg` / the `Logo` component.

- Every UI string ships EN + VN via the registry; don't inline one-language strings in components.

- Anchors (Umber/Ochre), `.cs-*` class names, `--cs-*` token names are stable contracts.

- Extending the system? Follow `docs/doctrine.md` and `CONTRIBUTING.md` (Expansion Rule: propagate to every deliverable in one change; verify via `_audit/`).

## Adopt via npm (optional)

The package is publishable (`private: false`; version equals root `VERSION`). License remains **UNLICENSED** — installing from the registry does **not** grant redistribution rights by itself. **LAUNCH was `@cyberskill/design@1.1.0`; pin follows `VERSION` thereafter** (auto-bump on `main` creates tag `vX.Y.Z`, which fires `npm-publish.yml`). CI publishes via **npm Trusted Publishing (OIDC)** (no long-lived publish token; package Publishing access **disallows tokens**). Approved use is recorded in **`docs/consumer-grant.md`** (CyberSkill portfolio products from `docs/products.md`). See `docs/decisions.md` and `docs/ci-cd.md`.

**Consumer grant (owner policy — not a secret).** Written and in force at `docs/consumer-grant.md` (+ `docs/vi/consumer-grant.md`). External teams need a dated stanza appended there; redistribution outside granted products needs a further written grant.

```bash
npm install @cyberskill/design@<VERSION>
```

Then link styles and import components. **Next.js / Vite / SSR apps** use the default entry (bundler-native):

```ts
import { Button, TextField } from "@cyberskill/design";
// equivalent: import { Button } from "@cyberskill/design/react";
import "@cyberskill/design/styles.css";
```

Add `transpilePackages: ["@cyberskill/design"]` in Next.js (JSX ships as source). The default entry (`_esm/react.mjs`) is a **`"use client"` barrel** — App Router Server Components can `import { Button } from "@cyberskill/design"` without per-import client shims. React and react-dom are **peerDependencies** — your app provides them. Published types use `export type *` (**TypeScript 5.0+**). Do **not** import `_esm/cs.mjs` (or `@cyberskill/design/legacy`) into an SSR bundler; that path self-ensures React via CDN and side-loads `_ds_bundle.js` for browsers only.

**Browser / no-build:** import `@cyberskill/design/legacy` (`_esm/cs.mjs`) or continue with the static tree paths below. The published tarball is the **full portable tree** (styles, tokens, components, templates, guidelines, docs, UI kits) — not a minimal “lib-only” subset. Host-only tooling (Storybook, `_audit/`) is not in `files[]`.

**First real install (Lumi).** Copy-paste working **browser** consumer: `examples/npm-hello/` — installs `@cyberskill/design` at the repo `VERSION` from the registry, links `styles.css`, mounts `Button` via the **legacy** browser entry (`_esm/cs.mjs`), scopes **Lumi** with `data-cs-element="hoa" data-cs-variant="plasma"` (locked row in `docs/products.md`). From that folder: `npm install && npm run smoke && npm start` → open `http://127.0.0.1:8766/`. Status Hub teams use the same install and swap to `data-cs-element="thuy"` — do not invent mappings. For Next/SSR product apps (e.g. Lumi landing), use `import { Button } from "@cyberskill/design"` as above — not the npm-hello import map.

**Publish path (maintainers):** `prepublishOnly` runs `build:bundle` + `build:design-md --check`. Workflow `.github/workflows/npm-publish.yml` on `workflow_dispatch` / `v*` tags uses **Trusted Publishing** (`permissions.id-token: write`; do not set `NODE_AUTH_TOKEN` on the publish step). `node _audit/ci/npm-publish.mjs --dry-run` always lists the tarball. See `docs/ci-cd.md` and `docs/decisions.md`.

## Adopt (two paths, plus a module shortcut)

**1. Static / prototypes / mocks — link the stylesheet.** For **production static**, link the flattened bundle `dist/styles.min.css` (also `@cyberskill/design/styles.min.css`) — one file, no `@import` waterfall. Keep `styles.css` (+ the `tokens/`, `base/`, `fonts/` it `@import`s) as the readable source/dev path, or serve the whole tree. Either way you get every `--cs-*` token, the `.cs-*` component classes, and the Liquid Glass surfaces. Compose with the classes (see `templates/kitchen-sink.html` and `examples/static-hello/`). Copy any asset you reference from `assets/`.

**2. Production React — load the compiled bundle.** Link `dist/styles.min.css` (or `styles.css` in dev) and `<script src="_ds_bundle.js">`, then read components off the namespace. **Resolve by prefix, never hardcode:** the bundle exposes `window.CyberSkillDesignSystem_<projectId>`, and that 6-hex suffix is compiler-assigned and **changes on import into another project**:
```html
<link rel="stylesheet" href="<path>/dist/styles.min.css">
<script src="<path>/_ds_bundle.js"></script>
<script>
 const CS = window[Object.keys(window).find(k => /^CyberSkillDesignSystem_/.test(k))];
 const { Button, TextField, DataGrid } = CS;
</script>
```
This is exactly what `_audit/consumer-smoke-test.html` exercises (and asserts green) — and the templates' `ds-base.js` does the same, publishing a stable `window.CyberSkillDS` alias.
**2b. Bundler-native React (Next / Vite / SSR) — default package entry.** `import { Button, TextField } from "@cyberskill/design"` resolves to `_esm/react.mjs` (also exported as `@cyberskill/design/react`). The generated file starts with `"use client"` so App Router / RSC consumers import interactive components directly. Re-exports every component from source JSX with **React as an external peer** — no CDN, no `_ds_bundle.js` side-load. Your bundler must transpile the package (Next: `transpilePackages: ["@cyberskill/design"]`). Still link styles yourself (`styles.min.css` recommended for production static sheets). Regenerated with `npm run build:react-entry`; parity is gated by `package-exports-integrity` + `test:react-entry`.

**2c. Browser ESM legacy — one import, no build.** `import { Button, TextField } from "@cyberskill/design/legacy"` (or `"<path>/_esm/cs.mjs"`) — the module self-ensures React via **umd-react@19.2.8** (SRI-pinned CDN; official React 19 has no UMD; skipped when `window.React` exists), side-loads `_ds_bundle.js` once, resolves the namespace by prefix, and re-exports all components (`_audit/esm-smoke-test.html` keeps the export list in lockstep with the manifest). Still link `styles.css` yourself. **Not for Next/SSR.** Bundler apps should keep providing their own `react` / `react-dom` peers (`^18 || ^19`).

**Templates.** Each `templates/<slug>/` is a Design Component seeded from `ds-base.js` (one `base` line to rebind the path to wherever this system lives relative to the consuming page). Copy the folder and edit copy/tweaks.

**Machine-readable tokens.** `tokens/tokens.json` + `tokens/tokens.js` (ESM) + `tokens/tokens.dtcg.json` (W3C DTCG, for Tokens Studio/Style Dictionary) expose every token grouped by category + theme/element maps — for native/mobile/design-tool pipelines. **Native builds ship pre-generated** in `tokens/native/` (SwiftUI `CSTokens.swift` · Compose `CSTokens.kt` · Flutter `cs_tokens.dart`) with `tokens/provenance.json` (release, source sha-256, conversion rules, per-target sha-256); the `token-pipeline` gate keeps them in lockstep with the DTCG source.

**Static HTML / no React / no build tooling.** Link `dist/styles.min.css` (production) or `styles.css` (source/dev) and compose with `.cs-*` classes — full catalog demonstrated in `templates/kitchen-sink.html`.

**Fonts, including a display face.** All three brand families are self-hosted in `fonts/` and declared by `tokens/fonts.css` (which `styles.css` `@import`s): **Be Vietnam Pro** (`--cs-font-family-ui`), **JetBrains Mono** (`--cs-font-family-mono`), and **Space Grotesk** (`--cs-font-family-display`, variable 300–700, Vietnamese subset included). The display face is **opt-in** — nothing in the DS points at it. A product that wants a headline face adds `class="cs-display-face"` (or sets `--cs-heading-family: var(--cs-font-family-display)`) on the scope; heading utilities follow, body copy stays on the UI face.

Consumers that skip `styles.css` to control font loading (`cyberskill.world` / Lumi imports the token + base sheets individually and keeps its own `font-display: optional` strategy) can switch from their ad-hoc `brand-fonts.css` to the package: either `@import "@cyberskill/design/tokens/fonts.css"` for the packaged faces, or keep the local `@font-face` block and point `--cs-heading-family` at `var(--cs-font-family-display)` so the **role** comes from the DS even when the **bytes** are served locally. Either way the display face stops being a per-product exception. Space Grotesk has no 800 weight, so `--cs-heading-weight-strong` (800) under `.cs-display-face` clamps to 700 within Space Grotesk — CSS does not hop to Be Vietnam Pro for a missing weight.

## The four axes

State Theme (`data-theme` — light / dark / system), Element (`data-cs-element` + `data-cs-variant`), Language (`lang` / template Language tweak), and Style (`data-cs-style`) on a container; everything inside re-skins with no code change (see `templates/playground.html`). Defaults: `light · tho · vi · liquid-glass` (absent theme / style ≡ those defaults; set `lang="en"` for EN surfaces). Bilingual: components resolve strings from `lang` (`lang="en"` on any container → full English; unset → Vietnamese-first fallback).

## Upgrading

- **Version tracks `VERSION`.** `package.json` stays equal to the root `VERSION` file (auto-bumped on `main`). There is no design-system changelog file — treat the **git tip SHA** as the technical truth, and read curated **Release Notes** (Storybook + `docs/release-notes.md`) for product-facing highlights.

- Anchors (Umber/Ochre), the `.cs-*` class names, and the `--cs-*` token names are stable contracts — safe to depend on. Breaking renames of those contracts should be rare and called out in the PR/docs when they happen.

- **Re-run the smoke test after upgrading.** Open `_audit/consumer-smoke-test.html` and the full Health board (`_audit/run.html`) against the new tip — the runner proves the packaged path still resolves.

## Host Storybook (optional)

The live site serves Storybook at `/` as the **product surface** for operators (Theme × Element × Language × Style + control matrices). That is **host-only tooling** — do not depend on Storybook in product apps. Portable Atomic View remains at `guidelines/atomic-view.html`. See `docs/storybook.md` and `docs/live-hub.md`.

## Five-minute consumer spike

**Registry path (preferred for product apps):**

```bash
cd examples/npm-hello
npm install
npm run smoke
npm start
# open http://127.0.0.1:8766/
```

**Clone / static path (no npm):**

```bash
# from monorepo root
python3 -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/examples/static-hello/
# then http://127.0.0.1:8765/_audit/consumer-smoke-test.html
```

Edit `examples/static-hello/index.html`: flip `data-theme="dark"` or `data-cs-element="thuy"` on `<body>`. No install, no Storybook.

## Native sample hosts (optional)

Multi-screen samples (Sign in · Home · Settings) live under `examples/native/swiftui`, `compose`, and `flutter`. They sync generated tokens via `node examples/native/sync-tokens.mjs`. Compose opens in **Android Studio** (no committed `gradlew` — CLI needs JDK 17+ + SDK; see `examples/native/README.md`). Not required for web consumers.

## Extending

If you're changing the system itself (not just consuming it), follow `CONTRIBUTING.md` — the Expansion Rule (propagate to every deliverable in one change) and the verification doctrine (deep checks via `_audit/`).
