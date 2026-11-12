'use client';
import { Slider } from '@cyberskill/design';
import { useState } from 'react';

export function SliderSingle() {
  return (
    <div style={{ display: 'grid', gap: 28, width: '100%', maxWidth: 380 }}>
      <Slider label="Volume" defaultValue={40} />
      <Slider label="Locked" defaultValue={30} disabled />
    </div>
  );
}

export function SliderRange() {
  const [price, setPrice] = useState<number | readonly number[]>([2_000_000, 8_000_000]);
  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <Slider
        label="Price"
        value={price}
        onValueChange={setPrice}
        min={0}
        max={10_000_000}
        step={500_000}
        locale="vi-VN"
        format={{ style: 'currency', currency: 'VND' }}
        thumbLabels={['Giá thấp nhất', 'Giá cao nhất']}
      />
    </div>
  );
}

export function SliderMarks() {
  return (
    <div style={{ display: 'grid', gap: 28, width: '100%', maxWidth: 380 }}>
      <Slider
        label="Response length"
        defaultValue={50}
        step={25}
        showValue={false}
        marks={[{ value: 0, label: 'Short' }, 25, { value: 50, label: 'Medium' }, 75, { value: 100, label: 'Long' }]}
      />
      <Slider thumbLabels={['Zoom']} defaultValue={30} />
    </div>
  );
}
