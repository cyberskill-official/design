import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";
import type { ReactNode } from "react";

export interface AccordionEntry { title: ReactNode; content: ReactNode; }

/** Collapsible sections. Single-open by default (set allowMultiple to open
 *  several); defaultOpen is the initially-open index (-1 starts closed).
 *  Changing allowMultiple preserves the first opened section; returning to
 *  single mode discards any other open sections. */
export interface AccordionProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  items: AccordionEntry[];
  defaultOpen?: number;
  allowMultiple?: boolean;
  className?: string;
}
export const Accordion: React.ForwardRefExoticComponent<React.PropsWithoutRef<AccordionProps> & React.RefAttributes<HTMLDivElement>>;
