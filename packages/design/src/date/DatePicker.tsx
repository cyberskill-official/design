import type { Locale } from 'date-fns';
import type { Matcher } from 'react-day-picker';
import { Calendar, type CalendarProps } from './Calendar';
import { PickerField, type PickerFieldProps } from './PickerField';
import { DEFAULT_DATE_FORMAT, FORM_DATE_FORMAT, formatDate, parseDate } from './utils';
import { isPickable, useControllable } from './picker-state';

export type DatePickerProps = PickerFieldProps & {
  value?: Date | null;
  defaultValue?: Date | null;
  /** Called with the picked or typed date, or `null` when cleared or when the typed text is not an allowed date. */
  onValueChange?: (value: Date | null) => void;
  /** date-fns pattern for display and typing. */
  format?: string;
  /** date-fns locale, e.g. `vi` from `react-day-picker/locale` (also translates calendar labels). */
  locale?: Locale;
  min?: Date;
  max?: Date;
  /** Extra days that cannot be picked, as react-day-picker matchers, e.g. `{ dayOfWeek: [0, 6] }`. */
  disabledDates?: Matcher | Matcher[];
  /** 0 Sunday … 6 Saturday. Default Monday. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Calendar screen-reader labels (react-day-picker `labels`), e.g. `labelDayButton` for the "Today" and "selected" words. */
  labels?: CalendarProps['labels'];
};

/** Labelled date field: type `15/03/2026` or pick from a calendar popup (calendar button or Alt+ArrowDown). */
export function DatePicker({ value, defaultValue = null, onValueChange, format = DEFAULT_DATE_FORMAT, locale, min, max, disabledDates, weekStartsOn, labels, placeholder = format.toLowerCase(), name, ...props }: DatePickerProps) {
  const [current, setCurrent, resets] = useControllable(value, defaultValue, onValueChange);
  return (
    <PickerField
      {...props}
      placeholder={placeholder}
      value={current}
      resets={resets}
      formFields={name ? { [name]: current ? formatDate(current, FORM_DATE_FORMAT) : '' } : undefined}
      onCommit={setCurrent}
      toText={d => formatDate(d, format, locale)}
      fromText={t => {
        const d = parseDate(t, format, locale);
        return d && isPickable(d, min, max, disabledDates) ? d : null;
      }}
    >
      {select => (
        <Calendar mode="single" required selected={current ?? undefined} defaultMonth={current ?? undefined} onSelect={select} locale={locale} minDate={min} maxDate={max} disabled={disabledDates} weekStartsOn={weekStartsOn} labels={labels} />
      )}
    </PickerField>
  );
}
