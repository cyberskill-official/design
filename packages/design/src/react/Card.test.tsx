import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
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

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16 }}>
        <Example />
        <Card interactive render={<a href="#security" />}>
          <CardTitle>Security</CardTitle>
          <CardDescription>SSO, audit log and data residency.</CardDescription>
        </Card>
      </div>,
    );
  });
});
