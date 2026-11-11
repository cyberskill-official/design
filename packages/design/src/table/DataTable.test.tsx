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

  it('sorts text in Vietnamese order, and numbers inside text by value', async () => {
    const people: Invoice[] = [
      { id: 'INV-10', customer: 'Zoe', total: 1 },
      { id: 'INV-2', customer: 'Đặng', total: 2 },
      { id: 'INV-1', customer: 'Ân', total: 3 },
      { id: 'INV-3', customer: 'Ánh', total: 4 },
    ];
    render(<DataTable label="Invoices" columns={columns} data={people} />);
    await userEvent.click(screen.getByRole('button', { name: 'Customer' }));
    expect(bodyRows().map(r => within(r).getAllByRole('cell')[1]!.textContent)).toEqual(['Ánh', 'Ân', 'Đặng', 'Zoe']);
    await userEvent.click(screen.getByRole('button', { name: 'Invoice' }));
    expect(firstCells()).toEqual(['INV-1', 'INV-2', 'INV-3', 'INV-10']);
  });

  it('a column sortFn still wins over the default text order', async () => {
    const byLength = col.columns([col.accessor('customer', { header: 'Customer', sortFn: (a, b) => a.original.customer.length - b.original.customer.length })]);
    render(<DataTable label="People" columns={byLength} data={[{ id: '1', customer: 'Ánh', total: 0 }, { id: '2', customer: 'An', total: 0 }]} />);
    await userEvent.click(screen.getByRole('button', { name: 'Customer' }));
    expect(firstCells()).toEqual(['An', 'Ánh']);
  });

  it('right-aligns numeric columns in tabular figures', () => {
    render(<DataTable label="Invoices" columns={columns} data={invoices.slice(0, 2)} />);
    const cell = within(bodyRows()[0]!).getAllByRole('cell')[2]!;
    expect(getComputedStyle(cell).textAlign).toBe('end');
    expect(getComputedStyle(cell).fontVariantNumeric).toBe('tabular-nums');
    expect(getComputedStyle(screen.getByRole('columnheader', { name: 'Total' })).textAlign).toBe('end');
  });

  it('keeps code columns on one line in mono, even when the table is squeezed', () => {
    const coded = col.columns([col.accessor('id', { header: 'Invoice', meta: { code: true } }), col.accessor('customer', { header: 'Customer' })]);
    render(<div style={{ width: 120 }}><DataTable label="Invoices" columns={coded} data={invoices.slice(0, 1)} /></div>);
    const cell = within(bodyRows()[0]!).getAllByRole('cell')[0]!;
    expect(getComputedStyle(cell).whiteSpace).toBe('nowrap');
    expect(getComputedStyle(cell).fontFamily).toMatch(/mono/i);
    expect(cell.getClientRects().length).toBe(1);
    const text = document.createRange(); text.selectNodeContents(cell);
    expect(text.getClientRects().length).toBe(1); // INV-001 not split at the hyphen
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

  it('paginates with a range and the Pagination component', async () => {
    render(<DataTable label="Invoices" columns={columns} data={invoices} pageSize={10} formatRange={(a, b, t) => `${a}–${b} / ${t}`} nextPageLabel="Trang sau" pageLabel={n => `Trang ${n}`} />);
    expect(screen.getByText('1–10 / 25')).toBeVisible();
    expect(bodyRows()).toHaveLength(10);
    const nav = screen.getByRole('navigation', { name: 'Invoices pages' });
    expect(within(nav).getByRole('button', { name: 'Trang 1' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('button', { name: 'Previous page' })).toBeDisabled();
    const next = within(nav).getByRole('button', { name: 'Trang sau' });
    await userEvent.click(next);
    expect(screen.getByText('11–20 / 25')).toBeVisible();
    await userEvent.click(within(nav).getByRole('button', { name: 'Trang 3' }));
    expect(screen.getByText('21–25 / 25')).toBeVisible();
    expect(firstCells()[0]).toBe('INV-021');
    expect(within(nav).getByRole('button', { name: 'Trang 3' })).toHaveAttribute('aria-current', 'page');
    expect(next).toBeDisabled();
  });

  it('follows a new pageSize', () => {
    const { rerender } = render(<DataTable label="Invoices" columns={columns} data={invoices} pageSize={10} />);
    expect(bodyRows()).toHaveLength(10);
    rerender(<DataTable label="Invoices" columns={columns} data={invoices} pageSize={50} />);
    expect(bodyRows()).toHaveLength(25);
    expect(screen.getByText('1–25 of 25')).toBeVisible();
  });

  it('names the select-all checkbox for the current page when paginated', () => {
    render(<DataTable label="Invoices" columns={columns} data={invoices} selectable pageSize={10} />);
    expect(screen.getByRole('checkbox', { name: 'Select all rows on this page' })).toBeVisible();
  });

  it('onRowClick: rows open on click, Enter or Space, but not from controls inside them', async () => {
    const opened: string[] = [];
    const withButton = col.columns([
      ...columns,
      col.display({ id: 'actions', header: 'Actions', cell: c => <button type="button">Email {c.row.original.id}</button> }),
    ]);
    render(<DataTable label="Invoices" columns={withButton} data={invoices.slice(0, 3)} getRowId={getRowId} selectable selectRowLabel={r => `Select ${r.id}`} onRowClick={r => opened.push(r.id)} />);
    const [first, second] = bodyRows();
    expect(getComputedStyle(first!).cursor).toBe('pointer');

    await userEvent.click(within(first!).getByText('Lan'));
    expect(opened).toEqual(['INV-001']);

    await userEvent.click(screen.getByRole('checkbox', { name: 'Select INV-002' }));
    await userEvent.click(screen.getByRole('button', { name: 'Email INV-002' }));
    expect(opened).toEqual(['INV-001']);
    expect(screen.getByRole('checkbox', { name: 'Select INV-002' })).toBeChecked();

    second!.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(opened).toEqual(['INV-001', 'INV-002', 'INV-002']);
    screen.getByRole('button', { name: 'Email INV-002' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(opened).toHaveLength(3);
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

  it('virtualized row indexes count every header row of grouped columns', () => {
    const grouped = col.columns([
      col.accessor('id', { header: 'Invoice' }),
      col.group({ id: 'details', header: 'Details', columns: col.columns([col.accessor('customer', { header: 'Customer' }), col.accessor('total', { header: 'Total' })]) }),
    ]);
    const many = Array.from({ length: 50 }, (_, i) => ({ id: `INV-${i + 1}`, customer: 'Lan', total: i }));
    render(<DataTable label="Invoices" columns={grouped} data={many} getRowId={getRowId} virtualized maxHeight={300} />);
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-rowcount', '52');
    const rows = within(table).getAllByRole('row');
    expect(rows.slice(0, 3).map(r => r.getAttribute('aria-rowindex'))).toEqual(['1', '2', '3']);
    expect(rows[2]!.textContent).toBe('INV-1Lan0'); // the first body row
  });

  it('keeps virtualized headers readable on a phone: the table scrolls sideways instead of squeezing columns', () => {
    const many = Array.from({ length: 50 }, (_, i) => ({ id: `INV-${i + 1}`, customer: 'Lan', total: i }));
    render(<div style={{ width: 300 }}><DataTable label="Invoices" columns={columns} data={many} getRowId={getRowId} virtualized maxHeight={300} /></div>);
    const table = screen.getByRole('table');
    for (const th of table.querySelectorAll('th')) {
      const sort = th.querySelector('button');
      if (sort) expect(sort.getBoundingClientRect().right).toBeLessThanOrEqual(th.getBoundingClientRect().right + 0.5);
    }
    expect(table.getBoundingClientRect().width).toBeGreaterThan(300);
  });

  it('shows the empty state when there are no rows', () => {
    render(<DataTable label="Invoices" columns={columns} data={[]} emptyState="Chưa có hóa đơn" />);
    expect(screen.getByRole('cell', { name: 'Chưa có hóa đơn' })).toHaveAttribute('colspan', '3');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div>
        <DataTable label="Invoices" columns={columns} data={invoices} getRowId={getRowId} selectable pageSize={5} rowSelection={{ 'INV-002': true }} onRowSelectionChange={() => {}} density="compact" onRowClick={() => {}} />
        <DataTable label="Archive" columns={columns} data={invoices} maxHeight={200} density="comfortable" />
        <DataTable label="Drafts" columns={columns} data={[]} />
      </div>,
    );
  });
});
