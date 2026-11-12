import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChartBar, Gear, House, MagnifyingGlass, Moon, Plus, Robot, UserPlus } from '@phosphor-icons/react';
import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button } from './Button';
import { CommandGroup, CommandItem, CommandMenu } from './CommandMenu';

const onNewAgent = fn();

const meta = {
  title: 'Overlays/CommandMenu',
  component: CommandMenu,
  tags: ['autodocs'],
  args: { open: false, onOpenChange: fn(), children: null },
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="secondary" iconStart={<MagnifyingGlass />} onClick={() => setOpen(true)}>
          Search <kbd className="cs-command-menu-kbd" style={{ marginInlineStart: 8 }}>⌘K</kbd>
        </Button>
        <CommandMenu {...args} open={open} onOpenChange={setOpen}>
          <CommandGroup label="Go to">
            <CommandItem icon={<House />} shortcut="G H">Dashboard</CommandItem>
            <CommandItem icon={<Robot />} keywords={['bots', 'trợ lý']}>Agents</CommandItem>
            <CommandItem icon={<ChartBar />} keywords={['reports', 'báo cáo']}>Analytics</CommandItem>
            <CommandItem icon={<Gear />} keywords={['settings', 'preferences']}>Cài đặt</CommandItem>
          </CommandGroup>
          <CommandGroup label="Actions">
            <CommandItem icon={<Plus />} shortcut="⌘N" onSelect={onNewAgent}>New agent</CommandItem>
            <CommandItem icon={<UserPlus />}>Invite teammate</CommandItem>
            <CommandItem icon={<Moon />} keywords={['theme', 'dark', 'light']}>Toggle appearance</CommandItem>
          </CommandGroup>
        </CommandMenu>
      </>
    );
  },
} satisfies Meta<typeof CommandMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /Search/ }));
    const dialog = await screen.findByRole('dialog', { name: 'Command menu' });
    await waitFor(() => expect(getComputedStyle(dialog).opacity).toBe('1'));
    await userEvent.type(screen.getByRole('combobox'), 'new');
    await waitFor(() => expect(screen.getByRole('option', { name: /New agent/ })).toHaveAttribute('data-highlighted'));
    await userEvent.keyboard('{Enter}');
    await expect(onNewAgent).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};

/** Matching ignores accents and case, and searches `keywords`: "cai dat" and "settings" both find "Cài đặt". */
export const NoResults: Story = {
  args: { emptyLabel: 'Không tìm thấy kết quả.' },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /Search/ }));
    await userEvent.type(await screen.findByRole('combobox'), 'zzz');
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Không tìm thấy kết quả.'));
  },
};

/** `shortcut` picks another letter (⌘J / Ctrl+J here) when the page already uses ⌘K; `false` turns it off. */
export const CustomShortcut: Story = {
  args: { shortcut: 'j' },
  play: async () => {
    await userEvent.keyboard('{Meta>}j{/Meta}');
    await screen.findByRole('dialog', { name: 'Command menu' });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  },
};
