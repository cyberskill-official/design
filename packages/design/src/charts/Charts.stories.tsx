import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AreaChart, BarChart, DonutChart, LineChart, Sparkline } from './index';

const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month, i) => ({
  month,
  web: 1200 + i * 150 + (i % 3) * 200,
  mobile: 800 + i * 120,
  api: 400 + i * 60,
}));
const series = [{ key: 'web', label: 'Web' }, { key: 'mobile', label: 'Mobile' }, { key: 'api', label: 'API' }];
const browsers = [{ browser: 'Chrome', visits: 6120 }, { browser: 'Safari', visits: 2480 }, { browser: 'Firefox', visits: 960 }, { browser: 'Edge', visits: 440 }];
const grid = { display: 'grid', gap: 16, maxWidth: 720 } as const;

const meta = {
  title: 'Data/Charts',
  component: BarChart,
  tags: ['autodocs'],
  args: { title: 'Signups by month', description: 'All channels, 2026', data, series, xKey: 'month', xLabel: 'Month' },
  decorators: [Story => <div style={grid}><Story /></div>],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Bars: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('img', { name: 'Signups by month' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Show table' }));
    const table = canvas.getByRole('table', { name: 'Signups by month' });
    await expect(within(table).getAllByRole('row')).toHaveLength(data.length + 1);
    await userEvent.click(canvas.getByRole('button', { name: 'Show chart' }));
  },
};

export const StackedBars: Story = { args: { title: 'Signups by channel', stacked: true } };

export const Lines: Story = {
  render: args => <LineChart {...args} title="Active users" description="Series names sit at the line ends" />,
};

export const StackedArea: Story = {
  render: args => <AreaChart {...args} series={series.slice(0, 2)} title="Traffic" stacked />,
};

export const Donut: Story = {
  render: () => <DonutChart title="Visits by browser" data={browsers} series={[{ key: 'visits', label: 'Visits' }]} xKey="browser" xLabel="Browser" centerLabel="Total visits" />,
};

/** `color` pins a palette slot to an entity, so Mobile stays gold after Web is filtered out. */
export const PinnedColors: Story = {
  render: args => <BarChart {...args} title="Mobile and API only" series={[{ key: 'mobile', label: 'Mobile', color: 2 }, { key: 'api', label: 'API', color: 3 }]} />,
};

export const Vietnamese: Story = {
  render: args => (
    <LineChart
      {...args} title="Người dùng hoạt động" description="Theo tháng" xLabel="Tháng" showTableLabel="Xem bảng" showChartLabel="Xem biểu đồ"
      series={[{ key: 'web', label: 'Web' }, { key: 'mobile', label: 'Di động' }]}
      locale="vi-VN"
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Xem bảng' }));
    await expect(within(canvasElement).getByRole('cell', { name: '1.550' })).toBeVisible();
  },
};

export const SparklineInTile: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 4, width: 220, padding: 16, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--panel)' }}>
      <span style={{ color: 'var(--muted)', fontSize: 13 }}>Weekly revenue</span>
      <span style={{ fontSize: 24, fontWeight: 600 }}>$48.2K</span>
      <Sparkline data={data} dataKey="web" label="Weekly revenue, last 8 weeks, up 104%" />
    </div>
  ),
};
