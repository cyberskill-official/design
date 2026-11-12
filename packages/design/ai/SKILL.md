---
name: cyberskill-design
description: Use when building or changing UI in a project that depends on @cyberskill/design (CyberSkill Design System, Ink & Gold): choosing components, colors, tokens, typography, icons, charts, tables, forms or dark mode. Read node_modules/@cyberskill/design/ai/INDEX.md first, then only the component docs you need.
---

# CyberSkill Design System

1. Read `node_modules/@cyberskill/design/ai/INDEX.md`: setup, rules and the table of every component with its import.
2. For each component you will use, read `node_modules/@cyberskill/design/ai/components/<name>.md` (exact props and types, examples, accessibility). Do not read the others.
3. For colors, spacing, type or motion, read `node_modules/@cyberskill/design/ai/tokens.md`.
4. Follow the rules in INDEX.md exactly: components before custom UI, no other UI kit (Radix, shadcn/ui, MUI…), tokens only (no hex or Tailwind palette colors), flat imports, labels on every control, status with icon + text.
5. Do not read the package source or `dist/` to learn the API; the ai/ docs are generated from it and are exact.
