import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Star } from '@phosphor-icons/react';
import { Badge, type BadgeTone } from './Badge';
import { expectAccessibleInThemes } from '../test/a11y';

const tones: BadgeTone[] = ['neutral', 'primary', 'accent', 'success', 'warning', 'danger', 'info'];

describe('Badge', () => {
  it('renders its text with tone, variant and size as data attributes', () => {
    render(<Badge tone="primary" variant="solid" size="sm">Beta</Badge>);
    const badge = screen.getByText('Beta').closest('.cs-badge');
    expect(badge).toHaveAttribute('data-tone', 'primary');
    expect(badge).toHaveAttribute('data-variant', 'solid');
    expect(badge).toHaveAttribute('data-size', 'sm');
  });

  it('status tones always show a decorative icon, even with icon={false}', () => {
    render(<Badge tone="danger" icon={false}>Failed</Badge>);
    const icon = screen.getByText('Failed').closest('.cs-badge')?.querySelector('.cs-badge-icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon?.querySelector('svg')).not.toBeNull();
  });

  it('non-status tones have no icon unless given one', () => {
    render(
      <>
        <Badge tone="neutral">Draft</Badge>
        <Badge tone="accent" icon={<Star />}>Featured</Badge>
      </>,
    );
    expect(screen.getByText('Draft').closest('.cs-badge')?.querySelector('.cs-badge-icon')).toBeNull();
    expect(screen.getByText('Featured').closest('.cs-badge')?.querySelector('.cs-badge-icon svg')).not.toBeNull();
  });

  it('truncates a long label inside a narrow container instead of overflowing it', () => {
    render(<div style={{ width: 120 }}><Badge>INV-2026-000184-HCM-PAYMENT-RECONCILIATION</Badge></div>);
    const badge = screen.getByText(/INV-2026/).closest('.cs-badge')!;
    expect(badge.getBoundingClientRect().width).toBeLessThanOrEqual(120);
  });

  it('has no accessibility violations (text contrast included) in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(['soft', 'solid', 'outline'] as const).flatMap(variant =>
          tones.flatMap(tone => (['sm', 'md'] as const).map(size => (
            <Badge key={`${variant}-${tone}-${size}`} tone={tone} variant={variant} size={size}>{`${tone} ${variant}`}</Badge>
          ))),
        )}
      </div>,
    );
  });
});
