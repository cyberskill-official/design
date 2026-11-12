'use client';
import { Tabs, TabsList, TabsPanel, TabsTab } from '@cyberskill/design';

export function AgentTabs() {
  return (
    <Tabs defaultValue="overview" style={{ width: '100%' }}>
      <TabsList aria-label="Agent">
        <TabsTab value="overview">Overview</TabsTab>
        <TabsTab value="sources">Sources</TabsTab>
        <TabsTab value="conversations">Conversations</TabsTab>
        <TabsTab value="billing" disabled>Billing</TabsTab>
      </TabsList>
      <TabsPanel value="overview">Support Copilot answers 1,284 questions a week with a 92% resolution rate.</TabsPanel>
      <TabsPanel value="sources">14 training sources, last synced 2 hours ago.</TabsPanel>
      <TabsPanel value="conversations">312 conversations this week.</TabsPanel>
      <TabsPanel value="billing">Billing</TabsPanel>
    </Tabs>
  );
}

export function VerticalTabs() {
  return (
    <Tabs defaultValue="general" orientation="vertical" style={{ width: '100%' }}>
      <TabsList aria-label="Settings">
        <TabsTab value="general">General</TabsTab>
        <TabsTab value="members">Members</TabsTab>
        <TabsTab value="api">API keys</TabsTab>
      </TabsList>
      <TabsPanel value="general">Workspace name, language and time zone.</TabsPanel>
      <TabsPanel value="members">8 members, 2 pending invites.</TabsPanel>
      <TabsPanel value="api">3 active keys.</TabsPanel>
    </Tabs>
  );
}
