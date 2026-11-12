import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { Copy } from '@phosphor-icons/react';
import { IconButton } from './Button';
import { Tooltip, TooltipProvider } from './Tooltip';
import { expectNoA11yViolations } from '../test/a11y';

function Example() {
  return (
    <TooltipProvider delay={0}>
      <Tooltip content="Copies the key once.">
        <IconButton label="Copy API key" icon={<Copy />} />
      </Tooltip>
    </TooltipProvider>
  );
}

describe('Tooltip', () => {
  it('shows on hover and hides when the pointer leaves', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Copy API key' });
    await userEvent.hover(trigger);
    expect(await screen.findByText('Copies the key once.')).toBeVisible();
    await userEvent.unhover(trigger);
    await expect.poll(() => screen.queryByText('Copies the key once.')).toBeNull();
  });

  it('shows on keyboard focus, Escape hides it and the trigger keeps focus and its own name', async () => {
    render(<Example />);
    await userEvent.tab();
    const trigger = screen.getByRole('button', { name: 'Copy API key' });
    expect(document.activeElement).toBe(trigger);
    expect(await screen.findByText('Copies the key once.')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByText('Copies the key once.')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<Example />);
      await userEvent.hover(screen.getByRole('button', { name: 'Copy API key' }));
      const tip = await screen.findByText('Copies the key once.');
      await expect.poll(() => getComputedStyle(tip).opacity).toBe('1'); // after the fade-in
      await expectNoA11yViolations(container);
      await expectNoA11yViolations(tip.closest('[data-base-ui-portal]')!);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
