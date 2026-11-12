<img src="https://cdn.jsdelivr.net/npm/@cyberskill/design@3/assets/logo-primary.svg" width="56" height="56" alt="CyberSkill">

# @cyberskill/design

The CyberSkill Design System: Ink & Gold tokens, accessible React components, chart presets and date pickers for every CyberSkill product. Docs and live examples: **[design.cyberskill.world](https://design.cyberskill.world)**.

[![npm](https://img.shields.io/npm/v/@cyberskill/design?color=14243D&label=npm)](https://www.npmjs.com/package/@cyberskill/design)
[![CI](https://github.com/cyberskill-official/design/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/cyberskill-official/design/actions/workflows/ci.yml)
![WCAG 2.2 AA](https://img.shields.io/badge/WCAG_2.2-AA-F4BA17)
![Provenance](https://img.shields.io/badge/npm-provenance-14243D)

- **60+ components** on [Base UI](https://base-ui.com): forms, pickers (combobox, multi-select, date, range and time), overlays, navigation, data table, charts.
- **Tokens** in light and dark, as CSS variables, a Tailwind v4 theme and a typed object. The build fails if any color pair drops below its contrast rule.
- **Vietnamese first:** stacked marks (Ẫ, Ỗ) are never clipped, search ignores accents, every user-facing string is a prop.
- **Checked on every release:** a 22-dimension quality benchmark runs on every story in light and dark (WCAG 2.2 AA, focus, keyboard, reflow, forced colors, Vietnamese text).
- **Server Components ready:** flat named exports, `'use client'` only where it is needed, optional peers in their own entry points.

## Install

```bash
npm install @cyberskill/design @phosphor-icons/react
```

```css
/* app/globals.css */
@import 'tailwindcss';                       /* optional */
@import '@cyberskill/design/tailwind.css';   /* optional, Tailwind v4 theme */
@import '@cyberskill/design/styles.css';
```

```tsx
import { Button, TextField, Dialog, DialogTrigger, DialogContent } from '@cyberskill/design';

export function Invite() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Invite people</DialogTrigger>
      <DialogContent title="Invite people">
        <TextField label="Work email" type="email" />
      </DialogContent>
    </Dialog>
  );
}
```

Fonts: load Manrope, Be Vietnam Pro and JetBrains Mono (`next/font/google` in Next.js). Dark mode: `data-theme="dark"` (or `system`) on `<html>` or any element; `ThemeScope` themes one part of a page, popups included.

## Entry points

| Import | Contents | Extra peer |
|---|---|---|
| `@cyberskill/design` | Components | `react@19`, `@phosphor-icons/react` |
| `@cyberskill/design/styles.css` | Tokens + base + component CSS | – |
| `@cyberskill/design/tokens.css` | CSS variables only | – |
| `@cyberskill/design/tailwind.css` | Tailwind v4 theme | `tailwindcss@4` |
| `@cyberskill/design/tokens` | Typed token object (and `tokens.json`) | – |
| `@cyberskill/design/charts` | Chart presets | `recharts@3` |
| `@cyberskill/design/table` | Data table | `@tanstack/react-table@9`, `@tanstack/react-virtual@3` |
| `@cyberskill/design/forms` | React Hook Form helpers | `react-hook-form@7` |
| `@cyberskill/design/date` | Calendar, date, range and time pickers | `react-day-picker@10`, `date-fns@4` |
| `@cyberskill/design/utils` | Pure helpers (`cx`, `formatFileSize`, chart colors), safe in Server Components | – |
| `@cyberskill/design/assets/*` | Logos and icons | – |

## For AI coding tools

The package ships its own AI guide in `ai/`: `INDEX.md` (setup, rules, every component with its import), one short file per component with exact types, `tokens.md`, a Claude Code skill and a Cursor rule. Install them into your project:

```bash
npx cyberskill-design ai-setup            # .claude/skills, .cursor/rules, AGENTS.md section
npx cyberskill-design ai-setup --dry-run  # preview
```

## Links

- [Get started](https://design.cyberskill.world/docs/get-started) · [Components](https://design.cyberskill.world/docs/components) · [Patterns](https://design.cyberskill.world/docs/patterns)
- [Migrating from 2.x](https://design.cyberskill.world/docs/migration) · [2.x docs](https://design.cyberskill.world/legacy/) (frozen at 2.9.0, npm tag `legacy`)
- [Changelog](https://design.cyberskill.world/docs/changelog) · [Quality benchmark](https://github.com/cyberskill-official/design/blob/main/docs/benchmark.md) · [Issues](https://github.com/cyberskill-official/design/issues)

## License

`UNLICENSED`. Use is limited to the CyberSkill products listed in the [consumer grant](https://github.com/cyberskill-official/design/blob/main/docs/consumer-grant.md).
