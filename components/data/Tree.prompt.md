**Tree** — expandable hierarchy with APG keyboard (ArrowUp/Down move, ArrowRight/Left expand-collapse, Home/End) and single select.

```jsx
<Tree aria-label="Platform navigation" selected={k} onSelect={setK} nodes={[{key:"p",label:"Platform",children:[{key:"ds",label:"Design System"}]}]}/>
```

Focus stays on the semantic treeitem carrying selected/expanded state. Labels
should contain descriptive, non-interactive content; child actions do not belong
inside a node label. Use unique node keys, and supply aria-label or aria-labelledby
for the tree name. Parent item names exclude descendant labels. Pointer twists
expand/collapse without selecting; Enter/Space retain selection plus branch toggle.

Keys may be empty strings or include ordinary JavaScript property names such as `__proto__`; they
remain distinct node identifiers. Coarse-pointer expansion and selection regions
each provide at least 44px targets, including short labels.

Keyboard: Up/Down traverse visible nodes; Home/End reach the ends; Right opens or enters a branch; Left collapses or moves to the parent. Enter/Space requests selection and toggles a branch. selected is caller-controlled; branch state is internal. defaultOpen seeds new branches and preserves existing branch state across updates.

Localization: Node labels and the tree accessible name are caller-owned; there is no lang prop or built-in translation. Labels should be descriptive non-interactive content, with unique keys across the hierarchy.

Source evidence: `Tree.jsx` and `Tree.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
