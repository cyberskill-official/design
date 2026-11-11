'use client';
import { ChartBar, Kanban, ListBullets } from '@phosphor-icons/react';
import { SegmentedControl } from '@cyberskill/design';
import { useState } from 'react';

const views = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
  { value: 'timeline', label: 'Timeline' },
];

export function SegmentedControlDemo() {
  const [view, setView] = useState('board');
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
      <SegmentedControl label="View" items={views} value={view} onValueChange={setView} />
      <p className="cs-caption">Showing the {view} view.</p>
    </div>
  );
}

export function SegmentedControlSizes() {
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <SegmentedControl label="Date range" size="sm" items={[{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days' }]} defaultValue="30d" />
      <SegmentedControl label="View" items={views} />
      <SegmentedControl
        label="Display"
        size="lg"
        items={[
          { value: 'list', label: <><ListBullets aria-hidden="true" />List</> },
          { value: 'board', label: <><Kanban aria-hidden="true" />Board</> },
          { value: 'chart', label: <><ChartBar aria-hidden="true" />Chart</>, disabled: true },
        ]}
      />
    </div>
  );
}
