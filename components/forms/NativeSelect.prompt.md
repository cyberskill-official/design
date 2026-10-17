**NativeSelect** — progressive-enhancement native `<select>` styled to CS tokens beside Select. Supports `size`, label, and inline error.

```jsx
<NativeSelect
  label="Squad"
  size="sm"
  options={[{value:"plat",label:"Platform"},{value:"ai",label:"AI"}]}
  defaultValue="ai"
/>
```

Caller `aria-describedby` IDs are retained alongside the local error ID.
There is no built-in help/description slot; provide any help element in the
consumer document and reference it with `aria-describedby`. A
local `error` forces `aria-invalid=true`; without one, the caller-provided
`aria-invalid` value is preserved. External referenced elements must exist in
the same document.

ReactNode labels and optional content preserve numeric `0`. Optional content still omits `null`, `false` and empty strings. A zero-valued error renders its alert, invalid styling and ARIA references just like a text error.

Keyboard: Uses native select focus, navigation and selection; browser/OS popup behavior remains native.

Localization: Labels, options and errors are caller-owned; this wrapper has no localized placeholder or default option list.

Source evidence: `NativeSelect.jsx` and `NativeSelect.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
