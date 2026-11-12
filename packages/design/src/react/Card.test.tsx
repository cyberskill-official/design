import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import type { CSSProperties } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';
import { expectAccessibleInThemes } from '../test/a11y';

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage this month</CardTitle>
        <CardDescription>Resets on the 1st.</CardDescription>
      </CardHeader>
      <CardContent>12,480 of 20,000 requests</CardContent>
      <CardFooter>
        <Button variant="secondary" size="sm">View details</Button>
      </CardFooter>
    </Card>
  );
}

describe('Card', () => {
  it('renders a titled surface with an h3 by default', () => {
    render(<Example />);
    expect(screen.getByRole('heading', { level: 3, name: 'Usage this month' })).toHaveClass('cs-card-title');
    expect(screen.getByText('Resets on the 1st.')).toHaveClass('cs-card-description');
  });

  it('title level follows render', () => {
    render(<CardTitle render={<h2 />}>Billing</CardTitle>);
    expect(screen.getByRole('heading', { level: 2, name: 'Billing' })).toHaveClass('cs-card-title');
  });

  it('renders as a focusable link when interactive', async () => {
    render(
      <Card interactive render={<a href="#billing" />}>
        <CardTitle>Billing</CardTitle>
        <CardDescription>Plans, invoices and payment methods.</CardDescription>
      </Card>,
    );
    const link = screen.getByRole('link', { name: /Billing/ });
    expect(link).toHaveAttribute('data-interactive');
    expect(link).toHaveClass('cs-card');
    await userEvent.tab();
    expect(document.activeElement).toBe(link);
  });

  it('lifts a link card on hover by a quarter of --motion-rise, so reduced motion keeps it still', async () => {
    render(
      <Card interactive render={<a href="#billing" />} style={{ '--motion-rise': '8px' } as CSSProperties}>
        <CardTitle>Billing</CardTitle>
      </Card>,
    );
    const link = screen.getByRole('link', { name: 'Billing' });
    await userEvent.hover(link);
    await expect.poll(() => new DOMMatrix(getComputedStyle(link).transform).m42).toBe(-2);
  });

  it('tone tints the card; surface="ink" paints the gradient and switches its content to the dark theme', () => {
    render(
      <>
        <Card tone="accent" data-testid="toned" />
        <Card surface="ink" tone="accent" data-testid="ink" />
        <Card surface="aurora" data-testid="aurora" />
        <span data-testid="probe" style={{ background: 'var(--accent-soft)' }} />
      </>,
    );
    expect(getComputedStyle(screen.getByTestId('toned')).backgroundColor).toBe(getComputedStyle(screen.getByTestId('probe')).backgroundColor);
    const ink = screen.getByTestId('ink');
    expect(ink).toHaveAttribute('data-theme', 'dark');
    expect(ink).not.toHaveAttribute('data-tone');
    expect(getComputedStyle(ink).backgroundImage).toMatch(/^linear-gradient/);
    expect(screen.getByTestId('aurora')).not.toHaveAttribute('data-theme');
    expect(getComputedStyle(screen.getByTestId('aurora')).backgroundImage).toMatch(/radial-gradient/);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16 }}>
        <Example />
        {(['primary', 'accent', 'success', 'warning', 'danger', 'info', 'blue', 'violet'] as const).map(tone => (
          <Card key={tone} tone={tone}>
            <CardTitle>{`${tone} card`}</CardTitle>
            <CardDescription>Plans, invoices and payment methods.</CardDescription>
          </Card>
        ))}
        <Card surface="ink">
          <CardTitle>Pro plan</CardTitle>
          <CardDescription>84% of seats in use.</CardDescription>
          <CardFooter><Button size="sm">Upgrade</Button><Button variant="secondary" size="sm">Compare</Button></CardFooter>
        </Card>
        <Card interactive render={<a href="#security" />}>
          <CardTitle>Security</CardTitle>
          <CardDescription>SSO, audit log and data residency.</CardDescription>
        </Card>
      </div>,
    );
  });
});
