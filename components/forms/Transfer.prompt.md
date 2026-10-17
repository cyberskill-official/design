**Transfer** — move checked items between source/target lists (bilingual titles).

```jsx
<Transfer items={[{key:"a",label:"Web app"}]} value={sel} onChange={setSel}/>
```

`value` is the caller-controlled list of target keys; apply `onChange` to move
items. Checkbox selection is internal and survives ordinary rerenders. Removing
an item clears its internal selection; move callbacks never add absent checked
items. Existing target keys remain caller-owned. Use unique string item keys.

Source and target lists share the available width around the move buttons.
Labels wrap inside narrow lists; coarse-pointer row and move targets retain
their 44px minimum without imposing two fixed-width columns on the page.

Keyboard: Tab reaches native row checkboxes and move buttons; Space toggles a row and Enter/Space activates a move. Apply `onChange` to the caller-controlled target keys.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Custom titles and item labels remain caller-owned.

Source evidence: `Transfer.jsx` and `Transfer.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
