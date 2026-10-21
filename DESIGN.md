---
name: "CyberSkill Design System"
version: "1.7.2"
generated: "2026-07-23"
generator: "scripts/generate-design-md.mjs (npm run build:design-md)"
sources:
  tokens: "tokens/tokens.dtcg.json"
  inventory: "_ds_manifest.json"
gate: "_audit/design-md-parity.html (window.__designmd)"
---

# CyberSkill Design System — open spec

> GENERATED FILE — do not edit by hand. Regenerate with `npm run build:design-md` after any token change; the `design-md-parity` gate fails on drift. This is the single-file open-spec surface for design tools and agents that read a root `DESIGN.md` (e.g. Google Stitch); The base typed projection is `tokens/tokens.dtcg.json`; its hashed `tokens/declarations.json` companion preserves the remaining declarations and source conditions. Read both for the repository adapter; use canonical CSS for runtime cascade behavior. This document is a selected token/inventory guide, not a complete conditional-mode or native rendering contract.

> **Stitch / non-DC consumers:** do **not** treat `templates/**/*.dc.html` as source of truth — those files need the Design Components compiler (tweaks, `__dcSetProps`). Generate static UI from this file + DTCG + `styles.css` / `.cs-*` / `templates/kitchen-sink.html` / `examples/static-hello/`. DC-capable authoring starts at `SKILL.md` and may use bundler `_esm/react.mjs` / legacy `_esm/cs.mjs` / `_ds_bundle.js` (prefix resolve). Dual path: `docs/consuming.md`. Operator docs are published on the Storybook Docs sidebar at `design.cyberskill.world`.

## Brand & doctrine

- **Slogan:** *Turn Your Will Into Real — Hiện Thực Hoá Ý Chí*.
- **Immutable anchors:** Umber `#45210E` (primary brand) · Ochre `#F4BA17` (accent). Never remap; the composite focus indicator (text-primary contour + ochre halo) is a studio-wide accessibility signature.
- **Four axes:** Theme (light · dark · system) × Element (Ngũ Hành — Kim · Mộc · Thủy · Hỏa · Thổ, 15 element×variant packs) × Language (EN · VI) × Style (`data-cs-style` — sole pack **liquid-glass**; absent ≡ default).
- **Language scope:** Vietnamese-first; registered component strings require EN + VI pairs. Template language capabilities are declared per template, and consumer-provided content needs its own translation and review. Preserve diacritics; declared pairs do not certify translation quality or screen-reader pronunciation.
- **Text never sits on the mid-tone `-accent`:** use `-bright` or `-tint`, or pair a `-strong` fill with `--cs-accent-on-strong` for body text. `-accent` is for bars, borders, progress fills, and large non-text fills.
- **Accessibility floor:** APCA Lc ≥ 75 body text · ≥ 44px touch targets · focus rings never removed · honour `prefers-reduced-motion` / `prefers-contrast`.
- **Voice:** warm · direct · honest · respectful — all four at once, never "fun/playful/edgy".

## Colors

Core semantic colours. Dark values are the `[data-theme="dark"]` overrides (the `system` theme mirrors them under `prefers-color-scheme: dark`).

