**Cascader** — column-per-level picker (e.g. TP.HCM / Quận 1).

```jsx
<Cascader value={p} onChange={setP} nodes={[{key:"hcm",label:"TP.HCM",children:[{key:"d1",label:"Quận 1"}]}]}/>
```

The open surface participates in the shared overlay stack: Escape closes it before its parent modal. Keyboard navigation handles events whose targets are inside this widget; native arrows/Home/End in neighboring fields are not consumed while the popup remains open. Trigger opening and option navigation ignore composing/keyCode229 events and events already cancelled by a caller capture handler. These source-bound handler guards do not certify physical OS IME behavior.

Changing `disabled` to true closes the popup and releases its overlay ownership without changing the selected value. Reenabling leaves it closed.

ArrowLeft from a child column restores focus to the selected parent before removing the child column.

Node labels accept React content, including inline rich text and numeric `0`.
The selected path renders those labels directly; it does not stringify React
elements. Visible path separators are hidden from the accessibility tree.

```jsx
<Cascader value={["hcm", "d1"]} onChange={setP}
  nodes={[{key:"hcm", label:<strong>TP.HCM</strong>,
    children:[{key:"d1", label:<em>Quận 1</em>}]}]} />
```

Keyboard: Down/Enter/Space opens the field. After opening, Down from the still-focused trigger enters the first option. While open, Up/Down and Home/End move through options; Right activates the focused option, including leaf selection. Left collapses toward the parent; Escape dismisses. Apply leaf `onChange` paths to `value`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Node labels remain caller-owned.

Source evidence: `Cascader.jsx` and `Cascader.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
