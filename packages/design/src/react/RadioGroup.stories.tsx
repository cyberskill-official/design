import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Radio, RadioGroup } from './RadioGroup';

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { label: 'Billing cycle', defaultValue: 'monthly', onValueChange: fn(), children: null },
  render: args => (
    <RadioGroup {...args}>
      <Radio value="monthly" label="Monthly" description="Billed on the 1st of each month." />
      <Radio value="yearly" label="Yearly" description="Two months free, billed once a year." />
      <Radio value="custom" label="Custom contract" disabled />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Yearly'));
    await expect(canvas.getByRole('radio', { name: 'Yearly' })).toBeChecked();
    await expect(args.onValueChange).toHaveBeenCalledWith('yearly', expect.anything());
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('radio', { name: 'Monthly' })).toBeChecked();
  },
};
export const WithDescription: Story = { args: { description: 'You can switch at the next renewal.' } };
export const WithError: Story = { args: { defaultValue: undefined, error: 'Choose a billing cycle.' } };
export const Disabled: Story = { args: { disabled: true } };
