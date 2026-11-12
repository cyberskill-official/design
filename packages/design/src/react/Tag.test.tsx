import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Tag } from './Tag';
import { expectAccessibleInThemes } from '../test/a11y';

describe('Tag', () => {
  it('renders its label without a button when not removable', () => {
    render(<Tag>Enterprise</Tag>);
    expect(screen.getByText('Enterprise')).toBeVisible();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('remove button is named after the tag and calls onRemove', async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>SOC 2</Tag>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove SOC 2' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('takes a translated remove label and works from the keyboard', async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove} removeLabel="Xóa">v2.4.1</Tag>);
    const button = screen.getByRole('button', { name: 'Xóa v2.4.1' });
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it('keeps a 44px touch target on the remove button', () => {
    render(<Tag onRemove={() => {}}>SOC 2</Tag>);
    const hit = getComputedStyle(screen.getByRole('button'), '::before');
    expect(parseFloat(hit.width)).toBeGreaterThanOrEqual(44);
    expect(parseFloat(hit.height)).toBeGreaterThanOrEqual(44);
  });

  it('takes a category tone', () => {
    render(<Tag tone="violet">Research</Tag>);
    expect(screen.getByText('Research').closest('.cs-tag')).toHaveAttribute('data-tone', 'violet');
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {(['blue', 'amber', 'teal', 'magenta', 'violet'] as const).map(tone => <Tag key={tone} tone={tone} onRemove={() => {}}>{tone}</Tag>)}
        <Tag>Enterprise</Tag>
        <Tag onRemove={() => {}}>SOC 2</Tag>
        <Tag onRemove={() => {}}>ISO 27001</Tag>
      </div>,
    );
  });
});
