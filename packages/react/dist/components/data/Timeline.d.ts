import type * as React from "react";
import type { ReactNode } from "react";

export interface TimelineItem {
  title: ReactNode;
  meta?: ReactNode;
  body?: ReactNode;
  /** "done" (default, umber/green check), "now" (ochre arrow), "todo" (hollow). */
  state?: "done" | "now" | "todo";
}

/** Vertical event/release trail with a connecting line. */
export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}
export const Timeline: React.ForwardRefExoticComponent<
  TimelineProps & React.RefAttributes<HTMLElement>
>;
