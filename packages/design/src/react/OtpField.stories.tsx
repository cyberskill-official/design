import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { OtpField } from './OtpField';

const meta = {
  title: 'Pickers/OtpField',
  component: OtpField,
  tags: ['autodocs'],
  args: { label: 'Verification code', description: 'We sent a 6-digit code to +84 90 123 4567.', onComplete: fn() },
} satisfies Meta<typeof OtpField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('textbox', { name: 'Verification code' }));
    await userEvent.keyboard('482913');
    await expect(args.onComplete).toHaveBeenCalledWith('482913', expect.anything());
  },
};

export const Invalid: Story = {
  args: { defaultValue: '123456', error: 'That code is not valid. Check the latest SMS.' },
};

export const FourDigits: Story = {
  args: { label: 'PIN', length: 4, mask: true, description: undefined },
};

export const Alphanumeric: Story = {
  args: { label: 'Recovery code', validationType: 'alphanumeric', length: 8, description: 'Letters and numbers, e.g. A7C9XZ2B.' },
};

export const Disabled: Story = { args: { defaultValue: '12', disabled: true } };
