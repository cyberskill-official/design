import type { RootTargetProps } from "../_utils/target-props";
/** ReactNode content preserves numeric zero; optional empty content remains omitted. */
import type * as React from "react";
import type { ReactNode } from "react";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  description?: ReactNode;
}
export const Radio: React.ForwardRefExoticComponent<React.PropsWithoutRef<RadioProps> & React.RefAttributes<HTMLInputElement>>;

export interface RadioOption { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean; }

/**
 * A grouped set of radios (single choice) rendered as a labelled fieldset,
 * controlled by `value` / `onChange`.
 */
export interface RadioGroupProps {
  /** Attributes for the existing fieldset root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLFieldSetElement>;
  legend?: ReactNode;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  className?: string;
}
export const RadioGroup: React.ForwardRefExoticComponent<React.PropsWithoutRef<RadioGroupProps> & React.RefAttributes<HTMLFieldSetElement>>;
