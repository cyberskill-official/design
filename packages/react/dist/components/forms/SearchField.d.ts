import type * as React from "react";

/** Pill-shaped search input with a leading icon and a clear button. Controlled
 *  (value/onChange) or uncontrolled. */
export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}
export const SearchField: React.ForwardRefExoticComponent<
  SearchFieldProps & React.RefAttributes<HTMLElement>
>;
