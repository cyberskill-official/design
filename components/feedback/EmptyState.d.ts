import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";
import type { ReactNode } from "react";

/** Friendly placeholder for empty or zero-result views: icon, title, message,
 *  and optional actions (compose Buttons). */
export interface EmptyStateProps {
  icon?: ReactNode;
  title?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  /** Attributes for the existing outer div. Internal handlers run before consumer handlers; owned semantics remain controlled. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  className?: string;
}
export const EmptyState: React.ForwardRefExoticComponent<React.PropsWithoutRef<EmptyStateProps> & React.RefAttributes<HTMLDivElement>>;
