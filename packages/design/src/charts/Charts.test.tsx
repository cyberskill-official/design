import { render, screen, within } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { AreaChart, BarChart, DonutChart, LineChart, Sparkline } from './index';
import { expectAccessibleInThemes, expectNoA11yViolations } from '../test/a11y';

const data = [
  { month: 'Jan', web: 1200, mobile: 800 },
  { month: 'Feb', web: 1350, mobile: 950 },
  { month: 'Mar', web: 1500, mobile: 1100 },
];
const series = [{ key: 'web', label: 'Web' }, { key: 'mobile', label: 'Mobile' }];
const share = [{ browser: 'Chrome', visits: 60 }, { browser: 'Safari', visits: 30 }, { browser: 'Firefox', visits: 10 }];

/** The rgb() a token resolves to inside `scope` (so it follows that scope's data-theme). */
function tokenColor(token: string, scope: Element = document.body) {
  const probe = document.createElement('span');
  probe.style.color = `var(${token})`;
  scope.appendChild(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

describe('Charts', () => {
  it('names the chart image by the title and toggles an accessible table of the same data', async () => {
    render(<BarChart title="Signups by month" description="Web and mobile" data={data} series={series} xKey="month" xLabel="Month" />);
    expect(screen.getByRole('figure', { name: 'Signups by month' })).toBeVisible();
    expect(await screen.findByRole('img', { name: 'Signups by month' })).toHaveAccessibleDescription('Web and mobile');

    await userEvent.click(screen.getByRole('button', { name: 'Show table' }));
    const table = screen.getByRole('table', { name: 'Signups by month' });
    expect(within(table).getAllByRole('columnheader').map(h => h.textContent)).toEqual(['Month', 'Web', 'Mobile']);
    expect(within(table).getByRole('rowheader', { name: 'Feb' })).toBeVisible();
    expect(within(table).getByRole('cell', { name: (1350).toLocaleString() })).toBeVisible();

    await userEvent.click(screen.getByRole('button', { name: 'Show chart' }));
    expect(await screen.findByRole('img', { name: 'Signups by month' })).toBeVisible();
  });

  it('paints series in the fixed palette order, follows the theme and honors a pinned color', async () => {
    const first: string[] = [];
    for (const theme of ['light', 'dark'] as const) {
      const host = document.createElement('div');
      host.setAttribute('data-theme', theme);
      document.body.appendChild(host);
      const { unmount } = render(<BarChart title="Signups" data={data} series={[series[0]!, { ...series[1]!, color: 4 }]} xKey="month" />, { container: host });
      await expect.poll(() => host.querySelectorAll('.recharts-bar-rectangle path').length).toBeGreaterThan(0);
      const fills = (layer: number) => getComputedStyle(host.querySelectorAll('.recharts-bar-rectangles')[layer]!.querySelector('path')!).fill;
      expect(fills(0)).toBe(tokenColor('--chart-1', host));
      expect(fills(1)).toBe(tokenColor('--chart-4', host));
      first.push(fills(0));
      unmount();
      host.remove();
    }
    expect(first[0]).not.toBe(first[1]);
  });

  it('shows a legend for two or more series only', () => {
    const { unmount } = render(<LineChart title="Trend" data={data} series={series} xKey="month" />);
    expect(screen.getByRole('list')).toMatchTextContent('WebMobile');
    unmount();
    render(<LineChart title="Trend" data={data} series={[series[0]!]} xKey="month" />);
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('keyboard focus on the chart shows the same tooltip as hover', async () => {
    render(<LineChart title="Trend" data={data} series={series} xKey="month" valueFormatter={v => `${v} users`} />);
    const chart = await screen.findByRole('img', { name: 'Trend' });
    chart.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect.poll(() => document.querySelector('.cs-chart-tooltip')?.textContent ?? '').toMatch(/users/);
    expect(document.querySelector('.cs-chart-tooltip')).toMatchTextContent(/Web.*Mobile/);
  });

  it('donut shows the total in the center and each slice share in the legend', async () => {
    render(<DonutChart title="Browsers" data={share} series={[{ key: 'visits', label: 'Visits' }]} xKey="browser" centerLabel="Total" />);
    expect(screen.getByText('100')).toBeVisible();
    expect(screen.getByRole('list')).toMatchTextContent('Chrome60 · 60%');
    expect(await screen.findByRole('img', { name: 'Browsers' })).toBeVisible();
  });

  it('sparkline is a named image', () => {
    render(<div style={{ width: 120 }}><Sparkline data={data} dataKey="web" label="Web signups, up 25%" /></div>);
    expect(screen.getByRole('img', { name: 'Web signups, up 25%' })).toBeVisible();
  });

  it('has no accessibility violations in light and dark, chart and table views', async () => {
    const results = await expectAccessibleInThemes(
      <div>
        <BarChart title="Grouped" data={data} series={series} xKey="month" />
        <BarChart title="Stacked" data={data} series={series} xKey="month" stacked />
        <LineChart title="Line" data={data} series={series} xKey="month" />
        <AreaChart title="Area" data={data} series={series} xKey="month" stacked />
        <DonutChart title="Donut" data={share} series={[{ key: 'visits', label: 'Visits' }]} xKey="browser" centerLabel="Total" />
        <Sparkline data={data} dataKey="web" label="Web signups" />
      </div>,
    );
    const r = results[0]!;
    for (const button of within(r.container as HTMLElement).getAllByRole('button', { name: 'Show table' })) await userEvent.click(button);
    expect(within(r.container as HTMLElement).getAllByRole('table')).toHaveLength(5);
    await expectNoA11yViolations(r.container);
  });
});
