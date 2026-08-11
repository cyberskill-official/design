# Design styles

The live styling axes are **Theme × Element × Language × Style**. Style’s sole pack today is **liquid-glass** (absent `data-cs-style` ≡ liquid-glass — same default pattern as light theme / Thổ middle). Published on Storybook **Docs** at `design.cyberskill.world`.

| Axis | How to set it | What it changes |
|---|---|---|
| **Theme** | light = attribute absent; `data-theme="dark"` | light/dark semantic colours (product UI axis). Token-level `data-theme="system"` follows the OS (`prefers-color-scheme`) and mirrors dark — Storybook toolbar and Atomic View expose a system control |
| **Element** | `data-cs-element` + optional `data-cs-variant` | Ngũ Hành product identity (**15 packs** = 5 elements × soft/middle/deep) |
| **Language** | `lang` / Language tweak | EN · VI copy |
| **Style** | `data-cs-style` (optional; absent ≡ `liquid-glass`) | Surface material pack. Sole pack today: **liquid-glass** (`tokens/styles.css` + `base/glass.css`) |

## Element colour contract

Source of truth: [`tokens/element-seeds.json`](../tokens/element-seeds.json) → `npm run tokens:elements` → [`tokens/elements.css`](../tokens/elements.css) (+ JSON / JS / DTCG / native mirrors). **Do not hand-edit pack hexes.**

| Rule | Detail |
|---|---|
| **Default** | Thổ **middle** (studio) — logo ochre `#F4BA17` on `:root` when no element attribute is set |
| **Intensity ladder** | Every element has **soft · middle · deep** with shared OKLCH L targets (C scaled per element). Middle is the default (no `data-cs-variant`) |
| **Names preserved** | Public variants stay `sand/clay`, `plasma/lava`, `mist/ocean`, `bamboo/forest`, `titanium/steel` — mapped onto the ladder (see [`docs/products.md`](products.md) Slot column) |
| **Character offsets** | Small explicit `dh`/`dc` in the seed file only (e.g. Hỏa·plasma, Kim·steel) — not freehand drift |
| **Light ↔ dark** | Same hue family (Δh locked); roles remapped + APCA-solved — 15 × 2 = **30 colour sets** |
| **Text rule** | Text on `-bright` or `-tint` only — never on mid-tone `-accent` |
| **Never remap** | composite focus indicator (text-primary contour + ochre halo) · semantic status colours |
| **Geometry gate** | [`_audit/element-geometry.html`](../_audit/element-geometry.html) — intensity sync · variant distinctness · hue identity |

## Style pack — liquid-glass

- Liquid-glass materials (`cs-surface-*`) are the default surface language.
- Radius, shadow, and glass tokens come from `tokens/elevation.css` + `base/glass.css`; the Style axis contract lives in [`tokens/styles.css`](../tokens/styles.css).
- Gate: [`_audit/style-contract.html`](../_audit/style-contract.html) — allowlists `liquid-glass` only.
- Rejected by doctrine: neon/cyberpunk cold hues, memphis playfulness, full skeuomorphism, emoji in UI chrome.
- Type families are fixed and token-named: Be Vietnam Pro (UI) · Space Grotesk (`--cs-font-family-display`, opt-in headline face) · JetBrains Mono (code). The display face is a **role a scope may opt into** with `.cs-display-face`, not a product axis.

## Adding a new look

Prefer:
1. A new **Element** intensity tweak (seed offset) when the shift is hue/identity inside Ngũ Hành.
2. Local composition with existing tokens/classes when the shift is one-off layout.
3. A documented pattern in `docs/conventions.md` + a specimen card when the pattern should be reusable.
4. A new **`data-cs-style`** pack only after an Expansion Rule pass — see [`docs/benchmark-rubric.md`](benchmark-rubric.md) style-expansion checklist. Styles consume the same 10 accent roles (incl. `on-strong`); they must not invent parallel Element packs.

Do not invent a fifth product axis, and do not add a second Style pack without the Expansion Rule checklist.
