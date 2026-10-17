**Sortable** — reorderable list with move-up/down buttons (keyboard + single-pointer) and optional HTML5 drag. Compose columns of it for a kanban.

```jsx
<Sortable items={tasks} onChange={setTasks} lang="en"/>
```

Buttons expose i18n `aria-label`s (`moveUp` / `moveDown`); first/last controls are disabled.

A drop on another item commits one reordered list. Ending or cancelling a drag without a drop clears hover/drag presentation and emits no change. Move buttons remain the keyboard-accessible alternative.

Keyboard: Native Tab reaches enabled move buttons; Enter/Space requests one adjacent reorder. The caller must apply onChange to items and provide unique keys. HTML5 drag is an enhancement; no change is emitted without a completed drop. Reorder helper indices should be valid whole numbers.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Item labels remain caller-owned. The built-in move labels name directions; this source does not add a live announcement of the new position.

Source evidence: `Sortable.jsx` and `Sortable.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
