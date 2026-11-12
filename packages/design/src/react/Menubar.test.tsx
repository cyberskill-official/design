import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarSubmenu, MenubarSubmenuTrigger, MenubarTrigger } from './Menubar';
import { expectNoA11yViolations } from '../test/a11y';

function Example({ onPdf = () => {} }: { onPdf?: () => void }) {
  return (
    <Menubar aria-label="Editor">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="⌘N">New agent</MenubarItem>
          <MenubarSubmenu>
            <MenubarSubmenuTrigger>Export</MenubarSubmenuTrigger>
            <MenubarContent>
              <MenubarItem onClick={onPdf}>PDF</MenubarItem>
              <MenubarItem>CSV</MenubarItem>
            </MenubarContent>
          </MenubarSubmenu>
          <MenubarSeparator />
          <MenubarItem tone="danger">Delete</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem shortcut="⌘Z">Undo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

describe('Menubar', () => {
  it('renders a labelled menubar; arrows move across menus and into submenus; Escape closes and restores focus', async () => {
    render(<Example />);
    expect(screen.getByRole('menubar', { name: 'Editor' })).toBeVisible();
    const file = screen.getByRole('menuitem', { name: 'File' });
    await userEvent.click(file);
    await screen.findByRole('menu');
    await expect.poll(() => document.activeElement?.closest('[role="menu"]')).toBeTruthy();

    await userEvent.keyboard('{ArrowRight}'); // next menu in the bar
    await expect.poll(() => screen.queryByRole('menuitem', { name: /Undo/ })).not.toBeNull();
    await userEvent.keyboard('{ArrowLeft}');
    await expect.poll(() => screen.queryByRole('menuitem', { name: /New agent/ })).not.toBeNull();

    await userEvent.keyboard('{ArrowDown}{ArrowDown}'); // highlight "Export"
    await expect.poll(() => document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Export' }));
    await userEvent.keyboard('{ArrowRight}');
    await expect.poll(() => document.activeElement).toBe(screen.getByRole('menuitem', { name: 'PDF' }));

    await userEvent.keyboard('{Escape}'); // closes the submenu only
    await expect.poll(() => document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Export' }));
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(file);
  });

  it('runs a submenu item action and closes', async () => {
    const onPdf = vi.fn();
    render(<Example onPdf={onPdf} />);
    await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
    await userEvent.hover(await screen.findByRole('menuitem', { name: 'Export' }));
    await userEvent.click(await screen.findByRole('menuitem', { name: 'PDF' }));
    expect(onPdf).toHaveBeenCalledOnce();
    await expect.poll(() => screen.queryByRole('menu')).toBeNull();
  });

  it('has no accessibility violations with a menu open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<Example />);
      await expectNoA11yViolations(container);
      await userEvent.click(screen.getByRole('menuitem', { name: 'File' }));
      const menu = await screen.findByRole('menu');
      await expect.poll(() => getComputedStyle(menu).opacity).toBe('1');
      await userEvent.keyboard('{End}'); // danger item on --raised
      await expectNoA11yViolations(menu.closest('[data-base-ui-portal]')!);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
