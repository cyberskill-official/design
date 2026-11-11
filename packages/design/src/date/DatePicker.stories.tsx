import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { vi } from 'react-day-picker/locale';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { DatePicker } from './DatePicker';

const march15 = new Date(2026, 2, 15);

const meta = {
  title: 'Date/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { label: 'Start date', description: 'Type dd/mm/yyyy or pick from the calendar.' },
  decorators: [Story => <div style={{ maxWidth: 320 }}><Story /></div>],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState<Date | null>(march15);
    return <DatePicker {...args} value={value} onValueChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Start date' });
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Choose date' }));
    const dialog = await screen.findByRole('dialog', { name: 'Choose date' });
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));
    await userEvent.click(within(dialog).getByRole('button', { name: /, 20 March 2026/ }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(input).toHaveValue('20/03/2026');
  },
};

export const Typing: Story = {
  args: { defaultValue: null },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Start date' });
    await userEvent.type(input, '1/4/2026');
    await userEvent.tab();
    await expect(input).toHaveValue('01/04/2026');
  },
};

export const Invalid: Story = {
  args: { min: new Date(2026, 0, 1), invalidMessage: 'Enter a date from 01/01/2026 as dd/mm/yyyy.' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Start date' });
    await userEvent.type(input, '31/02/2026');
    await userEvent.tab();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  },
};

export const MinMax: Story = {
  args: { label: 'Delivery date', defaultValue: new Date(2026, 2, 18), min: new Date(2026, 2, 16), max: new Date(2026, 3, 15), disabledDates: { dayOfWeek: [0] }, description: 'Within 30 days, no Sundays.' },
};

export const Vietnamese: Story = {
  args: { label: 'Ngày bắt đầu', description: 'Nhập dd/mm/yyyy hoặc chọn trên lịch.', locale: vi, defaultValue: march15, clearLabel: 'Xoá ngày', openLabel: 'Chọn ngày', invalidMessage: 'Ngày không hợp lệ' },
};

export const Disabled: Story = { args: { defaultValue: march15, disabled: true } };
