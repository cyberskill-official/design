'use client';
import { MultiSelect, MultiSelectField } from '@cyberskill/design';
import { useState } from 'react';

const skills = [
  { value: 'react', label: 'React' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'node', label: 'Node.js' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'python', label: 'Python' },
  { value: 'figma', label: 'Figma', description: 'Design' },
];

export function MultiSelectStates() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <MultiSelectField label="Skills" items={skills} placeholder="Add skills" description="Shown on your public profile." />
      <MultiSelectField label="Tags" items={skills} defaultValue={['react']} error="Add at least two tags." />
      <MultiSelectField label="Locked" items={skills} defaultValue={['ts', 'go']} disabled />
    </div>
  );
}

export function MultiSelectLimits() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <MultiSelectField label="Reviewers" items={skills} defaultValue={['react', 'ts']} max={3} description="Up to 3 reviewers." />
      <MultiSelectField label="Stack" items={skills} defaultValue={['react', 'ts', 'node', 'go']} maxChips={2} />
    </div>
  );
}

export function MultiSelectControlled() {
  const [value, setValue] = useState<string[]>(['react', 'go']);
  return (
    <div style={{ display: 'grid', gap: 8, width: '100%', maxWidth: 420 }}>
      <MultiSelect aria-label="Skills" items={skills} value={value} onValueChange={setValue} size="sm" removeLabel={(l) => `Bỏ ${l}`} />
      <p style={{ margin: 0, fontSize: 13 }}>Value: <code>{JSON.stringify(value)}</code></p>
    </div>
  );
}
