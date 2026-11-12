# @cyberskill/design

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
