/** Option icons preserve numeric 0; null, false and empty strings omit the icon slot. */
import type * as React from "react";
import type { ReactNode } from "react";

export interface SegmentOption { value: string; label: ReactNode; icon?: ReactNode;
  /** Unique option ID. In tabs mode, also referenced by the panel's aria-labelledby. */
  id?: string;
  /** Optional caller-owned controlled region. In tabs mode this is the tabpanel ID. */
  "aria-controls"?: string;
 }

/** Pill toggle group for a small set of mutually exclusive options (the Status
 *  Hub board/table/releases switcher). Controlled via value/onChange. */
export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "role"> {
  /** Value picker by default; tabs mode preserves caller-rendered tab panels.
   * Planned-major semantic change; this does not add native form serialization.
   * @default "radio" */
  mode?: "radio" | "tabs";
  /** @deprecated Use mode instead. When mode is omitted, tablist selects tabs
   * and radiogroup selects radio; an explicit mode takes precedence.
   * Retained pending the published-minor and elapsed-notice removal policy. */
  role?: "tablist" | "radiogroup";
  options: SegmentOption[];
  /** Vertical uses Up/Down; horizontal uses Left/Right. Caller supplies matching visual layout. */
  "aria-orientation"?: "horizontal" | "vertical";
  value?: string;
  onChange?: (value: string) => void;
}
export const SegmentedControl: React.ForwardRefExoticComponent<React.PropsWithoutRef<SegmentedControlProps> & React.RefAttributes<HTMLDivElement>>;
