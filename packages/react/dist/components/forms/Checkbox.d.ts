import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Native checkbox tinted with the brand accent-color, plus an associated label
 * and optional description. Fully keyboard + AT accessible.
 */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  description?: ReactNode;
}

export const Checkbox: React.ForwardRefExoticComponent<
  CheckboxProps & React.RefAttributes<HTMLElement>
>;
