import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Small umber bubble shown on hover/focus of its trigger. Wrap a focusable
 * element forwarding aria-describedby so keyboard users get it too. Escape
 * dismisses without closing a parent overlay. Non-element content gets a focusable wrapper.
 * Keep the label to a few words; do not place interactive controls in the bubble.
 */
export interface TooltipProps extends FloatingPanelProps {
  /** Preferred placement: top. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  label?: ReactNode;
  children: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  /** Attributes for the existing outer trigger wrapper, not the tooltip bubble or described child. Internal handlers run before consumer handlers; owned semantics remain controlled. */
  rootProps?: Omit<RootTargetProps<HTMLSpanElement>, "data-managed" | "data-open"> & { "data-managed"?: never; "data-open"?: never };
  className?: string;
}

export const Tooltip: React.ForwardRefExoticComponent<React.PropsWithoutRef<TooltipProps> & React.RefAttributes<HTMLSpanElement>>;
