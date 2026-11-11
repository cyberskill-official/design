import { render, screen } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { Gear, House, Moon, Plus } from '@phosphor-icons/react';
import { useState } from 'react';
import { Button } from './Button';
import { CommandGroup, CommandItem, CommandMenu, useCommandMenuShortcut } from './CommandMenu';
import { expectNoA11yViolations } from '../test/a11y';

function WithHook() {
  const [open, setOpen] = useState(false);
  useCommandMenuShortcut(setOpen);
  return <CommandMenu open={open} onOpenChange={setOpen}><CommandItem>Dashboard</CommandItem></CommandMenu>;
}

function Example({ onNewAgent = () => {}, shortcut }: { onNewAgent?: () => void; shortcut?: string | false }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Search</Button>
      <CommandMenu open={open} onOpenChange={setOpen} shortcut={shortcut}>
        <CommandGroup label="Navigation">
          <CommandItem icon={<House />}>Dashboard</CommandItem>
          <CommandItem icon={<Gear />} keywords={['preferences']}>Cài đặt</CommandItem>
        </CommandGroup>
        <CommandGroup label="Actions">
          <CommandItem icon={<Plus />} shortcut="⌘N" onSelect={onNewAgent}>New agent</CommandItem>
          <CommandItem icon={<Moon />} keywords={['theme', 'dark']}>Toggle appearance</CommandItem>
        </CommandGroup>
      </CommandMenu>
    </>
  );
}

const openMenu = async () => {
  const trigger = screen.getByRole('button', { name: 'Search' });
  await userEvent.click(trigger);
  const dialog = await screen.findByRole('dialog', { name: 'Command menu' });
  await expect.poll(() => getComputedStyle(dialog).opacity).toBe('1'); // after the fade-in
  return { trigger, dialog, input: screen.getByRole('combobox', { name: 'Command menu' }) };
};
const visibleOptions = () => screen.queryAllByRole('option').map(o => o.textContent);

describe('CommandMenu', () => {
  it('opens as a labelled dialog with focus in the search box; Escape closes and restores focus', async () => {
    render(<Example />);
    const { trigger, input } = await openMenu();
    await expect.poll(() => document.activeElement).toBe(input);
    expect(screen.getByRole('group', { name: 'Navigation' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('filters by label and keywords, ignoring case and accents, hides empty groups and announces no results', async () => {
    render(<Example />);
    const { input } = await openMenu();
    await userEvent.type(input, 'cai dat');
    await expect.poll(visibleOptions).toEqual(['Cài đặt']);
    expect(screen.queryByRole('group', { name: 'Actions' })).toBeNull(); // hidden from everyone

    await userEvent.clear(input);
    await userEvent.type(input, 'DARK');
    await expect.poll(visibleOptions).toEqual(['Toggle appearance']);

    await userEvent.clear(input);
    await userEvent.type(input, 'zzz');
    await expect.poll(() => screen.getByRole('status')).toHaveTextContent('No results found.');
    expect(visibleOptions()).toEqual([]);
  });

  it('highlights the first match; arrows move it, Enter runs onSelect and closes', async () => {
    const onNewAgent = vi.fn();
    render(<Example onNewAgent={onNewAgent} />);
    const { input } = await openMenu();
    await expect.poll(() => screen.getByRole('option', { name: 'Dashboard' })).toHaveAttribute('data-highlighted');
    await userEvent.type(input, 'agent');
    await expect.poll(() => screen.getByRole('option', { name: /New agent/ })).toHaveAttribute('data-highlighted');
    await userEvent.keyboard('{Enter}');
    expect(onNewAgent).toHaveBeenCalledOnce();
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('runs an item on click', async () => {
    const onNewAgent = vi.fn();
    render(<Example onNewAgent={onNewAgent} />);
    await openMenu();
    await userEvent.click(screen.getByRole('option', { name: /New agent/ }));
    expect(onNewAgent).toHaveBeenCalledOnce();
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('toggles with ⌘K and Ctrl+K', async () => {
    render(<Example />);
    await userEvent.keyboard('{Meta>}k{/Meta}');
    await screen.findByRole('dialog', { name: 'Command menu' });
    await userEvent.keyboard('{Control>}k{/Control}');
    await expect.poll(() => screen.queryByRole('dialog')).toBeNull();
  });

  it('shortcut changes the letter, and false turns it off', async () => {
    const { unmount } = render(<Example shortcut="j" />);
    await userEvent.keyboard('{Meta>}k{/Meta}');
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.keyboard('{Meta>}j{/Meta}');
    await screen.findByRole('dialog', { name: 'Command menu' });
    unmount();

    render(<Example shortcut={false} />);
    await userEvent.keyboard('{Meta>}k{/Meta}');
    await userEvent.keyboard('{Control>}k{/Control}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('toggles once when useCommandMenuShortcut is also used', async () => {
    render(<WithHook />);
    await userEvent.keyboard('{Meta>}k{/Meta}');
    await screen.findByRole('dialog', { name: 'Command menu' });
  });

  it('ignores keydown events without a key (Chrome autofill)', () => {
    const errors: unknown[] = [];
    const onError = (e: ErrorEvent) => errors.push(e.error);
    window.addEventListener('error', onError);
    render(<Example />);
    document.dispatchEvent(new Event('keydown')); // a plain Event: `key` is undefined
    window.removeEventListener('error', onError);
    expect(errors).toEqual([]);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('has no accessibility violations when open, in light and dark', async () => {
    for (const theme of ['light', 'dark']) {
      document.documentElement.setAttribute('data-theme', theme);
      const { unmount } = render(<Example />);
      const { input } = await openMenu();
      await expect.poll(() => screen.getByRole('option', { name: 'Dashboard' })).toHaveAttribute('data-highlighted');
      await expectNoA11yViolations(document.body);
      await userEvent.type(input, 'zzz'); // empty state
      await expect.poll(() => screen.getByRole('status')).toHaveTextContent('No results found.');
      await expectNoA11yViolations(document.body);
      unmount();
    }
    document.documentElement.removeAttribute('data-theme');
  });
});
