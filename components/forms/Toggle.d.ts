/** The icon slots preserve numeric zero; null/false/empty string omit those slots. */
import type { ReactNode } from "react";
import type * as React from "react";

/** A single pressable on/off button (aria-pressed). Not a form Switch and not a
 *  SegmentedControl — use it for standalone style/state toggles (e.g. Bold). */
export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "onClick"> {
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Uncontrolled initial state. Default false. */
  defaultPressed?: boolean;
  onChange?: (pressed: boolean) => void;
  /** Runs before toggling; preventDefault cancels the state change. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function Toggle(props: ToggleProps): React.ReactElement;
