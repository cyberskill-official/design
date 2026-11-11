import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createDataTableColumnHelper, DataTable } from './index';

type Invoice = { id: string; customer: string; status: string; total: number };
const col = createDataTableColumnHelper<Invoice>();
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const columns = col.columns([
  col.accessor('id', { header: 'Invoice' }),
  col.accessor('customer', { header: 'Customer' }),
  col.accessor('status', { header: 'Status', enableSorting: false }),
  col.accessor('total', { header: 'Amount', meta: { numeric: true }, cell: c => money.format(c.getValue()) }),
]);
const makeInvoices = (n: number): Invoice[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `INV-${1040 + i}`,
    customer: ['Lan Tran', 'Minh Nguyen', 'An Pham', 'Bao Le', 'Thu Ho'][i % 5]!,
    status: ['Paid', 'Pending', 'Overdue'][i % 3]!,
    total: ((i * 37) % 50) * 41.5 + 12,
  }));
const invoices = makeInvoices(42);
const getRowId = (r: Invoice) => r.id;

const meta = {
  title: 'Data/DataTable',
  component: DataTable<Invoice>,
  tags: ['autodocs'],
  args: { label: 'Invoices', columns, data: invoices.slice(0, 8), getRowId },
  argTypes: { density: { control: 'inline-radio', options: ['compact', 'default', 'comfortable'] } },
  decorators: [Story => <div style={{ maxWidth: 760 }}><Story /></div>],
} satisfies Meta<typeof DataTable<Invoice>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sortable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole('columnheader', { name: 'Customer' });
    await userEvent.click(within(header).getByRole('button', { name: 'Customer' }));
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
  },
};

export const SelectionAndPagination: Story = {
  args: { data: invoices, selectable: true, pageSize: 10, selectRowLabel: (r: Invoice) => `Select ${r.id}` },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select INV-1041' }));
    await expect(canvas.getByRole('checkbox', { name: 'Select all rows' })).toHaveProperty('indeterminate', true);
    await expect(canvas.getByText('1–10 of 42')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }));
    await expect(canvas.getByText('11–20 of 42')).toBeVisible();
  },
};

/** `onRowClick`: click a row, or Tab to it and press Enter. The checkbox keeps its own behavior. */
export const ClickableRows: Story = {
  args: { selectable: true, selectRowLabel: (r: Invoice) => `Select ${r.id}`, onRowClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('INV-1042'));
    await expect(args.onRowClick).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'INV-1042' }));
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select INV-1043' }));
    await expect(args.onRowClick).toHaveBeenCalledTimes(1);
  },
};

export const Virtualized: Story = {
  args: { label: 'All invoices', data: makeInvoices(5000), virtualized: true, maxHeight: 420 },
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole('table', { name: 'All invoices' });
    await expect(table).toHaveAttribute('aria-rowcount', '5001');
    await expect(within(table).getAllByRole('row').length).toBeLessThan(60);
  },
};

export const StickyHeader: Story = { args: { data: invoices, maxHeight: 320 } };

export const Compact: Story = { args: { density: 'compact' } };

export const Comfortable: Story = { args: { density: 'comfortable' } };

export const Empty: Story = { args: { data: [], emptyState: 'No invoices yet. Create one to get paid.' } };

export const Vietnamese: Story = {
  args: {
    label: 'Hóa đơn', data: invoices, selectable: true, pageSize: 10, emptyState: 'Chưa có hóa đơn',
    selectAllLabel: 'Chọn tất cả', selectRowLabel: (r: Invoice) => `Chọn ${r.id}`, previousPageLabel: 'Trang trước', nextPageLabel: 'Trang sau',
    pageLabel: (n: number) => `Trang ${n}`, paginationLabel: 'Phân trang hóa đơn',
    formatRange: (from: number, to: number, total: number) => `${from}–${to} trên ${total}`,
  },
};
