import type * as React from "react";
import type { ReactNode } from "react";

/** Coloured status dot + label. Optional pulse for live/online states. Always
 *  spell the status out in the label — never colour alone. */
export interface StatusIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: "online" | "busy" | "offline" | "error";
  pulse?: boolean;
  children?: ReactNode;
}
export const StatusIndicator: React.ForwardRefExoticComponent<
  StatusIndicatorProps & React.RefAttributes<HTMLElement>
>;
