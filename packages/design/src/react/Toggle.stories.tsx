import type { Meta, StoryObj } from '@storybook/react-vite';
import { Star, TextB, TextItalic, TextUnderline } from '@phosphor-icons/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Toggle } from './Toggle';

const meta = {
  title: 'Pickers/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: { children: 'Favorite', icon: <Star />, pressedIcon: <Star weight="fill" />, onPressedChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const toggle = within(canvasElement).getByRole('button', { name: 'Favorite' });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(args.onPressedChange).toHaveBeenCalledWith(true, expect.anything());
  },
};

export const Pressed: Story = { args: { defaultPressed: true } };

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 4 }}>
      <Toggle icon={<TextB />} label="Bold" defaultPressed />
      <Toggle icon={<TextItalic />} label="Italic" />
      <Toggle icon={<TextUnderline />} label="Underline" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Toggle size="sm" icon={<Star />}>Small</Toggle>
      <Toggle icon={<Star />}>Medium</Toggle>
      <Toggle size="lg" icon={<Star />}>Large</Toggle>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };
