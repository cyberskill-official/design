# Working in this repo (humans and AI agents)

CyberSkill Design System 3.x: Ink & Gold tokens, accessible React components and the showcase site at design.cyberskill.world. Read this before adding or changing a component.

## Layout

| Path | What lives there |
|---|---|
| `packages/design/tokens/*.json` | **Single source of truth** for every color, font, size, radius, shadow, motion and z-index value |
| `packages/design/scripts/build-tokens.mjs` | Generates `dist/tokens.css`, `tailwind.css`, `tokens.{js,d.ts,json}`. **Fails the build** when a contrast or color-distinctness rule breaks |
| `packages/design/src/css/base.css` | Zero-specificity defaults, type classes (`cs-h1`…), `cs-visually-hidden` |
| `packages/design/src/css/components/<name>.css` | One stylesheet per component (kebab-case file name). The build wraps it in `@layer components` (base.css in `@layer base`), so app CSS and Tailwind utilities win |
| `packages/design/src/css/components/tone.css` | The tone map: `data-tone` to `--tone`, `--tone-on`, `--tone-soft`, `--tone-soft-hover`, `--tone-line`, `--tone-text`, `--tone-icon`, shared by every toned component; `.cs-tone` gives app markup the same variables |
| `packages/design/src/css/motion.css` | Reduced motion (redefines the `--motion-*` recipes and start values once) and forced colors, emitted unlayered after every component |
| `packages/design/src/react/<Name>.tsx` | Component (PascalCase file name) |
| `packages/design/src/react/<Name>.stories.tsx` | Storybook stories. Each story also runs as a real-browser test |
| `packages/design/src/react/<Name>.test.tsx` | Vitest browser tests (behavior + axe) |
| `packages/design/src/react/_exports/*.ts` | Public exports by family, re-exported by `src/react/index.ts`. Pure helpers also go in `src/utils/index.ts` (`/utils`, no `'use client'`) |
| `packages/design/src/react/tone.ts` | `Tone`, `StatusTone`, `CategoryTone` and `toneFor(key)` (a stable category tone for avatars and tags) |
| `packages/design/src/{charts,table,forms,date,motion}/` | Optional entries, one per optional peer (Recharts, TanStack, React Hook Form, react-day-picker + date-fns, Motion). Only these import their peer; the core entry never does |
| `packages/design/bin/cyberskill-design.mjs` | The CLI apps run: `ai-setup` (installs the AI rules) and `check` (raw colors, raw motion, a second animation library) |
| `apps/site/demos/<name>.tsx` | Live examples used by the site page |
| `apps/site/content/docs/components/<name>.mdx` | The component's page on the site |

## Component rules

1. **Behavior comes from Base UI** (`@base-ui/react/<part>`, e.g. `import { Dialog as BaseDialog } from '@base-ui/react/dialog'`). Never hand-roll focus traps, roving focus, popover positioning or ARIA wiring. The exact API is in `node_modules/@base-ui/react/docs/react/components/<part>.md`; read it, it is authoritative.
2. **Flat named exports, no dot-namespaces.** `Dialog`, `DialogTrigger`, `DialogContent`… React Server Components cannot "dot into" a client module, so `Dialog.Root` breaks in Next.js server files.
3. **Props:** extend the Base UI part's props (or the native element's), take `className?: string` and merge it with `cx('cs-name', className)` from `../utils/cx`. Forward the rest with `{...props}` so `ref`, `aria-*`, `data-*` and events pass through (React 19: `ref` is a normal prop).
4. **Variants and sizes are data attributes:** `data-variant`, `data-size`, `data-tone`. Not extra class names. `data-tone` takes a `Tone` from `tone.ts` and is styled only through the tone map's `--tone-*` variables. Base UI state attributes (`data-disabled`, `data-checked`, `data-open`, `data-popup-open`, `data-highlighted`, `data-invalid`, `data-starting-style`, `data-ending-style`…) drive state styles.
5. **Sizes:** `sm` 32px, `md` 40px (default), `lg` 48px tall (`--control-sm|md|lg`). Anything tapped on its own needs a 44px hit area (`--control-touch`); use padding or a `::before` hit-slop when the visual is smaller.
6. **Status meaning never rests on color alone.** Status chips, alerts and toasts carry an icon (Phosphor: `CheckCircle`, `Warning`, `XCircle`, `Info`) and text.
7. **Icons:** Phosphor (`@phosphor-icons/react`), `weight="regular"`, 16px in `sm`/`md` controls, 20px in `lg`. Decorative icons get `aria-hidden`. Icon-only buttons need an accessible name (`label` prop).
8. **Text:** component code holds no hard-coded English that a user reads, except sensible defaults exposed as props (e.g. `closeLabel = 'Close'`), so apps can pass Vietnamese.

## CSS rules (checked by `npm run lint:css -w @cyberskill/design`)

