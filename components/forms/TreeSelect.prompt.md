**TreeSelect** — field + popover Tree; leaf picks set the value.

```jsx
<TreeSelect value={k} onChange={setK} nodes={[{key:"p",label:"Platform",children:[{key:"ds",label:"Design System"}]}]}/>
```

Escape dismisses this open surface through the shared overlay stack, preserving its parent modal.

Changing `disabled` to true closes the popup and releases its overlay ownership without changing the selected value. Reenabling leaves it closed.

Keyboard: Enter/Space opens the field. Tree uses Up/Down, Home/End, Right to expand/enter and Left to collapse/return; Enter/Space selects a leaf or toggles a branch. Escape dismisses the popup. The consumer commits leaf selections through `value`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Tree node labels remain caller-owned.

Source evidence: `TreeSelect.jsx` and `TreeSelect.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
