'use client';
import { Button, Stat } from '@cyberskill/design';
import { AnimatedNumber } from '@cyberskill/design/motion';
import { useState } from 'react';

export function AnimatedNumberDemo() {
  const [learners, setLearners] = useState(1284);
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 320 }}>
      <Stat label="Active learners" value={<AnimatedNumber value={learners} locale="en-US" />} hint="this month" />
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" size="sm" onClick={() => setLearners(n => n + 120)}>Add 120</Button>
        <Button variant="secondary" size="sm" onClick={() => setLearners(n => Math.max(0, n - 120))}>Remove 120</Button>
      </div>
    </div>
  );
}

export function CountOnMountDemo() {
  const [run, setRun] = useState(0);
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 320 }}>
      <Stat key={run} label="Course completions" value={<AnimatedNumber value={8420} from={0} locale="en-US" />} hint="since launch" />
      <div><Button variant="secondary" size="sm" onClick={() => setRun(r => r + 1)}>Replay</Button></div>
    </div>
  );
}

export function CurrencyNumberDemo() {
  const [revenue, setRevenue] = useState(48_210_000);
  return (
    <div style={{ display: 'grid', gap: 16, width: '100%', maxWidth: 320 }}>
      <Stat label="Doanh thu tháng" value={<AnimatedNumber value={revenue} locale="vi-VN" format={{ style: 'currency', currency: 'VND' }} />} />
      <div><Button variant="secondary" size="sm" onClick={() => setRevenue(n => n + 2_500_000)}>Thêm đơn hàng</Button></div>
    </div>
  );
}
