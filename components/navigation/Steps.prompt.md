**Steps** — horizontal progress stepper. Steps before `current` are done, `current` is active.

```jsx
<Steps current={1} steps={[{title:"Make a wish"},{title:"Shape it"},{title:"Build"},{title:"Last"}]} />
```

The active list item exposes `aria-current="step"`. Set `current` to the number of steps for a fully completed sequence with no active item. Marker/body ReactNode values preserve numeric zero; nullish markers fall back to the one-based number.

Keyboard: The progress list adds no keyboard navigation or activation. The caller supplies current; current equal to steps.length marks all steps done.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Step titles, bodies and custom markers are caller-owned. Markers are display content; the component does not track completion itself.

Source evidence: `Steps.jsx` and `Steps.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
