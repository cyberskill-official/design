/** Date field + popover Calendar. Displays VN dates as DD/MM/YYYY (EN: 02 Jul 2026)
 *  via the shared i18n formatDate. Controlled: value (Date) / onChange(Date). */
export interface DatePickerProps {
  value?: Date | string | number;
  onChange?: (date: Date) => void;
  /** Default from the bilingual registry ("Select a date" / "Chọn ngày"). */
  placeholder?: string;
  /** Accessible label for the field. */
  label?: string;
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export const DatePicker: React.ForwardRefExoticComponent<
  DatePickerProps & React.RefAttributes<HTMLElement>
>;
