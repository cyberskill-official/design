import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Hover/focus-triggered rich preview panel with open/close delays.
 * Remains open while hovered or focused within; Escape dismisses and returns
 * focus from interactive panel content to its focusable trigger. */
export interface HoverCardProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** Attributes for the existing span root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLSpanElement>;
  trigger: ReactNode;
  children?: ReactNode;
  /** Accessible panel name. Supply this or aria-labelledby with meaningful text. */
  "aria-label"?: string;
  /** IDs of visible heading elements that name the panel; takes naming precedence. */
  "aria-labelledby"?: string;
  /** ms before opening. Default 150. */
  openDelay?: number;
  /** ms before closing. Default 200. */
  closeDelay?: number;
  className?: string;
}
export const HoverCard: React.ForwardRefExoticComponent<React.PropsWithoutRef<HoverCardProps> & React.RefAttributes<HTMLSpanElement>>;
