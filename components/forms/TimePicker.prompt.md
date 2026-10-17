**TimePicker** — 24h time select in fixed steps (VN-friendly 24h clock).

```jsx
<TimePicker value={time} onChange={setTime} step={15}/>
```

`step` is a whole number of minutes from 1 through 1440. Other values use the
30-minute default, so the list has at most 1440 options and every value remains
`HH:MM`. A nondividing step such as 7 stops at the final interval before midnight.
The `value`/`onChange` contract remains parent-controlled.

Keyboard: Uses native select keyboard navigation. `onChange` proposes an HH:MM value; the parent updates `value`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. The generated option values retain the fixed 24-hour HH:MM format.

Source evidence: `TimePicker.jsx` and `TimePicker.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
