import type { RootTargetProps } from "../_utils/target-props";
import type * as React from "react";

/**
 * Loading placeholder with a shimmer (freezes under reduced-motion). Use `lines`
 * for multi-line text, or a single block/circle sized by width/height.
 */
export interface SkeletonProps {
  /** Attributes for the existing div/span root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement | HTMLSpanElement>, "aria-hidden" | "role">;
  variant?: "block" | "circle";
  width?: number | string;
  height?: number | string;
  /** Whole text-line count, with the final rendered line at 70% width. Finite fractions round down; nonpositive, nonfinite or unrepresentable counts use the single block/circle view. */
  lines?: number;
  radius?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.ForwardRefExoticComponent<React.PropsWithoutRef<SkeletonProps> & React.RefAttributes<HTMLDivElement | HTMLSpanElement>>;
