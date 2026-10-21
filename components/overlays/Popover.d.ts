import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Floating panel anchored to a trigger — richer than Tooltip (holds
 * interactive content). Uncontrolled (click toggles; outside-click / Escape
 * close) or controlled via open/onOpenChange. `align="end"` aligns with the trigger’s inline-end edge: right in LTR, left in RTL.
 */
export interface PopoverProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start; bottom-end when align="end". Existing align selects bottom-start/end when placement is omitted; viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  trigger: ReactNode;
  children?: ReactNode;
  /** Accessible panel name. Defaults to localized “Details”; supply this or aria-labelledby with meaningful context. */
  "aria-label"?: string;
  /** IDs of visible heading elements that name the panel; takes naming precedence. */
  "aria-labelledby"?: string;
  align?: "start" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Attributes for the existing outer anchor span, not the trigger or dialog panel. Internal handlers run before consumer handlers; owned semantics remain controlled. */
  rootProps?: RootTargetProps<HTMLSpanElement>;
  className?: string;
}
export const Popover: React.ForwardRefExoticComponent<React.PropsWithoutRef<PopoverProps> & React.RefAttributes<HTMLDivElement>>;
