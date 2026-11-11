# Design styles

The live styling axes are **Theme × Element × Language × Style**. Style ships two surface material packs: **liquid-glass** (default; an absent style attribute selects it) and **matte-paper** (opaque crisp paper surfaces with zero backdrop blur). Unmarked descendants inherit their nearest theme and element scopes; the neutral root defaults to light with the studio brand anchors. Published on Storybook **Docs** at `design.cyberskill.world`.

| Axis | How to set it | What it changes |
|---|---|---|
| **Theme** | `data-theme="light"`, `"dark"` or `"system"`; absence inherits the nearest scope (light at the neutral root) | light/dark semantic colours (product UI axis). Explicit light resets a dark ancestor. System follows the OS light/dark preference through `prefers-color-scheme`; Storybook toolbar and Atomic View expose all three values |
| **Element** | `data-cs-element` + optional `data-cs-variant` | Ngũ Hành product identity (**15 packs** = 5 elements × soft/middle/deep) |
| **Language** | `lang` / Language tweak | EN · VI built-in copy (`vi` default on UI surfaces); programmatic `ja` remains an internal Pagination i18n spike, not a UI toolbar locale |
| **Style** | `data-cs-style` (optional; absent ≡ `liquid-glass`) | Surface material pack: **liquid-glass** (default frosted optical blur) · **matte-paper** (opaque crisp paper surfaces, `tokens/styles.css` + `base/glass.css`) |

## Element colour contract

Source of truth: [`tokens/element-seeds.json`](../tokens/element-seeds.json) → `npm run tokens:generate` → [`tokens/elements.css`](../tokens/elements.css) (+ JSON / JS / DTCG / native mirrors). **Do not hand-edit pack hexes.**

| Rule | Detail |
|---|---|
| **Default** | An unmarked root uses the neutral studio palette with logo ochre `#F4BA17`. Explicit `data-cs-element="tho"` selects Thổ **middle** (studio); its complete palette differs from neutral. Unmarked descendants inherit their nearest element |
| **Intensity ladder** | Every element has **soft · middle · deep** with shared OKLCH L targets (C scaled per element). Middle is the default (no `data-cs-variant`) |
| **Names preserved** | Public variants stay `sand/clay`, `plasma/lava`, `mist/ocean`, `bamboo/forest`, `titanium/steel` — mapped onto the ladder (see [`docs/products.md`](products.md) Slot column) |
| **Character offsets** | Small explicit `dh`/`dc` in the seed file only (e.g. Hỏa·plasma, Kim·steel) — not freehand drift |
| **Light ↔ dark** | Same hue family (Δh locked); roles remapped + APCA-solved — 15 × 2 = **30 colour sets** |
| **Text rule** | Use `-bright` or `-tint`, or pair a `-strong` fill with `--cs-accent-on-strong` for body text; never use mid-tone `-accent` behind text |
| **Never remap** | composite focus indicator (text-primary contour + ochre halo) · semantic status colours |
| **Geometry gate** | [`_audit/element-geometry.html`](../_audit/element-geometry.html) — intensity sync · variant distinctness · hue identity |

## Style packs — liquid-glass & matte-paper

- **liquid-glass** (`cs-surface-*`, default when `data-cs-style` is absent) is the optical frosted-glass surface language.
- **matte-paper** (`data-cs-style="matte-paper"`) removes backdrop blur, switches `.cs-surface-*` and `.cs-card` / `.cs-dialog` / `.cs-drawer` / `.cs-popover__panel` / `.cs-menu__list` to crisp opaque `--cs-color-surface-panel` / `--cs-color-surface-raised` fills with `1px` solid `--cs-color-border-default` borders and tactile flat elevation (`--cs-shadow-xs`), ideal for legal/editorial instruments, dense ERP tables, and SOC War-Rooms; a nested `[data-cs-style="liquid-glass"]` restores optical blur.
- Radius, shadow, and glass tokens come from `tokens/elevation.css` + `base/glass.css`; the Style axis contract lives in [`tokens/styles.css`](../tokens/styles.css).
- Gate: [`_audit/style-contract.html`](../_audit/style-contract.html) — allowlists `liquid-glass` and `matte-paper`.
- Rejected by doctrine: neon/cyberpunk cold hues, memphis playfulness, full skeuomorphism, emoji in UI chrome.
- Type families are fixed and token-named: Be Vietnam Pro (UI) · Space Grotesk (`--cs-font-family-display`, opt-in headline face) · JetBrains Mono (code). The display face is a **role a scope may opt into** with `.cs-display-face`, not a product axis.

