/** The icon slots preserve numeric zero; null/false/empty string omit those slots. */
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * CyberSkill primary action control. Umber-filled by default with a warm hover
 * and a composite focus indicator (text-primary contour + Ochre halo); carries a full variant + size ramp and a 44px
 * comfortable touch target. Use for the single most important action in a view.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. Default "primary". */
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger" | "danger-ghost";
  /** Size ramp. Default "md" (44px). */
  size?: "xs" | "sm" | "md" | "lg";
  /** Show a spinner and disable interaction. */
  loading?: boolean;
  disabled?: boolean;
  /** Stretch to the container width. */
  fullWidth?: boolean;
  /** Optional leading icon node. */
  icon?: ReactNode;
  children?: ReactNode;
}

export function Button(props: ButtonProps): React.ReactElement;
