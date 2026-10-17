**Pagination** — prev/next + numbered pages with automatic ellipsis. Controlled via `page`/`pageCount`/`onChange`.

```jsx
<Pagination page={p} pageCount={12} onChange={setP} />
```

Keyboard: Tab reaches native page buttons; Enter/Space proposes an onChange page. The parent updates page. Supply a positive whole pageCount and a whole page in its range; this component does not normalize invalid caller state.

Localization: Built-in EN/VI copy follows explicit `lang` or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Numeric page labels use their fixed number values; the region and previous/next button names are localized.

Source evidence: `Pagination.jsx` and `Pagination.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
