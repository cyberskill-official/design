import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Fieldset } from './Fieldset';
import { TextField } from './Field';

const meta = {
  title: 'Structure/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  args: { legend: 'Billing address', description: 'Printed on every invoice.' },
  render: args => (
    <div style={{ maxWidth: 420 }}>
      <Fieldset {...args}>
        <TextField label="Company" name="company" defaultValue="Acme Vietnam JSC" />
        <TextField label="Tax code" name="taxCode" defaultValue="0312345678" />
        <TextField label="Address" name="address" />
      </Fieldset>
    </div>
  ),
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole('group', { name: 'Billing address' });
    await expect(group).toHaveAccessibleDescription('Printed on every invoice.');
  },
};

export const WithoutDescription: Story = { args: { description: undefined, legend: 'Contact' } };

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText('Company')).toBeDisabled();
  },
};
