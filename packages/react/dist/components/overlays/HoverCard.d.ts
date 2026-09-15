import type { ReactNode } from "react";

/** Hover/focus-triggered rich preview panel with open/close delays. */
export interface HoverCardProps {
  trigger: ReactNode;
  children?: ReactNode;
  /** ms before opening. Default 150. */
  openDelay?: number;
  /** ms before closing. Default 200. */
  closeDelay?: number;
  className?: string;
}
export const HoverCard: React.ForwardRefExoticComponent<
  HoverCardProps & React.RefAttributes<HTMLElement>
>;
