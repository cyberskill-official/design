import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** 24-hour time select in fixed minute steps (default 30). Controlled:
 *  value "HH:MM" / onChange("HH:MM"). Bilingual aria label via the registry. */
export interface TimePickerProps {
  /** Attributes for the existing span root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLSpanElement>;
  /** "HH:MM" 24h. Default "09:00". */
  value?: string;
  onChange?: (time: string) => void;
  /** Whole-minute step from 1 through 1440. Invalid, fractional or out-of-range
   *  values use 30. At most 1440 options; values remain "HH:MM". Default 30. */
  step?: number;
  /** Accessible label. Default from the registry ("Time" / "Giờ"). */
  label?: string;
  /** External label element IDs for the time select. */
  "aria-labelledby"?: string;
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
  /** Native select control; while component control is mounted. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLSelectElement>;
}
export const TimePicker: React.ForwardRefExoticComponent<React.PropsWithoutRef<TimePickerProps> & React.RefAttributes<HTMLSpanElement>>;
