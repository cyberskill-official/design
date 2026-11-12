import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { AnimatedNumber, MotionProvider } from './index';
import { Button, Stat } from '../react';

function CountUp() {
  const [learners, setLearners] = useState(1284);
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      <Stat label="Active learners" value={<AnimatedNumber value={learners} locale="en-US" />} hint="this month" />
      <div><Button variant="secondary" onClick={() => setLearners(n => n + 120)}>Add 120 learners</Button></div>
    </div>
  );
}

const meta = {
  title: 'Motion/AnimatedNumber',
  component: AnimatedNumber,
  tags: ['autodocs'],
  decorators: [Story => <MotionProvider><Story /></MotionProvider>],
  args: { value: 1284, locale: 'en-US' },
} satisfies Meta<typeof AnimatedNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Renders its value as is; it counts only when the value changes. */
export const Default: Story = {};

/** A stat that counts to its new value. Screen readers hear only the final number. */
export const CountsOnChange: Story = {
  render: () => <CountUp />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Add 120 learners' }));
    await expect(canvas.getByText('1,404', { selector: '.cs-visually-hidden' })).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByText('1,404', { selector: '[aria-hidden="true"]' })).toBeInTheDocument());
  },
};

/** `from` counts up on mount. Server HTML shows `from` in the digits and the real value to screen readers. */
export const CountsOnMount: Story = {
  args: { from: 0 },
  render: args => <Stat label="Active learners" value={<AnimatedNumber {...args} />} hint="this month" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('1,284', { selector: '.cs-visually-hidden' })).toBeInTheDocument();
    await waitFor(() => expect(canvas.getByText('1,284', { selector: '[aria-hidden="true"]' })).toBeInTheDocument());
  },
};

/** Currency in Vietnamese: the format and locale go straight to Intl.NumberFormat. */
export const Currency: Story = { args: { value: 48_210_000, locale: 'vi-VN', format: { style: 'currency', currency: 'VND' } } };
