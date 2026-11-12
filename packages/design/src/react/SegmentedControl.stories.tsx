import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kanban, ListBullets, ChartBar } from '@phosphor-icons/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SegmentedControl } from './SegmentedControl';

const views = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
  { value: 'timeline', label: 'Timeline' },
];

const meta = {
  title: 'Forms/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: { label: 'View', items: views, onValueChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Board' }));
    await expect(canvas.getByRole('button', { name: 'Board' })).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onValueChange).toHaveBeenCalledWith('board');
    // Pressing the selected segment again keeps it selected.
    await userEvent.click(canvas.getByRole('button', { name: 'Board' }));
    await expect(canvas.getByRole('button', { name: 'Board' })).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Sizes: Story = {
  render: args => (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <SegmentedControl {...args} size="sm" />
      <SegmentedControl {...args} size="md" />
      <SegmentedControl {...args} size="lg" />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    items: [
      { value: 'list', label: <><ListBullets aria-hidden="true" />List</> },
      { value: 'board', label: <><Kanban aria-hidden="true" />Board</> },
      { value: 'chart', label: <><ChartBar aria-hidden="true" />Chart</> },
    ],
    defaultValue: 'board',
  },
};

export const DisabledSegment: Story = {
  args: {
    label: 'Date range',
    items: [{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days' }, { value: '1y', label: '1 year', disabled: true }],
    defaultValue: '30d',
  },
};
