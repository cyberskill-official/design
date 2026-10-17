**DataGrid** — sortable + selectable table with sticky header.

```jsx
<DataGrid selectable selected={sel} onSelect={setSel} rowKey="key"
  columns={[{key:"name",header:"Project",sortable:true},{key:"pct",header:"Progress",sortable:true}]} rows={rows}/>
```

**filterText / filterKeys / pinned:** client filter query, optional key subset, and sticky column pin.

**virtual / virtualThreshold / rowHeight:** windowed body rows for large datasets (auto when rows ≥ 80). Sets `data-virtual="true"`, `data-row-count` and the resolved `data-row-height`. The positive `rowHeight` estimate is a minimum: window math and rendered row floors use the natural height of mounted rows when larger. Measurement reacts to resizing, ancestor styling, fonts and pointer mode, so touch controls cannot silently outgrow the spacer calculation. Uniform rows are recommended; unseen variable-height content is still estimated.

**persistKey:** stores column order in `localStorage` under `cs:datagrid:cols:<persistKey>`; pin control reorders a column to first.

When rows or filtered results shrink, virtualization clamps the visible window to the remaining rows instead of leaving stale spacer padding and a blank body. Empty data uses the normal empty state; later data can render again without remounting the grid.

The caption slots preserve numeric `0`; `null`, `false` and empty strings continue to omit those slots.

Each row selection checkbox includes its first nonempty string cell value (or row key as fallback) in its localized accessible name.

Column pin actions reference the rendered header and localized action text.
ReactNode headers retain their accessible text rather than becoming object
strings; a missing header uses the column key. IDs are unique per grid and names
follow header, language and column-order updates.

Keyboard: This is a semantic table with native sorting buttons and selection checkboxes, rather than an arrow-key grid widget. Enter/Space cycles a sortable column ascending, descending and unsorted, or toggles a checkbox. The caller applies selected/onSelect and supplies unique stable rowKey values for selectable rows. Select-all acts on the filtered set and clears the selection when that set is fully selected.

Localization: Built-in EN/VI copy follows explicit lang or the inherited DOM language scope (Vietnamese fallback). Caller-supplied content is not translated. Empty/select/pin action text is built in. Column headers, captions, rendered cells and custom empty content remain caller-owned. Sorting compares supplied values; filtering lowercases raw values rather than localized rendered cell text. Use uniform row heights for windowing; unseen variable heights remain estimates.

Source evidence: `DataGrid.jsx` and `DataGrid.d.ts` define this contract. These pointers do not establish manual assistive-technology or operator acceptance.
