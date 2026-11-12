import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs, TabsList, TabsPanel, TabsTab } from './Tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { defaultValue: 'overview' },
  render: args => (
    <Tabs {...args}>
      <TabsList aria-label="Agent">
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="sources">Sources</TabsTab>
        <TabsTab value="conversations">Conversations</TabsTab>
        <TabsTab value="billing" disabled>Billing</TabsTab>
      </TabsList>
      <TabsPanel value="overview">Support Copilot answers 1,284 questions a week with a 92% resolution rate.</TabsPanel>
      <TabsPanel value="sources">14 training sources, last synced 2 hours ago.</TabsPanel>
      <TabsPanel value="conversations">312 conversations this week.</TabsPanel>
      <TabsPanel value="billing">Billing</TabsPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Overview' }));
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(canvas.getByRole('tab', { name: 'Sources' })).toHaveAttribute('aria-selected', 'true');
    // by name: the panel being left stays in the page (inert) for a moment while it closes
    await expect(canvas.getByRole('tabpanel', { name: 'Sources' })).toHaveTextContent('14 training sources');
  },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};
