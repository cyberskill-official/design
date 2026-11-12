import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../react/Button';
import { DateTimePicker } from './DateTimePicker';
import { formatDate } from './utils';

const meta = {
  title: 'Date/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  args: { label: 'Meeting starts', description: 'Shown to guests in their own time zone.' },
  decorators: [Story => <div style={{ maxWidth: 400 }}><Story /></div>],
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => {
    const [value, setValue] = useState<Date | null>(new Date(2026, 2, 15, 14, 30));
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <DateTimePicker {...args} value={value} onValueChange={setValue} />
        <output className="cs-field-description">{value ? formatDate(value, 'dd/MM/yyyy HH:mm') : 'Not set'}</output>
        <Button>Schedule</Button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const time = canvas.getByRole('combobox', { name: 'Time' });
    await userEvent.clear(time);
    await userEvent.type(time, '9:15');
    await userEvent.tab();
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Schedule' })).toHaveFocus();
    await expect(canvas.getByText('15/03/2026 09:15')).toBeVisible();
  },
};

export const TwelveHour: Story = { args: { hourCycle: 12, step: 30, defaultValue: new Date(2026, 2, 15, 18, 0) } };

export const Invalid: Story = { args: { required: true, error: 'Pick a start time in the future.' } };
