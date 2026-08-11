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
