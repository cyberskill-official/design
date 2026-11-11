'use client';
import { Calendar } from '@cyberskill/design/date';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { vi } from 'react-day-picker/locale';

export function CalendarSingle() {
  const [day, setDay] = useState<Date | undefined>(new Date());
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
  const today = new Date();
  const in60Days = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 60);
  return <Calendar mode="single" minDate={today} maxDate={in60Days} disabled={{ dayOfWeek: [0, 6] }} />;
}

export function CalendarDropdowns() {
  return <Calendar mode="single" captionLayout="dropdown" defaultMonth={new Date(1995, 5, 1)} minDate={new Date(1940, 0, 1)} maxDate={new Date()} />;
}

export function CalendarVietnamese() {
  const [day, setDay] = useState<Date | undefined>(new Date());
  return <Calendar mode="single" locale={vi} selected={day} onSelect={setDay} />;
}
