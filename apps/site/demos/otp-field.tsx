'use client';
import { OtpField } from '@cyberskill/design';
import { useState } from 'react';

export function OtpFieldDemo() {
  const [status, setStatus] = useState('');
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <OtpField label="Verification code" description="We sent a 6-digit code to +84 90 123 4567." onComplete={(code) => setStatus(`Checking ${code}…`)} onValueChange={() => setStatus('')} />
      <p role="status" style={{ margin: 0, fontSize: 13, minHeight: 18 }}>{status}</p>
    </div>
  );
}

export function OtpFieldStates() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <OtpField label="Wrong code" defaultValue="123456" error="That code is not valid. Check the latest SMS." />
      <OtpField label="PIN" length={4} mask />
      <OtpField label="Recovery code" length={8} validationType="alphanumeric" slotLabel={(n, total) => `Ký tự ${n} trên ${total}`} />
    </div>
  );
}
