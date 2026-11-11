import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Copy, PencilSimple, Trash } from '@phosphor-icons/react';
import { Button } from './Button';
import { Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuGroupLabel, MenuItem, MenuSeparator, MenuTrigger } from './Menu';
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
