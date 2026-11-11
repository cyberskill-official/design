'use client';
import {
  Bell,
  ChartLineUp,
  ChatCircle,
  CreditCard,
  Database,
  Gear,
  House,
  List,
  Robot,
  SignOut,
  UserCircle,
  Users,
} from '@phosphor-icons/react';
import {
  Alert,
  Autocomplete,
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  SideNav,
  SideNavGroup,
  SideNavItem,
  Stat,
} from '@cyberskill/design';
import { LineChart, Sparkline } from '@cyberskill/design/charts';
import { useState } from 'react';

const search = [
  { label: 'Pages', items: [
    { value: 'analytics', label: 'Analytics', description: 'Workspace › Analytics' },
    { value: 'billing', label: 'Billing', description: 'Settings › Billing' },
    { value: 'sources', label: 'Training sources', description: 'Build › Sources' },
  ] },
  { label: 'Agents', items: ['Support Copilot', 'Sales Assistant', 'Onboarding Guide'] },
];

const weeks = ['W36', 'W37', 'W38', 'W39', 'W40', 'W41', 'W42', 'W43', 'W44', 'W45', 'W46', 'W47'];
const conversations = weeks.map((week, i) => ({
  week,
  resolved: 1840 + i * 132 + (i % 3) * 90,
  handedOff: 620 - i * 18 + (i % 2) * 40,
}));
const spark = (base: number, step: number) => weeks.map((week, i) => ({ week, v: base + i * step + ((i * 7) % 5) * step * 0.6 }));

const activity = [
  { who: 'Linh Tran', what: 'published Support Copilot v12', when: '12 min ago' },
  { who: 'Minh Nguyen', what: 'added 18 help-center articles to Training sources', when: '1 h ago' },
  { who: 'An Pham', what: 'took over a conversation flagged as urgent', when: '3 h ago' },
  { who: 'Bao Le', what: 'invited 2 teammates to the workspace', when: 'Yesterday' },
];

function Nav() {
  return (
    <SideNav label="Main">
      <SideNavItem href="#overview" icon={<House />} active>Overview</SideNavItem>
      <SideNavItem href="#analytics" icon={<ChartLineUp />}>Analytics</SideNavItem>
      <SideNavGroup label="Build">
        <SideNavItem href="#agents" icon={<Robot />}>Agents</SideNavItem>
        <SideNavItem href="#sources" icon={<Database />}>Training sources</SideNavItem>
        <SideNavItem href="#conversations" icon={<ChatCircle />} badge={12}>Conversations</SideNavItem>
      </SideNavGroup>
      <SideNavGroup label="Workspace">
        <SideNavItem href="#team" icon={<Users />}>Team</SideNavItem>
        <SideNavItem href="#billing" icon={<CreditCard />}>Billing</SideNavItem>
        <SideNavItem href="#settings" icon={<Gear />}>Settings</SideNavItem>
      </SideNavGroup>
    </SideNav>
  );
}

export function DashboardPattern() {
  const [query, setQuery] = useState('');
  const [showQuota, setShowQuota] = useState(true);
  return (
    <div className="pt-app">
      <div className="pt-shell">
        <aside className="pt-shell-nav">
          <div className="pt-shell-brand">Northwind</div>
          <Nav />
        </aside>

        <div style={{ minWidth: 0 }}>
          <header className="pt-topbar">
            {/* Below 880px the side nav moves into a drawer */}
            <Drawer side="left">
              <DrawerTrigger render={<IconButton label="Open navigation" icon={<List />} variant="ghost" className="pt-only-narrow" />} />
              <DrawerContent title="Northwind" size="sm">
                <Nav />
              </DrawerContent>
            </Drawer>
            <Breadcrumbs className="pt-topbar-crumbs" items={[{ label: 'Workspace', href: '#workspace' }, { label: 'Overview' }]} />
            <div className="pt-topbar-search">
              <Autocomplete aria-label="Search the workspace" items={search} placeholder="Search pages and agents" value={query} onValueChange={setQuery} size="sm" />
            </div>
            <IconButton label="Notifications, 3 unread" icon={<Bell />} variant="ghost" size="sm" />
            <Menu>
              <MenuTrigger render={<IconButton label="Account menu for Linh Tran" icon={<Avatar name="Linh Tran" size="sm" aria-hidden />} variant="ghost" size="sm" />} />
              <MenuContent align="end">
                <MenuItem icon={<UserCircle />}>Profile</MenuItem>
                <MenuItem icon={<Gear />}>Workspace settings</MenuItem>
                <MenuSeparator />
                <MenuItem icon={<SignOut />}>Sign out</MenuItem>
              </MenuContent>
            </Menu>
          </header>

          <main className="pt-main">
            <div className="pt-row">
              <div className="pt-stack" style={{ gap: 4 }}>
                <h2 className="pt-title">Overview</h2>
                <p className="pt-subtitle">Last 12 weeks, all agents</p>
              </div>
              <span className="pt-spacer" />
              <Button variant="secondary" size="sm">Export report</Button>
            </div>

            {showQuota && (
              <Alert
                tone="warning"
                role="note"
                title="86% of this month's messages used"
                description="Agents pause new conversations at 100%. The quota resets on 1 December."
                action={<Button size="sm" variant="secondary">Upgrade plan</Button>}
                onDismiss={() => setShowQuota(false)}
              />
            )}

            <section className="pt-kpis" aria-label="Key metrics">
              <Stat label="Conversations" value="24,318" delta={{ value: '+12.4%', trend: 'up' }} hint="vs. previous 12 weeks">
                <Sparkline data={spark(1900, 120)} dataKey="v" label="Conversations per week, rising" />
              </Stat>
              <Stat label="Resolved by AI" value="78.2%" delta={{ value: '+3.1 pts', trend: 'up' }} hint="vs. previous 12 weeks">
                <Sparkline data={spark(70, 0.7)} dataKey="v" label="AI resolution rate, rising" />
              </Stat>
              <Stat label="Median first reply" value="4.2 s" delta={{ value: '−0.8 s', trend: 'down', sentiment: 'positive' }} hint="vs. previous 12 weeks">
                <Sparkline data={spark(6, -0.15)} dataKey="v" label="First reply time, falling" />
              </Stat>
              <Stat label="CSAT" value="4.6 / 5" delta={{ value: '−0.1', trend: 'down' }} hint="1,204 ratings">
                <Sparkline data={spark(4.7, -0.01)} dataKey="v" label="Customer satisfaction, flat" />
              </Stat>
            </section>

            <div className="pt-split">
              <LineChart
                title="Conversations per week"
                description="Resolved by AI vs. handed to a person"
                data={conversations}
                series={[{ key: 'resolved', label: 'Resolved by AI' }, { key: 'handedOff', label: 'Handed off' }]}
                xKey="week"
                xLabel="Week"
              />
              <Card>
                <CardHeader>
                  <CardTitle>Recent activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="pt-activity">
                    {activity.map((a) => (
                      <li key={a.what}>
                        <Avatar name={a.who} size="sm" aria-hidden />
                        <div>
                          <strong>{a.who}</strong> {a.what}
                          <time>{a.when}</time>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
