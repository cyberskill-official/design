import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Meter } from './Meter';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Meter', () => {
  it('is a meter named by its label, showing the percentage by default', () => {
    render(<Meter label="Storage" value={30} />);
    const meter = screen.getByRole('meter', { name: 'Storage' });
    expect(meter).toHaveAttribute('aria-valuenow', '30');
    expect(screen.getByText('30%')).toBeVisible();
  });

  it('fills gold by default and ink with tone="primary"', () => {
    const { rerender } = render(<Meter label="Storage" value={30} />);
    expect(screen.getByRole('meter')).toHaveAttribute('data-tone', 'accent');
    rerender(<Meter label="Storage" value={30} tone="primary" />);
    expect(screen.getByRole('meter')).toHaveAttribute('data-tone', 'primary');
    expect(screen.getByRole('meter').querySelector('svg')).toBeNull();
  });

  it('valueLabel replaces the visible and spoken value', () => {
    render(<Meter label="API calls" value={720_000} max={1_000_000} valueLabel="720K of 1M" />);
    const meter = screen.getByRole('meter', { name: 'API calls' });
    expect(meter).toHaveAttribute('aria-valuetext', '720K of 1M');
    expect(screen.getByText('720K of 1M')).toBeVisible();
  });

  it('switches to warning at warnAt and shows an icon', () => {
    render(<Meter label="API calls" value={850_000} max={1_000_000} warnAt={800_000} />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('data-tone', 'warning');
    expect(meter.querySelector('svg')).not.toBeNull();
  });

  it('names the warning and danger status for screen readers, with overridable labels', () => {
    const { rerender } = render(<Meter label="API calls" value={850} max={1000} warnAt={800} />);
    expect(screen.getByRole('meter', { name: /^API calls ?, Warning$/ })).toBeVisible();
    rerender(<Meter label="Seats" value={10} max={10} tone="danger" />);
    expect(screen.getByRole('meter', { name: /^Seats ?, Critical$/ })).toBeVisible();
    rerender(<Meter label="Chỗ ngồi" value={10} max={10} tone="warning" warningLabel="Cảnh báo" />);
    expect(screen.getByRole('meter', { name: /^Chỗ ngồi ?, Cảnh báo$/ })).toBeVisible();
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16, width: 320 }}>
        <Meter label="Storage" value={30} />
        <Meter label="Seats" value={6} max={10} tone="primary" valueLabel="6 of 10" />
        <Meter label="API calls" value={850_000} max={1_000_000} warnAt={800_000} valueLabel="850K of 1M" />
        <Meter label="Seats" value={10} max={10} tone="danger" valueLabel="10 of 10" />
      </div>,
    );
  });
});
