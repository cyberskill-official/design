'use client';
import { Calendar } from '@cyberskill/design/date';
import { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { vi } from 'react-day-picker/locale';

/** Fixed day for the static HTML and the first client render, so hydration matches whatever day the site was built. */
export const SAMPLE_DAY = new Date(2026, 2, 18);

/** `SAMPLE_DAY` until the page has mounted, then the visitor's real today. */
export function useToday() {
  const [today, setToday] = useState(SAMPLE_DAY);
  useEffect(() => setToday(new Date()), []);
  return today;
}

export function CalendarSingle() {
  const today = useToday();
  const [day, setDay] = useState<Date | undefined>(SAMPLE_DAY);
  return <Calendar mode="single" today={today} selected={day} onSelect={setDay} />;
}

export function CalendarRange() {
  const today = useToday();
  const [range, setRange] = useState<DateRange | undefined>();
  return <Calendar mode="range" numberOfMonths={2} today={today} selected={range} onSelect={setRange} />;
}

export function CalendarMultiple() {
  const today = useToday();
  const [days, setDays] = useState<Date[] | undefined>([]);
  return <Calendar mode="multiple" today={today} selected={days} onSelect={setDays} />;
}

export function CalendarLimits() {
  const today = useToday();
  const in60Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60);
  // Remounts once the real today arrives, so the shown month follows the new limits.
  return <Calendar key={today.toDateString()} mode="single" today={today} minDate={today} maxDate={in60Days} disabled={{ dayOfWeek: [0, 6] }} />;
}

export function CalendarDropdowns() {
  const today = useToday();
  return <Calendar mode="single" captionLayout="dropdown" today={today} defaultMonth={new Date(1995, 5, 1)} minDate={new Date(1940, 0, 1)} maxDate={today} />;
}

export function CalendarVietnamese() {
  const today = useToday();
  const [day, setDay] = useState<Date | undefined>(SAMPLE_DAY);
  return <Calendar mode="single" locale={vi} today={today} selected={day} onSelect={setDay} />;
}
