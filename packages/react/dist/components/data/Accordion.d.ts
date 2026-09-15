import type * as React from "react";
import type { ReactNode } from "react";

export interface AccordionEntry { title: ReactNode; content: ReactNode; }

/** Collapsible sections. Single-open by default (set allowMultiple to open
 *  several); defaultOpen is the initially-open index. */
export interface AccordionProps {
  items: AccordionEntry[];
  defaultOpen?: number;
  allowMultiple?: boolean;
  className?: string;
}
export const Accordion: React.ForwardRefExoticComponent<
  AccordionProps & React.RefAttributes<HTMLElement>
>;
