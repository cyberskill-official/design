# Data table

> Sortable, selectable table on TanStack Table v9 with pagination or row virtualization, a sticky header and right-aligned numbers.

```tsx
import { DataTable, RowSelectionState } from '@cyberskill/design/table';
```

For records people scan, sort and act on: invoices, users, deployments. It lives in its own entry, so apps without tables never load TanStack:

```tsx
import { DataTable, createDataTableColumnHelper } from '@cyberskill/design/table';
```

For a short list of label–value pairs, use a description list; for a layout grid, use CSS grid. Do not put forms or long text in cells.

## Sorting

Columns are TanStack Table v9 column definitions. Headers sort on click (text A→Z first, numbers high→low first). Text follows Vietnamese alphabet order, so "Ánh" and "Đặng" come before "Zoe", and numbers inside text sort by value (INV-2 before INV-10); a column's own `sortFn` wins. Turn a column off with `enableSorting: false`. `meta: { numeric: true }` right-aligns a column and sets it in tabular figures so digits line up; `meta: { code: true }` sets codes and IDs in mono and keeps them on one line.

```tsx
type Invoice = { id: string; customer: string; status: string; total: number };
const col = createDataTableColumnHelper<Invoice>();
const columns = col.columns([
  col.accessor('id', { header: 'Invoice', meta: { code: true } }),
  col.accessor('customer', { header: 'Customer' }),
  col.accessor('status', { header: 'Status', enableSorting: false }),
  col.accessor('total', { header: 'Amount', meta: { numeric: true }, cell: (c) => money.format(c.getValue()) }),
]);

<DataTable label="Invoices" columns={columns} data={invoices} getRowId={(r) => r.id} />
```

Keep `columns` stable: define them at module scope or in `useMemo`. Pass `getRowId` with a database id so selection survives sorting and new data.

## Selection and pagination

`selectable` adds a checkbox column; the header checkbox selects the page and shows a dash when only some rows are selected. Selected rows take the soft primary background. `pageSize` paginates on the client and shows the range and a [Pagination](/docs/components/pagination); new data (say, after a filter) goes back to page 1. For server-side paging, pass only the current page as `data` and render `Pagination` yourself.

```tsx
const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

<DataTable
  label="Invoices" columns={columns} data={invoices} getRowId={(r) => r.id} pageSize={8}
  selectable rowSelection={rowSelection} onRowSelectionChange={setRowSelection}
  selectRowLabel={(r) => `Select ${r.id}`}
/>
```

## Clickable rows

`onRowClick` makes each row open something, usually a detail drawer or page. The row takes a click anywhere, or Enter or Space when it has focus (Tab reaches it). Controls inside the row keep their own behavior: a click on a checkbox, button or link never opens the row.

```tsx
const [opened, setOpened] = useState<Invoice | null>(null);

<DataTable
  label="Invoices" columns={columns} data={invoices} getRowId={(r) => r.id}
  selectable selectRowLabel={(r) => `Select ${r.id}`}
  onRowClick={setOpened}
/>
```

## Large data

`virtualized` renders only the rows in view, so thousands of rows scroll smoothly. It scrolls inside `maxHeight` (480px by default) with the header pinned. `maxHeight` alone gives a sticky header without virtualization. `density` is `compact` (36px rows), `default` (44px) or `comfortable` (52px).

```tsx
<DataTable label="All invoices" columns={columns} data={invoices} getRowId={(r) => r.id} virtualized maxHeight={360} density="compact" />
```

## Empty state

