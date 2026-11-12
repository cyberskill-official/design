import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Alert } from './Alert';
import { Button } from './Button';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: { tone: 'info', title: 'Scheduled maintenance on Sunday', description: 'The dashboard is read-only from 01:00 to 03:00 (GMT+7). API traffic is not affected.' },
  argTypes: { tone: { control: 'inline-radio', options: ['info', 'success', 'warning', 'danger'] } },
  render: args => <div style={{ maxWidth: 560 }}><Alert {...args} /></div>,
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
      <Alert tone="info" title="New export format" description="CSV exports now include the workspace ID column." />
      <Alert tone="success" title="Domain verified" description="support.acme.vn is live and serving over HTTPS." />
      <Alert tone="warning" title="80% of monthly API calls used" description="Requests are throttled after 1M calls. Upgrade or wait until 1 December." />
      <Alert tone="danger" title="Payment failed" description="The card ending 4242 was declined. Update it to keep your workspace active." />
    </div>
  ),
};

export const TitleOnly: Story = { args: { tone: 'success', title: 'Changes saved', description: undefined } };

export const WithAction: Story = {
  args: {
    tone: 'danger',
    title: 'Payment failed',
    description: 'The card ending 4242 was declined.',
    action: <Button size="sm" variant="secondary">Update card</Button>,
  },
};

export const Dismissible: Story = {
  args: { tone: 'warning', title: '80% of monthly API calls used', onDismiss: fn() },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Dismiss' }));
    await expect(args.onDismiss).toHaveBeenCalledOnce();
  },
};
