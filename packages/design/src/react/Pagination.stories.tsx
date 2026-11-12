import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Pagination, type PaginationProps } from './Pagination';

function Stateful(args: PaginationProps) {
  const [page, setPage] = useState(args.page);
  return <Pagination {...args} page={page} onPageChange={p => { setPage(p); args.onPageChange(p); }} />;
}

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: { page: 1, pageCount: 20, onPageChange: fn() },
  render: args => <Stateful {...args} />,
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(args.onPageChange).toHaveBeenCalledWith(2);
    await expect(canvas.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  },
};

export const Middle: Story = { args: { page: 10 } };

export const FewPages: Story = { args: { page: 2, pageCount: 4 } };

export const Vietnamese: Story = {
  args: { page: 6, label: 'Phân trang', previousLabel: 'Trang trước', nextLabel: 'Trang sau', pageLabel: n => `Trang ${n}` },
};

/** In a card narrower than 19.5rem that is a size container: `‹ 3 / 6 ›`, still 44px targets. */
export const NarrowCard: Story = {
  args: { page: 3, pageCount: 6 },
  render: args => <div style={{ width: 240, containerType: 'inline-size' }}><Stateful {...args} /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('3 / 6')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(canvas.getByText('4 / 6')).toBeVisible();
  },
};
