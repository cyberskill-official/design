import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ComponentProps } from 'react';
import { Link } from './Link';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Link', () => {
  it('renders an underlined anchor', () => {
    render(<Link href="/docs">Read the docs</Link>);
    const link = screen.getByRole('link', { name: 'Read the docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveAttribute('data-tone', 'default');
    expect(getComputedStyle(link).textDecorationLine).toBe('underline');
    expect(link).not.toHaveAttribute('target');
  });

  it('external links open a new tab safely and say so to screen readers', () => {
    render(<Link href="https://example.com" external>Status page</Link>);
    const link = screen.getByRole('link', { name: 'Status page (opens in new tab)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('takes a translated external label', () => {
    render(<Link href="https://example.com" external externalLabel="(mở trong thẻ mới)">Trạng thái</Link>);
    expect(screen.getByRole('link', { name: 'Trạng thái (mở trong thẻ mới)' })).toBeVisible();
  });

  it('renders through a router link with render', () => {
    const RouterLink = ({ to, ...props }: ComponentProps<'a'> & { to: string }) => <a {...props} href={to} data-router="" />;
    render(<Link render={<RouterLink to="/pricing" />} tone="muted">Pricing</Link>);
    const link = screen.getByRole('link', { name: 'Pricing' });
    expect(link).toHaveAttribute('href', '/pricing');
    expect(link).toHaveAttribute('data-router');
    expect(link).toHaveClass('cs-link');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <p>
        Read the <Link href="/docs">setup guide</Link>, check the <Link href="https://example.com" external>status page</Link> or see{' '}
        <Link href="/terms" tone="muted">terms</Link>.
      </p>,
    );
  });
});
