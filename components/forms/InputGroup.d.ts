import type * as React from "react";
import type { ReactNode } from "react";

/** Input with prefix/suffix addons (text or nodes), a clearable ×, and a
 *  password show/hide reveal. Controlled or uncontrolled. */
export interface InputGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "prefix"> {
  id?: string;
  /** Visible field label (associates via htmlFor). When omitted, falls back to aria-label, placeholder, or bilingual "input". */
  label?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  /** Renders a password field with a reveal button. */
  password?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Disables the input, clear action and password reveal. */
  disabled?: boolean;
  /** Prevents value editing and clearing; password visibility may still change. */
  readOnly?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
  "aria-label"?: string;
}
export const InputGroup: React.ForwardRefExoticComponent<React.PropsWithoutRef<InputGroupProps> & React.RefAttributes<HTMLDivElement>>;
