import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { vi } from 'react-day-picker/locale';
import { expect, userEvent, within } from 'storybook/test';
import { Calendar } from './Calendar';

// Fixed dates keep stories (and their tests) identical every day.
const march = new Date(2026, 2, 1);
const today = new Date(2026, 2, 10);

const meta = {
  title: 'Date/Calendar',
  component: Calendar,
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date | undefined>(new Date(2026, 2, 15));
    return <Calendar defaultMonth={march} today={today} mode="single" selected={selected} onSelect={setSelected} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /, 20 March 2026/ }));
    await expect(canvas.getByRole('button', { name: 'Friday, 20 March 2026, selected' })).toBeVisible();
  },
};

export const Range: Story = {
  render: () => {
    const [selected, setSelected] = useState<DateRange | undefined>({ from: new Date(2026, 2, 9), to: new Date(2026, 2, 13) });
    return <Calendar defaultMonth={march} today={today} mode="range" selected={selected} onSelect={setSelected} />;
  },
};

export const TwoMonths: Story = {
  render: () => <Calendar defaultMonth={march} today={today} mode="range" numberOfMonths={2} selected={{ from: new Date(2026, 2, 26), to: new Date(2026, 3, 4) }} />,
};

export const Multiple: Story = {
  render: () => {
    const [selected, setSelected] = useState<Date[] | undefined>([new Date(2026, 2, 4), new Date(2026, 2, 11), new Date(2026, 2, 18)]);
    return <Calendar defaultMonth={march} today={today} mode="multiple" selected={selected} onSelect={setSelected} />;
  },
};

/** Weekends disabled and a bookable window: days outside it are struck through and navigation stops at its months. */
export const DisabledDates: Story = {
  render: () => <Calendar defaultMonth={march} today={today} mode="single" minDate={new Date(2026, 2, 5)} maxDate={new Date(2026, 3, 20)} disabled={{ dayOfWeek: [0, 6] }} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /, 4 March 2026/ })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Go to the Previous Month' })).toHaveAttribute('aria-disabled', 'true');
  },
};

/** Month and year dropdowns for dates far from today, such as a date of birth. */
export const Dropdowns: Story = {
  render: () => <Calendar today={today} mode="single" captionLayout="dropdown" defaultMonth={new Date(1994, 5, 1)} minDate={new Date(1940, 0, 1)} maxDate={new Date(2026, 11, 31)} />,
};

/** `locale={vi}` from `react-day-picker/locale` translates month names, weekdays and screen-reader labels. */
export const Vietnamese: Story = {
  render: () => <Calendar defaultMonth={march} today={today} mode="single" locale={vi} selected={new Date(2026, 2, 15)} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button', { name: 'Đến tháng tiếp theo' })).toBeVisible();
  },
};
