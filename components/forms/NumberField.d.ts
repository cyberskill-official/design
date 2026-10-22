import type { RootTargetProps, InputControlTargetProps, ButtonControlTargetProps } from "../_utils/target-props";
import type * as React from "react";

/** Numeric stepper with −/+ buttons, keyboard entry, and min/max clamping.
 *  Controlled via value/onChange or uncontrolled. */
export interface NumberFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "min" | "max" | "step"> {
  id?: string;
  /** Visible field label (associates via htmlFor). When omitted, the input uses the bilingual "value" aria-label. */
  label?: string;
  value?: number;
  /** Mount-time numeric value for uncontrolled usage; defaults to zero. */
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Native number-input step. Buttons use native decimal arithmetic and step-base alignment within min/max. */
  step?: number;
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  /** Attributes for the outer wrapper; existing className remains on that wrapper. */
  rootProps?: RootTargetProps;
  /** Attributes for the documented focusable control; owned state and semantics cannot be replaced. Internal handlers run before consumer handlers. */
  controlProps?: InputControlTargetProps;
  description?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
}
export const NumberField: React.ForwardRefExoticComponent<React.PropsWithoutRef<NumberFieldProps> & React.RefAttributes<HTMLInputElement>>;
