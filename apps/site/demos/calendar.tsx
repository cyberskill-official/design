'use client';
import { Calendar } from '@cyberskill/design/date';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { vi } from 'react-day-picker/locale';

/** Fixed day for limits computed from today in the static HTML and the first client render, so hydration matches whatever day the site was built. Calendar marks today itself. */
export const SAMPLE_DAY = new Date(2026, 2, 18);

/** `SAMPLE_DAY` until the page has mounted, then the visitor's real today. For `min`/`max`-style limits, not for the today ring. */
export function useToday() {
  const [today, setToday] = useState(SAMPLE_DAY);
  useEffect(() => setToday(new Date()), []);
  return today;
}

export function CalendarSingle() {
  const [day, setDay] = useState<Date | undefined>();
  return <Calendar mode="single" selected={day} onSelect={setDay} />;
}

export function CalendarRange() {
  const [range, setRange] = useState<DateRange | undefined>();
  return <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} />;
}

export function CalendarMultiple() {
  const [days, setDays] = useState<Date[] | undefined>([]);
  return <Calendar mode="multiple" selected={days} onSelect={setDays} />;
}

export function CalendarLimits() {
  const today = useToday();
  const in60Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60);
  // Remounts once the real today arrives, so the shown month follows the new limits.
  return <Calendar key={today.toDateString()} mode="single" minDate={today} maxDate={in60Days} disabled={{ dayOfWeek: [0, 6] }} />;
}

export function CalendarDropdowns() {
  const today = useToday();
  return <Calendar mode="single" captionLayout="dropdown" defaultMonth={new Date(1995, 5, 1)} minDate={new Date(1940, 0, 1)} maxDate={today} />;
}

export function CalendarVietnamese() {
  const [day, setDay] = useState<Date | undefined>();
  return <Calendar mode="single" locale={vi} selected={day} onSelect={setDay} />;
}
