/** 24-hour time select in fixed minute steps (default 30). Controlled:
 *  value "HH:MM" / onChange("HH:MM"). Bilingual aria label via the registry. */
export interface TimePickerProps {
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
}
export function TimePicker(props: TimePickerProps): React.ReactElement;
