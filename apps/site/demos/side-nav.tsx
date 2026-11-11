'use client';
import { ChartBar, ChatCircle, Database, Gear, House, Robot } from '@phosphor-icons/react';
import { SideNav, SideNavGroup, SideNavItem } from '@cyberskill/design';
import { useState } from 'react';

const pages = [
  { group: null, items: [{ name: 'Overview', icon: <House /> }] },
  { group: 'Build', items: [{ name: 'Agents', icon: <Robot /> }, { name: 'Training sources', icon: <Database /> }, { name: 'Conversations', icon: <ChatCircle />, badge: 12 }] },
  { group: 'Workspace', items: [{ name: 'Usage', icon: <ChartBar /> }, { name: 'Settings', icon: <Gear /> }] },
];

export function SideNavDemo() {
  const [current, setCurrent] = useState('Agents');
  const item = (p: { name: string; icon: React.ReactNode; badge?: number }) => (
    <SideNavItem key={p.name} href="#" icon={p.icon} badge={p.badge} active={current === p.name} onClick={(e) => { e.preventDefault(); setCurrent(p.name); }}>
      {p.name}
    </SideNavItem>
  );
  return (
    <div style={{ width: 240 }}>
      <SideNav label="Main">
        {pages.map((s) => (s.group ? <SideNavGroup key={s.group} label={s.group}>{s.items.map(item)}</SideNavGroup> : s.items.map(item)))}
      </SideNav>
    </div>
  );
}
