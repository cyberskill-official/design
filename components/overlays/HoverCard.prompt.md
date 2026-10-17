**HoverCard** — hover/focus preview panel (delayed). Rich content (avatar + text), unlike single-line Tooltip.

```jsx
<HoverCard aria-label="Profile preview" trigger={<a href="#">@anle</a>}><b>An Lê</b> · Platform lead</HoverCard>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Existing keyboard selection and editing commands remain local to the widget.

Hover and keyboard focus independently keep the card open. Moving focus within the trigger/panel does not close it; delayed close starts only after both leave. Pending transitions are replaced on a new request and canceled by Escape or unmount.

Escape from interactive panel content returns focus to its focusable trigger without reopening the card. Escape while focus is outside the card leaves that focus in place.

On coarse pointers, direct button, link, or focusable trigger roots preserve a 44 × 44 CSS-pixel target. Text alone is not made focusable; supply a focusable trigger. Custom trigger components must render a focusable root and forward the relevant events and ARIA attributes.

Keyboard: Supply a focusable trigger. This component renders trigger directly and does not create a focusable wrapper for text. Focus and hover keep the delayed panel open independently. Native Tab reaches interactive content; the preview does not trap focus. Escape dismisses and can return panel focus to the trigger. There is no click-to-toggle handler.

Localization: Trigger and preview content are caller-owned; there is no lang prop or built-in copy. The panel has role=dialog. Supply a meaningful aria-labelledby referencing a visible heading, or aria-label naming its purpose. These props name the panel, not the trigger. Child text alone does not name a dialog; this source note does not certify dialog announcements.

Source evidence: `HoverCard.jsx` and `HoverCard.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