- Colors only through tokens: `var(--primary)`, `var(--border)`, `color-mix(in srgb, var(--destructive) 12%, var(--panel))`. **No hex, rgb() or hsl() literals.** Shadows: `var(--shadow-md)`.
- Class prefix `cs-`; parts as `cs-<block>-<part>` (`cs-dialog-title`). Native CSS nesting is fine.
- Spacing `var(--space-*)`, radius `var(--radius-*)`, layers `var(--z-*)`.
- **Fill by color role:** `--<tone>-soft` (tint), `-soft-hover`, `-line` (tinted border), `-text` (text on the tint), `-icon` (category icons). A toned component reads `var(--tone-*)` from the tone map; it never maps tones to colors itself. Category tones (blue, amber, teal, magenta, violet) are tint and icon only: no text on a solid category color.
- **Gold means on, done or key.** Switch on, Checkbox and Radio checked, Slider range, Progress and Meter fill and SideNav counts fill with `--accent`. Gold on white is 1.8:1, so each gold shape gets an `--accent-text` edge (a border, or an inset shadow on a bar) and its mark is `--accent-foreground`. Primary buttons, links, the tab line, the selected nav item and the focus ring stay ink.
- Static checks read CSS line by line: a `[data-tone='blue']` selector never follows a `:` on its line (`:hover[data-tone='blue']` reads as a raw color). Put the tone selector first, or on its own line.
- Text: `var(--font-sans)` for UI, `var(--font-display)` for headings inside components (dialog titles, stat values), `var(--font-mono)` for codes and numbers in tables. Sizes in rem (`0.875rem`, never px, so text follows the reader's browser font size); minimum 12px (11px for mono labels).
- Focus: `outline: 2px solid var(--ring); outline-offset: 2px` on `:focus-visible`. Text fields use the same ring with `outline-offset: 0` (it hugs the border); never a border-color change or glow alone.
- **Motion through recipes only:** every `transition` is one property on a `--motion-*` recipe, `transition: background-color var(--motion-state), transform var(--motion-release)`. No raw times or curves, no `var(--duration-*)` or `var(--ease-*)` in a transition, never `transition: all`. Keyframes run on a recipe too (`animation: cs-rise var(--motion-reveal)`); only loading loops (spinner, skeleton, indeterminate progress) keep raw timing.
- Which recipe: color, background, border, shadow and outline `state`; opacity on enter `fade`; press `transform: scale(var(--motion-press-scale))` on enabled `:active` with `press`, `release` at rest; thumbs, indicators and fills that travel `move`; popups `fade` + `pop-in` from `scale(var(--motion-pop-scale))` at `transform-origin: var(--transform-origin)`, `pop-out` to leave; dialogs `modal-in` / `modal-out` with `--motion-modal-scale`, no slide; drawers and sheets `sheet-in` / `sheet-out`; animated height `pop-in`. Never put `transform`, size or position on `state` or `fade`.
- Enter and exit use Base UI's `[data-starting-style]` / `[data-ending-style]`: the base rule's transition is the enter, a transition under `[data-ending-style]` is the exit. Hover-only effects (a card lifting) go inside `@media (hover: hover) and (pointer: fine)`.
- **Reduced motion comes from the tokens:** `motion.css` redefines the recipes and the start values (`--motion-*-scale` to 1, `--motion-rise` and `--motion-stagger` to 0). Build start and end transforms from those values and a component needs no rule of its own. Drawers and sheets, which slide in from off-screen, add a `prefers-reduced-motion` rule that fades instead.
- No `!important`. Never set colors in a way that only works in one theme; every token flips with `data-theme`.

## Stories and tests

- Stories: CSF3 with `satisfies Meta<typeof Component>`, `tags: ['autodocs']`, title `Group/Name` (`Actions/Button`, `Forms/TextField`, `Overlays/Dialog`). One story per meaningful variant or state. Interactive components get a `play` function using `storybook/test` (`expect`, `userEvent`, `within`).
- Tests: `import { render, screen } from '@testing-library/react'`, `import { userEvent } from 'vitest/browser'`, and `expectNoA11yViolations` from `../test/a11y`. Every component test checks: it renders its role/name, key interaction works, and **axe finds no violations in light and dark** (`expectAccessibleInThemes(<Component />)` from `../test/a11y`). See `Button.test.tsx` and `Dialog.test.tsx` for the pattern.

## Site page

`apps/site/content/docs/components/<name>.mdx` with front matter `title` and `description`, then: a short intro (what it is for, when not to use it), `<Demo>` blocks with live examples imported from `@/demos/<name>`, a fenced `tsx` code block under each demo showing the same code, a `<PropsTable rows={[...]} />`, and an **Accessibility** section (keyboard, screen reader). Pages are UI reference only: no brand or company content.

## AI docs shipped to consumers

`packages/design/ai/` is **generated** by `scripts/build-ai-docs.mjs` from the site pages, the built `.d.ts` files and the built tokens: `INDEX.md`, `components/<name>.md`, `motion.md` and `color.md` (from the two foundations pages), `tokens.md` (color roles and motion recipes included), `helpers.md`, `SKILL.md`, `cursor-rule.mdc`, `AGENTS-snippet.md`. Never edit it by hand: change the site page or JSDoc, run the build, commit the result. CI fails when it is stale, and the build fails when a component appears in no page's code sample (so its doc would be missing) or when `foundations/motion.mdx` or `color.mdx` loses its `## Rules` section. On those two pages each `##` section is plain Markdown; live components are self-closing tags on their own lines between sections. Apps install the skill and rules with `npx @cyberskill/design ai-setup` and check their own code with `npx @cyberskill/design check`.

## Before you finish

```bash
npm run build -w @cyberskill/design    # tokens + CSS + JS, fails on any broken color rule
npm run lint:css -w @cyberskill/design
npm run test:gates -w @cyberskill/design  # proves the token, CSS and CLI gates reject bad input
npm run test:tools                         # benchmark scoring and its file checks
npm run typecheck -w @cyberskill/design
npm run test -w @cyberskill/design
npm run build-storybook -w @cyberskill/design && npm run benchmark  # 25-dimension quality benchmark, every story
```

The benchmark ([docs/benchmark.md](docs/benchmark.md)) fails on any WCAG 2.2 AA or house-rule failure. A new form control also goes into the `InvalidStates` stress-test story, and a new text-bearing component into `VietnameseText` and `LongContent` (`packages/design/src/benchmark/Benchmark.stories.tsx`).
