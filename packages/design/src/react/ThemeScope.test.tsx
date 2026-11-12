import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { Button } from './Button';
import { Menu, MenuContent, MenuItem, MenuTrigger } from './Menu';
import { Dialog, DialogContent, DialogTrigger } from './Dialog';
import { ThemeScope } from './ThemeScope';

function Example() {
  return (
    <ThemeScope theme="dark">
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem>Rename</MenuItem>
        </MenuContent>
      </Menu>
      <Dialog>
        <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
        <DialogContent title="Dark dialog" />
      </Dialog>
    </ThemeScope>
  );
}

describe('ThemeScope', () => {
  it('popups opened inside a dark scope render dark on a light page', async () => {
    document.documentElement.setAttribute('data-theme', 'light');
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    const item = await screen.findByRole('menuitem', { name: 'Rename' });
    expect(item.closest('[data-theme]')?.getAttribute('data-theme')).toBe('dark');
    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    const dialog = await screen.findByRole('dialog', { name: 'Dark dialog' });
    expect(dialog.closest('[data-theme]')?.getAttribute('data-theme')).toBe('dark');
    // the dark panel color really applies
    expect(getComputedStyle(dialog).backgroundColor).toBe('rgb(17, 26, 41)');
    document.documentElement.removeAttribute('data-theme');
  });

  it('a popup open on first render lands in the scope host, never in body', async () => {
    const strays: Element[] = [];
    const watch = new MutationObserver(records => {
      for (const r of records) for (const n of r.addedNodes) if (n instanceof Element && n.querySelector('[role="dialog"]') && !n.closest('.cs-portal-host')) strays.push(n);
    });
    watch.observe(document.body, { childList: true, subtree: true });
    render(
      <ThemeScope theme="dark">
        <Dialog defaultOpen>
          <DialogContent title="Open at once" />
        </Dialog>
      </ThemeScope>,
    );
    const dialog = await screen.findByRole('dialog', { name: 'Open at once' });
    watch.disconnect();
    expect(dialog.closest('.cs-portal-host')).not.toBeNull();
    expect(strays).toHaveLength(0);
  });

  it('without a scope, popups keep rendering into document.body', async () => {
    render(
      <Menu>
        <MenuTrigger render={<Button variant="secondary" />}>Actions</MenuTrigger>
        <MenuContent>
          <MenuItem>Rename</MenuItem>
        </MenuContent>
      </Menu>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    const item = await screen.findByRole('menuitem', { name: 'Rename' });
    expect(item.closest('.cs-portal-host')).toBeNull();
  });
});
