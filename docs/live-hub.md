# Live hub = Storybook

## Decision

**Storybook is the single live interactive hub** for operators on `design.cyberskill.world`. There is no separate Live View page and no separate HTML dashboard product shell. Production **`/`** is Storybook.

## Sidebar IA

| Group | Role |
|---|---|
| **Docs** | Public MDX guides (consuming, deploy, conventions, styles, products, schema, Figma, contrast, voice, axes) |
| **Foundations** | Colors, typography, spacing, elevation, motion, elements |
| **Components** | Full CSF library |
| **Release Notes** | Curated product prose (**no CHANGELOG.md**) |
| **Status** | Full-bleed embed of `_audit/run.html` (auto-run on first load; **Re-run** on demand) |
| **A11y / I18n** | Accessibility + bilingual specimens |
| **Maintainer** | Portable HTML iframes for gates (Atomic View buried here — not a public top-level entry) |

## Surfaces

| Surface | Role |
|---|---|
| **Storybook** (`/`) | Host product surface: Theme × Element × Language toolbar, Docs/Foundations/Components/Release Notes/Status, and Maintainer/* iframes into portable HTML |
| **Atomic View** (`guidelines/atomic-view.html`) | Portable zero-build component grid for gates and clone-and-open browsing — not the public product entry |
| **Other guidelines / templates** | Portable specimens; opened from Storybook Maintainer/* when exploring Motion, Identity Lab, Status Hub / Website / Deck indexes, kitchen-sink, etc. |
| **Legacy `/dashboard`, `/dashboard/`, `/dashboard.html`, `/dashboard/:path*`, `/playground`, `/playground/`, `/playground/:path*`** | Redirect to `/` (stubs + Vercel redirects) |

## Surface map (Maintainer/* stories)

| Storybook entry | Portable HTML |
|---|---|
| Components/* CSF | React sources under `components/` |
| Maintainer/Surfaces → Motion | `guidelines/motion.html` |
| Maintainer/Surfaces → Identity Lab | `ui_kits/status-hub/identity-lab.html` |
| Maintainer/Surfaces → Status Hub | `ui_kits/status-hub/index.html` |
| Maintainer/Surfaces → Website | `ui_kits/website/index.html` |
| Maintainer/Surfaces → Deck | `ui_kits/deck/index.html` |
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
