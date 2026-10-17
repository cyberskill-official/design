**Accordion** — collapsible sections; single-open by default (`allowMultiple` to open several).

`defaultOpen` is an initial index; use `-1` to start closed. Changing
`allowMultiple` preserves the first opened section. Switching to single-open
discards other open sections, so they do not reappear on a later mode switch.

```jsx
<Accordion items={[{title:"What is a wish?",content:"A clear outcome…"}]} />
```

Keyboard: Native Tab reaches each section button; Enter/Space toggles it. Closed panel content is unmounted. defaultOpen seeds state once; changing items does not reset it. Titles must name the buttons and should contain no nested interactive control.

Localization: Titles and panel content are caller-owned; this component has no lang prop or built-in translated copy.

Source evidence: `Accordion.jsx` and `Accordion.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
