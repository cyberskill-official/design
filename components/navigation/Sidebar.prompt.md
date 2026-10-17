**Sidebar / NavItem** — vertical app-shell navigation. `NavItem` renders `<a>` (href) or `<button>`; `active` shows the ochre-tint current state.

```jsx
<Sidebar label="Workspace">
  <NavItem icon={<Icon name="sparkle" />} active>Overview</NavItem>
  <NavItem trail={<Badge>3</Badge>}>Projects</NavItem>
</Sidebar>
```

Button variants default to `type="button"` so activating an action does not submit an enclosing form. Non-button variants receive no button type.

The Sidebar label and NavItem icon slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: Sidebar adds navigation structure; NavItem uses a native link for a nonempty href or a button otherwise. Tab/Enter follow links; Enter/Space activates buttons. active is caller-controlled and exposes aria-current=page.

Localization: Label, row content, icons and trailing content are caller-owned. The Sidebar label is visible text; provide aria-label or aria-labelledby to name its navigation landmark when needed.

Source evidence: `Sidebar.jsx` and `Sidebar.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
