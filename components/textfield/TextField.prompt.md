**TextField** — labelled text input with optional description and inline error. The label is always associated; errors announce via `role="alert"`. Vietnamese diacritics and IME composition are preserved.

```jsx
<TextField label="Work email" type="email" placeholder="you@company.com" />
<TextField label="Tên của bạn" description="Vietnamese diacritics welcome" />
<TextField label="Email" error="Enter a valid email address." defaultValue="nope" />
```

- **label** (required), **description** (helper), **error** (inline + `aria-invalid`).

- Passes through all native `<input>` props (`type`, `placeholder`, `value`, `disabled`, `readOnly`, …).

Caller `aria-describedby` IDs are retained alongside local help/error IDs. A
local `error` forces `aria-invalid=true`; without one, the caller-provided
`aria-invalid` value is preserved. External referenced elements must exist in
the same document.

ReactNode labels and optional content preserve numeric `0`. Optional content still omits `null`, `false` and empty strings. A zero-valued error renders its alert, invalid styling and ARIA references just like a text error.

Keyboard: Uses native input editing, focus, disabled/readOnly and IME behavior; it adds no custom keyboard handler. Provide a visible label and contextual native input attributes.

Localization: Labels, descriptions, errors and placeholder text are caller-owned. It preserves the entered text and does not translate it.

Source evidence: `TextField.jsx` and `TextField.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
