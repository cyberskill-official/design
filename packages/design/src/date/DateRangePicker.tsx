import { addDays, isSameDay } from 'date-fns';
import type { Locale } from 'date-fns';
import { useState, useSyncExternalStore } from 'react';
import type { DateRange, Matcher } from 'react-day-picker';
import { Button } from '../react/Button';
import { Calendar, type CalendarProps } from './Calendar';
import { PickerField, type PickerFieldProps } from './PickerField';
import { DEFAULT_DATE_FORMAT, FORM_DATE_FORMAT, formatDate, parseDate, type DateRangePreset, type DateRangeValue } from './utils';
import { isPickable, useControllable } from './picker-state';

export type { DateRangePreset, DateRangeValue, RangePresetLabels } from './utils';

export type DateRangePickerProps = Omit<PickerFieldProps, 'placeholder' | 'name'> & {
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  /** Called with a full range, or `null` when cleared or when the typed text is not two allowed dates. */
  onValueChange?: (value: DateRangeValue | null) => void;
  /** Submits the range with a native form as two hidden inputs, `name[from]` and `name[to]`, each `yyyy-MM-dd`. */
  name?: string;
  /** date-fns pattern for each date. */
  format?: string;
  locale?: Locale;
  min?: Date;
  max?: Date;
  disabledDates?: Matcher | Matcher[];
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Reject ranges that span a day outside `min` / `max` or in `disabledDates` (e.g. a booking across a closed day): typed
   * text and presets that do are invalid, and a second click that would span one starts a new range there instead.
   */
  excludeDisabled?: boolean;
  /** Calendar screen-reader labels (react-day-picker `labels`), e.g. `labelDayButton` for the "Today" and "selected" words. */
  labels?: CalendarProps['labels'];
  /** Quick picks beside the calendar, e.g. `rangePresets()`. A preset with a start or end outside `min`, `max` or `disabledDates` is disabled. */
  presets?: DateRangePreset[];
  /** Accessible name of the presets group. */
  presetsLabel?: string;
  /** Months side by side. Default 2 from 640px wide, 1 below. */
  numberOfMonths?: number;
  /** Defaults to `dd/mm/yyyy – dd/mm/yyyy` from `format`. */
  placeholder?: string;
};

const SEPARATOR = ' – ';
const WIDE = '(min-width: 640px)';
const subscribe = (onChange: () => void) => {
  const query = matchMedia(WIDE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

/** Labelled range field: type `01/03/2026 – 15/03/2026`, pick two days on a two-month calendar, or use presets. */
export function DateRangePicker({ value, defaultValue = null, onValueChange, format = DEFAULT_DATE_FORMAT, locale, min, max, disabledDates, weekStartsOn, excludeDisabled = false, labels, presets, presetsLabel = 'Presets', numberOfMonths, placeholder = `${format.toLowerCase()}${SEPARATOR}${format.toLowerCase()}`, clearLabel = 'Clear dates', openLabel = 'Choose dates', name, ...props }: DateRangePickerProps) {
  const [current, setCurrent, resets] = useControllable(value, defaultValue, onValueChange);
  const wide = useSyncExternalStore(subscribe, () => matchMedia(WIDE).matches, () => true);
  const months = numberOfMonths ?? (wide ? 2 : 1);
  const toText = (r: DateRangeValue) => `${formatDate(r.from, format, locale)}${SEPARATOR}${formatDate(r.to, format, locale)}`;
  // One rule for typed ranges, presets and clicks: both ends (with excludeDisabled every day) must be pickable.
  const pickable = (d: Date) => isPickable(d, min, max, disabledDates);
  const allowed = (from: Date, to: Date) => {
    if (!pickable(from) || !pickable(to)) return false;
    // min and max are covered by the ends; only `disabledDates` can sit in between. Stops at the first disabled day.
    if (excludeDisabled && disabledDates) for (let d = addDays(from, 1); d < to; d = addDays(d, 1)) if (!pickable(d)) return false;
    return true;
  };
  // The range comes back in order.
  const toRange = (a?: Date | null, b?: Date | null): DateRangeValue | null => {
    if (!a || !b) return null;
    const [from, to] = a <= b ? [a, b] : [b, a];
    return allowed(from, to) ? { from, to } : null;
  };
  const fromText = (text: string): DateRangeValue | null => {
    // Any dash splits when the format has none; otherwise a hyphen needs spaces around it, so `yyyy-MM-dd` still works.
    const [a, b, ...rest] = text.split(format.includes('-') ? /\s+[-–—]\s+|\s*[–—]\s*/ : /\s*[-–—]\s*/).map(part => parseDate(part, format, locale));
    return rest.length ? null : toRange(a, b);
  };
  const formFields = name ? { [`${name}[from]`]: current ? formatDate(current.from, FORM_DATE_FORMAT) : '', [`${name}[to]`]: current ? formatDate(current.to, FORM_DATE_FORMAT) : '' } : undefined;

  return (
    <PickerField {...props} placeholder={placeholder} clearLabel={clearLabel} openLabel={openLabel} value={current} resets={resets} formFields={formFields} onCommit={setCurrent} toText={toText} fromText={fromText}>
      {select => (
        <div className="cs-date-range-panel">
          {presets?.length ? (
            <div className="cs-date-range-presets" role="group" aria-label={presetsLabel}>
              {presets.map(p => {
                const range = toRange(p.value.from, p.value.to);
                return (
                  <Button key={p.label} variant="ghost" size="sm" disabled={!range} aria-pressed={!!current && isSameDay(p.value.from, current.from) && isSameDay(p.value.to, current.to)} onClick={() => range && select(range)}>
                    {p.label}
                  </Button>
                );
              })}
            </div>
          ) : null}
          <RangeCalendar value={current} onPick={select} allowed={allowed} labels={labels} numberOfMonths={months} locale={locale} minDate={min} maxDate={max} disabled={disabledDates} weekStartsOn={weekStartsOn} />
        </div>
      )}
    </PickerField>
  );
}

type RangeCalendarProps = { value: DateRangeValue | null; onPick: (range: DateRangeValue) => void; allowed: (from: Date, to: Date) => boolean; labels?: CalendarProps['labels']; numberOfMonths: number; locale?: Locale; minDate?: Date; maxDate?: Date; disabled?: Matcher | Matcher[]; weekStartsOn?: DateRangePickerProps['weekStartsOn'] };

// First click starts a new range, second click finishes it and closes. Lives inside the popup, so it resets on every open.
function RangeCalendar({ value, onPick, allowed, ...props }: RangeCalendarProps) {
  const [draft, setDraft] = useState<DateRange | undefined>(value ?? undefined);
  return (
    <Calendar
      {...props}
      mode="range"
      selected={draft}
      defaultMonth={value?.from}
      onSelect={(_range, day) => {
        const from = draft?.from;
        const range = from && !draft?.to && (day < from ? { from: day, to: from } : { from, to: day });
        if (!range || !allowed(range.from, range.to)) return setDraft({ from: day, to: undefined });
        onPick(range);
      }}
    />
  );
}
