import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** Click-to-edit text: view button ⇄ input. Enter/blur commits, Escape cancels.
 *  Controlled (value/onChange) or uncontrolled. Bilingual edit/empty labels. */
export interface InlineEditProps {
  /** Attributes for the existing span root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLSpanElement>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Accessible field name (appended to the edit label). */
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
  /** Native input control; only while editing. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLInputElement>;
}
export const InlineEdit: React.ForwardRefExoticComponent<React.PropsWithoutRef<InlineEditProps> & React.RefAttributes<HTMLSpanElement>>;