## Adding a new look

Prefer:
1. A new **Element** intensity tweak (seed offset) when the shift is hue/identity inside Ngũ Hành.
2. Local composition with existing tokens/classes when the shift is one-off layout.
3. A documented pattern in `docs/conventions.md` + a specimen card when the pattern should be reusable.
4. A new **`data-cs-style`** pack only after an Expansion Rule pass — see [`docs/benchmark-rubric.md`](benchmark-rubric.md) style-expansion checklist. Styles consume the same 10 accent roles (incl. `on-strong`); they must not invent parallel Element packs.

Do not invent a fifth product axis, and do not add an unreviewed Style pack without the Expansion Rule checklist.

## Internal theme switches

Canonical theme resolution is generated by `scripts/generate-element-packs.mjs` into `tokens/elements.css`. The private `--_cs-light` and `--_cs-dark` custom properties select one branch of declarations such as `color: var(--_cs-light, var(--cs-color-brand-umber))var(--_cs-dark, var(--cs-color-brand-ochre));`. The two substitutions are concatenated with no stylesheet space: a space remains when the inactive channel is empty and makes `background` and `border-color` keep the previous used color. A switch set to `initial` uses the `var()` fallback; an empty switch contributes no value. Light sets the light switch to `initial` and the dark switch empty; dark reverses them. An explicit `data-theme="system"` follows `prefers-color-scheme`.

Consumers select `data-theme="light|dark|system"` and use public `--cs-*` tokens. Do not set the private switches directly, copy generated resolver blocks, or register these switches with `@property`: their empty/invalid-value behavior is part of the internal resolver. Resolver bindings are repeated at scope boundaries so nested element and theme changes recompute instead of inheriting an already selected parent value. Unmarked descendants inherit their surrounding scope.

Maintain the authored generator and run `npm run tokens:generate` and `npm run tokens:check`; do not patch generated CSS alone. The existing theme component-scope and three-engine token-mode regressions exercise nested themes and both operating-system preferences. These switches are implementation details, not extra public axes or tokens.


## Density and public spacing roles

`data-cs-density="compact"` tightens Button, shared `.cs-field__control` metrics (TextField, Textarea, Select, NativeSelect, Mentions), and container rhythm across `.cs-card`, `.cs-table`, `.cs-dialog`, `.cs-field`, `.cs-review-gate`, `.cs-alert`, `.cs-toast`, `.cs-tag`, `.cs-tab`, `.cs-menu`, `.cs-stat`, and `.cs-divider` (with nested `[data-cs-density="comfortable"]` reset). Existing `>= 44px` coarse-pointer target floors remain strictly in force. `data-cs-contrast="high"` (and `prefers-contrast: more`) reinforces text/border tokens plus form controls, glass surface borders, and table/datagrid cell dividers.

Spacing roles can replace a literal only when they express the same layout role. The current remediations verify unchanged geometry plus actual token intervention for controls and collection layouts. Border widths, font sizes, fixed geometry and touch targets are not automatically spacing-token candidates. A `px` census therefore measures literals, not defects.

Public utility tokens, including additive kebab aliases and retained legacy names, remain supported even when the shared stylesheet has no literal consumer. The repository cannot establish external product use from its own reference graph. No token is deprecated or removed by this census; removals require the documented notice policy. Broader compact layouts require explicit role metrics and relevant viewport/target validation before adoption.
