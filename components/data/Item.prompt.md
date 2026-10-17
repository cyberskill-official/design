**Item** — shared list / settings / nav row chrome. Leading + trailing slots, title + description, selected / disabled, and `href` (link) or `onClick` (button) when interactive.

```jsx
<Item
  title="Release notes"
  description="A summary each time a project ships."
  trailing={<Switch />}
/>
<Item title="Profile" href="#profile" selected />
```

Keyboard: With href, the row uses a native link activated by Enter; without href, onClick uses a native button activated by Enter/Space. Disabled rows become a noninteractive div with aria-disabled. An href takes precedence over the button callback. Avoid nested controls inside an interactive row.

Localization: Labels and child content are caller-owned; this component has no built-in translation. The selected flag sets aria-current; the caller owns the meaning of that selection.

Source evidence: `Item.jsx` and `Item.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
