import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { label: 'Auto-deploy main', onCheckedChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const control = within(canvasElement).getByRole('switch', { name: 'Auto-deploy main' });
    await userEvent.click(control);
    await expect(control).toHaveAttribute('aria-checked', 'true');
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  },
};
export const WithDescription: Story = { args: { description: 'Every push to main deploys to production.' } };
export const On: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Settings: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 20, maxWidth: 420 }}>
      <Switch label="Two-factor authentication" description="Ask for a code from your authenticator app at sign-in." defaultChecked />
      <Switch label="Session timeout" description="Sign out after 30 minutes without activity." />
      <Switch label="Single sign-on" description="Available on the Business plan." disabled />
    </div>
  ),
};
