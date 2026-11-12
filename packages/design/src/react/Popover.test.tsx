import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';
import { TextField } from './Field';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { expectNoA11yViolations } from '../test/a11y';

function Example({ closeLabel }: { closeLabel?: string }) {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="secondary" />}>Usage limits</PopoverTrigger>
      <PopoverContent title="Monthly limit" description="Agents pause when the workspace reaches this many messages." closeLabel={closeLabel}>
        <TextField label="Messages per month" type="number" defaultValue="20000" />
      </PopoverContent>
    </Popover>
  );
}

describe('Popover', () => {
  it('opens a labelled dialog, moves focus in and restores it on Escape', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Usage limits' });
    await userEvent.click(trigger);
    const popover = await screen.findByRole('dialog', { name: 'Monthly limit' });
    expect(popover).toHaveAccessibleDescription('Agents pause when the workspace reaches this many messages.');
    await expect.poll(() => popover.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('the close button closes it and takes a translated label', async () => {
    render(<Example closeLabel="Đóng" />);
    await userEvent.click(screen.getByRole('button', { name: 'Usage limits' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Đóng' }));
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<Example />);
      await userEvent.click(screen.getByRole('button', { name: 'Usage limits' }));
      const popover = await screen.findByRole('dialog');
      await expect.poll(() => getComputedStyle(popover).opacity).toBe('1'); // after the fade-in
      await expectNoA11yViolations(container);
      await expectNoA11yViolations(popover.closest('[data-base-ui-portal]')!);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
