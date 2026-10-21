import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Round floating action using the active element accent and paired foreground. With `actions`, the main press opens a
 *  speed-dial of mini actions. position="static" embeds it in flow (demos). */
export interface FabAction { icon: ReactNode; label: string; onSelect?: () => void; }
export interface FloatingActionButtonProps extends FloatingPanelProps {
  /** Preferred placement: top-end. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  icon: ReactNode;
  /** Accessible label for the main button (required — icon-only). */
  label: string;
  actions?: FabAction[];
  onClick?: () => void;
  position?: "fixed" | "static";
  className?: string;
  /** Native button control; while component control is mounted. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLButtonElement>;
}
export const FloatingActionButton: React.ForwardRefExoticComponent<React.PropsWithoutRef<FloatingActionButtonProps> & React.RefAttributes<HTMLDivElement>>;
