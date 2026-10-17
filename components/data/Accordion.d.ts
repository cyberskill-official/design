import type * as React from "react";
import type { ReactNode } from "react";

export interface AccordionEntry { title: ReactNode; content: ReactNode; }

/** Collapsible sections. Single-open by default (set allowMultiple to open
 *  several); defaultOpen is the initially-open index (-1 starts closed).
 *  Changing allowMultiple preserves the first opened section; returning to
 *  single mode discards any other open sections. */
export interface AccordionProps {
  items: AccordionEntry[];
  defaultOpen?: number;
  allowMultiple?: boolean;
  className?: string;
}
export function Accordion(props: AccordionProps): React.ReactElement;
