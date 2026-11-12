import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Lightning, ShieldCheck } from '@phosphor-icons/react';
import { IconTile } from './IconTile';
import type { Tone } from './tone';
import { expectAccessibleInThemes } from '../test/a11y';

const tones: Tone[] = ['primary', 'accent', 'success', 'warning', 'danger', 'info', 'blue', 'amber', 'teal', 'magenta', 'violet'];

describe('IconTile', () => {
  it('is decorative by default, with ink as the default tone', () => {
    const { container } = render(<IconTile><Lightning /></IconTile>);
    const tile = container.querySelector('.cs-icon-tile')!;
    expect(tile).toHaveAttribute('aria-hidden', 'true');
    expect(tile).toHaveAttribute('data-tone', 'primary');
    expect(tile).toHaveAttribute('data-size', 'md');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('is an image named by aria-label when given one', () => {
    render(<IconTile tone="success" aria-label="Verified"><ShieldCheck /></IconTile>);
    const tile = screen.getByRole('img', { name: 'Verified' });
    expect(tile).not.toHaveAttribute('aria-hidden');
    expect(tile).toHaveAttribute('data-tone', 'success');
  });

  it('is 28, 36 or 44px square', () => {
    const { container } = render(
      <>
        <IconTile size="sm"><Lightning /></IconTile>
        <IconTile size="md"><Lightning /></IconTile>
        <IconTile size="lg"><Lightning /></IconTile>
      </>,
    );
    const sizes = [...container.querySelectorAll('.cs-icon-tile')].map(t => [t.getBoundingClientRect().width, t.getBoundingClientRect().height]);
    expect(sizes).toEqual([[28, 28], [36, 36], [44, 44]]);
  });

  it('paints the tone tint behind the icon and the tone icon color on it', () => {
    const { container } = render(
      <>
        <IconTile tone="teal"><Lightning /></IconTile>
        <span data-testid="probe" style={{ background: 'var(--teal-soft)', color: 'var(--teal-icon)' }} />
      </>,
    );
    const tile = getComputedStyle(container.querySelector('.cs-icon-tile')!);
    const probe = getComputedStyle(screen.getByTestId('probe'));
    expect(tile.backgroundColor).toBe(probe.backgroundColor);
    expect(tile.color).toBe(probe.color);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {tones.map(tone => <IconTile key={tone} tone={tone} aria-label={tone}><Lightning /></IconTile>)}
      </div>,
    );
  });
});
