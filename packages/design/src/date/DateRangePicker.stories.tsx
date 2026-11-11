import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { vi } from 'react-day-picker/locale';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { DateRangePicker, rangePresets, type DateRangeValue } from './DateRangePicker';

const today = new Date(2026, 2, 18);

const meta = {
  title: 'Date/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  args: { label: 'Report period', numberOfMonths: 2 },
  decorators: [Story => <div style={{ maxWidth: 360 }}><Story /></div>],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState<DateRangeValue | null>({ from: new Date(2026, 2, 3), to: new Date(2026, 2, 12) });
    return <DateRangePicker {...args} value={value} onValueChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Choose dates' }));
    const dialog = await screen.findByRole('dialog', { name: 'Choose dates' });
    await userEvent.click(within(dialog).getByRole('button', { name: /, 23 March 2026/ }));
    await userEvent.click(within(dialog).getByRole('button', { name: /, 27 March 2026/ }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await expect(within(canvasElement).getByRole('textbox', { name: 'Report period' })).toHaveValue('23/03/2026 – 27/03/2026');
  },
};

export const WithPresets: Story = {
  args: { presets: rangePresets({}, today), defaultValue: rangePresets({}, today)[1]!.value },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Choose dates' }));
    const group = await screen.findByRole('group', { name: 'Presets' });
    await expect(within(group).getByRole('button', { name: 'Last 7 days' })).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Vietnamese: Story = {
  args: {
    label: 'Kỳ báo cáo',
    locale: vi,
    presets: rangePresets({ today: 'Hôm nay', last7Days: '7 ngày qua', last30Days: '30 ngày qua', thisMonth: 'Tháng này' }, today),
    presetsLabel: 'Chọn nhanh',
    clearLabel: 'Xoá ngày',
    openLabel: 'Chọn khoảng ngày',
    invalidMessage: 'Nhập hai ngày dạng dd/mm/yyyy – dd/mm/yyyy',
  },
};

export const Invalid: Story = {
  args: { error: 'The end date must be within 90 days of the start.' , defaultValue: { from: new Date(2026, 0, 1), to: new Date(2026, 5, 1) } },
};
