import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Labelled KPI/metric with an optional trend delta. Trend sets the delta colour
 * and arrow (up = success, down = danger, flat = muted).
 */
export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  trend?: "up" | "down" | "flat";
}

export const Stat: React.ForwardRefExoticComponent<
  StatProps & React.RefAttributes<HTMLElement>
>;
