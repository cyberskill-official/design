import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { CaretUpDown, ChartLineUp, Gear, House, Robot } from '@phosphor-icons/react';
import { ThemeScope } from './ThemeScope';
import { Button } from './Button';
import { Menu, MenuContent, MenuItem, MenuTrigger } from './Menu';
import { SideNav, SideNavItem } from './SideNav';

const meta = {
  title: 'Structure/ThemeScope',
  component: ThemeScope,
  tags: ['autodocs'],
  args: { theme: 'dark', children: null },
  render: args => (
    <div style={{ display: 'flex', flexWrap: 'wrap', minHeight: 280, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <ThemeScope {...args} style={{ flex: '1 0 200px', display: 'grid', alignContent: 'start', gap: 12, padding: 12, background: 'var(--background)', color: 'var(--foreground)' }}>
        <Menu>
          <MenuTrigger render={<Button variant="ghost" fullWidth iconEnd={<CaretUpDown />} style={{ justifyContent: 'space-between' }} />}>Northwind</MenuTrigger>
          <MenuContent>
            <MenuItem>Northwind</MenuItem>
            <MenuItem>Contoso Support</MenuItem>
          </MenuContent>
        </Menu>
        <SideNav label="Main">
          <SideNavItem href="#overview" icon={<House />} active>Overview</SideNavItem>
          <SideNavItem href="#agents" icon={<Robot />}>Agents</SideNavItem>
          <SideNavItem href="#analytics" icon={<ChartLineUp />}>Analytics</SideNavItem>
          <SideNavItem href="#settings" icon={<Gear />}>Settings</SideNavItem>
        </SideNav>
      </ThemeScope>
      <div style={{ flex: '3 1 240px', padding: 24 }}>The page keeps its own theme; the sidebar and its menu take the scope's.</div>
    </div>
  ),
} satisfies Meta<typeof ThemeScope>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A dark sidebar in a light page. The menu opens from inside the scope, so it is dark too. */
export const DarkSidebar: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Northwind' }));
    await waitFor(() => expect(document.querySelector('.cs-portal-host[data-theme="dark"] [role="menu"]')).toBeTruthy());
  },
};

/** The reverse: a light panel inside a dark page. */
export const LightPanel: Story = { args: { theme: 'light' } };
