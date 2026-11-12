import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trash } from '@phosphor-icons/react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from './AlertDialog';

const meta = {
  title: 'Overlays/AlertDialog',
  component: AlertDialogContent,
  tags: ['autodocs'],
  args: {
    title: 'Delete Support Copilot?',
    description: 'This removes the agent, its 14 training sources and all conversation history. This cannot be undone.',
    confirmLabel: 'Delete agent',
    onConfirm: fn(),
  },
  render: args => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="secondary" iconStart={<Trash />} />}>Delete project</AlertDialogTrigger>
      <AlertDialogContent {...args} />
    </AlertDialog>
  ),
} satisfies Meta<typeof AlertDialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Destructive: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Delete project' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Delete Support Copilot?' });
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1')); // after the fade-in
    await expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete agent' }));
    await expect(args.onConfirm).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  },
};

/** `onConfirm` returns a promise: the button shows a spinner and the dialog waits for it before closing. */
export const AsyncConfirm: Story = {
  args: { onConfirm: fn(() => new Promise<void>(resolve => setTimeout(resolve, 1500))) },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Delete project' }));
    const dialog = await screen.findByRole('alertdialog');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Delete agent' }));
    await expect(within(dialog).getByRole('button', { name: 'Delete agent' })).toHaveAttribute('aria-busy', 'true');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull(), { timeout: 3000 });
  },
};

/** A non-destructive decision: no warning icon, primary confirm button. */
export const Neutral: Story = {
  args: {
    tone: 'neutral',
    title: 'Publish to production?',
    description: 'Customers start talking to version 12 of Support Copilot right away.',
    confirmLabel: 'Publish',
  },
  render: args => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button />}>Publish</AlertDialogTrigger>
      <AlertDialogContent {...args} />
    </AlertDialog>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Publish' }));
    const dialog = await screen.findByRole('alertdialog', { name: 'Publish to production?' });
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  },
};
