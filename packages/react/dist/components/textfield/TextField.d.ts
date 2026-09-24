import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Labelled text input with optional helper description and inline error. Label
 * is always programmatically associated; errors wire up via aria-describedby +
 * role="alert". Preserves Vietnamese diacritics / IME composition.
 */
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visible, associated label. Required. */
  label: ReactNode;
  /** Optional helper text under the label. */
  description?: ReactNode;
  /** Inline error message; also flips aria-invalid. */
  error?: ReactNode;
}

export const TextField: React.ForwardRefExoticComponent<
  TextFieldProps & React.RefAttributes<HTMLElement>
>;
