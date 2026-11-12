import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Star, TextB } from '@phosphor-icons/react';
import { Toggle } from './Toggle';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Toggle', () => {
  it('flips aria-pressed when clicked', async () => {
    const onPressedChange = vi.fn();
    render(<Toggle icon={<Star />} onPressedChange={onPressedChange}>Favorite</Toggle>);
    const toggle = screen.getByRole('button', { name: 'Favorite' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('icon-only toggles are named by label and work with the keyboard', async () => {
    render(<Toggle icon={<TextB />} label="Bold" defaultPressed />);
    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    toggle.focus();
    await userEvent.keyboard(' ');
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('keeps a caller aria-label on an icon-only toggle', () => {
    render(<Toggle icon={<TextB />} aria-label="In đậm" />);
    expect(screen.getByRole('button', { name: 'In đậm' })).toBeVisible();
  });

  it('swaps to pressedIcon while pressed', async () => {
    render(<Toggle icon={<Star data-testid="off" />} pressedIcon={<Star weight="fill" data-testid="on" />} label="Favorite" />);
    expect(screen.getByTestId('on')).not.toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'Favorite' }));
    expect(screen.getByTestId('on')).toBeVisible();
    expect(screen.getByTestId('off')).not.toBeVisible();
  });

  it('keeps a 44px touch target on small toggles', () => {
    render(<Toggle size="sm" icon={<TextB />} label="Bold" />);
    const hit = getComputedStyle(screen.getByRole('button'), '::before');
    expect(parseFloat(hit.height)).toBeGreaterThanOrEqual(44);
    expect(parseFloat(hit.width)).toBeGreaterThanOrEqual(44);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'flex', gap: 8 }}>
        <Toggle icon={<Star />}>Favorite</Toggle>
        <Toggle icon={<Star />} pressedIcon={<Star weight="fill" />} defaultPressed>Favorited</Toggle>
        <Toggle icon={<TextB />} label="Bold" size="sm" defaultPressed />
        <Toggle icon={<TextB />} label="Bold" size="lg" />
        <Toggle disabled>Locked</Toggle>
      </div>,
    );
  });
});
