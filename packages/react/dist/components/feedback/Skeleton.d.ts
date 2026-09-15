import type * as React from "react";

/**
 * Loading placeholder with a shimmer (freezes under reduced-motion). Use `lines`
 * for multi-line text, or a single block/circle sized by width/height.
 */
export interface SkeletonProps {
  variant?: "block" | "circle";
  width?: number | string;
  height?: number | string;
  /** Render N text lines (last one 70% width). */
  lines?: number;
  radius?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.ForwardRefExoticComponent<
  SkeletonProps & React.RefAttributes<HTMLElement>
>;
