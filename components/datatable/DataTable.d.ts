import type { RootTargetProps } from "../_utils/target-props";
/** The caption in idle and default loading tables slots preserve numeric zero; null/false/empty string omit those slots. */
import type { ReactNode } from "react";
import type * as React from "react";

export interface DataTableColumn<Row> {
  key: string;
  header: ReactNode;
  /** Custom cell renderer; defaults to row[key]. */
  render?: (row: Row) => ReactNode;
}

/**
 * Async triad for collection surfaces (FIND-020). Prefer composing existing
 * feedback: Skeleton for loading, Result for error, emptyState for idle empty.
 * Idle is the default — omit `state` for static tables.
 */
export type DataTableState = "idle" | "loading" | "error";

/**
 * Enterprise data table: caption, scoped column headers, per-column render, and
 * idle / loading / error / empty states. Dense content — keep it on a solid
 * surface (no glass).
 */
export interface DataTableProps<Row extends Record<string, unknown>> {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "aria-busy" | "role">;
  caption?: ReactNode;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  /** Field used as React key. Default "id". */
  rowKey?: keyof Row & string;
  emptyState?: ReactNode;
  /**
   * Async data ownership. Default `"idle"`.
   * - `loading` — Skeleton rows (or `loadingState`) + aria-busy and hidden loading text
   * - `error` — Result (or `errorState`) with `role="alert"`
   * - `idle` — rows or empty cell
   */
  state?: DataTableState;
  /** Override the default Result error view. */
  errorState?: ReactNode;
  /** Override the default Skeleton-row loading view. */
  loadingState?: ReactNode;
  /** Whole skeleton-row count for the default loading view. Finite fractions round down, minimum 1. Nonfinite or unrepresentable counts use 5. */
  loadingRows?: number;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export function DataTable<Row extends Record<string, unknown>>(props: DataTableProps<Row> & React.RefAttributes<HTMLDivElement>): React.ReactElement;
