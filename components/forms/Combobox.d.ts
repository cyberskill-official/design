import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps, InputControlTargetProps, ButtonControlTargetProps } from "../_utils/target-props";
/** Filterable single-select: text input + filtered listbox (ARIA combobox).
 *  Controlled: value/onChange. Keyboard: arrows · Enter · Escape. */
export interface ComboboxOption { value: string; label: string; }
export interface ComboboxProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Default from the bilingual registry ("Select or type…" / "Chọn hoặc nhập…"). */
  placeholder?: string;
  /** Accessible label for the input. */
  label?: string;
  /** External label element IDs for the combobox input and listbox. */
  "aria-labelledby"?: string;
  /** Disables the field and closes an open popup; reenabling does not reopen it. */
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  /** Attributes for the outer wrapper; existing className remains on that wrapper. */
  rootProps?: RootTargetProps;
  /** Attributes for the documented focusable control; owned state and semantics cannot be replaced. Internal handlers run before consumer handlers. */
  controlProps?: Omit<InputControlTargetProps, "name" | "required">;
  description?: React.ReactNode;
  error?: React.ReactNode;
  /** Required state for field/controller semantics; button-based pickers do not gain native constraint validation. */
  required?: boolean;
  className?: string;
  /** Native input control; while component control is mounted. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLInputElement>;
}
export const Combobox: React.ForwardRefExoticComponent<React.PropsWithoutRef<ComboboxProps> & React.RefAttributes<HTMLDivElement>>;
