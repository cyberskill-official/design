**NumberField** — numeric stepper with −/+ buttons and min/max clamping. Pass `label` for a visible field name; bilingual decrease/increase/value labels via the registry.

```jsx
<NumberField label="Seats" value={seats} onChange={setSeats} min={1} max={20} />
```
