import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { TextB, TextItalic, TextUnderline } from '@phosphor-icons/react';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';
import { expectAccessibleInThemes } from '../test/a11y';

function Formatting(props: Partial<React.ComponentProps<typeof ToggleGroup>>) {
  return (
    <ToggleGroup label="Text formatting" multiple {...props}>
      <ToggleGroupItem value="bold" icon={<TextB />} label="Bold" />
      <ToggleGroupItem value="italic" icon={<TextItalic />} label="Italic" />
      <ToggleGroupItem value="underline" icon={<TextUnderline />} label="Underline" />
    </ToggleGroup>
  );
}

const pressed = () => screen.getAllByRole('button').filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.getAttribute('aria-label') ?? b.textContent);

describe('ToggleGroup', () => {
  it('is a named group of icon-only toggle buttons named by label', () => {
    render(<Formatting defaultValue={['bold']} />);
    expect(screen.getByRole('group', { name: 'Text formatting' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('multiple: presses several and reports the array', async () => {
    const onValueChange = vi.fn();
    render(<Formatting defaultValue={['bold']} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Italic' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic'], expect.anything());
    expect(pressed()).toEqual(['Bold', 'Italic']);
  });

  it('single: pressing one releases the others', async () => {
    render(
      <ToggleGroup label="Status filter" defaultValue={['all']}>
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        <ToggleGroupItem value="active">Active</ToggleGroupItem>
        <ToggleGroupItem value="archived">Archived</ToggleGroupItem>
      </ToggleGroup>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Active' }));
    expect(pressed()).toEqual(['Active']);
  });

  it('arrow keys move focus inside the group and Space toggles', async () => {
    render(<Formatting />);
    screen.getByRole('button', { name: 'Bold' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(pressed()).toEqual(['Italic']);
  });

  it('sizes every item from the group and keeps 44px touch areas apart', () => {
    render(<Formatting size="sm" />);
    const buttons = screen.getAllByRole('button');
    for (const b of buttons) expect(b).toHaveAttribute('data-size', 'sm');
    const hit = (b: HTMLElement) => {
      const r = b.getBoundingClientRect();
      const w = parseFloat(getComputedStyle(b, '::before').width);
      return { w, left: r.left + r.width / 2 - w / 2, right: r.left + r.width / 2 + w / 2 };
    };
    const [a, b] = [hit(buttons[0]!), hit(buttons[1]!)];
    expect(a.w).toBeGreaterThanOrEqual(44);
    expect(b.left).toBeGreaterThanOrEqual(a.right - 0.5);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16 }}>
        <Formatting defaultValue={['bold', 'underline']} />
        <ToggleGroup label="Status filter" defaultValue={['active']} size="sm">
          <ToggleGroupItem value="all">All</ToggleGroupItem>
          <ToggleGroupItem value="active">Active</ToggleGroupItem>
          <ToggleGroupItem value="archived" disabled>Archived</ToggleGroupItem>
        </ToggleGroup>
        <Formatting size="lg" disabled />
      </div>,
    );
  });
});
