import type * as React from "react";
import type { ReactNode, CSSProperties } from "react";

/**
 * CSS `aspect-ratio` wrapper for media and framed content.
 * `ratio` accepts a number (e.g. `1.777`) or CSS string (default `"16 / 9"`).
 */
export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number or CSS aspect-ratio string. Default `"16 / 9"`. */
  ratio?: number | string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function AspectRatio(props: AspectRatioProps): React.ReactElement;
