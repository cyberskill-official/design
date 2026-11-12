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
- A form reset (`reset()` in React Hook Form) no longer leaves stale chips, a selected segment, a search term or half-typed dates on screen.
- Date pickers no longer show the server's time zone after hydration.
- DataTable keeps its page when `data` is a new array; Combobox and MultiSelect keep the chosen label when async results no longer contain it.
- DateTimePicker with an error is announced as invalid and its inputs turn red; icon-only Toggle keeps a caller's `aria-label`.
- TextField keeps focus and typed text when an adornment appears or disappears.
- Disabled step, action and remove buttons look disabled; a pressed ButtonGroup button differs from hover; the calendar's "today" ring and the stepper's current bar show in light mode.
- Right-to-left: the switch thumb, tag remove area, table selection bar and close buttons mirror correctly.
- Charts handle an empty `series` and all-negative data; `rangePresets()` can be called from a Server Component.

**Changed behavior**
- NumberField and Slider format with `locale="en-US"` unless you pass a locale (server and browser now agree). Vietnamese apps: pass `locale="vi-VN"`.
- SegmentedControl shows no selected segment when its controlled value is reset to `undefined`.
- `Input` always renders inside its `cs-input-group` box (with or without adornments).
- Peer `recharts` is now `^3.8.0` (the charts already needed it); `ai-setup` only runs in a folder with a `package.json`.
