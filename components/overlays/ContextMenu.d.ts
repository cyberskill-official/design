import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Right-click menu scoped to its children (reuses Menu styling). */
export type ContextMenuItem = { label: ReactNode; onSelect?: () => void; danger?: boolean } | "-";
export interface ContextMenuProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "role" | "aria-label" | "tabIndex">;
  items: ContextMenuItem[];
  children?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
  /** Zone tab stop; defaults to 0. Use -1 only with a caller-provided keyboard route. */
  tabIndex?: number;
}
export const ContextMenu: React.ForwardRefExoticComponent<React.PropsWithoutRef<ContextMenuProps> & React.RefAttributes<HTMLDivElement>>;
