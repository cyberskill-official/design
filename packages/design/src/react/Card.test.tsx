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

// WCAG contrast of two computed rgb() colors
const ratio = (a: string, b: string) => {
  const lum = (c: string) => {
    const [r, g, bl] = c.match(/[\d.]+/g)!.slice(0, 3).map(v => +v / 255).map(v => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * bl!;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

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
    expect(getComputedStyle(ink).borderTopColor).not.toBe('rgba(0, 0, 0, 0)'); // an edge, so its deep end never melts into a dark page
    expect(getComputedStyle(ink).backgroundImage).toMatch(/^linear-gradient/);
    expect(screen.getByTestId('aurora')).not.toHaveAttribute('data-theme');
    expect(getComputedStyle(screen.getByTestId('aurora')).backgroundImage).toMatch(/radial-gradient/);
  });

  it("keeps an app's own data-tone and data-surface when the props are not given", () => {
    render(<><Card data-testid="a" data-tone="custom" /><Card data-testid="b" data-surface="custom" /><Card data-testid="c" tone="teal" /></>);
    expect(screen.getByTestId('a')).toHaveAttribute('data-tone', 'custom');
    expect(screen.getByTestId('b')).toHaveAttribute('data-surface', 'custom');
    expect(screen.getByTestId('c')).toHaveAttribute('data-tone', 'teal');
    expect(screen.getByTestId('c')).not.toHaveAttribute('data-surface');
  });

  it('an interactive ink card draws its focus ring and hover edge inside, on the ink, on a light and a dark page', async () => {
    for (const theme of ['light', 'dark'] as const) {
      const host = document.createElement('div');
      host.setAttribute('data-theme', theme);
      host.style.padding = '16px';
      document.body.appendChild(host);
      render(
        <Card interactive surface="ink" render={<a href="#plan" />}>
          <CardTitle>{`Pro plan ${theme}`}</CardTitle>
          <span data-testid={`ink-${theme}`} style={{ color: 'var(--brand-ink)', borderColor: 'var(--ink-deep)' }} />
        </Card>,
        { container: host },
      );
    }
    for (const theme of ['light', 'dark'] as const) {
      await userEvent.tab();
      const card = screen.getByRole('link', { name: `Pro plan ${theme}` });
      expect(document.activeElement).toBe(card);
      const style = getComputedStyle(card);
      const ink = getComputedStyle(screen.getByTestId(`ink-${theme}`));
      expect(style.outlineStyle).toBe('solid');
      expect(parseFloat(style.outlineOffset)).toBeLessThan(0);
      expect(ratio(style.outlineColor, ink.color)).toBeGreaterThanOrEqual(3);
      expect(ratio(style.outlineColor, ink.borderTopColor)).toBeGreaterThanOrEqual(3);
      await userEvent.hover(card);
      await expect.poll(() => getComputedStyle(card).boxShadow).toMatch(/inset/);
    }
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
