import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { expectAccessibleInThemes } from '../test/a11y';

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
