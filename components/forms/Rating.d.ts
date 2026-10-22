import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";
/** Whole-star rating (APG radiogroup: roving tabindex + arrow keys). Controlled
 *  (value/onChange) or uncontrolled (defaultValue). Clicking the current value
 *  clears to 0. Only the radio for the exact score is checked; preceding stars
 *  are visually filled. readOnly for display. */
export interface RatingProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Whole star count. Finite fractions round down; nonpositive counts render no stars. Nonfinite or unrepresentable counts use 5. */
  max?: number;
  readOnly?: boolean;
  /** Accessible label. Default from the bilingual registry ("Rating" / "Đánh giá"). */
  label?: string;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
  id?: string;
  /** Explicit outer target; Rating/OTP use the same semantic group as controlProps. No ref forwarding. */
  rootProps?: Omit<RootTargetProps, "role">;
  /** Explicit primary target. Owned role, state, value and change handling cannot be replaced. */
  controlProps?: Omit<RootTargetProps, "role">;
  description?: ReactNode;
  error?: ReactNode;
  /** Field requirement semantics; does not add native submission serialization. */
  required?: boolean;

}
export const Rating: React.ForwardRefExoticComponent<React.PropsWithoutRef<RatingProps> & React.RefAttributes<HTMLDivElement>>;
