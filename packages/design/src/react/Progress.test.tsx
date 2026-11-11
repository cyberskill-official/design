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
    expect(bar).toHaveAttribute('data-tone', 'primary');
  });

  it('switches to warning at warnAt and shows an icon, not just a color', () => {
    const { rerender } = render(<Progress label="Storage" value={79} warnAt={80} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('data-tone', 'primary');
    expect(bar.querySelector('svg')).toBeNull();
    rerender(<Progress label="Storage" value={80} warnAt={80} />);
    expect(bar).toHaveAttribute('data-tone', 'warning');
    expect(bar.querySelector('svg')).not.toBeNull();
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
        <Progress label="Storage" value={85} warnAt={80} />
        <Progress label="Import failed" value={60} tone="danger" />
        <Progress label="Preparing export" value={null} />
      </div>,
    );
  });
});
