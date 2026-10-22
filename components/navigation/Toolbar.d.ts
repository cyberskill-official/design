import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** Visible action labels preserve numeric zero, including the accessible action name. Null, false and empty strings omit the label span. */
import type { ReactNode } from "react";

/** Horizontal action bar (APG toolbar: arrow-key roving among controls).
 *  Items after `overflowAfter` collapse into a ⋯ menubutton + popup menu
 *  (bilingual aria). "-" renders a separator. */
export type ToolbarItem = { label?: ReactNode; icon?: ReactNode; onSelect?: () => void } | "-";
export interface ToolbarProps extends FloatingPanelProps {
  /** Preferred placement: bottom-end. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "role" | "aria-label" | "aria-orientation">;
  items: ToolbarItem[];
  /** Collapse items after this index into the ⋯ menu. */
  overflowAfter?: number;
  /** Accessible toolbar label. */
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Toolbar: React.ForwardRefExoticComponent<React.PropsWithoutRef<ToolbarProps> & React.RefAttributes<HTMLDivElement>>;
