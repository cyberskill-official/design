import type * as React from "react";

/** Numeric stepper with −/+ buttons, keyboard entry, and min/max clamping.
 *  Controlled via value/onChange or uncontrolled. */
export interface NumberFieldProps {
  id?: string;
  /** Visible field label (associates via htmlFor). When omitted, the input uses the bilingual "value" aria-label. */
  label?: string;
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function NumberField(props: NumberFieldProps): React.ReactElement;
