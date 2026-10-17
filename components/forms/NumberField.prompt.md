**NumberField** — numeric stepper with −/+ buttons and min/max clamping. Pass `label` for a visible field name; bilingual decrease/increase/value labels via the registry.

```jsx
<NumberField label="Seats" value={seats} onChange={setSeats} min={1} max={20} />
```

`value` controls the field; without it, internal state updates even when an
`onChange` observer is supplied. Controlled callers must update `value` themselves.

Stepper buttons use the native number input’s decimal and step-base rules,
including `min`/`max`, so fractional steps do not expose binary addition tails.
An off-grid value advances to the next valid native step. A controlled caller
that does not update `value` retains the displayed value after a button click.

Keyboard: Uses native number-input keyboard entry/stepping. Tab also reaches the decrease/increase buttons; Enter/Space invokes native step alignment. Controlled callers update `value`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `NumberField.jsx` and `NumberField.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
