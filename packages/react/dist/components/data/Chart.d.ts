import type { ReactNode } from "react";

/** Token-colored SVG charts: bar | line | spark | pie. Values are spoken via the
 *  aria-label (label defaults to a "label: value" list). */
export interface ChartDatum { label: string; value: number; }
export interface ChartProps {
  type?: "bar" | "line" | "spark" | "pie";
  data: ChartDatum[];
  /** px. Default 160. */
  height?: number;
  /** CSS color. Default accent. */
  color?: string;
  showValues?: boolean;
  label?: string;
  className?: string;
}
export const Chart: React.ForwardRefExoticComponent<
  ChartProps & React.RefAttributes<HTMLElement>
>;
