import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stat } from './Stat';

const meta = {
  title: 'Data Display/Stat',
  component: Stat,
  tags: ['autodocs'],
  args: { label: 'Monthly revenue', value: '$48,210', delta: { value: '+8.4%', trend: 'up' }, hint: 'vs. last month' },
} satisfies Meta<typeof Stat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: args => <Stat {...args} style={{ maxWidth: 280 }} /> };

export const Sentiments: Story = {
  globals: { theme: 'side-by-side' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
      <Stat label="Active users" value="1,284" delta={{ value: '+12%', trend: 'up' }} hint="vs. last week" />
      <Stat label="Churn" value="2.1%" delta={{ value: '−0.4 pts', trend: 'down', sentiment: 'positive' }} hint="vs. last month" />
      <Stat label="p95 latency" value="412 ms" delta={{ value: '+38 ms', trend: 'up', sentiment: 'negative' }} hint="vs. yesterday" />
      <Stat label="Seats" value="128" delta={{ value: '+0', trend: 'up', sentiment: 'neutral' }} hint="no change" />
    </div>
  ),
  // The sentiment is also text, so "−0.4 pts" for churn reads as good news without the color.
  play: async ({ canvasElement }) => {
    const [churn] = within(canvasElement).getAllByText('−0.4 pts');
    await expect(churn).toHaveTextContent('−0.4 pts (positive change)');
  },
};

const points = [12, 14, 13, 17, 16, 19, 22, 21, 24, 27];
const path = points.map((y, i) => `${i ? 'L' : 'M'}${(i / (points.length - 1)) * 100},${32 - y}`).join(' ');

export const WithSparkline: Story = {
  render: args => (
    <Stat {...args} style={{ maxWidth: 280 }}>
      <svg role="img" aria-label="Revenue rising over the last 10 weeks" viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: '100%', height: 40, color: 'var(--chart-1)' }}>
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </Stat>
  ),
};

export const NoDelta: Story = { args: { label: 'Uptime (30 days)', value: '99.98%', delta: undefined, hint: 'SLA 99.9%' }, render: args => <Stat {...args} style={{ maxWidth: 280 }} /> };
