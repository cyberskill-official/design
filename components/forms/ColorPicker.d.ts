import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps, ButtonControlTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";
/** Curated brand-swatch picker + custom hex input (never a raw free-picker UI). */
export interface ColorPickerProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** #RRGGBB. Default Ochre. */
  value?: string;
  onChange?: (hex: string) => void;
  /** Defaults to ten fixed literal swatches from this component, not the current
   * generated element packs. Does not adapt to the element axis. */
  swatches?: string[];
  label?: string;
  /** External label element IDs for the field and popup dialog. */
  "aria-labelledby"?: string;
  lang?: string;
  className?: string;
  id?: string;
  /** Explicit outer target; Rating/OTP use the same semantic group as controlProps. No ref forwarding. */
  rootProps?: RootTargetProps<HTMLSpanElement>;
  /** Explicit primary target. Owned role, state, value and change handling cannot be replaced. */
  controlProps?: ButtonControlTargetProps;
  description?: ReactNode;
  error?: ReactNode;
  /** Field requirement semantics; does not add native submission serialization. */
  required?: boolean;

  /** Native button control; while component control is mounted. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLButtonElement>;
}
export const ColorPicker: React.ForwardRefExoticComponent<React.PropsWithoutRef<ColorPickerProps> & React.RefAttributes<HTMLSpanElement>>;
