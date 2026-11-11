'use client';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { Input, TextField, Textarea } from '@cyberskill/design';

export function TextFieldStates() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <TextField label="Work email" type="email" placeholder="name@company.vn" description="We only use it for sign-in and billing notices." />
      <TextField label="API key name" defaultValue="prod key!" error="Use letters, numbers and dashes only." />
      <TextField label="Company" optionalLabel="Optional" />
      <TextField label="Plan" defaultValue="Business" disabled />
    </div>
  );
}

export function TextFieldAdornments() {
  return (
    <div style={{ display: 'grid', gap: 20, width: '100%', maxWidth: 420 }}>
      <TextField label="Workspace address" startAdornment="https://" endAdornment=".cyberskill.world" defaultValue="acme" />
      <Input aria-label="Search" placeholder="Search projects, people, docs" startAdornment={<MagnifyingGlass aria-hidden />} endAdornment="⌘K" />
    </div>
  );
}

export function TextareaDemo() {
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <Textarea label="Instructions for the agent" description="142 of 2,000 characters" defaultValue="Answer billing questions. Escalate refunds over 5 million VND to a human." />
    </div>
  );
}
