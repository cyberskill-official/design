'use client';
import { TimePicker } from '@cyberskill/design/date';
import { useState } from 'react';

export function TimePickerStates() {
  const [start, setStart] = useState<string | null>('09:30');
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 240 }}>
      <TimePicker label="Start time" value={start} onValueChange={setStart} description="Type 9:30, 21:30 or 930." />
      <TimePicker label="Appointment" min="08:00" max="17:30" step={30} description="Every 30 minutes, 8:00 to 17:30." />
      <TimePicker label="Pickup" hourCycle={12} defaultValue="18:00" />
      <TimePicker label="End time" error="The end time must be after the start time." />
    </div>
  );
}

export function TimePickerVietnamese() {
  return (
    <div style={{ width: '100%', maxWidth: 240 }}>
      <TimePicker label="Giờ hẹn" step={30} min="08:00" max="20:00" invalidMessage="Giờ không hợp lệ (08:00 – 20:00)." placeholder="hh:mm" />
    </div>
  );
}
