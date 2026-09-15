/** 24-hour time select in fixed minute steps (default 30). Controlled:
 *  value "HH:MM" / onChange("HH:MM"). Bilingual aria label via the registry. */
export interface TimePickerProps {
  /** "HH:MM" 24h. Default "09:00". */
  value?: string;
  onChange?: (time: string) => void;
  /** Minute step. Default 30. */
  step?: number;
  /** Accessible label. Default from the registry ("Time" / "Giờ"). */
  label?: string;
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const TimePicker: React.ForwardRefExoticComponent<
  TimePickerProps & React.RefAttributes<HTMLElement>
>;
