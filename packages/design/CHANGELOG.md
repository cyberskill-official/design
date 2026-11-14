# @cyberskill/design

## 3.3.0

### Minor Changes

- 4e4d8ed: Card, CardTitle, Meter and Separator render in Server Components with no JavaScript. Card keeps its `render` prop (an element or a function). Meter no longer takes `getAriaValueText` or `render`; pass `aria-valuetext` instead.

## 3.2.0

### Minor Changes

- 1d52d34: Motion and color that every app inherits.
  
  **Motion**
  - Springs defined the way Apple defines them (a duration and a bounce) and shipped as tokens: `--spring-smooth`, `--spring-snappy`, `--spring-bouncy`. In CSS they are `linear()` curves; `tokens.spring` has the same springs as stiffness and damping for JavaScript.
  - Recipes are the only motion a component or an app chooses: `--motion-state`, `--motion-fade`, `--motion-press`, `--motion-release`, `--motion-move`, `--motion-pop-in`, `--motion-pop-out`, `--motion-modal-in`, `--motion-modal-out`, `--motion-sheet-in`, `--motion-sheet-out`, `--motion-reveal` and `--motion-celebrate`. Use one per property: `transition: transform var(--motion-move)`.
  - Every component now moves through them: buttons answer on pointer-down and spring back, the switch thumb, tab line and segmented selection travel on a spring, menus and popovers grow from their trigger, dialogs scale in and leave faster than they arrive, drawers use a sheet curve, toasts land instead of travelling.
  - Reduced motion keeps the fade and drops the movement, for every component and for app code that uses the recipes. It ships with the tokens, so `tokens.css` on its own has it too.
  - New durations `--duration-instant` (80ms) and `--duration-slower` (500ms); new curves `--ease-enter` and `--ease-sheet`. The existing three durations are unchanged.
  - `Reveal` and `Stagger`: a first-load fade and rise in plain CSS. They need no JavaScript, work in Server Components and never restart on hydration.
  - New optional entry `@cyberskill/design/motion` (peer `motion`, install it only if you use the entry) for what CSS cannot do: `MotionProvider`, `AnimatedNumber`, and the tokens as Motion transitions (`transitions`, `springs`).
  
  **Color**
  - Color roles for every tone, derived by the token build and checked for contrast: `--<tone>-soft`, `--<tone>-soft-hover`, `--<tone>-line` and `--<tone>-text` for success, warning, destructive and info, plus the accent and primary equivalents.
  - Five category tones for icon tiles, avatars and tags, matching the chart palette: `blue`, `amber`, `teal`, `magenta`, `violet`.
  - `Button` `variant="soft"` with `tone`; new `IconTile`; `tone` on `Avatar`, `Stat`, `Card`, `Tag` and `Badge`; `Stat` `icon`; `Card` `surface="ink"` (the one inverse surface on a view) and `surface="aurora"`; `toneFor()` picks a stable category tone from a name.
  - Four gradient tokens, and no others: `--gradient-ink`, `--gradient-wash`, `--gradient-gold`, `--gradient-aurora`.
  - The selection in `SegmentedControl` is one thumb that slides.
  
  **For app repositories**
  - `npx @cyberskill/design check` fails on raw colors, raw durations or curves, and a second animation library. Add it to CI.
  - `npx @cyberskill/design ai-setup` now also points AI tools at `ai/motion.md` and `ai/color.md`.
  
  **Changed look: check these when upgrading from 3.1.0**
  - **The `secondary` button is a soft ink fill**, not a grey outline. Use `variant="ghost"` where you need a button with no fill.
  - **Checked controls are gold.** Switch, Checkbox, Radio, the Slider range, Progress and Meter fill with `--accent` and carry an ink mark. `Progress` and `Meter` take `tone="primary"` for the previous ink fill.
  - **Retiming components.** Recipes are resolved on `:root`, so overriding `--duration-*` or `--ease-*` no longer changes a component, and neither does an override on `body` or a subtree. Override the `--motion-*` recipe on `:root`, inside `@media (prefers-reduced-motion: no-preference)` so reduced motion still wins.
  - **`--primary-soft` is also the resting fill of the `secondary` button** (with a `--primary-line` hairline). An app that recolors `--primary-soft` for selected rows recolors those buttons too.
  - **Everything built on the secondary button changes with it:** `IconButton`, `ButtonGroup` (buttons sit 1px apart and the pressed one is a panel with an ink edge), the toast action, the alert dialog's cancel and the avatar upload trigger.
  - **`Stat` deltas are tinted chips**, the `SideNav` badge is solid gold whatever it holds, and an interactive `Card` lifts 2px on hover.
  - **`SegmentedControl` has a new first child**, the sliding thumb (`aria-hidden`). App CSS that picks segments with `:first-child` or `:nth-child` must use `.cs-segmented-control-item`; a custom `[data-pressed]` background now paints over the thumb.
  - The `CommandMenu` opens on the short pop recipe instead of the dialog one.

