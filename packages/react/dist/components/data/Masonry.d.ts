import type { ReactNode } from "react";

/** Column-packed gallery (CSS columns; items keep source order top-to-bottom per column). */
export interface MasonryProps {
  /** Default 3. */
  columns?: number;
  /** px. Default 16. */
  gap?: number;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export const Masonry: React.ForwardRefExoticComponent<
  MasonryProps & React.RefAttributes<HTMLElement>
>;
