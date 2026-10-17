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
  className?: string;
}
export function Timeline(props: TimelineProps): React.ReactElement;
