**Divider** — warm hairline separator. `label` centres text between two rules; `vertical` splits inline content in a flex row.

```jsx
<Divider />
<Divider label="or" />
```

The labelled divider preserves numeric zero. Null, false and an empty string use the unlabelled rule. A rendered label takes precedence over the vertical-rule branch.

Keyboard: The separator adds no keyboard action. A rendered label uses the labelled horizontal branch; `vertical` applies to the unlabelled rule.

Localization: Label content is caller-owned; this component has no built-in translation. Supply visible content through `label`; `children` are not rendered.

Source evidence: `Divider.jsx` and `Divider.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
