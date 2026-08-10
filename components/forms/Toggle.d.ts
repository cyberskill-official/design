import type { ReactNode } from "react";

/** A single pressable on/off button (aria-pressed). Not a form Switch and not a
 *  SegmentedControl — use it for standalone style/state toggles (e.g. Bold). */
export interface ToggleProps {
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Uncontrolled initial state. Default false. */
  defaultPressed?: boolean;
  onChange?: (pressed: boolean) => void;
  icon?: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function Toggle(props: ToggleProps): React.ReactElement;
