import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextAlignCenter, TextAlignLeft, TextAlignRight, TextB, TextItalic, TextUnderline } from '@phosphor-icons/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';

const meta = {
  title: 'Pickers/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  args: { label: 'Text formatting', multiple: true, defaultValue: ['bold'], onValueChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: args => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" icon={<TextB />} label="Bold" />
      <ToggleGroupItem value="italic" icon={<TextItalic />} label="Italic" />
      <ToggleGroupItem value="underline" icon={<TextUnderline />} label="Underline" />
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Multiple: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Italic' }));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(['bold', 'italic'], expect.anything());
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
  },
};

export const Single: Story = {
  args: { label: 'Text alignment', multiple: false, defaultValue: ['left'] },
  render: args => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" icon={<TextAlignLeft />} label="Align left" />
      <ToggleGroupItem value="center" icon={<TextAlignCenter />} label="Align center" />
      <ToggleGroupItem value="right" icon={<TextAlignRight />} label="Align right" />
    </ToggleGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Align left' }).focus();
    await userEvent.keyboard('{ArrowRight} ');
    await expect(canvas.getByRole('button', { name: 'Align center' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Align left' })).toHaveAttribute('aria-pressed', 'false');
  },
};

export const FilterChips: Story = {
  args: { label: 'Status', multiple: true, defaultValue: ['active'], size: 'sm' },
  render: args => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="active">Active</ToggleGroupItem>
      <ToggleGroupItem value="paused">Paused</ToggleGroupItem>
      <ToggleGroupItem value="draft">Draft</ToggleGroupItem>
      <ToggleGroupItem value="archived" disabled>Archived</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Sizes: Story = {
  globals: { theme: 'side-by-side' },
  render: () => (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      {(['sm', 'md', 'lg'] as const).map(size => (
        <ToggleGroup key={size} label={`Formatting (${size})`} multiple size={size} defaultValue={['bold']}>
          <ToggleGroupItem value="bold" icon={<TextB />} label="Bold" />
          <ToggleGroupItem value="italic" icon={<TextItalic />} label="Italic" />
          <ToggleGroupItem value="underline" icon={<TextUnderline />} label="Underline" />
        </ToggleGroup>
      ))}
    </div>
  ),
};

export const Vietnamese: Story = {
  args: { label: 'Định dạng chữ' },
  render: args => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" icon={<TextB />} label="In đậm" />
      <ToggleGroupItem value="italic" icon={<TextItalic />} label="In nghiêng" />
      <ToggleGroupItem value="underline" icon={<TextUnderline />} label="Gạch chân" />
    </ToggleGroup>
  ),
};
