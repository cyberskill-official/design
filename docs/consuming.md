# Consuming & upgrading the CyberSkill Design System

How any project — human-driven or agent-driven — adopts this HTML-first design system, and how to take updates safely.

**Package name:** `@cyberskill/design` (see `package.json`). Do not treat historical `@cyberskill/react` as the install path for this monolith.

## Claude Code vs Google Stitch

| Consumer | Start here | Works today | Do not |
|---|---|---|---|
| **Claude Code** | `SKILL.md` → `README.md` → `styles.css` + `_esm/cs.mjs` / `_ds_bundle.js` (prefix resolve) | Strong — rules, components, prompts; gates via full clone | Hardcode the bundle suffix; treat Storybook host as the portable contract |
| **Google Stitch** | `DESIGN.md` → `llms.txt` → `tokens/tokens.dtcg.json` | Strong for doctrine + tokens + static `.cs-*` HTML | Treat `templates/**/*.dc.html` as SoT — no tweaks / `__dcSetProps` / DC compiler |
| **Claude Design** | Full repo + DC compiler | Full fidelity (tweaks, `x-import`, bilingual templates) | Skip the sync loop in `docs/sync.md` |
| **npm** | `@cyberskill/design` | **1.0.0** on registry; CI Trusted Publishing; grant in `docs/consumer-grant.md` | Treat registry install as a public license (still UNLICENSED) |

**Stitch DC rule:** Stitch (and any non-DC tool) must **not** consume `*.dc.html` as source of truth. Use static export patterns, `templates/kitchen-sink.html`, `examples/static-hello/`, and `.cs-*` classes from `styles.css`.

**Release signal:** VERSION stays pinned at **1.0.0** (no CHANGELOG). Treat the **git tip SHA** as technical truth; read curated product highlights in `docs/release-notes.md`.

## Quick path for AI agents (Claude Code, or driving one)

**What you get:** `styles.css` (400+ tokens + `.cs-*` classes + Liquid Glass surfaces, `@import`s `tokens/` + `base/`) · `_ds_bundle.js` (compiled React components, no build step) · `_esm/cs.mjs` (ESM entry re-exporting every component) · `_ds_manifest.json` (machine-readable inventory) · per-component `Name.d.ts` (API) + `Name.prompt.md` (usage brief) · `tokens/tokens.dtcg.json` (W3C DTCG) + `tokens.json`/`tokens.js`.

**Repo checkout** — clone or copy the whole tree; everything is relative-path static. Entry points: Storybook on the host site (`/` / `npm run storybook`) · `guidelines/atomic-view.html` (every component live, portable) · `templates/<slug>/` (copyable starting points — DC for Claude Design; kitchen-sink / `.cs-*` for Stitch). Read `SKILL.md` before authoring anything on-brand; Stitch readers start at `DESIGN.md`. Deeper maps live in `llms.txt` (inventory) and this file (full adoption + upgrade guide below).

**After import — prove health.** Open `_audit/run.html`, let the gate board finish (every fast gate). All green = the copy is internally consistent (contrast, docs, portability, tokens, consumer path, behavior, a11y, stories, bilingual parity). Full-clone only — `_audit/` is not in the npm tarball.

**Rules that keep transfer lossless:**
- Never hardcode the bundle namespace suffix (see "Resolve by prefix" below — gate-enforced).

- Never recreate/recolour the logo — use `assets/logo-mark.svg` / the `Logo` component.

- Every UI string ships EN + VN via the registry; don't inline one-language strings in components.

- Anchors (Umber/Ochre), `.cs-*` class names, `--cs-*` token names are stable contracts.

- Extending the system? Follow `CONTRIBUTING.md` (Expansion Rule: propagate to every deliverable in one change; verify via `_audit/`).

## Adopt via npm (optional)

The package is publishable (`private: false`, version pinned **1.0.0**). License remains **UNLICENSED** — installing from the registry does **not** grant redistribution rights by itself. **`@cyberskill/design@1.0.0` is published.** CI republishes via **npm Trusted Publishing (OIDC)** on workflow `npm-publish.yml` (no long-lived publish token; package Publishing access **disallows tokens**). Approved use is recorded in **`docs/consumer-grant.md`** (CyberSkill portfolio products from `docs/products.md`). See `docs/decisions.md` and `docs/ci-cd.md`.

**Consumer grant (owner policy — not a secret).** Written and in force at `docs/consumer-grant.md` (+ `docs/vi/consumer-grant.md`). External teams need a dated stanza appended there; redistribution outside granted products needs a further written grant.

```bash
npm install @cyberskill/design@1.0.0
```

Then link styles and import from the package entry (`_esm/cs.mjs` via `exports["."]`), or continue using the static tree paths below. The published tarball is the **full portable tree** (styles, tokens, components, templates, guidelines, docs, UI kits) — not a minimal “lib-only” subset. Host-only tooling (Storybook, `_audit/`) is not in `files[]`.

