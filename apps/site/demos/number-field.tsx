'use client';
import { NumberField } from '@cyberskill/design';

export function NumberFieldStates() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 260 }}>
      <NumberField label="Seats" defaultValue={5} min={1} max={50} description="Billed per seat." />
      <NumberField label="Replicas" defaultValue={0} min={1} error="Run at least 1 replica." />
      <NumberField label="Locked" defaultValue={12} disabled />
    </div>
  );
}

export function NumberFieldFormats() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 260 }}>
      <NumberField label="Monthly budget" locale="vi-VN" format={{ style: 'currency', currency: 'VND' }} defaultValue={5_000_000} step={500_000} min={0} incrementLabel="Tăng" decrementLabel="Giảm" />
      <NumberField label="Discount" format={{ style: 'percent' }} defaultValue={0.1} step={0.05} min={0} max={1} />
    </div>
  );
}

export function NumberFieldSizes() {
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 260 }}>
      <NumberField label="Small" defaultValue={2} size="sm" />
      <NumberField label="Medium" defaultValue={2} />
      <NumberField label="Large" defaultValue={2} size="lg" />
    </div>
  );
}
