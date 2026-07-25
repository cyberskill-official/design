import type * as React from "react";
import type { ReactNode, CSSProperties } from "react";

/**
 * Focusable overflow region for dense panels (settings, long VN copy).
 * `maxHeight` caps the scrollport; keyboard focus scrolls when needed.
 */
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Max block size — number → px, or any CSS length string. */
  maxHeight?: number | string;
  className?: string;
  style?: CSSProperties;
}

export function ScrollArea(props: ScrollAreaProps): React.ReactElement;
