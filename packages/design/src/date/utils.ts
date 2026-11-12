// Pure date helpers (date-fns only, no React): safe to call in Server Components via '@cyberskill/design/date'.
import { format as formatFns, isValid, parse, startOfDay, startOfMonth, subDays } from 'date-fns';
import type { Locale } from 'date-fns';

export type DateRangeValue = { from: Date; to: Date };
export type DateRangePreset = { label: string; value: DateRangeValue };
export type RangePresetLabels = { today: string; last7Days: string; last30Days: string; thisMonth: string };

/**
 * The four common presets: Today, Last 7 days, Last 30 days, This month (1st to today). Override labels for Vietnamese:
 * `rangePresets({ today: 'Hôm nay', last7Days: '7 ngày qua', last30Days: '30 ngày qua', thisMonth: 'Tháng này' })`.
 * Call it while rendering so "today" stays current. Pure, so Server Components can call it too.
 */
export function rangePresets(labels: Partial<RangePresetLabels> = {}, today: Date = new Date()): DateRangePreset[] {
  const l = { today: 'Today', last7Days: 'Last 7 days', last30Days: 'Last 30 days', thisMonth: 'This month', ...labels };
  const day = startOfDay(today);
  return [
    { label: l.today, value: { from: day, to: day } },
    { label: l.last7Days, value: { from: subDays(day, 6), to: day } },
    { label: l.last30Days, value: { from: subDays(day, 29), to: day } },
    { label: l.thisMonth, value: { from: startOfMonth(day), to: day } },
  ];
}

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
 * Parses a typed time into 24-hour `"HH:mm"`. Accepts `9:30`, `09.30`, `930`, `21:30`, `9`, `9pm`, `9:30 PM`,
 * Vietnamese `9h30`, `9h`, `21H`, `9 h 30`, `9g30`, `9g` and `SA`/`CH`. Returns `null` when the text is not a time.
 */
export function parseTime(text: string): string | null {
  // `:` and `.` need minutes after them; `h`/`g` (giờ) may end the time: "21h" is 21:00.
  const m = /^(\d{1,2})(?:\s*[:.]\s*(\d{2})|\s*[hg]\s*(\d{2})?|(\d{2}))?\s*(am|pm|a|p|sa|ch)?$/i.exec(text.trim());
  if (!m) return null;
  let hours = Number(m[1]);
  const minutes = Number(m[2] ?? m[3] ?? m[4] ?? 0);
  const suffix = m[5]?.toLowerCase();
  if (suffix) {
    if (hours < 1 || hours > 12) return null;
    hours = (hours % 12) + (suffix.startsWith('p') || suffix === 'ch' ? 12 : 0);
  }
  if (hours > 23 || minutes > 59) return null;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** date-fns patterns of the values pickers submit with a native form (hidden inputs). */
export const FORM_DATE_FORMAT = 'yyyy-MM-dd';
export const FORM_DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm";

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
