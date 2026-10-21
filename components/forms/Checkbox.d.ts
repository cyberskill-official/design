/** ReactNode content preserves numeric zero; optional empty content remains omitted. */
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Native checkbox tinted with the brand accent-color, plus an associated label
 * and optional description. Uses native checkbox keyboard behavior and a
 * wrapping label; this declaration does not establish manual assistive-technology
 * acceptance for a consumer interface.
 */
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  description?: ReactNode;
}

export const Checkbox: React.ForwardRefExoticComponent<React.PropsWithoutRef<CheckboxProps> & React.RefAttributes<HTMLInputElement>>;
