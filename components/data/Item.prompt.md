**Item** — shared list / settings / nav row chrome. Leading + trailing slots, title + description, selected / disabled, and `href` (link) or `onClick` (button) when interactive.

```jsx
<Item
  title="Release notes"
  description="A summary each time a project ships."
  trailing={<Switch />}
/>
<Item title="Profile" href="#profile" selected />
```
