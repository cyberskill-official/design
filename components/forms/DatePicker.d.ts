/** Date field + popover Calendar. Displays VN dates as DD/MM/YYYY (EN: 02 Jul 2026)
 *  via the shared i18n formatDate. Controlled: value (Date) / onChange(Date). */
export interface DatePickerProps {
  /** Numeric timestamps include epoch zero; formatting uses the local time zone. */
  value?: Date | string | number;
  onChange?: (date: Date) => void;
  /** Default from the bilingual registry ("Select a date" / "Chọn ngày"). */
  placeholder?: string;
  /** Accessible label for the field and popup dialog. The dialog falls back to
   *  a nonblank placeholder, then the bilingual default. */
  label?: string;
  /** External label element IDs for the field and popup dialog. */
  "aria-labelledby"?: string;
  /** Disables the field and closes an open popup; reenabling does not reopen it. */
  disabled?: boolean;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function DatePicker(props: DatePickerProps): React.ReactElement;
