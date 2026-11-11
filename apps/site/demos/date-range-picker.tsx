'use client';
import { DateRangePicker, rangePresets, type DateRangeValue } from '@cyberskill/design/date';
import { useState } from 'react';
import { vi } from 'react-day-picker/locale';

export function DateRangeBasic() {
  const [stay, setStay] = useState<DateRangeValue | null>(null);
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <DateRangePicker label="Stay" value={stay} onValueChange={setStay} min={new Date()} description="Check-in after 14:00." />
    </div>
  );
}

export function DateRangePresets() {
  const presets = rangePresets();
  const [period, setPeriod] = useState<DateRangeValue | null>(presets[1]!.value);
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <DateRangePicker label="Report period" value={period} onValueChange={setPeriod} presets={presets} max={new Date()} />
    </div>
  );
}

export function DateRangeVietnamese() {
  return (
    <div style={{ width: '100%', maxWidth: 360 }}>
      <DateRangePicker
        label="Kỳ báo cáo"
        locale={vi}
        presets={rangePresets({ today: 'Hôm nay', last7Days: '7 ngày qua', last30Days: '30 ngày qua', thisMonth: 'Tháng này' })}
        presetsLabel="Chọn nhanh"
        clearLabel="Xoá ngày"
        openLabel="Chọn khoảng ngày"
        invalidMessage="Nhập hai ngày dạng dd/mm/yyyy – dd/mm/yyyy."
      />
    </div>
  );
}
