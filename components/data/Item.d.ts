import type { ReactNode, MouseEventHandler } from "react";

/**
 * Shared list / settings / nav row: leading · title · description · trailing,
 * with selected / disabled and href-or-button semantics when interactive.
 */
export interface ItemProps {
  leading?: ReactNode;
  trailing?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  /** Renders as an <a> when set (and not disabled). */
  href?: string;
  /** Renders as a <button> when set without href. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /**
   * Free-form main content when `trailing` is set, or the trailing slot when
   * `title` is set and `trailing` is omitted (DC-friendly Switch nesting).
   */
  children?: ReactNode;
  className?: string;
}

export function Item(props: ItemProps): React.ReactElement;
