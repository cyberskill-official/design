import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Chip/tag for filters, keywords, or selected values. Pass `onRemove` to show
 * a close button (omit for a static tag).
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}

export const Tag: React.ForwardRefExoticComponent<
  TagProps & React.RefAttributes<HTMLElement>
>;
