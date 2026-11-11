import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Copy, PencilSimple, Trash } from '@phosphor-icons/react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from './ContextMenu';
import { expectNoA11yViolations } from '../test/a11y';

function Example({ onRename = () => {} }: { onRename?: () => void }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger tabIndex={0} style={{ width: 240, height: 120 }}>Support Copilot</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem icon={<PencilSimple />} shortcut="⌘R" onClick={onRename}>Rename</ContextMenuItem>
        <ContextMenuItem icon={<Copy />} shortcut="⌘D">Duplicate</ContextMenuItem>
        <ContextMenuItem disabled>Archive</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem icon={<Trash />} tone="danger">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const openMenu = async () => {
  await userEvent.click(screen.getByText('Support Copilot'), { button: 'right' });
  const menu = await screen.findByRole('menu');
  await expect.poll(() => getComputedStyle(menu).opacity).toBe('1'); // after the fade-in
  return menu;
};

describe('ContextMenu', () => {
  it('opens on right click, arrows move between items, Escape closes and restores focus', async () => {
    render(<Example />);
    const menu = await openMenu();
    expect(menu.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: /Rename/ }));
    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: /Duplicate/ }));
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(screen.getByText('Support Copilot')); // the focusable area that was right-clicked
  });

  it('runs an item action and closes; disabled items are announced as disabled', async () => {
    const onRename = vi.fn();
    render(<Example onRename={onRename} />);
    await openMenu();
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(screen.getByRole('menuitem', { name: /Rename/ }));
    expect(onRename).toHaveBeenCalledOnce();
    await expect.poll(() => screen.queryByRole('menu')).toBeNull();
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { container, unmount } = render(<Example />);
      const menu = await openMenu();
      await userEvent.keyboard('{End}'); // highlight the danger item so its contrast is checked on --raised
      await expectNoA11yViolations(container);
      await expectNoA11yViolations(menu.closest('[data-base-ui-portal]')!);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
