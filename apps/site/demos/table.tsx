'use client';
import { Badge, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, type TableProps } from '@cyberskill/design';

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
        {invoices.map((r) => (
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

export function TableBasic() {
  return <Invoices />;
}

export function TableCompactStriped() {
  return <Invoices density="compact" striped selected="INV-1044" />;
}

export function TableSticky() {
  return <Invoices density="compact" stickyHeader maxHeight={200} />;
}
