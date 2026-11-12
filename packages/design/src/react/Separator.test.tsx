import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Separator } from './Separator';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Separator', () => {
  it('renders a horizontal separator by default', () => {
    render(<Separator />);
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('data-orientation', 'horizontal');
    expect(sep.getBoundingClientRect().height).toBe(1);
  });

  it('renders a vertical separator', () => {
    render(
      <div style={{ display: 'flex', height: 24 }}>
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>API</span>
      </div>,
    );
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
    expect(sep.getBoundingClientRect().width).toBe(1);
  });

  it('shows a label in the middle and uses it as the name', () => {
    render(<Separator label="or" />);
    expect(screen.getByRole('separator', { name: 'or' })).toBeVisible();
    expect(screen.getByText('or')).toBeVisible();
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16 }}>
        <Separator />
        <Separator label="or" />
        <div style={{ display: 'flex', gap: 12, height: 24 }}>
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>API</span>
        </div>
      </div>,
    );
  });
});
