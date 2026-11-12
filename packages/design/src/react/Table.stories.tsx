import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Badge } from './Badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, type TableProps } from './Table';

const invoices = [
  { id: 'INV-1042', customer: 'Northwind Traders', date: '2026-10-02', amount: '$1,240.00', status: 'paid' },
  { id: 'INV-1043', customer: 'Contoso Ltd', date: '2026-10-05', amount: '$860.50', status: 'due' },
  { id: 'INV-1044', customer: 'Fabrikam Inc', date: '2026-10-09', amount: '$12,400.00', status: 'paid' },
  { id: 'INV-1045', customer: 'Tailspin Toys', date: '2026-10-14', amount: '$318.75', status: 'overdue' },
  { id: 'INV-1046', customer: 'Wide World Importers', date: '2026-10-21', amount: '$4,092.10', status: 'paid' },
  { id: 'INV-1047', customer: 'Adventure Works', date: '2026-10-28', amount: '$2,750.00', status: 'due' },
] as const;

const status = {
  paid: <Badge tone="success" size="sm">Paid</Badge>,
  due: <Badge tone="info" size="sm">Due</Badge>,
  overdue: <Badge tone="danger" size="sm">Overdue</Badge>,
};

function Invoices({ selected, ...props }: TableProps & { selected?: string }) {
  return (
    <Table {...props}>
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead numeric>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(r => (
          <TableRow key={r.id} selected={r.id === selected}>
            <TableHead scope="row">{r.id}</TableHead>
            <TableCell>{r.customer}</TableCell>
            <TableCell>{r.date}</TableCell>
            <TableCell numeric>{r.amount}</TableCell>
            <TableCell>{status[r.status]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const meta = {
  title: 'Data Display/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: { density: { control: 'inline-radio', options: ['comfortable', 'compact'] } },
  render: args => <Invoices {...args} />,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('table', { name: 'Recent invoices' })).toBeVisible();
    await expect(canvas.getByRole('rowheader', { name: 'INV-1045' })).toBeVisible();
  },
};

export const Compact: Story = { args: { density: 'compact' } };

export const Striped: Story = { args: { striped: true }, globals: { theme: 'side-by-side' } };

export const SelectedRow: Story = { render: args => <Invoices {...args} selected="INV-1044" />, globals: { theme: 'side-by-side' } };

export const StickyHeader: Story = { args: { stickyHeader: true, maxHeight: 220, density: 'compact' } };

export const NarrowScreen: Story = {
  render: args => <div style={{ maxWidth: 320 }}><Invoices {...args} /></div>,
  play: async ({ canvasElement }) => {
    const scroller = within(canvasElement).getByRole('table').parentElement!;
    await waitFor(() => expect(scroller).toHaveAttribute('tabindex', '0'));
  },
};