| Token | Light | Dark |
|---|---|---|
| `--cs-color-brand-umber` | `#45210E` | — |
| `--cs-color-brand-ochre` | `#F4BA17` | — |
| `--cs-color-surface-page` | `#FFFDF8` | `#1a1108` |
| `--cs-color-surface-panel` | `#FFFFFF` | `#221710` |
| `--cs-color-surface-raised` | `#FBF4E9` | `#2b1e14` |
| `--cs-color-text-primary` | `#45210E` | `#f5ead9` |
| `--cs-color-text-inverse` | `#FFFFFF` | `#1a1108` |
| `--cs-color-text-accent` | `#6E3B0E` | `#FECD5D` |
| `--cs-color-text-muted` | `#3F2D21` | `#E9D6C2` |
| `--cs-color-semantic-success` | `#166534` | `#4ADE80` |
| `--cs-color-semantic-danger` | `#B42318` | `#FC9895` |
| `--cs-color-semantic-warning` | `#92400E` | `#FBBF24` |
| `--cs-color-semantic-info` | `#1D4ED8` | `#B5D4FD` |
| `--cs-color-semantic-success-fg` | `#FFFFFF` | `#1a1108` |
| `--cs-color-semantic-danger-fg` | `#FFFFFF` | `#1a1108` |
| `--cs-color-semantic-warning-fg` | `#FFFFFF` | `#1a1108` |
| `--cs-color-semantic-info-fg` | `#FFFFFF` | `#1a1108` |
| `--cs-color-accent-ochre` | `#F4BA17` | — |
| `--cs-color-border-default` | `#E7D9C6` | `#4a3a2c` |
| `--cs-color-link` | `#6E3B0E` | `#FECD5D` |
| `--cs-color-link-hover` | `#45210E` | `#f5ead9` |
| `--cs-color-semantic-success-text` | `#042D13` | `#68F798` |
| `--cs-color-semantic-danger-text` | `#4B0502` | `#FFD2CF` |
| `--cs-color-semantic-warning-text` | `#441801` | `#FFD887` |
| `--cs-color-semantic-info-text` | `#000A75` | `#C7DFFF` |

### Accent roles (Ngũ Hành)

