---
'@cyberskill/design': minor
---

A hardening pass over every component, plus fonts that ship with the package.

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
