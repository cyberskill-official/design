import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from './Collapsible';
import { expectAccessibleInThemes } from '../test/a11y';

function Example({ onOpenChange, defaultOpen }: { onOpenChange?: (open: boolean) => void; defaultOpen?: boolean }) {
  return (
    <Collapsible defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
      <CollapsiblePanel>
        <p>Temperature 0.2, max 800 tokens.</p>
      </CollapsiblePanel>
    </Collapsible>
  );
}

describe('Collapsible', () => {
  it('renders a collapsed toggle button', () => {
    render(<Example />);
    expect(screen.getByRole('button', { name: 'Advanced settings' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Temperature 0.2, max 800 tokens.')).toBeNull();
  });

  it('opens and closes from the keyboard and reports the change', async () => {
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button', { name: 'Advanced settings' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect.poll(() => screen.queryByText('Temperature 0.2, max 800 tokens.')).toBeVisible();
    expect(trigger).toHaveAttribute('aria-controls', screen.getByText('Temperature 0.2, max 800 tokens.').parentElement!.id);
    await userEvent.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onOpenChange.mock.calls.map(c => c[0])).toEqual([true, false]);
  });

  it('has no accessibility violations in light and dark', async () => {
    await expectAccessibleInThemes(<Example defaultOpen />);
  });
});
