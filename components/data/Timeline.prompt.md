**Timeline** — vertical event/release trail. `state`: `done` (check) · `now` (ochre arrow) · `todo` (hollow).

```jsx
<Timeline items={[
  {title:"v1.6.0", meta:"This week", state:"now", body:"Glass bindings"},
  {title:"v1.5.1", meta:"04 Jul 2026", body:"15 element packs"},
]} />
```

Item meta and body preserve numeric zero; null, false and empty strings omit those slots.

Keyboard: The event trail adds no keyboard navigation or selection. Interactive nodes in supplied content retain their own behavior.

Localization: Labels and child content are caller-owned; this component has no built-in translation. The caller supplies event order, state, dates and descriptions; the component does not detect release completion.

Source evidence: `Timeline.jsx` and `Timeline.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
