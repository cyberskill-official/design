import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { SearchField } from './SearchField';

const meta = {
  title: 'Pickers/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  args: { label: 'Search agents', placeholder: 'Name or ID', onValueChange: fn() },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: args => <div style={{ maxWidth: 360 }}><SearchField {...args} /></div>,
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Search agents' });
    await userEvent.type(input, 'support');
    await expect(args.onValueChange).toHaveBeenLastCalledWith('support');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(input).toHaveValue('');
    await expect(input).toHaveFocus();
  },
};

export const EscapeClears: Story = {
  args: { defaultValue: 'billing' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('searchbox');
    input.focus();
    await userEvent.keyboard('{Escape}');
    await expect(input).toHaveValue('');
  },
};

export const WithShortcut: Story = { args: { shortcut: '⌘K', hideLabel: true, placeholder: 'Search…' } };

export const Loading: Story = { args: { defaultValue: 'invoice', loading: true } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <SearchField label="Small" size="sm" defaultValue="sm" />
      <SearchField label="Medium" defaultValue="md" />
      <SearchField label="Large" size="lg" defaultValue="lg" />
    </div>
  ),
};

export const Vietnamese: Story = {
  globals: { theme: 'side-by-side' },
  args: { label: 'Tìm kiếm', placeholder: 'Tên hoặc mã', defaultValue: 'hà nội', clearLabel: 'Xoá tìm kiếm', loading: true, loadingLabel: 'Đang tải' },
  play: async ({ canvasElement }) => {
    for (const button of within(canvasElement).getAllByRole('button', { name: 'Xoá tìm kiếm' })) await expect(button).toBeVisible();
  },
};

export const WithError: Story = { args: { defaultValue: 'a', error: 'Type at least 2 characters.' } };
