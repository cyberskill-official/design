import type { FloatingPanelProps, FloatingPlacement } from "../_utils/floating-panel";
import type * as React from "react";
import type { RootTargetProps, InputControlTargetProps, ButtonControlTargetProps } from "../_utils/target-props";
/** Date field + popover Calendar. Displays VN dates as DD/MM/YYYY (EN: 02 Jul 2026)
 *  via the shared i18n formatDate. Controlled: value (Date) / onChange(Date). */
export interface DatePickerProps extends FloatingPanelProps {
  /** Preferred placement: bottom-start. Viewport collisions may flip the side. */
  placement?: FloatingPlacement;
  /** Numeric timestamps include epoch zero; formatting uses the local time zone. */
  value?: Date | string | number;
  onChange?: (date: Date) => void;
  /** Default from the bilingual registry ("Select a date" / "Chọn ngày"). */
  placeholder?: string;
  /** Accessible label for the field and popup dialog. The dialog falls back to
   *  a nonblank placeholder, then the bilingual default. */
  label?: string;
  /** External label element IDs for the field and popup dialog. */
  "aria-labelledby"?: string;
  /** Disables the field and closes an open popup; reenabling does not reopen it. */
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  /** Attributes for the outer wrapper; existing className remains on that wrapper. */
  rootProps?: RootTargetProps;
  /** Attributes for the documented focusable control; owned state and semantics cannot be replaced. Internal handlers run before consumer handlers. */
  controlProps?: ButtonControlTargetProps;
  description?: React.ReactNode;
  error?: React.ReactNode;
  /** Required state for field/controller semantics; button-based pickers do not gain native constraint validation. */
  required?: boolean;
  className?: string;
  /** Native button control; while component control is mounted. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLButtonElement>;
}
export const DatePicker: React.ForwardRefExoticComponent<React.PropsWithoutRef<DatePickerProps> & React.RefAttributes<HTMLDivElement>>;
