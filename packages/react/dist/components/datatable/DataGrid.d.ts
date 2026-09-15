import type { ReactNode } from "react";

/** Advanced table: sortable columns (aria-sort), checkbox row selection,
 *  sticky-header scroll area, bilingual empty/select labels,
 *  optional virtualization + column-order persistence. */
export interface DataGridColumn<R = any> {
  key: string;
  header: ReactNode;
  sortable?: boolean;
  /** Sticky first-column style pin (inline-start). */
  pinned?: boolean;
  /** Custom sort value; defaults to row[key]. */
  sortValue?: (row: R) => string | number;
  render?: (row: R) => ReactNode;
}
export interface DataGridProps<R = any> {
  columns: DataGridColumn<R>[];
  rows: R[];
  rowKey?: string;
  selectable?: boolean;
  selected?: Array<string | number>;
  onSelect?: (keys: Array<string | number>) => void;
  /** Scroll-area max height px. Default 280. */
  height?: number;
  caption?: ReactNode;
  empty?: ReactNode;
  /** Client-side filter query; matches any column value (or filterKeys). */
  filterText?: string;
  /** Column keys to filter when filterText is set. Defaults to all column keys. */
  filterKeys?: string[];
  /** Force row windowing. Also auto-enables when rows >= virtualThreshold. */
  virtual?: boolean;
  /** Auto-virtualize when row count reaches this (default 80). */
  virtualThreshold?: number;
  /** Estimated row height for window math (default 36). */
  rowHeight?: number;
  /** When set, column order is stored under localStorage key cs:datagrid:cols:<persistKey>. */
  persistKey?: string;
  lang?: string;
  className?: string;
}
export const DataGrid: React.ForwardRefExoticComponent<
  DataGridProps & React.RefAttributes<HTMLElement>
>;
