import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Select, SelectField } from './Select';
import { clickOption } from '../test/story-helpers';

const plans = [
  { value: 'starter', label: 'Starter' },
  { value: 'team', label: 'Team' },
  { value: 'business', label: 'Business' },
  { value: 'enterprise', label: 'Enterprise (contact sales)', disabled: true },
];

const meta = {
  title: 'Forms/Select',
  component: SelectField,
  tags: ['autodocs'],
  args: { label: 'Plan', items: plans, placeholder: 'Choose a plan', onValueChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: args => (
    <div style={{ maxWidth: 360 }}>
      <SelectField {...args} />
    </div>
  ),
} satisfies Meta<typeof SelectField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const trigger = within(canvasElement).getByRole('combobox', { name: 'Plan' });
    await userEvent.click(trigger);
    await clickOption('Team');
    await expect(args.onValueChange).toHaveBeenCalledWith('team', expect.anything());
    await waitFor(() => expect(trigger).toHaveTextContent('Team'));
  },
};
export const WithHelp: Story = { args: { description: 'You can change plans at any time.' } };
export const WithError: Story = { args: { label: 'Region', placeholder: 'Choose a region', error: 'Choose where your data is stored.' } };
export const Required: Story = { args: { required: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'business' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, maxWidth: 640 }}>
      <Select aria-label="Plan (small)" items={plans} size="sm" defaultValue="starter" />
      <Select aria-label="Plan (medium)" items={plans} defaultValue="team" />
      <Select aria-label="Plan (large)" items={plans} size="lg" defaultValue="business" />
    </div>
  ),
};
