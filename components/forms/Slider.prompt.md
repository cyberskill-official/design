**Slider** — brand-tinted native range input.

```jsx
<Slider min={0} max={100} value={v} onChange={e => setV(+e.target.value)} />
```

Keyboard: Uses native range-input keyboard behavior for min/max/step. Provide a contextual accessible name using native ARIA props.

Localization: The default accessible label follows explicit `lang` or inherited EN/VI scope; supplied ARIA naming and other content remain caller-owned.

Source evidence: `Slider.jsx` and `Slider.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
