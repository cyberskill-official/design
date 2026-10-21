/** ReactNode content preserves numeric zero; optional empty content remains omitted. */
/** Caller aria-describedby is combined with local help/error IDs. Local errors
 *  force aria-invalid=true. Enclosing FormField descriptions/error and native required
 *  are inherited through the shared association context. Explicit external ARIA names
 *  and a meaningful local label keep precedence over the enclosing field label. */
import type * as React from "react";
import type { ReactNode } from "react";

/**
 * Labelled text input with optional helper description and inline error. Label
 * is always programmatically associated; errors wire up via aria-describedby +
 * role="alert". Preserves Vietnamese diacritics / IME composition.
 */
export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional visible label. Supply a meaningful local label, an enclosing FormField label,
   *  or an explicit aria-label/aria-labelledby accessible name. */
  label?: ReactNode;
  /** Optional helper text under the label. */
  description?: ReactNode;
  /** Inline error message; also flips aria-invalid. */
  error?: ReactNode;
}

export const TextField: React.ForwardRefExoticComponent<React.PropsWithoutRef<TextFieldProps> & React.RefAttributes<HTMLInputElement>>;
