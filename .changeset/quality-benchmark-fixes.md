---
'@cyberskill/design': patch
---

Fixes found by the new quality benchmark (`npm run benchmark`, see docs/benchmark.md):

- Text inputs, selects, tags, chips, menu items and truncated labels no longer cut off stacked Vietnamese marks (Ẫ showed as Â, Ỗ as Ô).
- Buttons, badges and segmented controls truncate a long label inside a narrow container instead of overflowing it; alerts, stats and field text wrap long IDs and emails.
- Focusing a field that has an error now shows a solid ring; before, only a faint glow changed.
- MultiSelect: pressing Escape with the list closed no longer deletes every chosen value.
- Soft and outline badges use the tone's own color for text, so success, warning and danger stay tellable apart for color-blind readers.
- Calendar ranges, the chosen date-range preset, the current navigation-menu link and the selected segment get an edge at 3:1, not just a tint.
- SearchField's clear button is at least 24px, also in the small size.
- The command menu's hidden Close button shows while it has keyboard focus; the inverted code block's focus ring is drawn inside it.
