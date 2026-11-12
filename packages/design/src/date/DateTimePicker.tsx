import { WarningCircle } from '@phosphor-icons/react';
import { isSameDay, startOfMinute } from 'date-fns';
import { useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { DatePicker, type DatePickerProps } from './DatePicker';
import { TimePicker, type TimePickerProps } from './TimePicker';
import { FORM_DATE_TIME_FORMAT, formatDate, withTime } from './utils';
import { useControllable, useFormReset, useHydrated } from './picker-state';

export type DateTimePickerProps = Pick<DatePickerProps, 'format' | 'locale' | 'min' | 'max' | 'disabledDates' | 'weekStartsOn' | 'labels' | 'invalidMessage' | 'clearLabel' | 'openLabel' | 'onBlur'> &
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
    /** Called with the combined date and time once both are set and allowed, `null` while either is empty or invalid. */
    onValueChange?: (value: Date | null) => void;
    /** Accessible names of the two inputs (the group label is visible). */
    dateLabel?: string;
    timeLabel?: string;
    /** Error for a typed time that is not a time, or is before `min` / after `max` on their days. */
    invalidTimeMessage?: ReactNode;
    /** Submits the value with a native form as one hidden input, `yyyy-MM-ddTHH:mm`. */
    name?: string;
    /** Ref to the date input, e.g. React Hook Form's `field.ref` so a failed submit focuses it. */
    inputRef?: DatePickerProps['inputRef'];
  };

const NO_DRAFT = { date: null, time: null };

/**
 * Date + time in one labelled group, producing a single `Date`. `min` and `max` limit the days and, on those two days,
 * the time as well (a `min` of 15/03/2026 09:00 allows 15/03 from 09:00 and any time after that day).
 */
export function DateTimePicker({ className, label, description, error, required, disabled, value, defaultValue = null, onValueChange, dateLabel = 'Date', timeLabel = 'Time', step, hourCycle, invalidTimeMessage, locale, min, max, name, inputRef, onBlur, ...dateProps }: DateTimePickerProps) {
  const [current, setCurrent, resets] = useControllable(value, defaultValue, onValueChange);
  const hydrated = useHydrated();
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  // Half-filled or out-of-range input (a date without a time, 08:00 on a day that starts at 09:00) waits here.
  const [draft, setDraft] = useState<{ date: Date | null; time: string | null }>(NO_DRAFT);
  // An outside reset (React Hook Form's reset()) or a form reset drops it.
  const [prevResets, setPrevResets] = useState(resets);
  if (resets !== prevResets) {
    setPrevResets(resets);
    setDraft(NO_DRAFT);
  }
  useFormReset(fieldsetRef, () => setDraft(NO_DRAFT));
  const date = current ?? draft.date;
  // The time of a Date depends on the time zone: empty until hydrated, like the date text.
  const time = current ? (hydrated ? formatDate(current, 'HH:mm') : null) : draft.time;
  // The time limits only apply on the first and last allowed day.
  const timeMin = date && min && isSameDay(date, min) ? formatDate(min, 'HH:mm') : undefined;
  const timeMax = date && max && isSameDay(date, max) ? formatDate(max, 'HH:mm') : undefined;
  const update = (d: Date | null, t: string | null) => {
    const next = d && t ? withTime(d, t) : null;
    const allowed = next && !(min && next < startOfMinute(min)) && !(max && next > max) ? next : null;
    setDraft(allowed ? { date: null, time: null } : { date: d, time: t });
    setCurrent(allowed);
  };
  const id = useId();
  const describedBy = [description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset ref={fieldsetRef} className={cx('cs-date-time-picker', className)} disabled={disabled} aria-describedby={describedBy} data-invalid={error ? '' : undefined}>
      <legend className="cs-field-label">
        {label}
        {required && <span className="cs-field-required" aria-hidden="true">*</span>}
      </legend>
      {/* Remounted on an outside reset, so typed text in either input goes too. */}
      <div key={resets} className="cs-date-time-picker-row">
        <DatePicker {...dateProps} locale={locale} min={min} max={max} label={dateLabel} hideLabel required={required} disabled={disabled} invalid={!!error} value={date} onValueChange={d => update(d, time)} inputRef={inputRef} onBlur={onBlur} />
        <TimePicker label={timeLabel} hideLabel required={required} disabled={disabled} invalid={!!error} step={step} hourCycle={hourCycle} locale={locale} min={timeMin} max={timeMax} invalidMessage={invalidTimeMessage} value={time} onValueChange={t => update(date, t)} onBlur={onBlur} />
      </div>
      {name && <input type="hidden" name={name} value={current && hydrated ? formatDate(current, FORM_DATE_TIME_FORMAT) : ''} disabled={disabled} />}
      {description && <p id={`${id}-description`} className="cs-field-description">{description}</p>}
      {error && (
        <p id={`${id}-error`} className="cs-field-error">
          <WarningCircle aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </fieldset>
  );
}
