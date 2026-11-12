import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { NumberField } from './NumberField';

const meta = {
  title: 'Pickers/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  args: { label: 'Seats', defaultValue: 5, min: 1, max: 50, onValueChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: args => (
    <div style={{ maxWidth: 240 }}>
      <NumberField {...args} />
    </div>
  ),
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }));
    await expect(canvas.getByRole('textbox', { name: 'Seats' })).toHaveValue('6');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(6, expect.anything());
  },
};

export const Currency: Story = {
  args: {
    label: 'Monthly budget',
    locale: 'vi-VN',
    format: { style: 'currency', currency: 'VND' },
    defaultValue: 5_000_000,
    step: 500_000,
    min: 0,
    max: undefined,
    description: 'Charged on the 1st of each month.',
    incrementLabel: 'Tăng',
    decrementLabel: 'Giảm',
  },
};

export const Percent: Story = {
  args: { label: 'Discount', format: { style: 'percent' }, defaultValue: 0.1, step: 0.05, min: 0, max: 1 },
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 240 }}>
      <NumberField label="Replicas" defaultValue={0} min={1} error="Run at least 1 replica." />
      <NumberField label="Locked" defaultValue={12} disabled />
      <NumberField label="Small" defaultValue={2} size="sm" />
      <NumberField label="Large" defaultValue={2} size="lg" />
    </div>
  ),
};
