import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Checkbox, CheckboxGroup } from './Checkbox';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Email me a weekly summary', onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const box = within(canvasElement).getByRole('checkbox', { name: 'Email me a weekly summary' });
    await userEvent.click(box);
    await expect(box).toHaveAttribute('aria-checked', 'true');
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  },
};
export const WithDescription: Story = { args: { description: 'Sent on Mondays at 9:00. Unsubscribe from any email.' } };
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { label: 'Select all', indeterminate: true } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
export const WithError: Story = { args: { label: 'I accept the terms of service', error: 'Accept the terms to continue.' } };

export const Group: Story = {
  render: () => (
    <CheckboxGroup label="Notify me about" description="Applies to every workspace you belong to." defaultValue={['mentions', 'replies']}>
      <Checkbox value="mentions" label="Mentions" />
      <Checkbox value="replies" label="Replies" description="Only in threads you follow." />
      <Checkbox value="deploys" label="Failed deploys" />
      <Checkbox value="billing" label="Billing changes" disabled />
    </CheckboxGroup>
  ),
};

const regions = ['ap-southeast-1', 'eu-central-1', 'us-east-1'];
function ParentExample() {
  const [value, setValue] = useState<string[]>(['eu-central-1']);
  return (
    <CheckboxGroup label="Replicate to" value={value} onValueChange={setValue} allValues={regions}>
      <Checkbox parent label="All regions" />
      <div style={{ display: 'grid', gap: 12, paddingInlineStart: 28 }}>
        {regions.map(r => <Checkbox key={r} value={r} label={r} />)}
      </div>
    </CheckboxGroup>
  );
}

export const ParentCheckbox: Story = {
  render: () => <ParentExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const all = canvas.getByRole('checkbox', { name: 'All regions' });
    await expect(all).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.click(all);
    await expect(canvas.getByRole('checkbox', { name: 'us-east-1' })).toHaveAttribute('aria-checked', 'true');
  },
};
