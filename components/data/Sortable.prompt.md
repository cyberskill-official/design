**Sortable** — reorderable list with move-up/down buttons (keyboard + single-pointer) and optional HTML5 drag. Compose columns of it for a kanban.

```jsx
<Sortable items={tasks} onChange={setTasks} lang="en"/>
```

Buttons expose i18n `aria-label`s (`moveUp` / `moveDown`); first/last controls are disabled.
