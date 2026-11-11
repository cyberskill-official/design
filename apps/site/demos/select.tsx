'use client';
import { Select, SelectField } from '@cyberskill/design';
import { useState } from 'react';

const plans = [
  { value: 'starter', label: 'Starter' },
  { value: 'team', label: 'Team' },
  { value: 'business', label: 'Business' },
  { value: 'enterprise', label: 'Enterprise (contact sales)', disabled: true },
];

export function SelectStates() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <SelectField label="Plan" items={plans} placeholder="Choose a plan" description="You can change plans at any time." />
      <SelectField label="Region" items={[{ value: 'sg', label: 'Singapore' }, { value: 'fra', label: 'Frankfurt' }]} placeholder="Choose a region" error="Choose where your data is stored." />
      <SelectField label="Seats" items={plans} defaultValue="team" disabled />
    </div>
  );
}

export function SelectSizes() {
  return (
    <>
      <div style={{ width: 160 }}><Select aria-label="Plan (small)" items={plans} size="sm" defaultValue="starter" /></div>
      <div style={{ width: 180 }}><Select aria-label="Plan (medium)" items={plans} defaultValue="team" /></div>
      <div style={{ width: 200 }}><Select aria-label="Plan (large)" items={plans} size="lg" defaultValue="business" /></div>
    </>
  );
}

export function SelectControlled() {
  const [plan, setPlan] = useState<string | null>('team');
  return (
    <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 420 }}>
      <SelectField label="Plan" items={plans} value={plan} onValueChange={setPlan} />
      <p className="cs-caption">Selected value: <code>{String(plan)}</code></p>
    </div>
  );
}
