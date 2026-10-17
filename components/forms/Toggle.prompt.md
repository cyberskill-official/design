**Toggle** — single pressable on/off button (`aria-pressed`). Standalone state toggle; not a Switch (form) or SegmentedControl (choice set).

```jsx
<Toggle defaultPressed icon={<Icon name="sparkle" size="sm"/>}>Bold</Toggle>
<Toggle pressed={on} onChange={setOn}>Aurora wash</Toggle>
```

Visible child content supplies the accessible name; `aria-label` or
`aria-labelledby` can name icon-only controls. The localized state label is a
fallback only when no child content or explicit name supplies context.
`onClick` observes native mouse and keyboard activation before toggling;
calling `preventDefault()` cancels the state change and `onChange` emission.
Controlled callers must update `pressed`; disabled controls do not activate.

The icon slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: The native button supports Enter/Space. `onClick` runs before the toggle; preventing its default cancels the state change. Controlled callers update `pressed`.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `Toggle.jsx` and `Toggle.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
