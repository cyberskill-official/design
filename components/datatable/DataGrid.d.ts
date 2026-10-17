/** Row selection names include first text-cell content or the row key. */
/** The caption slots preserve numeric zero; null/false/empty string omit those slots. */
import type { ReactNode } from "react";

/** Advanced table: sortable columns (aria-sort), checkbox row selection,
 *  sticky-header scroll area, bilingual empty/select labels,
 *  optional virtualization + column-order persistence. */
export interface DataGridColumn<R = any> {
  key: string;
  /** Rendered column label; pin actions reference its accessible text without stringifying React nodes. */
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
  /** Force row windowing. Also auto-enables when rows >= virtualThreshold.
   * The visible window is clamped when rows or filtered results shrink. */
  virtual?: boolean;
  /** Auto-virtualize when row count reaches this (default 80). */
  virtualThreshold?: number;
  /** Minimum row-height estimate (default 36). Window math uses at least the
   * natural height of mounted rows, including coarse-pointer controls.
   * Uniform rows are recommended; arbitrary unseen variable heights remain estimated. */
  rowHeight?: number;
  /** When set, column order is stored under localStorage key cs:datagrid:cols:<persistKey>. */
  persistKey?: string;
  lang?: string;
  className?: string;
}
export function DataGrid(props: DataGridProps): React.ReactElement;
