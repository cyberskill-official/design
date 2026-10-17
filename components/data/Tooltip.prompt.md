**Tooltip** — small umber bubble on hover/focus of its trigger. Wrap a focusable element; keep the label short.

```jsx
<Tooltip label="Blocked on infra"><button className="cs-button cs-button--ghost cs-button--sm">?</button></Tooltip>
```

Provide one focusable trigger that forwards `aria-describedby`. Existing descriptions are preserved and each tooltip receives a stable ID. Hover and focus open it; Escape dismisses only the tooltip. The bubble remains hoverable across the trigger gap. Use HoverCard for interactive content. Text/fragment children receive a focusable wrapper; disabled controls need an enabled focusable wrapper.

On coarse pointers, built-in text fallbacks and direct button, link, or focusable trigger roots preserve a 44 × 44 CSS-pixel target. Custom trigger components must render a focusable root and forward the relevant events and ARIA attributes.

Keyboard: Native focus or pointer hover opens the description; Escape dismisses through the shared layer. Supply one focusable trigger forwarding aria-describedby. Trigger content and label should not contain interactive content in the bubble. The component adds no click-to-toggle handler.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The default short tooltip label is localized; a supplied label and trigger content remain caller-owned. A tooltip supplements the trigger name rather than supplying its only accessible name.

Source evidence: `Tooltip.jsx` and `Tooltip.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
