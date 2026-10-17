**Badge** — compact status label. Neutral by default; `solid`/`ochre` for emphasis; `success`/`danger`/`warning`/`info` for state; optional leading `dot`.

```jsx
<Badge variant="success" dot>Shipped</Badge>
<Badge variant="ochre">Now</Badge>
```

Semantic variants pair their fill with its matching `--cs-color-semantic-{role}-fg`; use the separate `-text` role for semantic text on a surface.

Keyboard: The badge adds no keyboard commands; any interactive child owns its own behavior. The dot is decorative.

Localization: Status text is caller-owned; the component adds no translated status label. Keep the meaning in text.

Source evidence: `Badge.jsx` and `Badge.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
