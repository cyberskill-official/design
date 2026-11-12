import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurrencyDollar, UsersThree } from '@phosphor-icons/react';
import { Stat } from './Stat';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Stat', () => {
  it('renders label, value, delta and hint', () => {
    render(<Stat label="Monthly revenue" value="$48,210" delta={{ value: '+8.4%', trend: 'up' }} hint="vs. last month" />);
    expect(screen.getByText('Monthly revenue')).toBeVisible();
    expect(screen.getByText('$48,210')).toHaveStyle({ fontVariantNumeric: 'tabular-nums' });
    expect(screen.getByText('vs. last month')).toBeVisible();
  });

  it('shows the trend with an arrow and text, never color alone', () => {
    render(<Stat label="Churn" value="2.1%" delta={{ value: '−0.4 pts', trend: 'down', sentiment: 'positive' }} />);
    const delta = screen.getByText('−0.4 pts');
    expect(delta).toHaveAttribute('data-trend', 'down');
    expect(delta).toHaveAttribute('data-sentiment', 'positive');
    expect(delta.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('says whether the change is good or bad in text, with overridable labels', () => {
    const { rerender } = render(<Stat label="Churn" value="2.1%" delta={{ value: '−0.4 pts', trend: 'down', sentiment: 'positive' }} />);
    expect(screen.getByText('−0.4 pts')).toHaveTextContent('−0.4 pts (positive change)');
    rerender(<Stat label="Latency" value="412 ms" delta={{ value: '+38 ms', trend: 'up', sentiment: 'negative' }} negativeLabel="tiêu cực" />);
    expect(screen.getByText('+38 ms')).toHaveTextContent('+38 ms (tiêu cực)');
    rerender(<Stat label="Seats" value="128" delta={{ value: '0', trend: 'up', sentiment: 'neutral' }} />);
    expect(screen.getByText('0').textContent).toBe('0');
  });

  it('sentiment defaults from the trend', () => {
    render(<Stat label="Uptime" value="99.2%" delta={{ value: '−0.6%', trend: 'down' }} />);
    expect(screen.getByText('−0.6%')).toHaveAttribute('data-sentiment', 'negative');
  });

  it('renders the chart slot', () => {
    render(<Stat label="Requests" value="1.2M"><svg role="img" aria-label="Requests over 30 days" /></Stat>);
    expect(screen.getByRole('img', { name: 'Requests over 30 days' }).parentElement).toHaveClass('cs-stat-chart');
  });

  it('icon renders a decorative tile in the given tone beside the label and value', () => {
    const { container, rerender } = render(<Stat label="Active users" value="1,284" icon={<UsersThree />} tone="teal" />);
    const tile = container.querySelector('.cs-icon-tile')!;
    expect(tile).toHaveAttribute('data-tone', 'teal');
    expect(tile).toHaveAttribute('aria-hidden', 'true');
    const label = screen.getByText('Active users').getBoundingClientRect();
    expect(tile.getBoundingClientRect().left).toBeGreaterThanOrEqual(label.right);
    rerender(<Stat label="Active users" value="1,284" />);
    expect(container.querySelector('.cs-icon-tile')).toBeNull();
  });

  it('draws the delta as a soft chip: the base status color as text on its 8% tint, with the arrow', () => {
    render(
      <>
        <Stat label="Churn" value="2.1%" delta={{ value: '−0.4 pts', trend: 'down', sentiment: 'positive' }} />
        <Stat label="Latency" value="412 ms" delta={{ value: '+38 ms', trend: 'up', sentiment: 'negative' }} />
        <span data-testid="good" style={{ background: 'color-mix(in srgb, var(--success) 8%, var(--panel))', color: 'var(--success)' }} />
        <span data-testid="bad" style={{ background: 'color-mix(in srgb, var(--destructive) 8%, var(--panel))', color: 'var(--destructive)' }} />
      </>,
    );
    for (const [text, probe] of [['−0.4 pts', 'good'], ['+38 ms', 'bad']] as const) {
      const chip = getComputedStyle(screen.getByText(text));
      const want = getComputedStyle(screen.getByTestId(probe));
      expect([chip.backgroundColor, chip.color]).toEqual([want.backgroundColor, want.color]);
      expect(screen.getByText(text).querySelector('svg')).not.toBeNull();
    }
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Stat label="Revenue" value="$48,210" icon={<CurrencyDollar />} tone="accent" delta={{ value: '+8.4%', trend: 'up' }} />
        <Stat label="Members" value="42" icon={<UsersThree />} />
        <Stat label="Monthly revenue" value="$48,210" delta={{ value: '+8.4%', trend: 'up' }} hint="vs. last month" />
        <Stat label="Error rate" value="0.42%" delta={{ value: '+0.1 pts', trend: 'up', sentiment: 'negative' }} hint="vs. last week" />
        <Stat label="Seats" value="128" delta={{ value: '0', trend: 'up', sentiment: 'neutral' }} hint="no change" />
      </div>,
    );
  });
});
