import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Warm hairline separator. `label` centres text between two rules; `vertical`
 * splits inline content (place inside a flex row).
 */
export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  vertical?: boolean;
  label?: ReactNode;
}

export const Divider: React.ForwardRefExoticComponent<
  DividerProps & React.RefAttributes<HTMLElement>
>;
