import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ScrollArea } from './ScrollArea';

const notes = Array.from({ length: 16 }, (_, i) => `Version 3.${16 - i}: faster replies, fewer retries and clearer error messages.`);

const meta = {
  title: 'Structure/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  args: { label: 'Release notes' },
  render: args => (
    <ScrollArea {...args} style={{ height: 200, maxWidth: 360, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--panel)' }}>
      <div style={{ padding: '12px 16px', display: 'grid', gap: 8 }} className="cs-ui">
        {notes.map(n => <p key={n} style={{ margin: 0 }}>{n}</p>)}
      </div>
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'Release notes' });
    await waitFor(() => expect(region).toHaveAttribute('tabindex', '0'));
    // Synthetic keys don't scroll natively; the unit test covers real arrow-key scrolling.
    await userEvent.tab();
    await expect(region).toHaveFocus();
  },
};

export const BothAxes: Story = {
  args: { label: 'Usage by region' },
  render: args => (
    <ScrollArea {...args} style={{ height: 200, maxWidth: 360, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--panel)' }}>
      <table className="cs-ui" style={{ borderCollapse: 'collapse', whiteSpace: 'nowrap' }}>
        <thead>
          <tr>{['Region', 'Messages', 'Tokens', 'Avg. latency', 'Errors', 'Cost (VND)'].map(h => <th key={h} scope="col" style={{ textAlign: 'start', padding: '10px 16px' }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {['ap-southeast-1', 'ap-northeast-1', 'eu-central-1', 'us-east-1', 'us-west-2', 'sa-east-1', 'me-central-1'].map((r, i) => (
            <tr key={r} style={{ borderTop: '1px solid var(--border)' }}>
              <td style={{ padding: '10px 16px', fontFamily: 'var(--font-mono)' }}>{r}</td>
              <td style={{ padding: '10px 16px' }}>{(12840 - i * 1310).toLocaleString('en')}</td>
              <td style={{ padding: '10px 16px' }}>{(2.4 - i * 0.2).toFixed(1)}M</td>
              <td style={{ padding: '10px 16px' }}>{320 + i * 40} ms</td>
              <td style={{ padding: '10px 16px' }}>{i}</td>
              <td style={{ padding: '10px 16px' }}>{(1840000 - i * 150000).toLocaleString('en')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'Usage by region' });
    await waitFor(() => expect(region).toHaveAttribute('tabindex', '0'));
  },
};
