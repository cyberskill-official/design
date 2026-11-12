# Tabs

> Switch between views of the same object without leaving the page. A primary underline marks the active tab.

```tsx
import { Tabs, TabsList, TabsPanel, TabsTab } from '@cyberskill/design';
```

Use tabs to **switch between views of the same object**: an agent's overview, sources and conversations. Prefer tabs for that, **not for primary app navigation**: moving between sections of the app belongs in a [side nav](/docs/components/side-nav) with real links. Keep labels short and avoid more tabs than fit in one row.

## Horizontal

```tsx
<Tabs defaultValue="overview">
  <TabsList aria-label="Agent">
    <TabsTab value="overview">Overview</TabsTab>
    <TabsTab value="sources">Sources</TabsTab>
    <TabsTab value="conversations">Conversations</TabsTab>
    <TabsTab value="billing" disabled>Billing</TabsTab>
  </TabsList>
  <TabsPanel value="overview">…</TabsPanel>
  <TabsPanel value="sources">…</TabsPanel>
</Tabs>
```

## Vertical

```tsx
<Tabs defaultValue="general" orientation="vertical">
  <TabsList aria-label="Settings">…</TabsList>
  <TabsPanel value="general">…</TabsPanel>
</Tabs>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `Tabs value / defaultValue` | `any` | `0` | The active tab; match a TabsTab value |
| `Tabs onValueChange` | `(value, details) => void` | – | Called when the user picks another tab |
| `Tabs orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Vertical puts the list on the left and uses Up/Down arrows |
| `TabsList activateOnFocus` | `boolean` | `false` | Select a tab as soon as an arrow key focuses it |
| `TabsTab value` | `any` | – | Identifies the tab (required) |
| `TabsTab disabled` | `boolean` | `false` | Focusable but cannot be selected |
| `TabsPanel value / keepMounted` | `any / boolean` | `– / false` | Panel for that tab; keepMounted keeps hidden panels in the DOM |

## Accessibility

- The list is a `tablist` (give it an `aria-label`), each tab a `tab`, each panel a `tabpanel` named by its tab.
- Tab moves focus into the list and then to the panel; Left/Right (Up/Down when vertical) move between tabs, Home and End jump to the ends.
- Enter or Space selects the focused tab (or turn on `activateOnFocus`).
- The active tab is marked with weight and the underline, not color alone.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type TabsProps = Omit<BaseUI.Tabs.Root.Props, 'className'> & {
  className?: string;
};
export type TabsListProps = Omit<BaseUI.Tabs.List.Props, 'className'> & {
  className?: string;
};
export type TabsPanelProps = Omit<BaseUI.Tabs.Panel.Props, 'className'> & {
  className?: string;
};
export type TabsTabProps = Omit<BaseUI.Tabs.Tab.Props, 'className'> & {
  className?: string;
};
```
