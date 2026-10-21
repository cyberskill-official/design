import type { RootTargetProps } from "../_utils/target-props";
/** Item meta and body preserve numeric zero; null, false and empty strings omit those slots. */
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
  /** Attributes for the existing outer div. Internal handlers run before consumer handlers; owned semantics remain controlled. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  className?: string;
}
export const Timeline: React.ForwardRefExoticComponent<React.PropsWithoutRef<TimelineProps> & React.RefAttributes<HTMLDivElement>>;
