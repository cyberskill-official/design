**Menu / MenuItem** — dropdown anchored to a `trigger`. Uncontrolled (click toggles; outside-click / Escape close) or controlled via `open`/`onOpenChange`. `align="end"` aligns with the trigger’s inline-end edge: right in LTR, left in RTL.

```jsx
<Menu trigger={<button className="cs-button cs-button--secondary cs-button--sm">Actions</button>}>
  <MenuItem>Duplicate</MenuItem>
  <div className="cs-menu__sep" />
  <MenuItem danger>Delete</MenuItem>
</Menu>
```

`open` controls visibility; without it, internal visibility changes even when
`onOpenChange` is supplied. The callback observes the requested next state.

When nested in a modal, Escape dismisses only this open child. Modal Tab trapping resumes after dismissal.

MenuItem icon preserves numeric zero; null, false and empty strings omit the icon slot.

Supply a focusable trigger that forwards its click event. Opening through pointer or keyboard activation focuses that trigger before registering the layer, so Escape can return focus to it across browsers. A trigger handler that prevents the click default cancels opening.

On coarse pointers, built-in text fallbacks and direct button, link, or focusable trigger roots preserve a 44 × 44 CSS-pixel target. Custom trigger components must render a focusable root and forward the relevant events and ARIA attributes.

Keyboard: Native trigger activation toggles the menu and focuses the first enabled menuitem. Up/Down and Home/End move among enabled items, stopping at the ends. Navigation ignores native isComposing, legacy keyCode 229, and events already prevented by a caller handler. These commands apply only to events from the Menu wrapper; after native Tab moves to a neighboring field, its native keys remain available even while the menu stays open. Escape requests closure through the shared layer. MenuItem activation calls its native onClick; it does not automatically close Menu, so a caller needing selection-to-close should control open. Custom triggers must forward events, ARIA and a focusable root.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The built-in copy names the menu region. Trigger and item content remain caller-owned.

Source evidence: `Menu.jsx` and `Menu.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
