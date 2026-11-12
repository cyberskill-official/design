import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { useState, type CSSProperties } from 'react';
import { renderToString } from 'react-dom/server';
import { SegmentedControl } from './SegmentedControl';
import { expectAccessibleInThemes } from '../test/a11y';

// offsetLeft/offsetWidth (immune to an opening dialog's scale) round to whole pixels, so allow one
const under = (thumb: HTMLElement, item: HTMLElement) => {
  const [t, i] = [thumb.getBoundingClientRect(), item.getBoundingClientRect()];
  return Math.abs(t.left - i.left) <= 1 && Math.abs(t.width - i.width) <= 1;
};

const views = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
  { value: 'timeline', label: 'Timeline' },
];

describe('SegmentedControl', () => {
  it('is a labelled group; the first segment is selected by default', () => {
    render(<SegmentedControl label="View" items={views} />);
    expect(screen.getByRole('group', { name: 'View' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'List' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Board' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('selects on click and never clears the selection', async () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl label="View" items={views} defaultValue="board" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Timeline' }));
    expect(onValueChange).toHaveBeenLastCalledWith('timeline');
    expect(screen.getByRole('button', { name: 'Timeline' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Board' })).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(screen.getByRole('button', { name: 'Timeline' }));
    expect(screen.getByRole('button', { name: 'Timeline' })).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('follows a controlled value', async () => {
    const { rerender } = render(<SegmentedControl label="View" items={views} value="list" />);
    rerender(<SegmentedControl label="View" items={views} value="timeline" />);
    expect(screen.getByRole('button', { name: 'Timeline' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('a controlled value reset to undefined (React Hook Form reset()) selects nothing, not the last click', async () => {
    function Form() {
      const [view, setView] = useState<string | undefined>('list');
      return (
        <>
          <SegmentedControl label="View" items={views} value={view} onValueChange={setView} />
          <button type="button" onClick={() => setView(undefined)}>Reset</button>
        </>
      );
    }
    render(<Form />);
    await userEvent.click(screen.getByRole('button', { name: 'Board' }));
    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByRole('button', { name: 'Board' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('moves focus between segments with arrow keys', async () => {
    render(<SegmentedControl label="View" items={views} />);
    screen.getByRole('button', { name: 'List' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Board' }));
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('button', { name: 'Board' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('one thumb sits under the pressed segment and slides to the next one', async () => {
    const { container } = render(<SegmentedControl label="View" items={views} />);
    const thumb = container.querySelector<HTMLElement>('.cs-segmented-control-thumb')!;
    expect(thumb).toBeVisible();
    expect(thumb).toHaveAttribute('aria-hidden', 'true');
    expect(under(thumb, screen.getByRole('button', { name: 'List' }))).toBe(true);
    // the thumb draws the selection now, so the pressed segment drops its own background
    expect(getComputedStyle(screen.getByRole('button', { name: 'List' })).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    await userEvent.click(screen.getByRole('button', { name: 'Timeline' }));
    await expect.poll(() => under(thumb, screen.getByRole('button', { name: 'Timeline' }))).toBe(true);
  });

  it('keeps the thumb on the pressed segment when a label or the track size changes', async () => {
    const { container, rerender } = render(<div style={{ width: 400 }}><SegmentedControl label="View" items={views} defaultValue="board" /></div>);
    const thumb = container.querySelector<HTMLElement>('.cs-segmented-control-thumb')!;
    const board = () => screen.getByRole('button', { name: /Board/ });
    rerender(<div style={{ width: 400 }}><SegmentedControl label="View" items={views.map(v => (v.value === 'board' ? { ...v, label: 'Board with a longer name' } : v))} defaultValue="board" /></div>);
    await expect.poll(() => under(thumb, board())).toBe(true);
    expect(board().offsetWidth).toBeGreaterThan(150);
    rerender(<div style={{ width: 160 }}><SegmentedControl label="View" items={views} defaultValue="board" /></div>);
    await expect.poll(() => under(thumb, board())).toBe(true);
    expect(board().offsetWidth).toBeLessThan(100);
  });

  it('measured inside a hidden container, it waits: the pressed segment keeps its selection, and the thumb appears in place once shown', async () => {
    // a slow slide, so a thumb springing in from the left edge would still be on its way when checked
    const { container } = render(
      <div hidden data-testid="box">
        <SegmentedControl label="View" items={views} defaultValue="timeline" style={{ '--motion-move': '10s linear' } as CSSProperties} />
      </div>,
    );
    const thumb = container.querySelector<HTMLElement>('.cs-segmented-control-thumb')!;
    expect(thumb).toHaveAttribute('hidden');
    const timeline = container.querySelector<HTMLElement>('[data-pressed]')!;
    expect(getComputedStyle(timeline).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    screen.getByTestId('box').hidden = false;
    await expect.poll(() => thumb.hasAttribute('hidden')).toBe(false);
    expect(under(thumb, timeline)).toBe(true);
    expect(thumb.getAnimations()).toHaveLength(0);
  });

  it('renders the thumb hidden on the server, so the pressed segment shows the selection until it is measured', () => {
    const html = renderToString(<SegmentedControl label="View" items={views} />);
    expect(html).toMatch(/<span[^>]*class="cs-segmented-control-thumb"[^>]*hidden=""/);
    expect(html).toMatch(/aria-pressed="true"[^>]*data-pressed=""|data-pressed=""[^>]*aria-pressed="true"/);
  });

  it('keeps a 44px touch target on each segment', () => {
    render(<SegmentedControl label="View" items={views} size="sm" />);
    const hit = getComputedStyle(screen.getByRole('button', { name: 'List' }), '::before');
    expect(parseFloat(hit.height)).toBeGreaterThanOrEqual(44);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
        <SegmentedControl label="View" items={views} size="sm" />
        <SegmentedControl label="Range" items={[{ value: '7d', label: '7 days' }, { value: '30d', label: '30 days' }, { value: '90d', label: '90 days', disabled: true }]} defaultValue="30d" />
        <SegmentedControl label="Mode" items={views} size="lg" defaultValue="timeline" />
      </div>,
    );
  });
});
