# Live hub = Storybook

Published on Storybook **Docs** at `design.cyberskill.world`.

## Decision

**Storybook is the single live interactive hub** for operators on `design.cyberskill.world`. There is no separate Live View page and no separate HTML dashboard product shell. Production **`/`** is Storybook.

## Sidebar IA

Atomic browse order on the product site: **Foundations → Components → Templates → Pages** (Atoms / Molecules / Organisms live inside Atomic View and CSF Components; Templates and Pages are first-class sidebar groups).

| Group | Role |
|---|---|
| **Docs** | Published operator docs: **Start** (Introduction, README, SKILL, Contributing, llms, Library) · **Guides** (consuming, grant, deploy, schema, conventions, styles, products, Figma, contrast, storybook, live-hub, HR Suite sources, release runbook, benchmark, …) · **Maintainers** (doctrine, decisions, CI/CD, quality gates, sync). Curated MDX plus one sidebar entry per tracked page. EN·VI via the Documentation Library (`/docs/viewer.html`) |
| **Foundations** | Colors, typography, spacing, elevation, motion, elements |
| **Components** | Full CSF library |
| **Templates** | Public starting points: **Gallery** (Atomic View → Templates tier, kitchen-sink, playground) plus every `_ds_manifest.json` template grouped like Atomic View (Product · Board · … · **HR** Suite · Documents). Includes all 38 `vn-*` A4 instruments (Employment Suite + commercial framework) |
| **Pages** | UI kits — Status Hub, Marketing site, Slide deck |
| **Release Notes** | Curated product prose (**no CHANGELOG.md**) |
| **Status** | Full-bleed embed of `_audit/run.html` (auto-run on first load; **Re-run** on demand) |
| **A11y / I18n** | Accessibility + bilingual specimens |
| **Maintainer** | Portable HTML iframes for gates and demos (Motion, kit mirrors, template demos, RTL, Atomic View for gates) |

## Surfaces

| Surface | Role |
|---|---|
| **Storybook** (`/`) | Host product surface: Theme × Element × Language × Style toolbar, Docs/Foundations/Components/**Templates**/**Pages**/Release Notes/Status, and Maintainer/* iframes into portable HTML |
| **Atomic View** (`guidelines/atomic-view.html`) | Portable zero-build atomic browser (Atoms → Molecules → Organisms → Templates → Pages). Public via **Templates → Gallery → Atomic gallery**; also under Maintainer for gates / clone-and-open |
| **Other guidelines / templates** | Portable specimens; opened from Storybook Templates/*, Pages/*, or Maintainer/* |
| **Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*`** | Redirect to `/` (stubs + Vercel redirects) |

## Surface map (public + Maintainer)

| Storybook entry | Portable HTML |
|---|---|
| Components/* CSF | React sources under `components/` |
| Templates/Gallery → Atomic gallery | `guidelines/atomic-view.html#tier-templates` |
| Templates/{Category}/* | `templates/**/*.dc.html` via `_ds_manifest.json` (regen: `node scripts/generate-template-stories.mjs`) |
| Pages → Status Hub / Marketing site / Slide deck | `ui_kits/status-hub|website|deck/index.html` |
| Maintainer/Surfaces → Motion | `guidelines/motion.html` |
| Maintainer/Surfaces → Status Hub / Website / Deck | same UI kits (maintainer mirrors) |
| Maintainer/Surfaces → Template Playground | `templates/playground.html` |
| Maintainer/Surfaces → Kitchen Sink | `templates/kitchen-sink.html` |
| Maintainer/Surfaces → Image Slots | `templates/image-slots-demo.html` |
| Maintainer/Surfaces → AI Cluster | `templates/ai-cluster-demo.html` |
| Maintainer/Surfaces → RTL | `guidelines/rtl-preview.html` |
| Maintainer/Surfaces → Atomic View (gates) | `guidelines/atomic-view.html` |
| Status/Gate board | `_audit/run.html` |

## Status behavior

- Opening Status loads `_audit/run.html`, which **auto-runs** the fast board once.
- Storybook may keep a cached iframe when you navigate away and back — that does **not** silently re-run gates.
- Use the board **Re-run** button for a fresh pass (each gate iframe is cache-busted).

## Portable consumers (unchanged)

Consumers still link `styles.css` / `_ds_bundle.js` / ESM / templates. **Do not** require Storybook in product apps. See `docs/consuming.md`.

## Local

```bash
npm run storybook          # product Storybook at http://localhost:6006
npm run build:site         # packages Storybook at .vercel-static/ (site root `/`)
```

Open **Templates → Gallery → Atomic gallery** or **Templates → HR → …** for the Employment Suite.
