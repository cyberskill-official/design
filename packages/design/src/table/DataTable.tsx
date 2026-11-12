import { CaretDown, CaretUp, CaretUpDown } from '@phosphor-icons/react';
import {
  createColumnHelper, createPaginatedRowModel, createSortedRowModel, metaHelper, rowPaginationFeature, rowSelectionFeature, rowSortingFeature,
  sortFn_datetime, tableFeatures, useTable,
  type ColumnDef, type OnChangeFn, type RowSelectionState, type SortFn, type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useLayoutEffect, useMemo, useRef, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { Pagination, type PaginationProps } from '../react/Pagination';
import { cx } from '../utils/cx';

/** Labels the built-in checkbox column reads, passed as table meta so inline label functions never rebuild the columns. */
type DataTableMeta = { selectAllLabel: string; selectRowLabel: (row: any) => string };

export type DataTableColumnMeta = {
  /** Right-aligns the column and sets numbers in tabular mono figures. */
  numeric?: boolean;
  /** Codes and IDs (INV-1043, SKU-88): mono, and never broken across lines at a hyphen. */
  code?: boolean;
};

// Text sorts in Vietnamese order ("Ánh", "Đặng" before "Zoe"), numbers inside it by value (INV-2 before INV-10).
// Registered under both names 'auto' picks for strings; number columns keep the basic comparator and sort descending first.
const collator = new Intl.Collator('vi', { numeric: true });
const sortFn_collate: SortFn<any, any> = (a, b, id) => collator.compare(String(a.getValue(id) ?? ''), String(b.getValue(id) ?? ''));

/** The TanStack Table v9 features DataTable registers: sorting, row selection, pagination and typed column meta. */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_collate, text: sortFn_collate, datetime: sortFn_datetime },
  rowSelectionFeature,
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnMeta: metaHelper<DataTableColumnMeta>(),
  tableMeta: metaHelper<DataTableMeta>(),
});
export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableColumnDef<TData extends object> = ColumnDef<DataTableFeatures, TData, any>;

/** Column helper typed for DataTable: `const col = createDataTableColumnHelper<Invoice>(); col.columns([col.accessor('total', { header: 'Total', meta: { numeric: true } })])`. */
export const createDataTableColumnHelper = <TData extends object>() => createColumnHelper<DataTableFeatures, TData>();

export type DataTableDensity = 'compact' | 'default' | 'comfortable';
const ROW_HEIGHT: Record<DataTableDensity, number> = { compact: 36, default: 44, comfortable: 52 };

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
  /** Read out for the compact `‹ 3 / 6 ›` pagination, e.g. `(p, n) => \`Trang ${p} / ${n}\``. */
  statusLabel?: PaginationProps['statusLabel'];
};

const leafCount = (defs: readonly object[]): number => defs.reduce<number>((n, d) => n + ('columns' in d && Array.isArray(d.columns) ? leafCount(d.columns) : 1), 0);

const selectColumn: DataTableColumnDef<object> = {
  id: '_select',
  enableSorting: false,
  header: ({ table }) => (
    <input
      type="checkbox" className="cs-data-table-check" aria-label={table.options.meta?.selectAllLabel}
      checked={table.getIsAllPageRowsSelected()}
      ref={el => { if (el) el.indeterminate = table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(); }}
      onChange={table.getToggleAllPageRowsSelectedHandler()}
    />
  ),
  cell: ({ row, table }) => (
    <input
      type="checkbox" className="cs-data-table-check" aria-label={table.options.meta?.selectRowLabel(row.original)}
      checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={row.getToggleSelectedHandler()}
    />
  ),
};

const defaultRange = (from: number, to: number, total: number) => `${from}–${to} of ${total}`;
const defaultSelectRowLabel = () => 'Select row';

// What a click inside a clickable row may land on and still belong to a control, not the row (the row itself matches [tabindex]).
const CONTROLS = 'a[href], button, input, select, textarea, label, summary, [role="button"], [role="checkbox"], [role="switch"], [role="link"], [role="menuitem"], [contenteditable="true"], [tabindex]';

