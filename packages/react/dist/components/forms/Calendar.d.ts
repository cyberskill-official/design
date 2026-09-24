/** Month-grid calendar, Monday week-start (VN convention), bilingual month and
 *  weekday names (Tháng 7 · T2–CN). Controlled: value (Date) / onChange(Date). */
export interface CalendarProps {
  value?: Date | string | number;
  onChange?: (date: Date) => void;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const Calendar: React.ForwardRefExoticComponent<
  CalendarProps & React.RefAttributes<HTMLElement>
>;
