import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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

  it('sentiment defaults from the trend', () => {
    render(<Stat label="Uptime" value="99.2%" delta={{ value: '−0.6%', trend: 'down' }} />);
    expect(screen.getByText('−0.6%')).toHaveAttribute('data-sentiment', 'negative');
  });

  it('renders the chart slot', () => {
    render(<Stat label="Requests" value="1.2M"><svg role="img" aria-label="Requests over 30 days" /></Stat>);
    expect(screen.getByRole('img', { name: 'Requests over 30 days' }).parentElement).toHaveClass('cs-stat-chart');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Stat label="Monthly revenue" value="$48,210" delta={{ value: '+8.4%', trend: 'up' }} hint="vs. last month" />
        <Stat label="Error rate" value="0.42%" delta={{ value: '+0.1 pts', trend: 'up', sentiment: 'negative' }} hint="vs. last week" />
        <Stat label="Seats" value="128" delta={{ value: '0', trend: 'up', sentiment: 'neutral' }} hint="no change" />
      </div>,
    );
  });
});
