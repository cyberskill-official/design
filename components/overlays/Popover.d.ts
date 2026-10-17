import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Floating panel anchored to a trigger — richer than Tooltip (holds
 * interactive content). Uncontrolled (click toggles; outside-click / Escape
 * close) or controlled via open/onOpenChange. `align="end"` aligns with the trigger’s inline-end edge: right in LTR, left in RTL.
 */
export interface PopoverProps {
  trigger: ReactNode;
  children?: ReactNode;
  /** Accessible panel name. Supply this or aria-labelledby with meaningful text. */
  "aria-label"?: string;
  /** IDs of visible heading elements that name the panel; takes naming precedence. */
  "aria-labelledby"?: string;
  align?: "start" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}
export function Popover(props: PopoverProps): React.ReactElement;
