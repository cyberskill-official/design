**Textarea** — multi-line input in the `.cs-field` frame; description + error like TextField, vertically resizable.

```jsx
<Textarea label="Tell us your wish" description="A sentence or two is plenty." rows={4} />
```

Caller `aria-describedby` IDs are retained alongside local help/error IDs. A
local `error` forces `aria-invalid=true`; without one, the caller-provided
`aria-invalid` value is preserved. External referenced elements must exist in
the same document.

ReactNode labels and optional content preserve numeric `0`. Optional content still omits `null`, `false` and empty strings. A zero-valued error renders its alert, invalid styling and ARIA references just like a text error.

Keyboard: Uses native multiline editing and IME behavior; Enter inserts a newline. The wrapper adds no submission key handler.

Localization: Visible labels and content are caller-owned; there is no built-in translation for them.

Source evidence: `Textarea.jsx` and `Textarea.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
