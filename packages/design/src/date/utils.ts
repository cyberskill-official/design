import { format as formatFns, isValid, parse } from 'date-fns';
import type { Locale } from 'date-fns';
import { useState } from 'react';
import { dateMatchModifiers, type Matcher } from 'react-day-picker';

/** Default display format for dates: Vietnamese and British order, `31/12/2026`. */
export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';

/** Formats a date with a date-fns pattern. `formatDate(new Date(2026, 2, 15))` → `"15/03/2026"`. */
export function formatDate(date: Date, format: string = DEFAULT_DATE_FORMAT, locale?: Locale): string {
  return formatFns(date, format, { locale });
}

/** Parses typed text in a date-fns pattern. Returns `null` for anything that is not a real date with a 4-digit year. */
export function parseDate(text: string, format: string = DEFAULT_DATE_FORMAT, locale?: Locale): Date | null {
  const date = parse(text.trim(), format, new Date(), { locale });
  return isValid(date) && date.getFullYear() >= 1000 ? date : null;
}

/**
 * Parses a typed time into 24-hour `"HH:mm"`. Accepts `9:30`, `09.30`, `930`, `21:30`, `9h30`, `9`, `9pm`, `9:30 PM`
 * and Vietnamese `SA`/`CH`. Returns `null` when the text is not a time.
 */
export function parseTime(text: string): string | null {
  const m = /^(\d{1,2})(?:\s*[:.h]\s*(\d{2})|(\d{2}))?\s*(am|pm|a|p|sa|ch)?$/i.exec(text.trim());
  if (!m) return null;
  let hours = Number(m[1]);
  const minutes = Number(m[2] ?? m[3] ?? 0);
  const suffix = m[4]?.toLowerCase();
  if (suffix) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (suffix.startsWith('p') || suffix === 'ch' ? 12 : 0);
  }
  if (hours > 23 || minutes > 59) return null;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Shows a `"HH:mm"` time as `09:30` (24h) or `9:30 AM` (12h, AM/PM words from the date-fns `locale`). */
export function formatTime(time: string, hourCycle: 12 | 24 = 24, locale?: Locale): string {
  return hourCycle === 24 ? time : formatFns(withTime(new Date(2000, 0, 1), time), 'h:mm a', { locale });
}

/** A copy of `date` at the `"HH:mm"` time. */
export function withTime(date: Date, time: string): Date {
  const [h = 0, m = 0] = time.split(':').map(Number);
  const next = new Date(date);
  next.setHours(h, m, 0, 0);
  return next;
}

/** Day-level check that a typed date may be picked: inside min/max and not matched by `disabled`. */
export function isPickable(date: Date, min?: Date, max?: Date, disabled?: Matcher | Matcher[]): boolean {
  return !dateMatchModifiers(date, [disabled ?? false, min ? { before: min } : false, max ? { after: max } : false].flat());
}

/** Controlled (`value` defined, `null` included) or uncontrolled (`defaultValue`) state, Base UI style. */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    setInner(next);
    if (!Object.is(next, current)) onChange?.(next);
  };
  return [current, set] as const;
}
