**Popconfirm** — inline confirm bubble (alertdialog) on a consequential action; bilingual OK/Cancel via the registry.

```jsx
<Popconfirm title="Delete this draft?" onConfirm={remove}
  trigger={<Button variant="danger-ghost" size="sm">Delete</Button>}/>
```

Escape dismisses this open surface through the shared overlay stack, preserving its parent modal.

The rendered title supplies the surface's accessible name, including rich React content. Supply meaningful text; purely decorative title content cannot provide a useful name.

Supply a focusable trigger that forwards its click event. Opening through pointer or keyboard activation focuses that trigger before registering the layer, so Escape can return focus to it across browsers. A trigger handler that prevents the click default cancels opening.

On coarse pointers, built-in text fallbacks and direct button, link, or focusable trigger roots preserve a 44 × 44 CSS-pixel target. Custom trigger components must render a focusable root and forward the relevant events and ARIA attributes.

Keyboard: Native trigger Enter/Space opens through its click handler. Native Tab reaches confirmation actions; this nonmodal bubble does not trap focus. Escape and outside mousedown dismiss without invoking onCancel; the Cancel button invokes it. Confirm closes before notifying onConfirm. The caller owns the actual operation.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Default OK/Cancel labels are localized. Title, trigger and overrides remain caller-owned. Supply meaningful title text and a focusable trigger forwarding click and ARIA.

Source evidence: `Popconfirm.jsx` and `Popconfirm.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
