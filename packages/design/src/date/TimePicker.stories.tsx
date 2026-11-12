import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { TimePicker } from './TimePicker';

const meta = {
  title: 'Date/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  args: { label: 'Start time', description: 'Type 9:30 or 21:30, or pick from the list.' },
  decorators: [Story => <div style={{ maxWidth: 220 }}><Story /></div>],
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState<string | null>('09:30');
    return <TimePicker {...args} value={value} onValueChange={setValue} />;
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Start time' });
    await userEvent.click(input);
    const list = await screen.findByRole('listbox');
    await userEvent.click(within(list).getByRole('option', { name: '10:15' }));
    await waitFor(() => expect(input).toHaveValue('10:15'));
  },
};

export const Typing: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Start time' });
    await userEvent.type(input, '2130');
    await userEvent.tab();
    await expect(input).toHaveValue('21:30');
  },
};

export const TwelveHour: Story = { args: { hourCycle: 12, defaultValue: '14:00', step: 30 } };

export const OfficeHours: Story = { args: { label: 'Appointment', min: '08:00', max: '17:30', step: 30, defaultValue: '13:30', description: 'Every 30 minutes, 8:00 to 17:30.' } };

export const Invalid: Story = {
  args: { invalidMessage: 'Giờ không hợp lệ', label: 'Giờ bắt đầu', description: undefined },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Giờ bắt đầu' });
    await userEvent.type(input, '25:00');
    await userEvent.tab();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Disabled: Story = { args: { defaultValue: '09:30', disabled: true } };
