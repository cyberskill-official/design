'use client';
import { CurrencyDollar, Timer, UsersThree } from '@phosphor-icons/react';
import { Stat } from '@cyberskill/design';

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, width: '100%' } as const;

export function StatRow() {
  return (
    <div style={grid}>
      <Stat label="Monthly revenue" value="$48,210" delta={{ value: '+8.4%', trend: 'up' }} hint="vs. last month" />
      <Stat label="Churn" value="2.1%" delta={{ value: '−0.4 pts', trend: 'down', sentiment: 'positive' }} hint="vs. last month" />
      <Stat label="p95 latency" value="412 ms" delta={{ value: '+38 ms', trend: 'up', sentiment: 'negative' }} hint="vs. yesterday" />
    </div>
  );
}

export function StatIcons() {
  return (
    <div style={grid}>
      <Stat label="Monthly revenue" value="$48,210" icon={<CurrencyDollar />} tone="accent" delta={{ value: '+8.4%', trend: 'up' }} hint="vs. last month" />
      <Stat label="Active users" value="1,284" icon={<UsersThree />} tone="blue" delta={{ value: '+12%', trend: 'up' }} hint="vs. last week" />
      <Stat label="p95 latency" value="412 ms" icon={<Timer />} delta={{ value: '+38 ms', trend: 'up', sentiment: 'negative' }} hint="vs. yesterday" />
    </div>
  );
}

const points = [12, 14, 13, 17, 16, 19, 22, 21, 24, 27];
const path = points.map((y, i) => `${i ? 'L' : 'M'}${(i / (points.length - 1)) * 100},${32 - y}`).join(' ');

export function StatSparkline() {
  return (
    <Stat label="Active users" value="1,284" delta={{ value: '+12%', trend: 'up' }} hint="vs. last week" style={{ width: '100%', maxWidth: 280 }}>
      <svg role="img" aria-label="Active users rising over the last 10 weeks" viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: '100%', height: 40, color: 'var(--chart-1)' }}>
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </Stat>
  );
}
