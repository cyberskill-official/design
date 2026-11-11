'use client';
import { DateRangePicker, rangePresets, type DateRangeValue } from '@cyberskill/design/date';
import { useState } from 'react';
import { vi } from 'react-day-picker/locale';
import { useToday } from './calendar';

export function DateRangeBasic() {
  const today = useToday();
  const [stay, setStay] = useState<DateRangeValue | null>(null);
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <DateRangePicker label="Stay" value={stay} onValueChange={setStay} min={today} description="Check-in after 14:00." />
    </div>
  );
}

export function DateRangePresets() {
  const today = useToday();
  const presets = rangePresets({}, today);
  // Until someone picks, show "Last 7 days" of whichever today is current (the sample day while hydrating).
  const [period, setPeriod] = useState<DateRangeValue | null>();
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <DateRangePicker label="Report period" value={period === undefined ? presets[1]!.value : period} onValueChange={setPeriod} presets={presets} max={today} />
    </div>
  );
}

export function DateRangeVietnamese() {
  const today = useToday();
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <DateRangePicker
        label="Kỳ báo cáo"
        locale={vi}
        presets={rangePresets({ today: 'Hôm nay', last7Days: '7 ngày qua', last30Days: '30 ngày qua', thisMonth: 'Tháng này' }, today)}
        presetsLabel="Chọn nhanh"
        clearLabel="Xoá ngày"
        openLabel="Chọn khoảng ngày"
        invalidMessage="Nhập hai ngày dạng dd/mm/yyyy – dd/mm/yyyy."
      />
    </div>
  );
}
