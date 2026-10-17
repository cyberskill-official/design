**SearchField** — pill search input with icon + clear button.

```jsx
<SearchField value={q} onChange={setQ} placeholder="Search projects…" />
```

`value` controls the field; without it, internal state updates even when an
`onChange` observer is supplied. Controlled callers must update `value` themselves.

`defaultValue` initializes uncontrolled state once; later changes do not reset
the user's query. Both `disabled` and `readOnly` prevent typing and clearing,
including `onChange`/`onClear` callbacks. Parent-controlled `value` updates still
render while locked. Reenabling the field restores the clear action.

Keyboard: Uses native text editing. The clear button supports Enter/Space and is disabled with the input’s disabled/readOnly state. Supply an accessible name through native input props.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `SearchField.jsx` and `SearchField.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
