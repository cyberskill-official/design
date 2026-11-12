import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from './Dialog';
import { expectNoA11yViolations } from '../test/a11y';

function Example() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary" />}>Delete project</DialogTrigger>
      <DialogContent title="Delete Support Copilot?" description="This removes the agent and its history." size="sm">
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>Cancel</DialogClose>
          <Button variant="danger">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('opens as a labelled modal dialog, moves focus in and restores it on Escape', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Delete project' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Delete Support Copilot?' });
    expect(dialog).toHaveAccessibleDescription('This removes the agent and its history.');
    expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('Cancel closes it', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { unmount } = render(<Example />);
      await userEvent.click(screen.getByRole('button', { name: 'Delete project' }));
      await screen.findByRole('dialog');
      await expectNoA11yViolations(document.body);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
