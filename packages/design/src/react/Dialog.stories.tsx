import type { Meta, StoryObj } from '@storybook/react-vite';
import { Trash } from '@phosphor-icons/react';
import { expect, userEvent, within, screen, waitFor } from 'storybook/test';
import { Button } from './Button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from './Dialog';
import { TextField } from './Field';

const meta = {
  title: 'Overlays/Dialog',
  component: DialogContent,
  tags: ['autodocs'],
  args: { title: 'Delete Support Copilot?', description: 'This removes the agent, its 14 training sources and all conversation history. This cannot be undone.' },
  render: args => (
    <Dialog>
      <DialogTrigger render={<Button variant="secondary" />}>Delete project</DialogTrigger>
      <DialogContent {...args} size="sm" icon={<Trash />} tone="danger">
        <TextField label="Type DELETE to confirm" autoComplete="off" />
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>Cancel</DialogClose>
          <Button variant="danger">Delete agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Delete project' }));
    const dialog = await screen.findByRole('dialog', { name: 'Delete Support Copilot?' });
    await waitFor(() => expect(dialog).toBeVisible()); // after the fade-in transition
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  },
};

export const Form: Story = {
  args: { title: 'Invite people', description: 'They get an email with a link to join this workspace.' },
  render: args => (
    <Dialog>
      <DialogTrigger render={<Button />}>Invite people</DialogTrigger>
      <DialogContent {...args}>
        <TextField label="Work email" type="email" placeholder="name@company.vn" />
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>Cancel</DialogClose>
          <Button>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
