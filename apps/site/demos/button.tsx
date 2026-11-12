'use client';
import { ArrowRight, Copy, PencilSimple, Plus, Sparkle } from '@phosphor-icons/react';
import { Button, ButtonGroup, IconButton } from '@cyberskill/design';
import { useState } from 'react';

export function ButtonVariants() {
  return (
    <>
      <Button>Start free trial</Button>
      <Button variant="secondary">Talk to sales</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="quiet">Preview</Button>
      <Button variant="accent" iconStart={<Sparkle />}>Ask AI</Button>
      <Button variant="danger">Delete project</Button>
      <Button variant="link">View docs</Button>
    </>
  );
}

export function ButtonSoft() {
  return (
    <>
      <Button variant="soft">Details</Button>
      <Button variant="soft" tone="accent" iconStart={<Sparkle />}>Suggest</Button>
      <Button variant="soft" tone="success">Approve</Button>
      <Button variant="soft" tone="warning">Pause</Button>
      <Button variant="soft" tone="danger">Remove</Button>
      <Button variant="soft" tone="info">Learn more</Button>
    </>
  );
}

export function ButtonSizes() {
  return (
    <>
      <Button size="sm" iconStart={<Plus />}>New project</Button>
      <Button size="md">Deploy</Button>
      <Button size="lg" iconEnd={<ArrowRight />}>Book a demo</Button>
    </>
  );
}

export function ButtonStates() {
  const [saving, setSaving] = useState(false);
  return (
    <>
      <Button loading={saving} onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1500); }}>
        {saving ? 'Saving' : 'Save changes'}
      </Button>
      <Button disabled>Disabled</Button>
      <IconButton label="Edit" icon={<PencilSimple />} />
      <IconButton label="Copy" icon={<Copy />} size="sm" />
    </>
  );
}

export function ButtonGroupDemo() {
  const [view, setView] = useState('List');
  return (
    <ButtonGroup label="View">
      {['List', 'Board', 'Timeline'].map((v) => (
        <Button key={v} variant="secondary" size="sm" aria-pressed={view === v} onClick={() => setView(v)}>
          {v}
        </Button>
      ))}
    </ButtonGroup>
  );
}
