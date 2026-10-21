import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Light single-panel expand without Accordion chrome (settings, policy clauses).
 * Controlled via `open` + `onOpenChange`, or uncontrolled via `defaultOpen`.
 * `title` (or `trigger`) is the button label.
 */
export interface CollapsibleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Trigger label (preferred). */
  title?: ReactNode;
  /** Alias for `title`. */
  trigger?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Native button control; while component control is mounted. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLButtonElement>;
}

export const Collapsible: React.ForwardRefExoticComponent<React.PropsWithoutRef<CollapsibleProps> & React.RefAttributes<HTMLDivElement>>;
