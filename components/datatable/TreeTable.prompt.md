**TreeTable** — expandable nested rows in a table.

```jsx
<TreeTable defaultExpanded={["p"]} columns={[{key:"name",header:"Item"},{key:"pct",header:"Progress"}]}
  nodes={[{key:"p",name:"Platform",pct:"70%",children:[{key:"ds",name:"Design System",pct:"72%"}]}]}/>
```

Expansion buttons expose the localized Expand/Collapse action together with their rendered first-cell label. Supply meaningful first-cell content, including when using a custom renderer. Native Enter/Space activation toggles the row; the action label follows live EN/VI changes without resetting expansion.

The caption slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: Native Tab reaches branch buttons; Enter/Space toggles expansion. This semantic nested-row table adds no APG treegrid arrow navigation. defaultExpanded seeds internal expansion once. Use unique node keys and meaningful first-cell content to name expansion buttons.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Built-in empty and expand/collapse action text is localized. Column headers, caption and all cell content remain caller-owned. Expansion is preserved when language changes.

Source evidence: `TreeTable.jsx` and `TreeTable.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
