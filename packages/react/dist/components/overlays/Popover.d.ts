import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Floating panel anchored to a trigger — richer than Tooltip (holds
 * interactive content). Uncontrolled (click toggles; outside-click / Escape
 * close) or controlled via open/onOpenChange. `align="end"` right-aligns.
 */
export interface PopoverProps {
  trigger: ReactNode;
  children?: ReactNode;
  align?: "start" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}
export const Popover: React.ForwardRefExoticComponent<
  PopoverProps & React.RefAttributes<HTMLElement>
>;
