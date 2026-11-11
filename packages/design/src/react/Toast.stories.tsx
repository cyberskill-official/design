import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, within } from 'storybook/test';
import { Button } from './Button';
import { ToastProvider, useToast } from './Toast';

function ToneButtons() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Button variant="secondary" onClick={() => toast({ title: 'Export started', description: 'We will email you when the CSV is ready.' })}>Info</Button>
      <Button variant="secondary" onClick={() => toast({ tone: 'success', title: 'Changes saved' })}>Success</Button>
      <Button variant="secondary" onClick={() => toast({ tone: 'warning', title: '80% of API calls used', description: 'Requests are throttled after 1M calls.' })}>Warning</Button>
      <Button variant="secondary" onClick={() => toast({ tone: 'danger', title: 'Payment failed', description: 'The card ending 4242 was declined.', timeout: 0 })}>Danger</Button>
    </div>
  );
}

function UndoButton() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ tone: 'success', title: 'Project archived', description: 'Support Copilot moved to Archive.', action: { label: 'Undo', onClick: () => toast({ title: 'Project restored' }) } })}>
      Archive project
    </Button>
  );
}

const meta = {
  title: 'Feedback/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  args: { closeLabel: 'Close' },
  render: args => (
    <ToastProvider {...args}>
      <ToneButtons />
    </ToastProvider>
  ),
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Success' }));
    await expect(await screen.findByRole('dialog', { name: 'Changes saved' })).toBeInTheDocument();
  },
};

export const WithAction: Story = {
  render: args => (
    <ToastProvider {...args}>
      <UndoButton />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Archive project' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Undo' }));
    await expect(await screen.findByRole('dialog', { name: 'Project restored' })).toBeInTheDocument();
  },
};
