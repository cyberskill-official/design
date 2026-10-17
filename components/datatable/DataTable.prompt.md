**DataTable** — semantic table with a caption, scoped column headers, per-column `render`, and an async triad (`idle` / `loading` / `error`). Dense content, so it stays on a solid surface (never glass). Use `state` when the host owns a fetch — do not show empty while loading.

```jsx
<DataTable
  caption="Releases"
  columns={[
    { key: "ver", header: "Version" },
    { key: "date", header: "Ships" },
    { key: "status", header: "Status", render: (r) => <span className={`pill ${r.tone}`}>{r.status}</span> },
  ]}
  rows={releases}
  rowKey="ver"
  state={status} /* "idle" | "loading" | "error" */
  emptyState="No releases yet"
/>
```

The caption in idle and default loading tables slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

The default loading view rounds finite fractional `loadingRows` down with a minimum of one. Nonfinite or unrepresentable counts use five; caller-provided `loadingState` remains authoritative.

Keyboard: This semantic table adds no navigation handler; native Tab reaches controls supplied in cells. The caller owns fetching, state and any retry actions. Loading sets aria-busy and renders hidden loading text; it does not establish a polite live region. Error uses role=alert around the supplied/default error content.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Built-in empty/loading/error copy is localized. Headers, captions, cell content and state overrides remain caller-owned. Provide unique stable rowKey values; default keys fall back to row indices.

Source evidence: `DataTable.jsx` and `DataTable.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
