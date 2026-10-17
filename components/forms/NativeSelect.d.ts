/** ReactNode content preserves numeric zero; optional empty content remains omitted. */
/** Caller aria-describedby is combined with the local error ID; there is no
 *  built-in help/description slot. Caller help elements must exist in the document. Local errors
 *  force aria-invalid=true; otherwise the supplied aria-invalid is preserved. */
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
