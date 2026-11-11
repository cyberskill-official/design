import { CaretDown, CaretLeft, CaretRight, CaretUp, CaretUpDown } from '@phosphor-icons/react';
import {
  createColumnHelper, createPaginatedRowModel, createSortedRowModel, metaHelper, rowPaginationFeature, rowSelectionFeature, rowSortingFeature,
  sortFn_alphanumeric, sortFn_datetime, sortFn_text, tableFeatures, useTable,
  type ColumnDef, type OnChangeFn, type RowSelectionState, type SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { IconButton } from '../react/Button';
import { cx } from '../utils/cx';

/** Labels the built-in checkbox column reads, passed as table meta so inline label functions never rebuild the columns. */
type DataTableMeta = { selectAllLabel: string; selectRowLabel: (row: any) => string };

export type DataTableColumnMeta = {
  /** Right-aligns the column and sets numbers in tabular mono figures. */
  numeric?: boolean;
};

/** The TanStack Table v9 features DataTable registers: sorting, row selection, pagination and typed column meta. */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, datetime: sortFn_datetime },
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
  selectAllLabel?: string;
  /** Accessible name of a row checkbox. Name the row, e.g. `row => \`Select ${row.number}\``. */
  selectRowLabel?: (row: TData) => string;
  previousPageLabel?: string;
  nextPageLabel?: string;
  /** Footer range text. Defaults to "1–10 of 214". */
  formatRange?: (from: number, to: number, total: number) => string;
};

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

/** Sortable, selectable data table on TanStack Table v9, with optional pagination or row virtualization. */
export function DataTable<TData extends object>({
  columns, data, label, getRowId, density = 'default', sorting, onSortingChange, selectable = false, rowSelection, onRowSelectionChange,
  pageSize, virtualized = false, maxHeight = virtualized ? 480 : undefined, emptyState = 'No results',
  selectAllLabel = 'Select all rows', selectRowLabel = () => 'Select row', previousPageLabel = 'Previous page', nextPageLabel = 'Next page',
  formatRange = defaultRange, className, ...props
}: DataTableProps<TData>) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const allColumns = useMemo(() => (selectable ? [selectColumn as DataTableColumnDef<TData>, ...columns] : columns), [columns, selectable]);

  // TanStack treats a present-but-undefined option as set, so controlled pairs are only added when given.
  const table = useTable({
    features: dataTableFeatures,
    columns: allColumns,
    data,
    ...(getRowId && { getRowId }),
    enableRowSelection: selectable,
    meta: { selectAllLabel, selectRowLabel },
    manualPagination: !pageSize,
    initialState: { pagination: { pageIndex: 0, pageSize: pageSize ?? 10 } },
    state: { ...(sorting && { sorting }), ...(rowSelection && { rowSelection }) },
    ...(onSortingChange && { onSortingChange }),
    ...(onRowSelectionChange && { onRowSelectionChange }),
  });

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
  const from = total ? pageIndex * size + 1 : 0;
  const to = Math.min(pageIndex * size + rows.length, total);
  const scrolls = maxHeight != null;

  return (
    <div {...props} className={cx('cs-data-table', className)} data-density={density}>
      <div
        ref={scrollRef} className="cs-data-table-scroll" style={{ maxHeight }}
        {...(scrolls && { tabIndex: 0, role: 'region', 'aria-label': label })}
      >
        <table aria-label={label} aria-rowcount={virtualized ? rows.length + 1 : undefined} data-virtualized={virtualized || undefined}>
          <thead>
            {table.getHeaderGroups().map(group => (
              <tr key={group.id} aria-rowindex={virtualized ? 1 : undefined}>
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
                aria-rowindex={virtualized ? items[i]!.index + 2 : undefined}
                ref={virtualized ? virtualizer.measureElement : undefined}
              >
                {row.getAllCells().map(cell => (
                  <td key={cell.id} data-numeric={cell.column.columnDef.meta?.numeric || undefined} data-select={cell.column.id === '_select' || undefined}>
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
          <span className="cs-data-table-pager">
            {/* aria-disabled, not disabled: focus stays on the button when the last page is reached */}
            <IconButton label={previousPageLabel} icon={<CaretLeft />} size="sm" variant="ghost" aria-disabled={!table.getCanPreviousPage() || undefined} onClick={() => table.getCanPreviousPage() && table.previousPage()} />
            <IconButton label={nextPageLabel} icon={<CaretRight />} size="sm" variant="ghost" aria-disabled={!table.getCanNextPage() || undefined} onClick={() => table.getCanNextPage() && table.nextPage()} />
          </span>
        </div>
      )}
    </div>
  );
}
