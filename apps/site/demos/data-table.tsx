'use client';
import { createDataTableColumnHelper, DataTable, type RowSelectionState } from '@cyberskill/design/table';
import { useState } from 'react';

type Invoice = { id: string; customer: string; status: string; total: number };
const col = createDataTableColumnHelper<Invoice>();
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const columns = col.columns([
  col.accessor('id', { header: 'Invoice' }),
  col.accessor('customer', { header: 'Customer' }),
  col.accessor('status', { header: 'Status', enableSorting: false }),
  col.accessor('total', { header: 'Amount', meta: { numeric: true }, cell: (c) => money.format(c.getValue()) }),
]);
const makeInvoices = (n: number): Invoice[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `INV-${1040 + i}`,
    customer: ['Lan Tran', 'Minh Nguyen', 'An Pham', 'Bao Le', 'Thu Ho'][i % 5]!,
    status: ['Paid', 'Pending', 'Overdue'][i % 3]!,
    total: ((i * 37) % 50) * 41.5 + 12,
  }));
const invoices = makeInvoices(42);
const many = makeInvoices(5000);
const getRowId = (r: Invoice) => r.id;

export function DataTableBasic() {
  return <DataTable label="Invoices" columns={columns} data={invoices.slice(0, 6)} getRowId={getRowId} />;
}

export function DataTableSelection() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const count = Object.keys(rowSelection).length;
  return (
    <div style={{ display: 'grid', gap: 8, width: '100%' }}>
      <span style={{ color: 'var(--muted)', fontSize: 13 }}>{count} selected</span>
      <DataTable
        label="Invoices" columns={columns} data={invoices} getRowId={getRowId} pageSize={8}
        selectable rowSelection={rowSelection} onRowSelectionChange={setRowSelection} selectRowLabel={(r) => `Select ${r.id}`}
      />
    </div>
  );
}

export function DataTableVirtualized() {
  return <DataTable label="All invoices" columns={columns} data={many} getRowId={getRowId} virtualized maxHeight={360} density="compact" />;
}

export function DataTableEmpty() {
  return <DataTable label="Drafts" columns={columns} data={[]} emptyState="No drafts yet. New invoices start here." />;
}
