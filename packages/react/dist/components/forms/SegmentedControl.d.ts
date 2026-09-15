import type * as React from "react";
import type { ReactNode } from "react";

export interface SegmentOption { value: string; label: ReactNode; icon?: ReactNode; }

/** Pill toggle group for a small set of mutually exclusive options (the Status
 *  Hub board/table/releases switcher). Controlled via value/onChange. */
export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentOption[];
  value?: string;
  onChange?: (value: string) => void;
}
export const SegmentedControl: React.ForwardRefExoticComponent<
  SegmentedControlProps & React.RefAttributes<HTMLElement>
>;
