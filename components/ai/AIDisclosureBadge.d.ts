import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";
import type * as React from "react";

/**
 * AI-native disclosure pill (info-blue). Expands to explain what AI did and to
 * list sources — an explainability path, never decoration. Includes localized
 * default copy (EN + VN); deployment is consumer-owned. The caller supplies
 * accurate disclosure and sources. The UI does not detect AI involvement,
 * verify provenance or establish human approval.
 */
export interface AIDisclosureBadgeProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** Attributes for the existing span root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLSpanElement>;
  label?: string;
  details?: ReactNode;
  sources?: string[];
  /** UI locale override; otherwise inherits the nearest language scope. */
  lang?: string;
  className?: string;
  /** Native button control; while component control is mounted. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLButtonElement>;
}

export const AIDisclosureBadge: React.ForwardRefExoticComponent<React.PropsWithoutRef<AIDisclosureBadgeProps> & React.RefAttributes<HTMLSpanElement>>;