## 3.1.0

### Minor Changes

- 7470028: A hardening pass over every component, plus fonts that ship with the package.
  
  **New**
  - Four components: `PasswordField` (show/hide toggle), `TagInput` (free-text chips: Enter, comma or paste adds; duplicates and invalid entries are refused), `AvatarUpload` (one image with a round preview, replace and remove) and `Prose` (styles Markdown and AI answers: headings, lists, code, tables, links).
  - Kbd, Spinner, Skeleton, EmptyState, Badge, Stat, Stepper, Breadcrumbs and Prose have no `'use client'`: used from a Server Component they ship and hydrate no JavaScript.
  - `@cyberskill/design/fonts.css`: Be Vietnam Pro, Manrope and JetBrains Mono, self-hosted (Latin and Vietnamese). It raises Be Vietnam Pro's ascent, so text inputs no longer cut the top mark off stacked Vietnamese capitals (Ẫ showed as Â).
  - Text and control sizes are in rem, so they grow with the reader's browser font size.
  - Windows contrast themes (forced colors): selected, pressed and current items use the system highlight, and the switch has an edge.
  - DataTable `statusLabel`; FileUpload `name` (files submit with a native form or Server Action); FormField `invalidLabel`; DateRangePicker `excludeDisabled`; `labels` on the date pickers; `invalid` on DatePicker and TimePicker.
  
  **Fixed**
  - Text fields, selects and OTP inputs show the standard 2px focus ring instead of a border change and a faint glow; hovering an invalid field no longer hides its red edge.
  - A form reset (`reset()` in React Hook Form) no longer leaves stale chips, a selected segment, a search term or half-typed dates on screen. One case is left: invalid date text when the form's default for that date is `null` (change the picker's `key` on reset).
  - Date pickers no longer show the server's time zone after hydration. Until the page hydrates they render empty, so a form posted before that sends no date.
  - DataTable keeps its page when `data` is a new array (a refetch, a deleted row) and returns to page 1 on a new sort order; Combobox and MultiSelect keep the chosen label when async results no longer contain it.
  - DateTimePicker with an error is announced as invalid and its inputs turn red; icon-only Toggle keeps a caller's `aria-label`.
  - TextField keeps focus and typed text when an adornment appears or disappears.
  - Disabled step, action and remove buttons look disabled; a pressed ButtonGroup button differs from hover; the calendar's "today" ring and the stepper's current bar show in light mode.
  - Right-to-left: the switch thumb, tag remove area, table selection bar and close buttons mirror correctly.
  - Charts handle an empty `series` and all-negative data; `rangePresets()` can be called from a Server Component.
  
  **Changed behavior: check these when upgrading from 3.0.0**
  - **Sizes are in rem.** With the browser default (16px root font) nothing changes. An app that sets its own root size (`html { font-size: 62.5% }`) gets smaller text and controls: set the root back to 100%, or override the `--text-*` and `--control-*` tokens.
  - **`Input` and `TextField` always render the `cs-input-group` box around the input.** `className` and `style` go to that box, as they did to the bordered input before, so widths and margins keep working. App CSS that targets `.cs-input` for the border, background or radius must target `.cs-input-group`.
  - **NumberField and Slider use `locale="en-US"` unless you pass a locale**, for the shown text and for reading typed text (server and browser now agree). Before, a visitor's browser locale was used: in a Vietnamese or German browser a typed `1,5` was 1.5 and is now 15. Apps for those users pass `locale="vi-VN"`.
  - **DataTable no longer jumps to page 1 when `data` changes.** If you filter `data` yourself (a search box above the table), give the table `key={query}` so each search starts at page 1.
  - SegmentedControl shows no selected segment when its controlled value is reset to `undefined`.
  - `accept="image/*"` takes a file the browser could not type only when it ends in `.heic`, `.heif` or `.avif`.
  - Badge, Stat, Stepper and Breadcrumbs draw their built-in icons without `IconContext` (they are server-renderable now); icons you pass in are unaffected.
  - Peer `recharts` is now `^3.8.0` (the charts already needed it: on 3.0–3.7 `npm install` reports a peer conflict until recharts is updated). `engines.node` is `>=20.9`, the version Next 16 needs. `ai-setup` only runs in a folder with a `package.json`.