/** Sortable, selectable data table on TanStack Table v9, with optional pagination or row virtualization. */
export function DataTable<TData extends object>({
  columns, data, label, getRowId, density = 'default', sorting, onSortingChange, selectable = false, rowSelection, onRowSelectionChange,
  pageSize, virtualized = false, maxHeight = virtualized ? 480 : undefined, emptyState = 'No results', onRowClick,
  selectAllLabel = pageSize ? 'Select all rows on this page' : 'Select all rows', selectRowLabel = defaultSelectRowLabel, previousPageLabel = 'Previous page', nextPageLabel = 'Next page',
  paginationLabel = `${label} pages`, pageLabel, statusLabel, formatRange = defaultRange, className, ...props
}: DataTableProps<TData>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const allColumns = useMemo(() => (selectable ? [selectColumn as DataTableColumnDef<TData>, ...columns] : columns), [columns, selectable]);
  const meta = useMemo(() => ({ selectAllLabel, selectRowLabel }), [selectAllLabel, selectRowLabel]);

  // TanStack treats a present-but-undefined option as set, so controlled pairs are only added when given.
  const table = useTable({
    features: dataTableFeatures,
    columns: allColumns,
    data,
    ...(getRowId && { getRowId }),
    enableRowSelection: selectable,
    meta,
    manualPagination: !pageSize,
    autoResetPageIndex: false, // new data (a refetch, a deleted row) keeps the page; see the clamp below
    initialState: { pagination: { pageIndex: 0, pageSize: pageSize ?? 10 } },
    state: { ...(sorting && { sorting }), ...(rowSelection && { rowSelection }) },
    ...(onSortingChange && { onSortingChange }),
    ...(onRowSelectionChange && { onRowSelectionChange }),
  });

  // initialState is read once; follow later pageSize changes.
  useEffect(() => {
    if (pageSize && pageSize !== table.state.pagination.pageSize) table.setPageSize(pageSize);
  }, [table, pageSize]);

  const rows = table.getRowModel().rows;
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT[density],
    overscan: 10,
    enabled: virtualized,
  });
  const items = virtualized ? virtualizer.getVirtualItems() : [];
  const visible = virtualized ? items.map(item => rows[item.index]!) : rows;
  const padTop = items[0]?.start ?? 0;
  const padBottom = items.length ? virtualizer.getTotalSize() - items[items.length - 1]!.end : 0;

  const { pageIndex, pageSize: size } = table.state.pagination;
  const total = table.getRowCount();
  // Fewer rows than the current page needs (rows deleted on the last page): go to the new last page, before paint.
  const lastPage = Math.max(0, table.getPageCount() - 1);
  useLayoutEffect(() => {
    if (pageSize && pageIndex > lastPage) table.setPageIndex(lastPage);
  }, [table, pageSize, pageIndex, lastPage]);
  // A new sort order starts at page 1 (autoResetPageIndex is off, so this is ours to do).
  const sortKey = JSON.stringify(table.state.sorting);
  const lastSort = useRef(sortKey);
  useLayoutEffect(() => {
    if (lastSort.current === sortKey) return;
    lastSort.current = sortKey;
    table.setPageIndex(0);
  }, [table, sortKey]);
  const from = total ? pageIndex * size + 1 : 0;
  const to = Math.min(pageIndex * size + rows.length, total);
  const scrolls = maxHeight != null;
  const headerGroups = table.getHeaderGroups();

  return (
    <div {...props} className={cx('cs-data-table', className)} data-density={density}>
      <div
        ref={scrollRef} className="cs-data-table-scroll" style={{ maxHeight }}
        {...(scrolls && { tabIndex: 0, role: 'region', 'aria-label': label })}
      >
        <table
          aria-label={label} aria-rowcount={virtualized ? rows.length + headerGroups.length : undefined} data-virtualized={virtualized || undefined}
          // Virtualized tables use a fixed layout so columns don't jump as rows scroll. A floor of 9rem per column makes
          // narrow screens scroll sideways instead of squeezing headers into each other.
          style={virtualized ? { minWidth: `calc(${leafCount(columns)} * 9rem${selectable ? ' + 36px' : ''})` } : undefined}
        >
          <thead>
            {headerGroups.map((group, g) => (
              <tr key={group.id} aria-rowindex={virtualized ? g + 1 : undefined}>
                {group.headers.map(header => {
                  const sorted = header.column.getIsSorted();
                  const numeric = header.column.columnDef.meta?.numeric;
                  return (
                    <th
                      key={header.id} scope="col" colSpan={header.colSpan} data-numeric={numeric || undefined} data-select={header.column.id === '_select' || undefined}
                      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button type="button" className="cs-data-table-sort" onClick={header.column.getToggleSortingHandler()}>
                          <table.FlexRender header={header} />
                          <span className="cs-data-table-sort-icon" data-sorted={sorted || undefined} aria-hidden="true">
                            {sorted === 'asc' ? <CaretUp /> : sorted === 'desc' ? <CaretDown /> : <CaretUpDown />}
                          </span>
                        </button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {padTop > 0 && <tr aria-hidden="true" className="cs-data-table-spacer" style={{ height: padTop }} />}
            {visible.map((row, i) => (
              <tr
                key={row.id} data-selected={row.getIsSelected() || undefined}
                data-index={virtualized ? items[i]!.index : undefined}
                aria-rowindex={virtualized ? items[i]!.index + headerGroups.length + 1 : undefined}
                ref={virtualized ? virtualizer.measureElement : undefined}
                {...(onRowClick && {
                  tabIndex: 0,
                  'data-clickable': '',
                  // closest() reaching the row means no control in between (portalled popups never reach it)
                  onClick: (event: MouseEvent<HTMLTableRowElement>) => (event.target as Element).closest(CONTROLS) === event.currentTarget && onRowClick(row.original),
                  onKeyDown: (event: KeyboardEvent<HTMLTableRowElement>) => {
                    if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
                    event.preventDefault(); // Space would scroll the page
                    onRowClick(row.original);
                  },
                })}
              >
                {row.getAllCells().map(cell => (
                  <td key={cell.id} data-numeric={cell.column.columnDef.meta?.numeric || undefined} data-code={cell.column.columnDef.meta?.code || undefined} data-select={cell.column.id === '_select' || undefined}>
                    <table.FlexRender cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
            {padBottom > 0 && <tr aria-hidden="true" className="cs-data-table-spacer" style={{ height: padBottom }} />}
            {rows.length === 0 && (
              <tr>
                <td colSpan={table.getAllLeafColumns().length} className="cs-data-table-empty">{emptyState}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pageSize != null && (
        <div className="cs-data-table-footer">
          <span className="cs-data-table-range" aria-live="polite">{formatRange(from, to, total)}</span>
          <Pagination
            page={pageIndex + 1} pageCount={Math.max(1, table.getPageCount())} onPageChange={page => table.setPageIndex(page - 1)}
            label={paginationLabel} previousLabel={previousPageLabel} nextLabel={nextPageLabel} pageLabel={pageLabel} statusLabel={statusLabel}
          />
        </div>
      )}
    </div>
  );
}
