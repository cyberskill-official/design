import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Small umber bubble shown on hover/focus of its trigger. Wrap a focusable
 * element so keyboard users get it too. Keep the label to a few words.
 */
export interface TooltipProps {
  label: ReactNode;
  children: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}

export function Tooltip(props: TooltipProps): React.ReactElement;
