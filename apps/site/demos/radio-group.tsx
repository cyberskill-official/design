'use client';
import { Radio, RadioGroup } from '@cyberskill/design';

export function RadioGroupDemo() {
  return (
    <RadioGroup label="Billing cycle" description="You can switch at the next renewal." defaultValue="monthly">
      <Radio value="monthly" label="Monthly" description="Billed on the 1st of each month." />
      <Radio value="yearly" label="Yearly" description="Two months free, billed once a year." />
      <Radio value="custom" label="Custom contract" disabled />
    </RadioGroup>
  );
}

export function RadioGroupError() {
  return (
    <RadioGroup label="Data residency" error="Choose where your data is stored.">
      <Radio value="sg" label="Singapore" />
      <Radio value="fra" label="Frankfurt" />
    </RadioGroup>
  );
}
