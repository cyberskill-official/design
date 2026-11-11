import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from './Button';
import { Separator } from './Separator';

const meta = {
  title: 'Structure/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
  render: args => (
    <div style={{ maxWidth: 420, display: 'grid', gap: 12 }}>
      <p className="cs-ui" style={{ margin: 0 }}>Workspace</p>
      <Separator {...args} />
      <p className="cs-ui" style={{ margin: 0 }}>Members</p>
    </div>
  ),
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const WithLabel: Story = {
  render: () => (
    <div style={{ maxWidth: 360, display: 'grid', gap: 16 }}>
      <Button variant="secondary" fullWidth>Continue with Google</Button>
      <Separator label="or" />
      <Button fullWidth>Continue with email</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('separator', { name: 'or' })).toBeVisible();
  },
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 24 }} className="cs-ui">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>API reference</span>
      <Separator orientation="vertical" />
      <span>Changelog</span>
    </div>
  ),
};
