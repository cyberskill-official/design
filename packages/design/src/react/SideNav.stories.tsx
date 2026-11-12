import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartBar, ChatCircle, Database, Gear, House, Robot } from '@phosphor-icons/react';
import { expect, within } from 'storybook/test';
import { SideNav, SideNavGroup, SideNavItem } from './SideNav';

const meta = {
  title: 'Navigation/SideNav',
  component: SideNav,
  tags: ['autodocs'],
  args: { label: 'Main' },
  decorators: [Story => <div style={{ width: 240 }}><Story /></div>],
  render: args => (
    <SideNav {...args}>
      <SideNavItem href="#" icon={<House />}>Overview</SideNavItem>
      <SideNavGroup label="Build">
        <SideNavItem href="#" icon={<Robot />} active>Agents</SideNavItem>
        <SideNavItem href="#" icon={<Database />}>Training sources</SideNavItem>
        <SideNavItem href="#" icon={<ChatCircle />} badge={12}>Conversations</SideNavItem>
      </SideNavGroup>
      <SideNavGroup label="Workspace">
        <SideNavItem href="#" icon={<ChartBar />}>Usage</SideNavItem>
        <SideNavItem href="#" icon={<Gear />}>Settings</SideNavItem>
      </SideNavGroup>
    </SideNav>
  ),
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Main' });
    await expect(within(nav).getByRole('link', { name: 'Agents' })).toHaveAttribute('aria-current', 'page');
  },
};

export const Vietnamese: Story = {
  args: { label: 'Chính' },
  render: args => (
    <SideNav {...args}>
      <SideNavItem href="#" icon={<House />} active>Tổng quan</SideNavItem>
      <SideNavGroup label="Xây dựng">
        <SideNavItem href="#" icon={<Robot />}>Trợ lý</SideNavItem>
        <SideNavItem href="#" icon={<ChatCircle />} badge={3}>Hội thoại</SideNavItem>
      </SideNavGroup>
    </SideNav>
  ),
};