Default accent pack = Thổ (the studio's own element). All 15 element×variant packs and their APCA-derived dark packs live in `tokens/elements.css` and DTCG `$extensions["com.cyberskill"].overrides.elements` / `.elementsDark`.

| Token | Value |
|---|---|
| `--cs-accent` | `#F4BA17` |
| `--cs-accent-strong` | `#916D10` |
| `--cs-accent-bright` | `#F4BA17` |
| `--cs-accent-on` | `#45210E` |
| `--cs-accent-tint` | `#FBF4E9` |
| `--cs-accent-ink` | `#45210E` |
| `--cs-accent-glow` | `rgba(244, 186, 23, 0.48)` |
| `--cs-accent-grad-a` | `#F4BA17` |
| `--cs-accent-grad-b` | `#F3B958` |
| `--cs-accent-on-strong` | `#FFFFFF` |

### Document palette

Shared ink / paper / rule colours for print-leaning instruments (`--cs-doc-*`). Prefer these over raw hex in VN legal and office templates.

| Token | Value |
|---|---|
| `--cs-doc-ink` | `#1A1614` |
| `--cs-doc-slate` | `#26323A` |
| `--cs-doc-fill` | `#FDE68A` |
| `--cs-doc-fill-ink` | `#1A1614` |

## Typography

Families ship self-hosted (Be Vietnam Pro · Space Grotesk · JetBrains Mono) with declared style/weight/subset faces. The bounded Vietnamese NFC/NFD repertoire is recorded in `fonts/subset-recipe.json`; it does not certify every Unicode sequence, shaping engine or native installation. `--cs-font-family-display` is the opt-in headline face; nothing points at it by default.

| Token | Value |
|---|---|
| `--cs-font-family-ui` | `'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif` |
| `--cs-font-family-display` | `'Space Grotesk', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif` |
| `--cs-font-family-mono` | `'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |
| `--cs-font-weight-regular` | `400` |
| `--cs-font-weight-medium` | `500` |
| `--cs-font-weight-semibold` | `600` |
| `--cs-font-weight-bold` | `700` |
| `--cs-font-weight-extrabold` | `800` |
| `--cs-font-lineHeight-body` | `1.5` |
| `--cs-font-lineHeight-heading` | `1.35` |
| `--cs-font-lineHeight-tight` | `1.15` |
| `--cs-font-size-2xs` | `0.6875rem` |
| `--cs-font-size-xs` | `0.75rem` |
| `--cs-font-size-sm` | `0.875rem` |
| `--cs-font-size-base` | `1rem` |
| `--cs-font-size-md` | `1.125rem` |
| `--cs-font-size-lg` | `1.25rem` |
| `--cs-font-size-xl` | `1.5rem` |
| `--cs-font-size-2xl` | `1.875rem` |
| `--cs-font-size-3xl` | `2.25rem` |
| `--cs-font-size-4xl` | `3rem` |
| `--cs-font-size-5xl` | `3.75rem` |
| `--cs-font-line-height-body` | `var(--cs-font-lineHeight-body)` |
| `--cs-font-line-height-heading` | `var(--cs-font-lineHeight-heading)` |
| `--cs-font-line-height-tight` | `var(--cs-font-lineHeight-tight)` |

### Type roles & tracking

Semantic aliases into the ramp — write intent, not magic numbers. `Resolves to` follows the alias chain.

| Token | CSS form | Resolves to |
|---|---|---|
| `--cs-text-display` | `var(--cs-font-size-5xl)` | `3.75rem` |
| `--cs-text-h1` | `var(--cs-font-size-3xl)` | `2.25rem` |
| `--cs-text-h2` | `var(--cs-font-size-2xl)` | `1.875rem` |
| `--cs-text-h3` | `var(--cs-font-size-xl)` | `1.5rem` |
| `--cs-text-h4` | `var(--cs-font-size-lg)` | `1.25rem` |
| `--cs-text-body-lg` | `var(--cs-font-size-md)` | `1.125rem` |
| `--cs-text-body` | `var(--cs-font-size-base)` | `1rem` |
| `--cs-text-secondary` | `var(--cs-font-size-sm)` | `0.875rem` |
| `--cs-text-micro` | `var(--cs-font-size-2xs)` | `0.6875rem` |
| `--cs-text-caption` | `var(--cs-font-size-xs)` | `0.75rem` |
| `--cs-text-eyebrow` | `var(--cs-font-size-xs)` | `0.75rem` |

| Token | Value |
|---|---|
| `--cs-letter-spacing-tight` | `-0.01em` |
| `--cs-letter-spacing-normal` | `0` |
| `--cs-letter-spacing-caps` | `0.08em` |

### Heading treatment

| Token | CSS form | Resolves to |
|---|---|---|
| `--cs-heading-family` | `var(--cs-font-family-ui)` | `'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif` |
| `--cs-heading-weight-strong` | `var(--cs-font-weight-extrabold)` | `800` |
| `--cs-heading-weight` | `var(--cs-font-weight-bold)` | `700` |
| `--cs-heading-tracking` | `var(--cs-letter-spacing-tight)` | `-0.01em` |

## Spacing & radius

| Token | Value |
|---|---|
| `--cs-space-0` | `0px` |
| `--cs-space-1` | `4px` |
| `--cs-space-2` | `8px` |
| `--cs-space-3` | `12px` |
| `--cs-space-4` | `16px` |
| `--cs-space-5` | `20px` |
| `--cs-space-6` | `24px` |
| `--cs-space-8` | `32px` |
| `--cs-space-10` | `40px` |
| `--cs-space-12` | `48px` |
| `--cs-space-16` | `64px` |
| `--cs-space-20` | `80px` |
| `--cs-space-24` | `96px` |

| Token | Value |
|---|---|
| `--cs-radius-sm` | `4px` |
| `--cs-radius-md` | `8px` |
| `--cs-radius-lg` | `14px` |
| `--cs-radius-full` | `999px` |

### Density (Theme attribute)

| Token | CSS form | Resolves to |
|---|---|---|
| `--cs-density-space-1` | `var(--cs-space-1)` | `4px` |
| `--cs-density-space-2` | `var(--cs-space-2)` | `8px` |
| `--cs-density-space-3` | `var(--cs-space-3)` | `12px` |
| `--cs-density-space-4` | `var(--cs-space-4)` | `16px` |
| `--cs-density-space-5` | `var(--cs-space-5)` | `20px` |
| `--cs-density-space-6` | `var(--cs-space-6)` | `24px` |
| `--cs-density-control-gap` | `var(--cs-component-button-gap)` | `8px` |

Scoped overrides (distinct from the base token rows):

| Scope | Token | CSS override |
|---|---|---|
| `data-cs-density="compact"` | `--cs-density-space-1` | `3px` |
| `data-cs-density="compact"` | `--cs-density-space-2` | `6px` |
| `data-cs-density="compact"` | `--cs-density-space-3` | `9px` |
| `data-cs-density="compact"` | `--cs-density-space-4` | `12px` |
| `data-cs-density="compact"` | `--cs-density-space-5` | `16px` |
| `data-cs-density="compact"` | `--cs-density-space-6` | `18px` |
| `data-cs-density="compact"` | `--cs-density-control-gap` | `6px` |
| `data-cs-density="compact"` | `--cs-component-button-gap` | `6px` |
| `data-cs-density="compact"` | `--cs-component-button-xs-paddingY` | `3px` |
| `data-cs-density="compact"` | `--cs-component-button-xs-padding-y` | `var(--cs-component-button-xs-paddingY)` |
| `data-cs-density="compact"` | `--cs-component-button-xs-paddingX` | `8px` |
| `data-cs-density="compact"` | `--cs-component-button-xs-padding-x` | `var(--cs-component-button-xs-paddingX)` |
| `data-cs-density="compact"` | `--cs-component-button-sm-paddingY` | `6px` |
| `data-cs-density="compact"` | `--cs-component-button-sm-padding-y` | `var(--cs-component-button-sm-paddingY)` |
| `data-cs-density="compact"` | `--cs-component-button-sm-paddingX` | `12px` |
| `data-cs-density="compact"` | `--cs-component-button-sm-padding-x` | `var(--cs-component-button-sm-paddingX)` |
| `data-cs-density="compact"` | `--cs-component-button-md-paddingY` | `10px` |
| `data-cs-density="compact"` | `--cs-component-button-md-padding-y` | `var(--cs-component-button-md-paddingY)` |
| `data-cs-density="compact"` | `--cs-component-button-md-paddingX` | `16px` |
| `data-cs-density="compact"` | `--cs-component-button-md-padding-x` | `var(--cs-component-button-md-paddingX)` |
| `data-cs-density="compact"` | `--cs-component-button-lg-paddingY` | `12px` |
| `data-cs-density="compact"` | `--cs-component-button-lg-padding-y` | `var(--cs-component-button-lg-paddingY)` |
| `data-cs-density="compact"` | `--cs-component-button-lg-paddingX` | `22px` |
| `data-cs-density="compact"` | `--cs-component-button-lg-padding-x` | `var(--cs-component-button-lg-paddingX)` |
| `data-cs-density="compact"` | `--cs-component-textfield-paddingY` | `8px` |
| `data-cs-density="compact"` | `--cs-component-textfield-padding-y` | `var(--cs-component-textfield-paddingY)` |
| `data-cs-density="compact"` | `--cs-component-textfield-paddingX` | `10px` |
| `data-cs-density="compact"` | `--cs-component-textfield-padding-x` | `var(--cs-component-textfield-paddingX)` |
| `data-cs-density="comfortable"` | `--cs-density-space-1` | `var(--cs-space-1)` |
| `data-cs-density="comfortable"` | `--cs-density-space-2` | `var(--cs-space-2)` |
| `data-cs-density="comfortable"` | `--cs-density-space-3` | `var(--cs-space-3)` |
| `data-cs-density="comfortable"` | `--cs-density-space-4` | `var(--cs-space-4)` |
| `data-cs-density="comfortable"` | `--cs-density-space-5` | `var(--cs-space-5)` |
| `data-cs-density="comfortable"` | `--cs-density-space-6` | `var(--cs-space-6)` |
| `data-cs-density="comfortable"` | `--cs-density-control-gap` | `var(--cs-component-button-gap)` |
| `data-cs-density="comfortable"` | `--cs-component-button-gap` | `8px` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-paddingY` | `4px` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-padding-y` | `var(--cs-component-button-xs-paddingY)` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-paddingX` | `10px` |
| `data-cs-density="comfortable"` | `--cs-component-button-xs-padding-x` | `var(--cs-component-button-xs-paddingX)` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-paddingY` | `8px` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-padding-y` | `var(--cs-component-button-sm-paddingY)` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-paddingX` | `14px` |
| `data-cs-density="comfortable"` | `--cs-component-button-sm-padding-x` | `var(--cs-component-button-sm-paddingX)` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-paddingY` | `12px` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-padding-y` | `var(--cs-component-button-md-paddingY)` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-paddingX` | `20px` |
| `data-cs-density="comfortable"` | `--cs-component-button-md-padding-x` | `var(--cs-component-button-md-paddingX)` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-paddingY` | `16px` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-padding-y` | `var(--cs-component-button-lg-paddingY)` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-paddingX` | `28px` |
| `data-cs-density="comfortable"` | `--cs-component-button-lg-padding-x` | `var(--cs-component-button-lg-paddingX)` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-paddingY` | `10px` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-padding-y` | `var(--cs-component-textfield-paddingY)` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-paddingX` | `12px` |
| `data-cs-density="comfortable"` | `--cs-component-textfield-padding-x` | `var(--cs-component-textfield-paddingX)` |

### Layout & iconography

| Token | Value |
|---|---|
| `--cs-breakpoint-xs` | `0px` |
| `--cs-breakpoint-phone` | `360px` |
| `--cs-breakpoint-sm` | `640px` |
| `--cs-breakpoint-md` | `768px` |
| `--cs-breakpoint-lg` | `1024px` |
| `--cs-breakpoint-xl` | `1280px` |
| `--cs-breakpoint-2xl` | `1536px` |
| `--cs-container-max` | `1320px` |
| `--cs-prose-measure` | `45rem` |
| `--cs-scroll-padding-block-start` | `var(--cs-space-4)` |
| `--cs-scroll-padding-block-end` | `var(--cs-space-4)` |
| `--cs-icon-sm` | `16px` |
| `--cs-icon-md` | `20px` |
| `--cs-icon-lg` | `24px` |

## Elevation

Shadow values are the raw CSS box-shadow strings from `$extensions["com.cyberskill"].css` (structured DTCG objects carry the same layers). Dark overrides shown.

| Token | Light | Dark |
|---|---|---|
| `--cs-shadow-xs` | `0 1px 2px rgba(69, 33, 14, 0.06)` | `0 1px 2px rgba(0, 0, 0, 0.40)` |
| `--cs-shadow-sm` | `0 1px 3px rgba(69, 33, 14, 0.04), 0 8px 24px rgba(69, 33, 14, 0.06)` | `0 1px 3px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(0, 0, 0, 0.42)` |
| `--cs-shadow-md` | `0 12px 30px rgba(31, 19, 11, 0.18)` | `0 12px 30px rgba(0, 0, 0, 0.50)` |
| `--cs-shadow-lg` | `0 20px 60px rgba(69, 33, 14, 0.18)` | `0 20px 60px rgba(0, 0, 0, 0.55)` |
| `--cs-shadow-xl` | `0 24px 80px rgba(31, 19, 11, 0.26)` | `0 24px 80px rgba(0, 0, 0, 0.62)` |

### Depth scale & Liquid Glass materials

| Token | Value |
|---|---|
| `--cs-depth-bg` | `0` |
| `--cs-depth-section` | `5` |
| `--cs-depth-card` | `10` |
| `--cs-depth-nav` | `50` |
| `--cs-depth-modal` | `100` |
| `--cs-depth-toast` | `200` |
| `--cs-depth-dropdown` | `60` |
| `--cs-depth-overlay` | `80` |
| `--cs-glass-whisper-blur` | `8px` |
| `--cs-glass-whisper-saturate` | `110%` |
| `--cs-glass-whisper-opacity` | `60%` |
| `--cs-glass-light-blur` | `12px` |
| `--cs-glass-light-saturate` | `130%` |
| `--cs-glass-light-opacity` | `70%` |
| `--cs-glass-standard-blur` | `16px` |
| `--cs-glass-standard-saturate` | `150%` |
| `--cs-glass-standard-opacity` | `80%` |
| `--cs-glass-heavy-blur` | `24px` |
| `--cs-glass-heavy-saturate` | `180%` |
| `--cs-glass-heavy-opacity` | `90%` |

## Motion

Calm, purposeful motion; the global `prefers-reduced-motion` safety net reduces animation/transition durations to 0.01ms and disables smooth scrolling at runtime; components can disable animation entirely — these exported values are the real ones (80/120/200/320ms).

| Token | Value |
|---|---|
| `--cs-duration-instant` | `80ms` |
| `--cs-duration-fast` | `120ms` |
| `--cs-duration-base` | `200ms` |
| `--cs-duration-slow` | `320ms` |
| `--cs-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` |
| `--cs-ease-entrance` | `cubic-bezier(0, 0, 0, 1)` |
| `--cs-ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` |
| `--cs-ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` |

## Component tokens

Component-level design decisions (button · textfield). Dark values are theme overrides.

| Token | Light | Dark |
|---|---|---|
| `--cs-component-button-primary-bg` | `#45210E` | `#f4ba17` |
| `--cs-component-button-primary-fg` | `#FFFFFF` | `#1a1108` |
| `--cs-component-button-gap` | `8px` | — |
| `--cs-component-button-radius` | `8px` | — |
| `--cs-component-button-xs-paddingY` | `4px` | — |
| `--cs-component-button-xs-paddingX` | `10px` | — |
| `--cs-component-button-xs-minHeight` | `28px` | — |
| `--cs-component-button-xs-minWidth` | `28px` | — |
| `--cs-component-button-xs-minHeight-coarse` | `44px` | — |
| `--cs-component-button-sm-paddingY` | `8px` | — |
| `--cs-component-button-sm-paddingX` | `14px` | — |
| `--cs-component-button-sm-minHeight` | `36px` | — |
| `--cs-component-button-sm-minHeight-coarse` | `44px` | — |
| `--cs-component-button-md-paddingY` | `12px` | — |
| `--cs-component-button-md-paddingX` | `20px` | — |
| `--cs-component-button-md-minHeight` | `44px` | — |
| `--cs-component-button-md-minHeight-coarse` | `44px` | — |
| `--cs-component-button-lg-paddingY` | `16px` | — |
| `--cs-component-button-lg-paddingX` | `28px` | — |
| `--cs-component-button-lg-minHeight` | `52px` | — |
| `--cs-component-textfield-border-default` | `#BFA58F` | `#5a4636` |
| `--cs-component-textfield-paddingY` | `10px` | — |
| `--cs-component-textfield-paddingX` | `12px` | — |
| `--cs-component-textfield-minHeight` | `44px` | — |
| `--cs-focus-ring` | `3px` | — |
| `--cs-component-button-xs-padding-y` | `var(--cs-component-button-xs-paddingY)` | — |
| `--cs-component-button-xs-padding-x` | `var(--cs-component-button-xs-paddingX)` | — |
| `--cs-component-button-xs-min-height` | `var(--cs-component-button-xs-minHeight)` | — |
| `--cs-component-button-xs-min-width` | `var(--cs-component-button-xs-minWidth)` | — |
| `--cs-component-button-xs-min-height-coarse` | `var(--cs-component-button-xs-minHeight-coarse)` | — |
| `--cs-component-button-sm-padding-y` | `var(--cs-component-button-sm-paddingY)` | — |
| `--cs-component-button-sm-padding-x` | `var(--cs-component-button-sm-paddingX)` | — |
| `--cs-component-button-sm-min-height` | `var(--cs-component-button-sm-minHeight)` | — |
| `--cs-component-button-sm-min-height-coarse` | `var(--cs-component-button-sm-minHeight-coarse)` | — |
| `--cs-component-button-md-padding-y` | `var(--cs-component-button-md-paddingY)` | — |
| `--cs-component-button-md-padding-x` | `var(--cs-component-button-md-paddingX)` | — |
| `--cs-component-button-md-min-height` | `var(--cs-component-button-md-minHeight)` | — |
| `--cs-component-button-md-min-height-coarse` | `var(--cs-component-button-md-minHeight-coarse)` | — |
| `--cs-component-button-lg-padding-y` | `var(--cs-component-button-lg-paddingY)` | — |
| `--cs-component-button-lg-padding-x` | `var(--cs-component-button-lg-paddingX)` | — |
| `--cs-component-button-lg-min-height` | `var(--cs-component-button-lg-minHeight)` | — |
| `--cs-component-textfield-padding-y` | `var(--cs-component-textfield-paddingY)` | — |
| `--cs-component-textfield-padding-x` | `var(--cs-component-textfield-paddingX)` | — |
| `--cs-component-textfield-min-height` | `var(--cs-component-textfield-minHeight)` | — |

## Components inventory

107 component files · 125 exports (from `_ds_manifest.json`). Every primary ships `.jsx` + `.d.ts` + `.prompt.md`.

`AIDisclosureBadge` · `Accordion` · `Alert` · `AlertDialog` · `Anchor` · `AspectRatio` · `Avatar` · `AvatarGroup` · `BackTop` · `Badge` · `Breadcrumb` · `Button` · `ButtonGroup` · `CS_ICONS` · `CS_LOGO_MARK_INNER` · `CS_LOGO_VIEWBOX` · `Calendar` · `Card` · `CardBody` · `CardFooter` · `CardHeader` · `Carousel` · `Cascader` · `Chart` · `ChatMessage` · `Checkbox` · `CitationList` · `CodeBlock` · `Collapsible` · `ColorPicker` · `Combobox` · `CommandPalette` · `Comment` · `ConfidenceMeter` · `ContextMenu` · `DataGrid` · `DataTable` · `DatePicker` · `DescriptionList` · `Dialog` · `Divider` · `Dock` · `Drawer` · `EDITOR_SCHEMA` · `Editor` · `EmptyState` · `FileUpload` · `FloatingActionButton` · `Form` · `FormField` · `FormFieldArray` · `FormWizard` · `HotKeys` · `HoverCard` · `HumanReviewGate` · `Icon` · `Image` · `InlineEdit` · `InputGroup` · `InputOTP` · `Item` · `Kbd` · `Link` · `List` · `ListItem` · `LocaleProvider` · `Logo` · `LumiAvatar` · `Masonry` · `Mentions` · `Menu` · `MenuItem` · `Menubar` · `NativeSelect` · `NavItem` · `NavigationMenu` · `NumberField` · `OverlayProvider` · `Pagination` · `Popconfirm` · `Popover` · `ProgressBar` · `PromptInput` · `PromptSuggestions` · `QRCode` · `Radio` · `RadioGroup` · `Rating` · `Result` · `ScrollArea` · `SearchField` · `SegmentedControl` · `Select` · `Sidebar` · `Skeleton` · `Slider` · `Sortable` · `Spinner` · `Splitter` · `Stat` · `StatusIndicator` · `Steps` · `Switch` · `Tab` · `Tabs` · `Tag` · `TagInput` · `Terminal` · `TextField` · `Textarea` · `TimePicker` · `Timeline` · `Toast` · `ToastStack` · `Toggle` · `Toolbar` · `Tooltip` · `Tour` · `Transfer` · `Tree` · `TreeSelect` · `TreeTable` · `TypingIndicator` · `Watermark` · `useMessages`

## Templates

85 templates with explicitly scoped language support in `templates/*/` (each a `.dc.html` + byte-identical `support.js` runtime; see `docs/template-schema-v2.md` for typed source-content slots; these are not automatically runtime props). **DC-capable authoring / full-clone only** — Stitch must not consume `*.dc.html` as SoT; use kitchen-sink / `.cs-*` / static examples instead.

## Links

- [README.md](README.md) — entrance document (voice, foundations, index)
- [SKILL.md](SKILL.md) — agent entry: hard rules + fast orientation
- [llms.txt](llms.txt) — agent/tool front door, capability-based consume-by-audience map
- [docs/consuming.md](docs/consuming.md) — adopt/upgrade + DC-capable vs static dual path
- [docs/doctrine.md](docs/doctrine.md) — expansion rule, verification depth, immutables
- [docs/sync.md](docs/sync.md) — repo ↔ authoring-environment round-trip & what non-DC agents can consume
- [tokens/](tokens/) — CSS custom properties + `tokens.json` / `tokens.js` (ESM) / `tokens.dtcg.json` (DTCG 2025.10 emitted-value profile) / `native/` (SwiftUI · Compose · Flutter)
- [docs/quality-gates.md](docs/quality-gates.md) — every deterministic gate incl. `design-md-parity`, which pins this file to the DTCG source

