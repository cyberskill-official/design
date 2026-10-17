/** ReactNode content preserves numeric zero; optional empty content remains omitted. */
import type * as React from "react";
import type { ReactNode } from "react";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  description?: ReactNode;
}
export function Radio(props: RadioProps): React.ReactElement;

export interface RadioOption { value: string; label: ReactNode; description?: ReactNode; disabled?: boolean; }

/**
 * A grouped set of radios (single choice) rendered as a labelled fieldset,
 * controlled by `value` / `onChange`.
 */
export interface RadioGroupProps {
  legend?: ReactNode;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  className?: string;
}
export function RadioGroup(props: RadioGroupProps): React.ReactElement;
