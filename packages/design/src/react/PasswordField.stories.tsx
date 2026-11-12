import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { PasswordField } from './PasswordField';

const meta = {
  title: 'Forms/PasswordField',
  component: PasswordField,
  tags: ['autodocs'],
  args: { label: 'Password', name: 'password' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: args => (
    <div style={{ maxWidth: 360 }}>
      <PasswordField {...args} />
    </div>
  ),
} satisfies Meta<typeof PasswordField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password');
    await userEvent.type(input, 'correct horse');
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(input).toHaveAttribute('type', 'text');
    await expect(canvas.getByRole('button', { name: 'Hide password' })).toBeVisible();
    await expect(input).toHaveFocus();
  },
};
export const WithHelp: Story = { args: { label: 'New password', autoComplete: 'new-password', description: 'At least 12 characters. A short sentence works well.' } };
export const WithError: Story = { args: { defaultValue: 'short', error: 'Use at least 12 characters.' } };
export const Shown: Story = { args: { defaultValue: 'correct horse battery', defaultVisible: true } };
export const Disabled: Story = { args: { defaultValue: 'secret', disabled: true } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <PasswordField label="Small" size="sm" defaultValue="secret" />
      <PasswordField label="Medium" defaultValue="secret" />
      <PasswordField label="Large" size="lg" defaultValue="secret" />
    </div>
  ),
};
export const Vietnamese: Story = {
  args: { label: 'Mật khẩu', showPasswordLabel: 'Hiện mật khẩu', hidePasswordLabel: 'Ẩn mật khẩu', description: 'Ít nhất 12 ký tự.' },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Hiện mật khẩu' }));
    await expect(within(canvasElement).getByRole('button', { name: 'Ẩn mật khẩu' })).toBeVisible();
  },
};
