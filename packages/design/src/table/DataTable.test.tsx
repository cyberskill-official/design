import { render, screen, within } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { createDataTableColumnHelper, DataTable, type RowSelectionState } from './index';
import { expectAccessibleInThemes } from '../test/a11y';

type Invoice = { id: string; customer: string; total: number };
const col = createDataTableColumnHelper<Invoice>();
const columns = col.columns([
  col.accessor('id', { header: 'Invoice' }),
  col.accessor('customer', { header: 'Customer' }),
  col.accessor('total', { header: 'Total', meta: { numeric: true } }),
]);
const invoices: Invoice[] = Array.from({ length: 25 }, (_, i) => ({ id: `INV-${String(i + 1).padStart(3, '0')}`, customer: ['Lan', 'Minh', 'An', 'Bao'][i % 4]!, total: ((i * 37) % 50) * 10 + 5 }));
const getRowId = (r: Invoice) => r.id;
const bodyRows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1);
const firstCells = () => bodyRows().map(r => within(r).getAllByRole('cell')[0]!.textContent);

describe('DataTable', () => {
  it('sorts by a header button and reports it with aria-sort', async () => {
    render(<DataTable label="Invoices" columns={columns} data={invoices.slice(0, 5)} getRowId={getRowId} />);
    expect(screen.getByRole('table', { name: 'Invoices' })).toBeVisible();
    const header = screen.getByRole('columnheader', { name: 'Total' });
    expect(header).not.toHaveAttribute('aria-sort');

    await userEvent.click(within(header).getByRole('button', { name: 'Total' }));
    // Numbers sort descending first (TanStack's auto direction for numeric data).
    expect(header).toHaveAttribute('aria-sort', 'descending');
    const totals = bodyRows().map(r => Number(within(r).getAllByRole('cell')[2]!.textContent));
    expect(totals).toEqual([...totals].sort((a, b) => b - a));

    await userEvent.click(within(header).getByRole('button', { name: 'Total' }));
    expect(header).toHaveAttribute('aria-sort', 'ascending');

    await userEvent.click(screen.getByRole('button', { name: 'Customer' }));
    expect(screen.getByRole('columnheader', { name: 'Customer' })).toHaveAttribute('aria-sort', 'ascending');
    expect(header).not.toHaveAttribute('aria-sort');
  });

  it('right-aligns numeric columns in tabular figures', () => {
    render(<DataTable label="Invoices" columns={columns} data={invoices.slice(0, 2)} />);
    const cell = within(bodyRows()[0]!).getAllByRole('cell')[2]!;
    expect(getComputedStyle(cell).textAlign).toBe('end');
    expect(getComputedStyle(cell).fontVariantNumeric).toBe('tabular-nums');
    expect(getComputedStyle(screen.getByRole('columnheader', { name: 'Total' })).textAlign).toBe('end');
  });

  it('selects rows with checkboxes, shows the selection and reports it', async () => {
    let selected: RowSelectionState = {};
    function Controlled() {
      const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
      selected = rowSelection;
      return <DataTable label="Invoices" columns={columns} data={invoices.slice(0, 3)} getRowId={getRowId} selectable rowSelection={rowSelection} onRowSelectionChange={setRowSelection} selectRowLabel={r => `Select ${r.id}`} />;
    }
    render(<Controlled />);
    const all = screen.getByRole('checkbox', { name: 'Select all rows' });
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select INV-002' }));
    expect(selected).toEqual({ 'INV-002': true });
    expect(all).toHaveProperty('indeterminate', true);
    const row = bodyRows()[1]!;
    expect(row).toHaveAttribute('data-selected');
    expect(getComputedStyle(row).backgroundColor).not.toBe(getComputedStyle(bodyRows()[0]!).backgroundColor);

    await userEvent.click(all);
    expect(Object.keys(selected)).toHaveLength(3);
    expect(all).toBeChecked();
    await userEvent.click(all);
    expect(Object.keys(selected)).toHaveLength(0);
  });

  it('keeps a 44px hit area on the small checkbox', () => {
    render(<DataTable label="Invoices" columns={columns} data={invoices.slice(0, 1)} selectable />);
    const hit = getComputedStyle(screen.getByRole('checkbox', { name: 'Select all rows' }), '::after');
    expect(parseFloat(hit.width)).toBeGreaterThanOrEqual(44);
  });

  it('paginates with a range and previous/next buttons', async () => {
    render(<DataTable label="Invoices" columns={columns} data={invoices} pageSize={10} formatRange={(a, b, t) => `${a}–${b} / ${t}`} nextPageLabel="Trang sau" />);
    expect(screen.getByText('1–10 / 25')).toBeVisible();
    expect(bodyRows()).toHaveLength(10);
    const prev = screen.getByRole('button', { name: 'Previous page' });
    expect(prev).toHaveAttribute('aria-disabled', 'true');
    const next = screen.getByRole('button', { name: 'Trang sau' });
    await userEvent.click(next);
    await userEvent.click(next);
    expect(screen.getByText('21–25 / 25')).toBeVisible();
    expect(firstCells()[0]).toBe('INV-021');
    expect(next).toHaveAttribute('aria-disabled', 'true');
    expect(document.activeElement).toBe(next);
  });

  it('virtualizes large data, rendering only rows in view', async () => {
    const many = Array.from({ length: 2000 }, (_, i) => ({ id: `INV-${i + 1}`, customer: 'Lan', total: i }));
    render(<DataTable label="Invoices" columns={columns} data={many} getRowId={getRowId} virtualized maxHeight={300} />);
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-rowcount', '2001');
    expect(bodyRows().length).toBeLessThan(60);
    const region = screen.getByRole('region', { name: 'Invoices' });
    expect(region.scrollHeight).toBeGreaterThan(2000 * 40);
    region.scrollTop = 1000 * 44;
    await expect.poll(() => firstCells().includes('INV-1001')).toBe(true);
    expect(bodyRows().find(r => r.textContent?.startsWith('INV-1001'))).toHaveAttribute('aria-rowindex', '1002');
  });

  it('shows the empty state when there are no rows', () => {
    render(<DataTable label="Invoices" columns={columns} data={[]} emptyState="Chưa có hóa đơn" />);
    expect(screen.getByRole('cell', { name: 'Chưa có hóa đơn' })).toHaveAttribute('colspan', '3');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div>
        <DataTable label="Invoices" columns={columns} data={invoices} getRowId={getRowId} selectable pageSize={5} rowSelection={{ 'INV-002': true }} onRowSelectionChange={() => {}} density="compact" />
        <DataTable label="Archive" columns={columns} data={invoices} maxHeight={200} density="comfortable" />
        <DataTable label="Drafts" columns={columns} data={[]} />
      </div>,
    );
  });
});
