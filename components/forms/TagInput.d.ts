import type * as React from "react";
import type { RootTargetProps, InputControlTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";
/** Multi-value token input: Enter/comma adds a tag, Backspace removes the last,
 *  blur commits while enabled, duplicates ignored. IME composition confirmation
 *  does not commit a tag. Controlled (value/onChange) or uncontrolled. */
export interface TagInputProps {
  id?: string;
  /** Visible field label (associates via htmlFor). When omitted, the input uses the placeholder as aria-label. */
  label?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  /** Default from the bilingual registry ("Add a tag…" / "Thêm thẻ…"). */
  placeholder?: string;
  /** Max tag count. */
  max?: number;
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
  /** Explicit outer target; Rating/OTP use the same semantic group as controlProps. No ref forwarding. */
  rootProps?: RootTargetProps;
  /** Explicit primary target. Owned role, state, value and change handling cannot be replaced. */
  controlProps?: Omit<InputControlTargetProps, "name" | "required">;
  description?: ReactNode;
  error?: ReactNode;
  /** Field requirement semantics; does not add native submission serialization. */
  required?: boolean;

  /** Native input control; while component control is mounted. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLInputElement>;
}
export const TagInput: React.ForwardRefExoticComponent<React.PropsWithoutRef<TagInputProps> & React.RefAttributes<HTMLDivElement>>;
