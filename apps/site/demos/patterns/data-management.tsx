'use client';
import { Archive, CheckCircle, Export, FunnelSimple, UserPlus, X } from '@phosphor-icons/react';
import {
  Autocomplete,
  Avatar,
  Badge,
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  EmptyState,
  Field,
  MultiSelectField,
  Toolbar,
  ToolbarButton,
  ToolbarSeparator,
} from '@cyberskill/design';
import { DateRangePicker, type DateRangeValue } from '@cyberskill/design/date';
import { createDataTableColumnHelper, DataTable, type RowSelectionState } from '@cyberskill/design/table';
import { useMemo, useState } from 'react';

type Status = 'open' | 'pending' | 'solved';
type Ticket = { id: string; subject: string; customer: string; status: Status; assignee: string; created: Date; message: string };

const statusBadge: Record<Status, { label: string; tone: 'info' | 'warning' | 'success' }> = {
  open: { label: 'Open', tone: 'info' },
  pending: { label: 'Pending', tone: 'warning' },
  solved: { label: 'Solved', tone: 'success' },
};
const statusItems = (Object.keys(statusBadge) as Status[]).map((value) => ({ value, label: statusBadge[value].label }));

const subjects = [
  'Charged twice for the Team plan',
  'Cannot connect the Zendesk integration',
  'Agent answers in the wrong language',
  'Export conversations to CSV',
  'SSO login loops back to sign-in',
  'Add a second admin to the workspace',
  'Webhook returns 401 after key rotation',
  'Invoice needs our tax ID',
  'Bot does not hand off to a person',
  'Upgrade from Starter to Business',
  'Training source stuck on “Syncing”',
  'Delete a teammate’s account',
  'Widget hides the cookie banner on mobile',
  'Rate limit errors on the API',
];
const customers = ['Mai Hoang', 'Daniel Brooks', 'Priya Shah', 'Tom Becker', 'Lucía Romero', 'Kenji Sato', 'Amara Okafor'];
const agents = ['Linh Tran', 'Minh Nguyen', 'An Pham'];
const statuses: Status[] = ['open', 'pending', 'solved', 'open', 'solved'];
const tickets: Ticket[] = subjects.map((subject, i) => ({
  id: `T-${4821 + i}`,
  subject,
  customer: customers[i % customers.length]!,
  status: statuses[i % statuses.length]!,
  assignee: agents[i % agents.length]!,
  created: new Date(2026, 9, 3 + i * 2),
  message: `Hi, ${subject.charAt(0).toLowerCase()}${subject.slice(1)}. Could you take a look? This is blocking our support team.`,
}));
const searchItems = [...new Set([...tickets.map((t) => t.customer), ...tickets.map((t) => t.subject)])];

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const PAGE_SIZE = 6;
const getRowId = (t: Ticket) => t.id;

