**Checkbox** — native checkbox tinted with the brand accent-color, with label + optional description.

```jsx
<Checkbox label="Email me release notes" defaultChecked />
<Checkbox label="Bilingual export" description="Ship EN + VN together" />
```

ReactNode labels and optional content preserve numeric `0`. Optional content still omits `null`, `false` and empty strings.

Keyboard: Uses native checkbox focus and Space toggling; the wrapping label associates the supplied text with the input. Disabled behavior follows the native input.

Localization: Visible labels and content are caller-owned; there is no built-in translation for them.

Source evidence: `Checkbox.jsx` and `Checkbox.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
