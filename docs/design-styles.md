# Design styles

Current surface treatment is **liquid-glass** (fixed). The live styling axes are **Theme × Element × Language** only.
| Axis | How to set it | What it changes |
|---|---|---|
| **Theme** | light = attribute absent; `data-theme="dark"` | light/dark semantic colours (product UI axis). Token-level `data-theme="system"` follows the OS (`prefers-color-scheme`) and mirrors dark — not a product-UI / Identity Lab / template enum value |
| **Element** | `data-cs-element` + optional `data-cs-variant` | Ngũ Hành product identity (15 packs) |
| **Language** | `lang` / Language tweak | EN · VI copy |

## Fixed treatment

- Liquid-glass materials (`cs-surface-*`) are the default surface language.

- Radius, shadow, and glass tokens come from the base system — not a parallel "style pack" axis.

- Rejected by doctrine: neon/cyberpunk cold hues, memphis playfulness, full skeuomorphism, emoji in UI chrome.

- Type families are fixed and token-named: Be Vietnam Pro (UI) · Space Grotesk (`--cs-font-family-display`, opt-in headline face) · JetBrains Mono (code). The display face is a **role a scope may opt into** with `.cs-display-face`, not a fourth axis — it changes nothing by default and no product mapping depends on it.

## Adding a new look

Prefer:
1. A new **Element** or **variant** when the shift is hue/identity.
2. Local composition with existing tokens/classes when the shift is one-off layout.
3. A documented pattern in `docs/conventions.md` + a specimen card when the pattern should be reusable.

Do not invent a fourth product axis without an Expansion Rule pass across tokens, Storybook Live, templates, docs, and gates.