## 3.0.0

### Major Changes

- 3.0.0: Ink & Gold. A rebuild of the CyberSkill Design System.
  
  - **Brand:** Ink & Gold tokens in light and dark, with Manrope, Be Vietnam Pro and JetBrains Mono. The build fails on any text below WCAG contrast and on status or chart colors too alike for color-blind readers.
  - **Components:** about 65 on Base UI, covering every Base UI part plus calendar, date, range and time pickers, combobox, autocomplete, multi-select, file upload, data table, charts and React Hook Form helpers. Flat named exports that work from React Server Components.
  - **Smaller apps:** optional peers (Recharts, TanStack, React Hook Form, react-day-picker) load only from their own entry points; an app using two components ships about 6 KB of component JavaScript.
  - **Quality:** every component is tested in a real browser with accessibility checks in both themes, and a 23-dimension benchmark runs on every story.
  - **AI tools:** short docs per component, a Claude Code skill and a Cursor rule ship in `ai/`; `npx @cyberskill/design ai-setup` installs them.
  - **Breaking:** 3.0 shares no components or class names with 2.x. See https://design.cyberskill.world/docs/migration. 2.x stays on npm under the `legacy` tag and its docs at https://design.cyberskill.world/legacy/.

### Patch Changes

- Combobox, MultiSelect and Autocomplete name their open list after the input when they are used with `aria-label` and no visible label (screen readers announced an unnamed list).
- ebb87e3: Fixes found by the new quality benchmark (`npm run benchmark`, see docs/benchmark.md):
  
  - Selects, tags, chips, menu items and truncated labels no longer cut off stacked Vietnamese marks (Ỗ showed as Ô). Text inputs still do: the browser clips input text to the font's ascent, so that needs a font-level fix.
  - Buttons, badges and segmented controls truncate a long label inside a narrow container instead of overflowing it; alerts, stats and field text wrap long IDs and emails.
  - Focusing a field that has an error now shows a solid ring; before, only a faint glow changed.
  - MultiSelect: pressing Escape with the list closed no longer deletes every chosen value.
  - Soft and outline badges use the tone's own color for text, so success, warning and danger stay tellable apart for color-blind readers.
  - Calendar ranges, the chosen date-range preset, the current navigation-menu link and the selected segment get an edge at 3:1, not just a tint.
  - SearchField's clear button is at least 24px, also in the small size.
  - The command menu's hidden Close button shows while it has keyboard focus; the inverted code block's focus ring is drawn inside it.
