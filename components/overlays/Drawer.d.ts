import type { RootTargetProps } from "../_utils/target-props";
/** The actions slots preserve numeric zero; null/false/empty string omit those slots. */
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Slide-in side panel with a scrim (the Status Hub detail-drawer pattern).
 * Escape / scrim-click close. Put Buttons in `actions`. `side="left"` slides
 * from the left.
 */
export interface DrawerProps {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  side?: "right" | "left";
  children?: ReactNode;
  actions?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  /** Attributes for the existing dialog panel div. Internal handlers run before consumer handlers; owned semantics remain controlled. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "role" | "tabIndex" | "aria-modal" | "aria-labelledby" | "aria-label" | "data-cs-overlay-material"> & { "data-cs-overlay-material"?: never };
  className?: string;
}
export const Drawer: React.ForwardRefExoticComponent<React.PropsWithoutRef<DrawerProps> & React.RefAttributes<HTMLDivElement>>;