```tsx
<DataTable label="Drafts" columns={columns} data={[]} emptyState="No drafts yet. New invoices start here." />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `DataTableColumnDef<T>[]` | – | TanStack v9 column definitions; build them with createDataTableColumnHelper<T>() |
| `data` | `T[]` | – | Rows |
| `label` | `string` | – | Accessible name of the table (and of its scroll region) |
| `getRowId` | `(row, index) => string` | `index` | Stable row id, e.g. the database id |
| `density` | `'compact' \| 'default' \| 'comfortable'` | `'default'` | Row height 36, 44 or 52px |
| `sorting / onSortingChange` | `SortingState / OnChangeFn` | – | Controlled sort state; pass both |
| `selectable` | `boolean` | `false` | Adds the checkbox column |
| `rowSelection / onRowSelectionChange` | `RowSelectionState / OnChangeFn` | – | Controlled selection keyed by row id; pass both |
| `pageSize` | `number` | – | Paginates on the client and shows the footer; changing it re-pages |
| `virtualized` | `boolean` | `false` | Renders only rows in view |
| `maxHeight` | `number \| string` | `480 when virtualized` | Scroll height; the header stays pinned |
| `emptyState` | `ReactNode` | `'No results'` | Shown when there are no rows |
| `onRowClick` | `(row: T) => void` | – | Makes rows clickable and focusable: click, Enter or Space. Clicks on controls inside a cell do not count |
| `selectAllLabel / selectRowLabel` | `string / (row) => string` | `'Select all rows' ('… on this page' with pageSize) / 'Select row'` | Checkbox names |
| `previousPageLabel / nextPageLabel` | `string` | `'Previous page' / 'Next page'` | Previous and next button names |
| `pageLabel` | `(page: number) => string` | ``Page ${n}`` | Name of each page button, e.g. (n) => `Trang ${n}` |
| `paginationLabel` | `string` | ``${label} pages`` | Name of the pagination landmark, e.g. "Invoices pages" |
| `formatRange` | `(from, to, total) => string` | `'1–10 of 214'` | Footer range text |

Column `meta`: `numeric` (right-aligned, tabular figures), `code` (mono, one line). Also exported: `dataTableFeatures` (the TanStack features object), `DataTableColumnDef`, `DataTableColumnMeta`, `SortingState`, `RowSelectionState`.

## Accessibility

- A real `<table>` named by `label`, with column headers. Sortable headers are buttons; the sorted column carries `aria-sort`, and the caret icons are decorative.
- Checkboxes are native, keyboard operable with Space, each named (`selectRowLabel`), with a 44px hit area. The header checkbox reports mixed when some rows are selected.
- The footer is the [Pagination](/docs/components/pagination) component: a named `nav` with page buttons (the current one has `aria-current="page"`) and 44px touch areas. The range text is announced as it changes.
- With `onRowClick`, each row is a Tab stop with a focus ring; Enter or Space opens it. Keep a visible control (a link or button) for actions that are not obvious from the row.
- A scrolling table is a focusable, labelled region so keyboard users can scroll it. Virtualized tables keep `aria-rowcount` and `aria-rowindex`, so screen readers report the true position in the full list.

## Exact types

```ts
export type DataTableProps<TData extends object> = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Keep stable (module scope or `useMemo`); a new array every render rebuilds the table. */
  columns: readonly DataTableColumnDef<TData>[];
  data: readonly TData[];
  /** Accessible name of the table, e.g. "Invoices". */
  label: string;
  /** Stable row id (database id). Needed for selection to survive sorting and new data. Defaults to the row index. */
  getRowId?: (row: TData, index: number) => string;
  density?: DataTableDensity;
  /** Controlled sort state. Pass with `onSortingChange`. Columns opt out with `enableSorting: false`. */
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  /** Adds a checkbox column and a select-all checkbox in the header. */
  selectable?: boolean;
  /** Controlled selection, keyed by row id. Pass with `onRowSelectionChange`. */
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  /** Paginates on the client with this many rows per page and shows the footer. */
  pageSize?: number;
  /** Renders only the rows in view, for thousands of rows. Scrolls inside `maxHeight` (480px by default). */
  virtualized?: boolean;
  /** Scroll height of the table; the header stays pinned while the body scrolls. */
  maxHeight?: number | string;
  /** Shown in place of rows when there is no data. */
  emptyState?: ReactNode;
  /**
   * Makes rows clickable, e.g. to open a detail view: a click on the row, or Enter or Space while it has focus.
   * Clicks on links, buttons, checkboxes and other controls inside a cell run those controls instead.
   */
  onRowClick?: (row: TData) => void;
  /** Accessible name of the header checkbox. Defaults to "Select all rows", or "Select all rows on this page" with `pageSize` (it selects only that page). */
  selectAllLabel?: string;
  /** Accessible name of a row checkbox. Name the row, e.g. `row => \`Select ${row.number}\``. */
  selectRowLabel?: (row: TData) => string;
  previousPageLabel?: string;
  nextPageLabel?: string;
  /** Accessible name of the pagination landmark. Defaults to `${label} pages`, e.g. "Invoices pages". */
  paginationLabel?: string;
  /** Accessible name of each page button, e.g. `(n) => \`Trang ${n}\``. */
  pageLabel?: PaginationProps['pageLabel'];
  /** Footer range text. Defaults to "1–10 of 214". */
  formatRange?: (from: number, to: number, total: number) => string;
};
```
