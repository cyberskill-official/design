import type { Meta, StoryObj } from '@storybook/react-vite';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { expect, userEvent, within } from 'storybook/test';
import { Input, TextField, Textarea } from './Field';

const meta = {
  title: 'Forms/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Work email', placeholder: 'name@company.vn', type: 'email' },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Work email');
    await userEvent.type(input, 'linh@company.vn');
    await expect(input).toHaveValue('linh@company.vn');
  },
};
export const WithHelp: Story = { args: { description: 'We only use it for sign-in and billing notices.' } };
export const WithError: Story = { args: { label: 'API key name', type: 'text', defaultValue: 'prod key!', error: 'Use letters, numbers and dashes only.' } };
export const Required: Story = { args: { required: true } };
export const Optional: Story = { args: { label: 'Company', type: 'text', optionalLabel: 'Optional', placeholder: '' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'linh@company.vn' } };
export const Adornments: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <TextField label="Workspace address" startAdornment="https://" endAdornment=".cyberskill.world" defaultValue="acme" />
      <Input aria-label="Search" placeholder="Search projects, people, docs" startAdornment={<MagnifyingGlass aria-hidden />} endAdornment="⌘K" />
    </div>
  ),
};
export const Multiline: Story = {
  render: () => <Textarea label="Instructions for the agent" description="142 of 2,000 characters" defaultValue="Answer billing questions. Escalate refunds over 5 million VND to a human." />,
};
