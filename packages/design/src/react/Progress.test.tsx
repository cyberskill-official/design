import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Progress } from './Progress';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Progress', () => {
  it('is a progressbar named by its label, with value text', () => {
    render(<Progress label="Uploading 3 files" value={50} max={200} />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading 3 files' });
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuemax', '200');
    expect(screen.getByText('25%')).toBeVisible();
    expect(bar).toHaveAttribute('data-tone', 'accent');
  });

  it('fills gold by default and ink with tone="primary"', () => {
    render(
      <>
        <Progress label="Gold" value={50} />
        <Progress label="Ink" value={50} tone="primary" />
        <span data-testid="accent" style={{ background: 'var(--accent)' }} />
        <span data-testid="primary" style={{ background: 'var(--primary)' }} />
      </>,
    );
    const fill = (name: string) => getComputedStyle(screen.getByRole('progressbar', { name }).querySelector('.cs-progress-indicator')!).backgroundColor;
    expect(fill('Gold')).toBe(getComputedStyle(screen.getByTestId('accent')).backgroundColor);
    expect(fill('Ink')).toBe(getComputedStyle(screen.getByTestId('primary')).backgroundColor);
  });

  it('switches to warning at warnAt and shows an icon, not just a color', () => {
    const { rerender } = render(<Progress label="Storage" value={79} warnAt={80} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('data-tone', 'accent');
    expect(bar.querySelector('svg')).toBeNull();
    rerender(<Progress label="Storage" value={80} warnAt={80} />);
    expect(bar).toHaveAttribute('data-tone', 'warning');
    expect(bar.querySelector('svg')).not.toBeNull();
  });

  it('names the warning and danger status for screen readers, with overridable labels', () => {
    const { rerender } = render(<Progress label="Storage" value={85} warnAt={80} />);
    expect(screen.getByRole('progressbar', { name: /^Storage ?, Warning$/ })).toBeVisible();
    rerender(<Progress label="Import" value={30} tone="danger" />);
    expect(screen.getByRole('progressbar', { name: /^Import ?, Critical$/ })).toBeVisible();
    rerender(<Progress label="Nhập dữ liệu" value={30} tone="danger" dangerLabel="Nghiêm trọng" />);
    expect(screen.getByRole('progressbar', { name: /^Nhập dữ liệu ?, Nghiêm trọng$/ })).toBeVisible();
    rerender(<Progress label="Upload" value={30} />);
    expect(screen.getByRole('progressbar', { name: 'Upload' })).toBeVisible();
  });

  it('shows the tone icon and status in the indeterminate state', () => {
    render(<Progress label="Retrying sync" value={null} tone="danger" />);
    const bar = screen.getByRole('progressbar', { name: /^Retrying sync ?, Critical$/ });
    expect(bar.querySelector('.cs-progress-value svg')).not.toBeNull();
  });

  it('is indeterminate when value is null', () => {
    render(<Progress label="Preparing export" value={null} />);
    const bar = screen.getByRole('progressbar', { name: 'Preparing export' });
    expect(bar).toHaveAttribute('data-indeterminate');
    expect(bar).not.toHaveAttribute('aria-valuenow');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16, width: 320 }}>
        <Progress label="Uploading" value={42} />
        <Progress label="Syncing" value={42} tone="primary" />
        <Progress label="Storage" value={85} warnAt={80} />
        <Progress label="Import failed" value={60} tone="danger" />
        <Progress label="Preparing export" value={null} />
        <Progress label="Retrying sync" value={null} tone="danger" />
      </div>,
    );
  });
});
