'use client';
import { Checkbox, CheckboxGroup } from '@cyberskill/design';
import { useState } from 'react';

export function CheckboxStates() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox label="Email me a weekly summary" description="Sent on Mondays at 9:00." />
      <Checkbox label="Remember this device" defaultChecked />
      <Checkbox label="Select all" indeterminate />
      <Checkbox label="Managed by your admin" disabled defaultChecked />
      <Checkbox label="I accept the terms of service" error="Accept the terms to continue." />
    </div>
  );
}

export function CheckboxGroupDemo() {
  return (
    <CheckboxGroup label="Notify me about" description="Applies to every workspace you belong to." defaultValue={['mentions', 'replies']}>
      <Checkbox value="mentions" label="Mentions" />
      <Checkbox value="replies" label="Replies" description="Only in threads you follow." />
      <Checkbox value="deploys" label="Failed deploys" />
      <Checkbox value="billing" label="Billing changes" disabled />
    </CheckboxGroup>
  );
}

const regions = ['ap-southeast-1', 'eu-central-1', 'us-east-1'];

export function ParentCheckboxDemo() {
  const [value, setValue] = useState<string[]>(['eu-central-1']);
  return (
    <CheckboxGroup label="Replicate to" value={value} onValueChange={setValue} allValues={regions}>
      <Checkbox parent label="All regions" />
      <div style={{ display: 'grid', gap: 12, paddingInlineStart: 28 }}>
        {regions.map((r) => <Checkbox key={r} value={r} label={r} />)}
      </div>
    </CheckboxGroup>
  );
}
