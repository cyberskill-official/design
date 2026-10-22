import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
/** Month-grid calendar, Monday week-start (VN convention), bilingual month and
 *  weekday names (Tháng 7 · T2–CN). Controlled: value (Date) / onChange(Date). */
export interface CalendarProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  /** Date-compatible value (including timestamp 0). A changed selected month updates the view. */
  value?: Date | string | number;
  onChange?: (date: Date) => void;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Calendar: React.ForwardRefExoticComponent<React.PropsWithoutRef<CalendarProps> & React.RefAttributes<HTMLDivElement>>;
