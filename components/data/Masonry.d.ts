import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Column-packed gallery (CSS columns; items keep source order top-to-bottom per column). */
export interface MasonryProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  /** Default 3. */
  columns?: number;
  /** px. Default 16. */
  gap?: number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export const Masonry: React.ForwardRefExoticComponent<React.PropsWithoutRef<MasonryProps> & React.RefAttributes<HTMLDivElement>>;
