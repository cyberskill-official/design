**Card** — warm content panel (14px radius, soft shadow). Compose with `CardHeader` / `CardBody` / `CardFooter`. `interactive` defaults to a hoverable button unless `as` overrides the tag; add `className="cs-surface-standard"` for glass over imagery.

```jsx
<Card interactive onClick={open}>
  <CardHeader title="Design System v1.6" subtitle="Platform squad" />
  <CardBody>Liquid Glass bindings + 15 element packs.</CardBody>
  <CardFooter><Badge variant="ochre">Now</Badge></CardFooter>
</Card>
```

Button variants default to `type="button"` so activating an action does not submit an enclosing form. Non-button variants receive no button type.

The CardHeader title and subtitle slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: An interactive Card defaults to a native button with Enter/Space activation. An explicit `as` overrides that tag; the caller then owns appropriate keyboard behavior, focus and semantics. Avoid interactive descendants inside a button card.

Localization: Labels and child content are caller-owned; this component has no built-in translation. CardHeader/Body/Footer render caller content without translating it.

Source evidence: `Card.jsx` and `Card.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
