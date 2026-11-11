'use client';
import { Sparkle } from '@phosphor-icons/react';
import { Badge, type BadgeTone } from '@cyberskill/design';

const examples: [BadgeTone, string][] = [
  ['neutral', 'Draft'],
  ['primary', 'Beta'],
  ['accent', 'New'],
  ['success', 'Active'],
  ['warning', 'Trial ends soon'],
  ['danger', 'Failed'],
  ['info', 'Syncing'],
];

export function BadgeTones() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['soft', 'solid', 'outline'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {examples.map(([tone, label]) => (
            <Badge key={tone} tone={tone} variant={variant}>{label}</Badge>
          ))}
        </div>
      ))}
    </div>
  );
}

export function BadgeSizes() {
  return (
    <>
      <Badge size="sm" tone="success">Active</Badge>
      <Badge size="md" tone="success">Active</Badge>
      <Badge size="sm" tone="primary" variant="solid">12</Badge>
      <Badge size="md" tone="primary" variant="solid">12</Badge>
    </>
  );
}

export function BadgeIcons() {
  return (
    <>
      <Badge tone="accent" icon={<Sparkle />}>AI assisted</Badge>
      <Badge tone="warning">Degraded</Badge>
      <Badge tone="danger" icon={false}>Failed</Badge>
    </>
  );
}
