**Collapsible** — light single-panel expand without Accordion chrome. Keyboard-accessible trigger with `aria-expanded`.

```jsx
<Collapsible title="Advanced" defaultOpen={false}>
  <p>Policy details…</p>
</Collapsible>
```

Keyboard: Native Enter/Space toggles the button; the named region mounts only when open. title takes precedence over trigger when non-null. open with onOpenChange is controlled; defaultOpen seeds uncontrolled state. Use a descriptive non-interactive button label.

Localization: Trigger and panel content are caller-owned; there is no lang prop or built-in translated copy.

Source evidence: `Collapsible.jsx` and `Collapsible.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
