import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, type TableProps } from './Table';
import { expectAccessibleInThemes } from '../test/a11y';

const rows = [
  { id: 'INV-1042', customer: 'Northwind', amount: '$1,240.00', status: 'Paid' },
  { id: 'INV-1043', customer: 'Contoso', amount: '$860.50', status: 'Due' },
  { id: 'INV-1044', customer: 'Fabrikam', amount: '$12,400.00', status: 'Paid' },
];

function Example(props: TableProps) {
  return (
    <Table {...props}>
      <TableCaption>Recent invoices</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead numeric>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={r.id} selected={i === 1}>
            <TableHead scope="row">{r.id}</TableHead>
            <TableCell>{r.customer}</TableCell>
            <TableCell numeric>{r.amount}</TableCell>
            <TableCell>{r.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

describe('Table', () => {
  it('renders a captioned table with column and row headers', () => {
    render(<Example />);
    const table = screen.getByRole('table', { name: 'Recent invoices' });
    expect(table).toHaveAttribute('data-density', 'comfortable');
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('rowheader', { name: 'INV-1043' })).toBeVisible();
    expect(screen.getByRole('cell', { name: '$860.50' })).toHaveStyle({ textAlign: 'end', fontVariantNumeric: 'tabular-nums' });
  });

  it('passes density, striped, sticky header and selection as data attributes', () => {
    render(<Example density="compact" striped stickyHeader maxHeight={160} />);
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('data-density', 'compact');
    expect(table).toHaveAttribute('data-striped');
    expect(screen.getByRole('columnheader', { name: 'Invoice' })).toHaveStyle({ position: 'sticky' });
    expect(screen.getByRole('row', { name: /INV-1043/ })).toHaveAttribute('data-selected');
  });

  it('a container that overflows becomes keyboard focusable; one that fits does not', async () => {
    const { unmount } = render(<Example />);
    const fits = screen.getByRole('table').parentElement!;
    await expect.poll(() => fits.hasAttribute('tabindex')).toBe(false);
    unmount();
    render(<div style={{ width: 200 }}><Example /></div>);
    await expect.poll(() => screen.getByRole('table').parentElement!.getAttribute('tabindex')).toBe('0');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16 }}>
        <Example />
        <Example density="compact" striped />
      </div>,
    );
  });
});
