import type * as React from "react";
import type { ReactNode } from "react";

export interface NativeSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Progressive-enhancement native <select> styled to CS tokens beside Select.
 * Leaner chrome: size · label · error (no description slot).
 */
export interface NativeSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: ReactNode;
  error?: ReactNode;
  options?: NativeSelectOption[];
  size?: "sm" | "md";
  children?: ReactNode;
}

export function NativeSelect(props: NativeSelectProps): React.ReactElement;
