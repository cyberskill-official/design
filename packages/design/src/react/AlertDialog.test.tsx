import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, type AlertDialogContentProps } from './AlertDialog';
import { expectNoA11yViolations } from '../test/a11y';

function Example(props: Partial<AlertDialogContentProps>) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="danger" />}>Delete agent</AlertDialogTrigger>
      <AlertDialogContent title="Delete Support Copilot?" description="Its history is removed for good." confirmLabel="Delete agent" {...props} />
    </AlertDialog>
  );
}

const open = async () => {
  const trigger = screen.getByRole('button', { name: 'Delete agent' });
  await userEvent.click(trigger);
  return { trigger, dialog: await screen.findByRole('alertdialog', { name: 'Delete Support Copilot?' }) };
};

describe('AlertDialog', () => {
  it('opens as a labelled alertdialog with focus on Cancel, Escape closes and restores focus', async () => {
    render(<Example />);
    const { trigger, dialog } = await open();
    expect(dialog).toHaveAccessibleDescription('Its history is removed for good.');
    await expect.poll(() => document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('alertdialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('does not close on a backdrop click', async () => {
    render(<Example />);
    await open();
    await userEvent.click(document.querySelector('.cs-dialog-backdrop')!, { position: { x: 5, y: 5 }, force: true });
    expect(screen.getByRole('alertdialog')).toBeVisible();
  });

  it('runs onConfirm and closes', async () => {
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);
    const { dialog } = await open();
    await userEvent.click(dialog.querySelector('[data-variant="danger"]')!);
    expect(onConfirm).toHaveBeenCalledOnce();
    await expect.poll(() => screen.queryByRole('alertdialog')).toBeNull();
  });

  it('keeps the dialog open with a busy button while an async confirm runs, and stays open when it fails', async () => {
    let settle!: (ok: boolean) => void;
    const onConfirm = () => new Promise<void>((resolve, reject) => (settle = ok => (ok ? resolve() : reject(new Error('Network')))));
    render(<Example onConfirm={onConfirm} />);
    const { dialog } = await open();
    const confirm = dialog.querySelector<HTMLElement>('[data-variant="danger"]')!;
    await userEvent.click(confirm);
    await expect.poll(() => confirm.getAttribute('aria-busy')).toBe('true');
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('alertdialog')).toBeVisible();

    settle(false);
    await expect.poll(() => confirm.getAttribute('aria-busy')).toBeNull();
    expect(screen.getByRole('alertdialog')).toBeVisible();

    await userEvent.click(confirm);
    settle(true);
    await expect.poll(() => screen.queryByRole('alertdialog')).toBeNull();
  });

  it('has no accessibility violations when open, in light and dark, for both tones', async () => {
    for (const theme of ['light', 'dark']) {
      for (const tone of ['danger', 'neutral'] as const) {
        document.documentElement.setAttribute('data-theme', theme);
        const { unmount } = render(<Example tone={tone} />);
        const { dialog } = await open();
        await expect.poll(() => getComputedStyle(dialog).opacity).toBe('1'); // after the fade-in
        await expectNoA11yViolations(document.body);
        unmount();
      }
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
