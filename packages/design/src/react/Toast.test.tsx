import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { ToastProvider, useToast, type ToastOptions } from './Toast';
import { expectNoA11yViolations } from '../test/a11y';

function Trigger(options: ToastOptions) {
  const { toast } = useToast();
  return <Button onClick={() => toast(options)}>Show toast</Button>;
}

function Example({ closeLabel, ...options }: ToastOptions & { closeLabel?: string }) {
  return (
    <ToastProvider closeLabel={closeLabel}>
      <Trigger {...options} />
    </ToastProvider>
  );
}

describe('Toast', () => {
  it('shows a labelled toast with the tone icon in a named region', async () => {
    render(<Example title="Changes saved" description="Your profile is up to date." tone="success" />);
    await userEvent.click(screen.getByRole('button', { name: 'Show toast' }));
    const toast = await screen.findByRole('dialog', { name: 'Changes saved' });
    expect(toast).toHaveAccessibleDescription('Your profile is up to date.');
    expect(toast).toHaveAttribute('data-tone', 'success');
    expect(toast.querySelector('svg')).not.toBeNull();
    expect(screen.getByRole('region', { name: 'Notifications' }).contains(toast)).toBe(true);
  });

  it('close button is named by closeLabel and closes the toast', async () => {
    render(<Example title="Changes saved" closeLabel="Đóng" />);
    await userEvent.click(screen.getByRole('button', { name: 'Show toast' }));
    // Base UI keeps Close out of the announcement until the stack is expanded (hover, or focus via F6/Tab).
    const close = await screen.findByLabelText('Đóng');
    expect(close).toHaveAttribute('aria-hidden', 'true');
    await userEvent.keyboard('{F6}');
    await expect.poll(() => close.getAttribute('aria-hidden')).toBe('false');
    await userEvent.click(close);
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('action runs its callback and closes the toast', async () => {
    const onUndo = vi.fn();
    render(<Example title="Project archived" action={{ label: 'Undo', onClick: onUndo }} />);
    await userEvent.click(screen.getByRole('button', { name: 'Show toast' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledOnce();
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on its own after the timeout', async () => {
    render(<Example title="Copied" timeout={200} />);
    await userEvent.click(screen.getByRole('button', { name: 'Show toast' }));
    await screen.findByRole('dialog', { name: 'Copied' });
    await expect.poll(() => screen.queryByRole('dialog'), { timeout: 3000 }).toBeNull();
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { unmount } = render(<Example title="Payment failed" description="The card was declined." tone="danger" action={{ label: 'Retry', onClick: () => {} }} timeout={0} />);
      await userEvent.click(screen.getByRole('button', { name: 'Show toast' }));
      // Audit the expanded stack, the state anyone acting on a toast is in (hover, or focus inside via F6/Tab).
      // Collapsed, Base UI sets aria-hidden on the focusable Close button and lifts it as soon as the stack expands.
      await userEvent.hover(await screen.findByRole('dialog'));
      await screen.findByRole('button', { name: 'Close' });
      await expectNoA11yViolations(document.body);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
