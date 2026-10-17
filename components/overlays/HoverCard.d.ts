import type { ReactNode } from "react";

/** Hover/focus-triggered rich preview panel with open/close delays.
 * Remains open while hovered or focused within; Escape dismisses and returns
 * focus from interactive panel content to its focusable trigger. */
export interface HoverCardProps {
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
export function HoverCard(props: HoverCardProps): React.ReactElement;
