'use client';
import { CaretUpDown, ChartLineUp, Check, Gear, House, Plus, Robot } from '@phosphor-icons/react';
import {
  Button,
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  SideNav,
  SideNavItem,
  ThemeScope,
} from '@cyberskill/design';

/** A dark sidebar inside a light page. The workspace menu opens from inside the scope, so it is dark too. */
export function ThemeScopeSidebar() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', minHeight: 300, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <ThemeScope theme="dark" style={{ flex: '1 0 220px', display: 'grid', alignContent: 'start', gap: 12, padding: 12 }}>
        <Menu>
          <MenuTrigger render={<Button variant="ghost" fullWidth iconEnd={<CaretUpDown />} style={{ justifyContent: 'space-between' }} />}>
            Northwind
          </MenuTrigger>
          <MenuContent>
            <MenuGroup>
              <MenuGroupLabel>Workspaces</MenuGroupLabel>
              <MenuItem icon={<Check />}>Northwind</MenuItem>
              <MenuItem>Contoso Support</MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuItem icon={<Plus />}>New workspace</MenuItem>
          </MenuContent>
        </Menu>
        <SideNav label="Main">
          <SideNavItem href="#overview" icon={<House />} active>Overview</SideNavItem>
          <SideNavItem href="#agents" icon={<Robot />}>Agents</SideNavItem>
          <SideNavItem href="#analytics" icon={<ChartLineUp />}>Analytics</SideNavItem>
          <SideNavItem href="#settings" icon={<Gear />}>Settings</SideNavItem>
        </SideNav>
      </ThemeScope>
      <div style={{ flex: '999 1 240px', minWidth: 0, padding: 20, display: 'grid', alignContent: 'start', gap: 8 }}>
        <h3 className="cs-h4" style={{ margin: 0 }}>Overview</h3>
        <p className="cs-caption" style={{ margin: 0 }}>The page keeps the theme of its surroundings; only the sidebar is dark.</p>
      </div>
    </div>
  );
}
