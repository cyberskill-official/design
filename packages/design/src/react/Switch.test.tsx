import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Switch', () => {
  it('is named by its label, described by its help text and toggles', async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Auto-deploy main" description="Deploys every push to main." onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch', { name: 'Auto-deploy main' });
    expect(control).toHaveAccessibleDescription('Deploys every push to main.');
    expect(control).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(screen.getByText('Auto-deploy main'));
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
    control.focus();
    await userEvent.keyboard(' ');
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('does not toggle when disabled', async () => {
    render(<Switch label="Maintenance mode" disabled />);
    const control = screen.getByRole('switch', { name: 'Maintenance mode' });
    await userEvent.click(control, { force: true });
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('keeps a 44px touch target around the track', () => {
    render(<Switch label="Beta features" />);
    const hit = getComputedStyle(screen.getByRole('switch'), '::before');
    expect(parseFloat(hit.height)).toBeGreaterThanOrEqual(44);
  });

  it('is gold when on, edged in --accent-text so it keeps a 3:1 boundary', () => {
    render(<><Switch label="On" defaultChecked /><span data-testid="probe" style={{ background: 'var(--accent)', borderColor: 'var(--accent-text)' }} /></>);
    const track = getComputedStyle(screen.getByRole('switch'));
    const probe = getComputedStyle(screen.getByTestId('probe'));
    expect(track.backgroundColor).toBe(probe.backgroundColor);
    expect(track.borderTopColor).toBe(probe.borderTopColor);
    expect(track.borderTopStyle).toBe('solid');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16 }}>
        <Switch label="Off" description="Help text." />
        <Switch label="On" defaultChecked />
        <Switch label="Disabled" disabled />
      </div>,
    );
  });
});
