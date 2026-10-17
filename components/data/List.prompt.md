**List / ListItem** — vertical list of rows (lead · title/subtitle · trail). `onClick` makes a row an interactive button.

```jsx
<List>
  <ListItem lead={<Avatar name="An Le" size="sm" />} title="An Le" subtitle="Platform" trail={<Badge>Owner</Badge>} />
</List>
```

Button variants default to `type="button"` so activating an action does not submit an enclosing form. Non-button variants receive no button type.

An interactive ListItem renders a native button inside a listitem wrapper, preserving both list structure and button semantics. Classes, DOM props and the click handler remain on the button; static rows remain a single listitem element. Avoid nested interactive controls inside a button row.

Interactive rows preserve a minimum 44 × 44 CSS-pixel target on coarse pointers, including title-only rows. Static list rows keep their existing density.

Keyboard: List adds list semantics. An interactive ListItem places a native Enter/Space button inside a listitem wrapper; static rows are listitems. Avoid nested interactive controls in a button row.

Localization: Labels and child content are caller-owned; this component has no built-in translation. Neither List nor ListItem adds translated row content.

Source evidence: `List.jsx` and `List.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
