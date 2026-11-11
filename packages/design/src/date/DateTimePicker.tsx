import { useId, useState, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { DatePicker, type DatePickerProps } from './DatePicker';
import { TimePicker, type TimePickerProps } from './TimePicker';
import { formatDate, useControllable, withTime } from './utils';

export type DateTimePickerProps = Pick<DatePickerProps, 'format' | 'locale' | 'min' | 'max' | 'disabledDates' | 'weekStartsOn' | 'invalidMessage' | 'clearLabel' | 'openLabel'> &
  Pick<TimePickerProps, 'step' | 'hourCycle'> & {
    className?: string;
    /** Group label, e.g. "Meeting starts". */
    label: ReactNode;
    description?: ReactNode;
    error?: ReactNode;
    required?: boolean;
    disabled?: boolean;
    value?: Date | null;
    defaultValue?: Date | null;
    /** Called with the combined date and time once both are set, `null` while either is empty. */
    onValueChange?: (value: Date | null) => void;
    /** Accessible names of the two inputs (the group label is visible). */
    dateLabel?: string;
    timeLabel?: string;
    /** Error for a typed time that is not a time. */
    invalidTimeMessage?: ReactNode;
  };

/** Date + time in one labelled group, producing a single `Date`. */
export function DateTimePicker({ className, label, description, error, required, disabled, value, defaultValue = null, onValueChange, dateLabel = 'Date', timeLabel = 'Time', step, hourCycle, invalidTimeMessage, locale, ...dateProps }: DateTimePickerProps) {
  const [current, setCurrent] = useControllable(value, defaultValue, onValueChange);
  // Half-filled input (a date without a time, or the reverse) waits here until both parts exist.
  const [draft, setDraft] = useState<{ date: Date | null; time: string | null }>({ date: null, time: null });
  const date = current ?? draft.date;
  const time = current ? formatDate(current, 'HH:mm') : draft.time;
  const update = (d: Date | null, t: string | null) => {
    setDraft(d && t ? { date: null, time: null } : { date: d, time: t });
    setCurrent(d && t ? withTime(d, t) : null);
  };
  const id = useId();
  const describedBy = [description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset className={cx('cs-date-time-picker', className)} disabled={disabled} aria-describedby={describedBy} data-invalid={error ? '' : undefined}>
      <legend className="cs-field-label">
        {label}
        {required && <span className="cs-field-required" aria-hidden="true">*</span>}
      </legend>
      <div className="cs-date-time-picker-row">
        <DatePicker {...dateProps} locale={locale} label={dateLabel} hideLabel required={required} disabled={disabled} value={date} onValueChange={d => update(d, time)} />
        <TimePicker label={timeLabel} hideLabel required={required} disabled={disabled} step={step} hourCycle={hourCycle} locale={locale} invalidMessage={invalidTimeMessage} value={time} onValueChange={t => update(date, t)} />
      </div>
      {description && <p id={`${id}-description`} className="cs-field-description">{description}</p>}
      {error && <p id={`${id}-error`} className="cs-field-error">{error}</p>}
    </fieldset>
  );
}
