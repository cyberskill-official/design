'use client';
import { AreaChart, BarChart, DonutChart, LineChart, Sparkline } from '@cyberskill/design/charts';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const signups = months.map((month, i) => ({ month, web: 1200 + i * 150 + (i % 3) * 200, mobile: 800 + i * 120, api: 400 + i * 60 }));
const channels = [{ key: 'web', label: 'Web' }, { key: 'mobile', label: 'Mobile' }, { key: 'api', label: 'API' }];
const browsers = [{ browser: 'Chrome', visits: 6120 }, { browser: 'Safari', visits: 2480 }, { browser: 'Firefox', visits: 960 }, { browser: 'Edge', visits: 440 }];

export function BarChartDemo() {
  return <BarChart title="Signups by month" description="All channels" data={signups} series={channels} xKey="month" xLabel="Month" />;
}

export function StackedBarChartDemo() {
  return <BarChart title="Signups by channel" data={signups} series={channels} xKey="month" xLabel="Month" stacked />;
}

export function LineChartDemo() {
  return <LineChart title="Active users" data={signups} series={channels} xKey="month" xLabel="Month" />;
}

export function AreaChartDemo() {
  return <AreaChart title="Traffic" data={signups} series={channels.slice(0, 2)} xKey="month" xLabel="Month" stacked />;
}

export function DonutChartDemo() {
  return <DonutChart title="Visits by browser" data={browsers} series={[{ key: 'visits', label: 'Visits' }]} xKey="browser" xLabel="Browser" centerLabel="Total visits" />;
}

export function PinnedColorDemo() {
  return <BarChart title="Mobile and API" data={signups} series={[{ key: 'mobile', label: 'Mobile', color: 2 }, { key: 'api', label: 'API', color: 3 }]} xKey="month" xLabel="Month" />;
}

export function VietnameseChartDemo() {
  return (
    <LineChart
      title="Người dùng hoạt động" description="Theo tháng" data={signups} xKey="month" xLabel="Tháng"
      series={[{ key: 'web', label: 'Web' }, { key: 'mobile', label: 'Di động' }]}
      showTableLabel="Xem bảng" showChartLabel="Xem biểu đồ" valueFormatter={v => new Intl.NumberFormat('vi-VN').format(v)}
    />
  );
}

export function SparklineDemo() {
  return (
    <div style={{ display: 'grid', gap: 4, width: 220, padding: 16, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--panel)' }}>
      <span style={{ color: 'var(--muted)', fontSize: 13 }}>Weekly revenue</span>
      <span style={{ fontSize: 24, fontWeight: 600 }}>$48.2K</span>
      <Sparkline data={signups} dataKey="web" label="Weekly revenue, last 8 weeks, up 104%" />
    </div>
  );
}
