**Select** — labelled native select in the `.cs-field` frame with a custom chevron; same description/error wiring as TextField.

```jsx
<Select label="Squad" options={[{value:"plat",label:"Platform"},{value:"ai",label:"AI"}]} />
<Select label="Locale"><option>EN</option><option>Tiếng Việt</option></Select>
```

Caller `aria-describedby` IDs are retained alongside local help/error IDs. A
local `error` forces `aria-invalid=true`; without one, the caller-provided
`aria-invalid` value is preserved. External referenced elements must exist in
the same document.

`placeholder` supplies text for a disabled, hidden empty-value option. When no option children are supplied, the default is localized; when using option children, an explicit placeholder inserts that option before them. If both data options and children are supplied, data options render, but children still determine whether an implicit placeholder is inserted.

ReactNode labels and optional content preserve numeric `0`. Optional content still omits `null`, `false` and empty strings. A zero-valued error renders its alert, invalid styling and ARIA references just like a text error.

Keyboard: Uses native select keyboard navigation and selection; the chevron has no independent action.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Option labels, field labels, descriptions and errors remain caller-owned.

Source evidence: `Select.jsx` and `Select.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
