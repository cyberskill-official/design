import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { ArrowsDownUp, Copy, Gear, PencilSimple, Trash } from '@phosphor-icons/react';
import type { ComponentProps } from 'react';
import { Button } from './Button';
import {
  Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuLinkItem, MenuRadioGroup, MenuRadioItem, MenuSeparator, MenuSubmenu, MenuSubmenuTrigger, MenuTrigger,
} from './Menu';
import { expectNoA11yViolations } from '../test/a11y';

function Example({ onDuplicate = () => {} }: { onDuplicate?: () => void }) {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="secondary" />}>Actions</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuGroupLabel>Agent</MenuGroupLabel>
          <MenuItem icon={<PencilSimple />}>Rename</MenuItem>
          <MenuItem icon={<Copy />} shortcut="⌘D" onClick={onDuplicate}>Duplicate</MenuItem>
          <MenuItem disabled>Archive</MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuCheckboxItem defaultChecked>Show in sidebar</MenuCheckboxItem>
        <MenuSeparator />
        <MenuItem icon={<Trash />} tone="danger">Delete</MenuItem>
      </MenuContent>
    </Menu>
  );
}

/** Stands in for a router link (Next.js `Link`): renders an anchor and reports the navigation. */
function RouterLink({ onNavigate, ...props }: ComponentProps<'a'> & { onNavigate: (href: string) => void }) {
  return <a {...props} onClick={e => { e.preventDefault(); props.onClick?.(e); onNavigate(props.href ?? ''); }} />;
}

function Nested({ onNavigate = () => {}, onSortChange = () => {} }: { onNavigate?: (href: string) => void; onSortChange?: (v: string) => void }) {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="secondary" />}>More</MenuTrigger>
      <MenuContent>
        <MenuSubmenu>
          <MenuSubmenuTrigger icon={<ArrowsDownUp />}>Sort by</MenuSubmenuTrigger>
          <MenuContent>
            <MenuRadioGroup defaultValue="name" onValueChange={onSortChange}>
              <MenuRadioItem value="name">Name</MenuRadioItem>
              <MenuRadioItem value="date">Date modified</MenuRadioItem>
            </MenuRadioGroup>
          </MenuContent>
        </MenuSubmenu>
        <MenuSeparator />
        <MenuLinkItem icon={<Gear />} render={<RouterLink href="/settings" onNavigate={onNavigate} />}>Settings</MenuLinkItem>
        <MenuLinkItem href="#help">Help</MenuLinkItem>
      </MenuContent>
    </Menu>
  );
}

const openNested = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'More' }));
  const menu = await screen.findByRole('menu');
  await expect.poll(() => getComputedStyle(menu).opacity).toBe('1');
  return menu;
};

describe('Menu', () => {
  it('opens from the keyboard, arrows move between items, Escape closes and restores focus', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    const menu = await screen.findByRole('menu');
    await expect.poll(() => document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Rename' }));
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: /Duplicate/ }));
    expect(menu).toContainElement(document.activeElement as HTMLElement);
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('runs an item action and closes', async () => {
    const onDuplicate = vi.fn();
    render(<Example onDuplicate={onDuplicate} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: /Duplicate/ }));
    expect(onDuplicate).toHaveBeenCalledOnce();
    await expect.poll(() => screen.queryByRole('menu')).toBeNull();
  });

  it('labels groups, disables items and toggles checkbox items', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(await screen.findByRole('group', { name: 'Agent' })).toBeVisible();
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveAttribute('aria-disabled', 'true');
    const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Show in sidebar' });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('opens a submenu to the side with ArrowRight; ArrowLeft returns to its trigger', async () => {
    render(<Nested />);
    await openNested();
    const trigger = screen.getByRole('menuitem', { name: 'Sort by' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    trigger.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect.poll(() => screen.queryAllByRole('menu').length).toBe(2);
    const submenu = screen.getAllByRole('menu')[1]!;
    await expect.poll(() => document.activeElement).toBe(screen.getByRole('menuitemradio', { name: 'Name' }));
    expect(submenu.getBoundingClientRect().left).toBeGreaterThanOrEqual(trigger.getBoundingClientRect().right - 8);
    await userEvent.keyboard('{ArrowLeft}');
    await expect.poll(() => screen.queryAllByRole('menu').length).toBe(1);
    expect(document.activeElement).toBe(trigger);
  });

  it('radio items pick one value and mark it with a check', async () => {
    const onSortChange = vi.fn();
    render(<Nested onSortChange={onSortChange} />);
    await openNested();
    await userEvent.hover(screen.getByRole('menuitem', { name: 'Sort by' }));
    const date = await screen.findByRole('menuitemradio', { name: 'Date modified' });
    expect(screen.getByRole('menuitemradio', { name: 'Name' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(date);
    expect(date).toHaveAttribute('aria-checked', 'true');
    expect(date.querySelector('.cs-menu-item-check svg')).not.toBeNull();
    expect(screen.getByRole('menuitemradio', { name: 'Name' })).toHaveAttribute('aria-checked', 'false');
    expect(onSortChange).toHaveBeenCalledWith('date', expect.anything());
  });

  it('link items are anchors, work with a router link and close the menu', async () => {
    const onNavigate = vi.fn();
    render(<Nested onNavigate={onNavigate} />);
    await openNested();
    expect(screen.getByRole('menuitem', { name: 'Help' })).toHaveAttribute('href', '#help');
    const settings = screen.getByRole('menuitem', { name: 'Settings' });
    expect(settings.tagName).toBe('A');
    await userEvent.click(settings);
    expect(onNavigate).toHaveBeenCalledWith('/settings');
    await expect.poll(() => screen.queryByRole('menu')).toBeNull();
  });

  it('has no accessibility violations with a submenu open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<Nested />);
      await openNested();
      screen.getByRole('menuitem', { name: 'Sort by' }).focus();
      await userEvent.keyboard('{ArrowRight}');
      await expect.poll(() => screen.queryAllByRole('menu').length).toBe(2);
      const [menu, submenu] = screen.getAllByRole('menu');
      await expect.poll(() => getComputedStyle(submenu!).opacity).toBe('1');
      await expectNoA11yViolations(container);
      await expectNoA11yViolations(menu!.closest('[data-base-ui-portal]')!);
      await expectNoA11yViolations(submenu!.closest('[data-base-ui-portal]')!);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<Example />);
      screen.getByRole('button', { name: 'Actions' }).focus();
      await userEvent.keyboard('{ArrowDown}');
      const menu = await screen.findByRole('menu');
      await expect.poll(() => getComputedStyle(menu).opacity).toBe('1'); // after the fade-in
      await userEvent.keyboard('{End}'); // highlight the danger item so its contrast is checked on --raised
      // Component-scoped like expectAccessibleInThemes: the portalled popup is checked on its own,
      // since axe's page-level `region` rule does not apply to a transient popup.
      await expectNoA11yViolations(container);
      await expectNoA11yViolations(menu.closest('[data-base-ui-portal]')!);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