export function DataManagementPattern() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string[]>(['open', 'pending']);
  const [range, setRange] = useState<DateRangeValue | null>(null);
  const [selection, setSelection] = useState<RowSelectionState>({});
  const [detail, setDetail] = useState<Ticket | null>(null);
  const [open, setOpen] = useState(false); // separate from detail so the drawer keeps its text while it slides out

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter(
      (t) =>
        (!q || `${t.id} ${t.subject} ${t.customer}`.toLowerCase().includes(q)) &&
        (status.length === 0 || status.includes(t.status)) &&
        (!range || (t.created >= range.from && t.created <= range.to)),
    );
  }, [query, status, range]);
  const selected = Object.keys(selection).filter((id) => selection[id]);

  // Any filter change clears the selection; the table goes back to page 1 when its data changes
  const refilter = <T,>(set: (v: T) => void) => (v: T) => { set(v); setSelection({}); };
  const clearFilters = () => { setQuery(''); setStatus([]); setRange(null); };
  const openDetail = (t: Ticket) => { setDetail(t); setOpen(true); };

  const columns = useMemo(() => {
    const col = createDataTableColumnHelper<Ticket>();
    return col.columns([
      col.accessor('id', { header: 'Ticket', cell: (c) => <span className="pt-nowrap">{c.getValue()}</span> }),
      // nowrap: on phones the table scrolls sideways instead of squeezing text into narrow columns
      col.accessor('subject', { header: 'Subject', cell: (c) => <span className="pt-nowrap">{c.getValue()}</span> }),
      col.accessor('customer', { header: 'Customer', cell: (c) => <span className="pt-nowrap">{c.getValue()}</span> }),
      col.accessor('status', {
        header: 'Status',
        enableSorting: false,
        cell: (c) => <Badge size="sm" tone={statusBadge[c.getValue()].tone}>{statusBadge[c.getValue()].label}</Badge>,
      }),
      col.accessor('created', { header: 'Created', cell: (c) => <span className="pt-nowrap">{dateFormat.format(c.getValue())}</span> }),
    ]);
  }, []);

  return (
    <div className="pt-app">
      <main className="pt-main">
        <div className="pt-row">
          <div className="pt-stack" style={{ gap: 4 }}>
            <h2 className="pt-title">Tickets</h2>
            <p className="pt-subtitle">{filtered.length} of {tickets.length} tickets</p>
          </div>
          <span className="pt-spacer" />
          <Button variant="secondary" size="sm" iconStart={<Export />}>Export CSV</Button>
        </div>

        <div className="pt-filters" role="search" aria-label="Filter tickets">
          <Field label="Search">
            <Autocomplete items={searchItems} placeholder="ID, subject, customer" value={query} onValueChange={refilter(setQuery)} />
          </Field>
          <MultiSelectField label="Status" items={statusItems} value={status} onValueChange={refilter(setStatus)} placeholder="Any status" />
          <DateRangePicker label="Created" value={range} onValueChange={refilter(setRange)} />
        </div>

        {selected.length > 0 && (
          <div className="pt-bulkbar">
            <strong role="status">{selected.length} selected</strong>
            <Toolbar aria-label="Bulk actions">
              <ToolbarButton icon={<UserPlus />}>Assign</ToolbarButton>
              <ToolbarButton icon={<CheckCircle />}>Mark solved</ToolbarButton>
              <ToolbarButton icon={<Archive />}>Archive</ToolbarButton>
              <ToolbarSeparator />
              <ToolbarButton icon={<X />} onClick={() => setSelection({})}>Clear</ToolbarButton>
            </Toolbar>
          </div>
        )}

        <DataTable
          label="Tickets"
          columns={columns}
          data={filtered}
          pageSize={PAGE_SIZE}
          getRowId={getRowId}
          onRowClick={openDetail}
          selectable
          rowSelection={selection}
          onRowSelectionChange={setSelection}
          selectRowLabel={(t) => `Select ${t.id}`}
          emptyState={
            <EmptyState
              size="sm"
              icon={<FunnelSimple />}
              title="No tickets match these filters"
              description="Try another status or a wider date range."
              action={<Button variant="secondary" size="sm" onClick={clearFilters}>Clear filters</Button>}
            />
          }
        />

      </main>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          title={detail?.subject ?? ''}
          description={detail ? `${detail.id} · opened ${dateFormat.format(detail.created)}` : undefined}
          footer={<>
            <DrawerClose render={<Button variant="secondary" />}>Close</DrawerClose>
            <Button>Reply</Button>
          </>}
        >
          {detail && (
            <div className="pt-stack">
              <dl className="pt-dl">
                <dt>Status</dt>
                <dd><Badge size="sm" tone={statusBadge[detail.status].tone}>{statusBadge[detail.status].label}</Badge></dd>
                <dt>Customer</dt>
                <dd>{detail.customer}</dd>
                <dt>Assignee</dt>
                <dd className="pt-row"><Avatar name={detail.assignee} size="sm" aria-hidden />{detail.assignee}</dd>
              </dl>
              <blockquote className="pt-quote">{detail.message}</blockquote>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

/** The same table when nothing matches. */
export function DataManagementEmpty() {
  return (
    <EmptyState
      icon={<FunnelSimple />}
      title="No tickets match these filters"
      description="Try another status or a wider date range."
      action={<Button variant="secondary" size="sm">Clear filters</Button>}
    />
  );
}
