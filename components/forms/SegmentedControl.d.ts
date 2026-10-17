/** Option icons preserve numeric 0; null, false and empty strings omit the icon slot. */
import type * as React from "react";
import type { ReactNode } from "react";

export interface SegmentOption { value: string; label: ReactNode; icon?: ReactNode;
  /** Unique tab ID, also referenced by the panel's aria-labelledby. */
  id?: string;
  /** ID of the caller-rendered panel controlled by this tab. */
  "aria-controls"?: string;
 }

/** Pill toggle group for a small set of mutually exclusive options (the Status
 *  Hub board/table/releases switcher). Controlled via value/onChange. */
export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SegmentOption[];
  /** Vertical uses Up/Down; horizontal uses Left/Right. Caller supplies matching visual layout. */
  "aria-orientation"?: "horizontal" | "vertical";
  value?: string;
  onChange?: (value: string) => void;
}
export function SegmentedControl(props: SegmentedControlProps): React.ReactElement;
