'use client';
import { ChartBar, Gear, House, MagnifyingGlass, Moon, Plus, Robot, UserPlus } from '@phosphor-icons/react';
import { Button, CommandGroup, CommandItem, CommandMenu } from '@cyberskill/design';
import { useState } from 'react';

export function CommandMenuDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);
  return (
    <>
      <Button variant="secondary" iconStart={<MagnifyingGlass />} onClick={() => setOpen(true)}>
        Search… <kbd className="cs-command-menu-kbd" style={{ marginInlineStart: 8 }}>⌘J</kbd>
      </Button>
      {last && <span className="cs-caption" role="status">Ran: {last}</span>}
      {/* ⌘K is this site's search, so the example uses ⌘J; apps usually keep the default 'k' */}
      <CommandMenu open={open} onOpenChange={setOpen} shortcut="j">
        <CommandGroup label="Go to">
          <CommandItem icon={<House />} onSelect={() => setLast('Dashboard')}>Dashboard</CommandItem>
          <CommandItem icon={<Robot />} keywords={['bots', 'trợ lý']} onSelect={() => setLast('Agents')}>Agents</CommandItem>
          <CommandItem icon={<ChartBar />} keywords={['reports', 'báo cáo']} onSelect={() => setLast('Analytics')}>Analytics</CommandItem>
          <CommandItem icon={<Gear />} keywords={['settings', 'preferences']} onSelect={() => setLast('Cài đặt')}>Cài đặt</CommandItem>
        </CommandGroup>
        <CommandGroup label="Actions">
          <CommandItem icon={<Plus />} shortcut="⌘N" onSelect={() => setLast('New agent')}>New agent</CommandItem>
          <CommandItem icon={<UserPlus />} onSelect={() => setLast('Invite teammate')}>Invite teammate</CommandItem>
          <CommandItem icon={<Moon />} keywords={['theme', 'dark', 'light']} onSelect={() => setLast('Toggle appearance')}>Toggle appearance</CommandItem>
        </CommandGroup>
      </CommandMenu>
    </>
  );
}
