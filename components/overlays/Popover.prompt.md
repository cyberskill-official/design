**Popover** — floating panel with interactive content, anchored to a trigger. Uncontrolled or controlled; `align="end"` aligns with the trigger’s inline-end edge: right in LTR, left in RTL.

```jsx
<Popover aria-label="Filter status" trigger={<button className="cs-button cs-button--secondary cs-button--sm">Filter</button>}>
  <RadioGroup legend="Status" options={statusOptions} value={s} onChange={setS} />
</Popover>
```

`open` controls visibility; without it, internal visibility changes even when
`onOpenChange` is supplied. The callback observes the requested next state.

When nested in a modal, Escape dismisses only this open child. Modal Tab trapping resumes after dismissal.

Supply a focusable trigger that forwards its click event. Opening through pointer or keyboard activation focuses that trigger before registering the layer, so Escape can return focus to it across browsers. A trigger handler that prevents the click default cancels opening.

On coarse pointers, built-in text fallbacks and direct button, link, or focusable trigger roots preserve a 44 × 44 CSS-pixel target. Custom trigger components must render a focusable root and forward the relevant events and ARIA attributes.

Keyboard: Native trigger activation requests visibility; native Tab reaches panel content. This nonmodal panel does not trap focus or automatically focus its contents. Escape and outside mousedown request closure. Controlled open requires the caller to apply onOpenChange. The trigger must forward click and ARIA; preventDefault cancels toggling.

Localization: Trigger and panel content are caller-owned; there is no lang prop or built-in translated copy. The panel has role=dialog. Supply a meaningful aria-labelledby referencing a visible heading, or aria-label naming its purpose. These props name the panel, not the trigger. Child text alone does not name a dialog; this note does not certify dialog announcements.

Source evidence: `Popover.jsx` and `Popover.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
