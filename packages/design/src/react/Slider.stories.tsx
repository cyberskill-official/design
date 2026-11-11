import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Slider } from './Slider';

const meta = {
  title: 'Pickers/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { label: 'Volume', defaultValue: 40, onValueChange: fn() },
  render: args => (
    <div style={{ maxWidth: 360 }}>
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const thumb = within(canvasElement).getByRole('slider', { name: 'Volume' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(41, expect.anything());
  },
};

export const Range: Story = {
  args: {
    label: 'Price',
    defaultValue: [2_000_000, 8_000_000],
    min: 0,
    max: 10_000_000,
    step: 500_000,
    locale: 'vi-VN',
    format: { style: 'currency', currency: 'VND' },
    thumbLabels: ['Giá thấp nhất', 'Giá cao nhất'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('slider', { name: /Giá thấp nhất/ })).toBeVisible();
    await expect(canvas.getByRole('slider', { name: /Giá cao nhất/ })).toBeVisible();
  },
};

export const Marks: Story = {
  args: {
    label: 'Response length',
    defaultValue: 50,
    step: 25,
    showValue: false,
    marks: [
      { value: 0, label: 'Short' },
      { value: 25 },
      { value: 50, label: 'Medium' },
      { value: 75 },
      { value: 100, label: 'Long' },
    ],
  },
};

export const Unlabelled: Story = {
  args: { label: undefined, thumbLabels: ['Zoom'], defaultValue: 30 },
};

export const Disabled: Story = { args: { disabled: true } };
