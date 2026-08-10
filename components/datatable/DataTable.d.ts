import type { ReactNode } from "react";
import type * as React from "react";

export interface DataTableColumn<Row> {
  key: string;
  header: ReactNode;
  /** Custom cell renderer; defaults to row[key]. */
  render?: (row: Row) => ReactNode;
}

/**
 * Enterprise data table: caption, scoped column headers, per-column render, and
 * an empty state. Dense content — keep it on a solid surface (no glass).
 */
export interface DataTableProps<Row extends Record<string, unknown>> {
  caption?: ReactNode;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  /** Field used as React key. Default "id". */
  rowKey?: keyof Row & string;
  emptyState?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export function DataTable<Row extends Record<string, unknown>>(props: DataTableProps<Row>): React.ReactElement;
