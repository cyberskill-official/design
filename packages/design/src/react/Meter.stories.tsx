import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Meter } from './Meter';

const meta = {
  title: 'Feedback/Meter',
  component: Meter,
  tags: ['autodocs'],
  args: { label: 'API calls this month', value: 720_000, max: 1_000_000, valueLabel: '720K of 1M' },
  argTypes: { tone: { control: 'inline-radio', options: ['primary', 'warning', 'danger'] } },
  render: args => <div style={{ width: 360 }}><Meter {...args} /></div>,
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Usage: Story = {
  play: async ({ canvasElement }) => {
    const meter = within(canvasElement).getByRole('meter', { name: 'API calls this month' });
    await expect(meter).toHaveAttribute('aria-valuetext', '720K of 1M');
  },
};

export const Percentage: Story = { args: { label: 'Storage', value: 38, max: 100, valueLabel: undefined } };

export const NearLimit: Story = { args: { value: 860_000, valueLabel: '860K of 1M', warnAt: 800_000 } };

export const AtLimit: Story = { args: { label: 'Seats', value: 10, max: 10, valueLabel: '10 of 10', tone: 'danger' } };
