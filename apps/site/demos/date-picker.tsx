'use client';
import { DatePicker, DateTimePicker, formatDate } from '@cyberskill/design/date';
import { useState } from 'react';
import { vi } from 'react-day-picker/locale';
import { useToday } from './calendar';

export function DatePickerStates() {
  const [start, setStart] = useState<Date | null>(new Date(2026, 2, 15));
  const today = useToday();
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 320 }}>
      <DatePicker label="Start date" value={start} onValueChange={setStart} description="Type dd/mm/yyyy or pick from the calendar." />
      <DatePicker label="Delivery date" min={today} max={new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30)} disabledDates={{ dayOfWeek: [0] }} description="Within 30 days, no Sundays." />
      <DatePicker label="End date" error="The end date must be after the start date." />
      <DatePicker label="Contract signed" defaultValue={new Date(2025, 10, 3)} disabled />
    </div>
  );
}

export function DatePickerVietnamese() {
  const today = useToday();
  return (
    <div style={{ width: '100%', maxWidth: 320 }}>
      <DatePicker
        label="Ngày sinh"
        locale={vi}
        defaultValue={new Date(1995, 5, 12)}
        max={today}
        invalidMessage="Ngày không hợp lệ. Nhập dạng dd/mm/yyyy."
        clearLabel="Xoá ngày"
        openLabel="Chọn ngày"
      />
    </div>
  );
}

export function DateTimePickerDemo() {
  const [start, setStart] = useState<Date | null>(new Date(2026, 2, 15, 14, 30));
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 360 }}>
      <DateTimePicker label="Meeting starts" value={start} onValueChange={setStart} step={30} description="Guests see it in their own time zone." />
      <output style={{ font: '400 13px/18px var(--font-mono)', color: 'var(--muted)' }}>{start ? formatDate(start, 'dd/MM/yyyy HH:mm') : 'Not set'}</output>
    </div>
  );
}
