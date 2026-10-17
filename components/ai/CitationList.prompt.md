**CitationList** — numbered provenance sources for AI output (pairs with AIDisclosureBadge).

Built-in heading follows `lang` → nearest DOM language scope → document language
→ Vietnamese default (`Nguồn` / `Sources`). Override `label` for caller-owned
content, or pass `label={null}` to omit the heading. Citation data is supplied by
the caller; this component does not verify source accuracy or backend authority.

```jsx
<CitationList items={[{title:"release-notes.md"},{title:"Task backlog",source:"Status Hub",href:"#"}]} />
```

The explicit label and item source slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Keyboard: Rows with `href` are native links reached with Tab and activated with Enter; rows without a link have no keyboard action.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated.

Source evidence: `CitationList.jsx` and `CitationList.d.ts` define this contract. These source pointers do not establish manual assistive-technology or consumer acceptance.