**First real install (Lumi).** Copy-paste working consumer: `examples/npm-hello/` — installs `@cyberskill/design@1.0.0` from the registry, links `styles.css`, mounts `Button` via package exports, scopes **Lumi** with `data-cs-element="hoa" data-cs-variant="plasma"` (locked row in `docs/products.md`). From that folder: `npm install && npm run smoke && npm start` → open `http://127.0.0.1:8766/`. Status Hub teams use the same install and swap to `data-cs-element="thuy"` — do not invent mappings.

**Publish path (maintainers):** `prepublishOnly` runs `build:bundle` + `build:design-md --check`. Workflow `.github/workflows/npm-publish.yml` on `workflow_dispatch` / `v*` tags uses **Trusted Publishing** (`permissions.id-token: write`; do not set `NODE_AUTH_TOKEN` on the publish step). `node _audit/ci/npm-publish.mjs --dry-run` always lists the tarball. See `docs/ci-cd.md` and `docs/decisions.md`.

## Adopt (two paths, plus a module shortcut)

**1. Static / prototypes / mocks — link the stylesheet.** Copy `styles.css` (+ the `tokens/`, `base/`, `fonts/` it `@import`s, or serve the whole tree) and link it; you now have every `--cs-*` token, the `.cs-*` component classes, and the Liquid Glass surfaces. Compose with the classes (see `templates/kitchen-sink.html`). Copy any asset you reference from `assets/`.

**2. Production React — load the compiled bundle.** Link `styles.css` and `<script src="_ds_bundle.js">`, then read components off the namespace. **Resolve by prefix, never hardcode:** the bundle exposes `window.CyberSkillDesignSystem_<projectId>`, and that 6-hex suffix is compiler-assigned and **changes on import into another project**:
```html
<link rel="stylesheet" href="<path>/styles.css">
<script src="<path>/_ds_bundle.js"></script>
<script>
 const CS = window[Object.keys(window).find(k => /^CyberSkillDesignSystem_/.test(k))];
 const { Button, TextField, DataGrid } = CS;
</script>
```
This is exactly what `_audit/consumer-smoke-test.html` exercises (and asserts green) — and the templates' `ds-base.js` does the same, publishing a stable `window.CyberSkillDS` alias.
**2b. ESM (module) path — one import, no build.** `import { Button, TextField } from "<path>/_esm/cs.mjs"` — the module self-ensures React (pinned; skipped when `window.React` exists), side-loads `_ds_bundle.js` once, resolves the namespace by prefix, and re-exports all components (`_audit/esm-smoke-test.html` keeps the export list in lockstep with the manifest). Still link `styles.css` yourself.

**Templates.** Each `templates/<slug>/` is a Design Component seeded from `ds-base.js` (one `base` line to rebind the path to wherever this system lives relative to the consuming page). Copy the folder and edit copy/tweaks.

**Machine-readable tokens.** `tokens/tokens.json` + `tokens/tokens.js` (ESM) + `tokens/tokens.dtcg.json` (W3C DTCG, for Tokens Studio/Style Dictionary) expose every token grouped by category + theme/element maps — for native/mobile/design-tool pipelines. **Native builds ship pre-generated** in `tokens/native/` (SwiftUI `CSTokens.swift` · Compose `CSTokens.kt` · Flutter `cs_tokens.dart`) with `tokens/provenance.json` (release, source sha-256, conversion rules, per-target sha-256); the `token-pipeline` gate keeps them in lockstep with the DTCG source.

**Static HTML / no React / no build tooling.** Link `styles.css` and compose with `.cs-*` classes — full catalog demonstrated in `templates/kitchen-sink.html`.

## The three axes

State Theme (`data-theme`), Element (`data-cs-element` + `data-cs-variant`), and Language (`lang` / template Language tweak) on a container; everything inside re-skins with no code change (see `templates/playground.html`). Defaults: `light · tho · en`. Surface treatment is liquid-glass (fixed). Bilingual: components resolve strings from `lang` (`lang="vi"` on any container → full Vietnamese).

## Upgrading

- **Version is pinned.** `VERSION` and `package.json` stay at **1.0.0**. There is no design-system changelog file — treat the **git tip SHA** as the technical truth, and read curated **Release Notes** (Storybook + `docs/release-notes.md`) for product-facing highlights.

- Anchors (Umber/Ochre), the `.cs-*` class names, and the `--cs-*` token names are stable contracts — safe to depend on. Breaking renames of those contracts should be rare and called out in the PR/docs when they happen.

- **Re-run the smoke test after upgrading.** Open `_audit/consumer-smoke-test.html` and the full Health board (`_audit/run.html`) against the new tip — the runner proves the packaged path still resolves.

## Host Storybook (optional)

The live site serves Storybook at `/` as the **product surface** for operators (Theme × Element × Language + control matrices). That is **host-only tooling** — do not depend on Storybook in product apps. Portable Atomic View remains at `guidelines/atomic-view.html`. See `docs/storybook.md` and `docs/live-hub.md`.

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
