import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Token-colored SVG charts: bar | line | spark | pie. Values are spoken via the
 *  aria-label (label defaults to a "label: value" list). */
export interface ChartDatum { label: string; value: number; }
export interface ChartProps {
  /** Attributes for the existing figure root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLElement>, "role" | "aria-label">;
  type?: "bar" | "line" | "spark" | "pie";
  /** Pie: a positive full-total datum draws a circle; zero-valued data have no sector. Legend/name retain all data. */
  data: ChartDatum[];
  /** px. Default 160. */
  height?: number;
  /** CSS color. Default accent. */
  color?: string;
  showValues?: boolean;
  /** Nonblank accessible name override. Otherwise derives from data; empty data uses localized no-data text. */
  label?: string;
  /** EN/VI no-data text: explicit lang, nearest language scope, document, Vietnamese default. */
  lang?: string;
  className?: string;
}
export const Chart: React.ForwardRefExoticComponent<React.PropsWithoutRef<ChartProps> & React.RefAttributes<HTMLElement>>;
