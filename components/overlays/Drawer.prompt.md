**Drawer** — slide-in side panel + scrim (the Status Hub detail pattern). Escape / scrim-click close; `side="left"` for left.

```jsx
<Drawer open={open} onClose={close} title="Design System v1.6"
  actions={<Button>Open project</Button>}>
  <DescriptionList items={meta} />
</Drawer>
```

The rendered title supplies the surface's accessible name, including rich React content. Supply meaningful text; purely decorative title content cannot provide a useful name.

The actions slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: The shared modal layer moves focus, contains Tab and restores owned focus on closure. Escape, scrim and the close button call onClose; the parent must change open. The body is itself focusable for scrollable content.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The default panel/close names are localized. A supplied title names the dialog; title, body and actions remain caller-owned.

Source evidence: `Drawer.jsx` and `Drawer.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.

The slide uses logical margins so fixed nested overlays keep viewport coordinates. Filtered materials keep their fill on the panel and use a decorative sibling filter backing; server markup retains its ordinary material before hydration. Content keeps its DOM language/token scope. These implementation checks do not establish manual AT or product visual acceptance.
