import type * as React from "react";

/** Pill-shaped search input with a leading icon and a clear button. Controlled
 *  (value/onChange) or uncontrolled, initialized once from defaultValue.
 *  Disabled/readOnly applies to both text entry and clearing. Parent value
 *  updates still render while locked; clear callbacks do not fire. */
export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}
export function SearchField(props: SearchFieldProps): React.ReactElement;
