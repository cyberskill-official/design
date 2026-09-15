import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Compact status label. Neutral by default; solid/ochre for emphasis; semantic
 * variants for state. Optional leading dot. Keep the text meaningful — never
 * rely on colour alone.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "solid" | "ochre" | "success" | "danger" | "warning" | "info";
  dot?: boolean;
  children?: ReactNode;
}

export const Badge: React.ForwardRefExoticComponent<
  BadgeProps & React.RefAttributes<HTMLElement>
>;
