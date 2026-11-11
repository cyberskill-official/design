# Accordion

> Headed sections that expand and collapse, one at a time or several at once.

```tsx
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '@cyberskill/design';
```

Use an accordion to shorten a long page of related, optional detail: FAQs, settings groups, plan details. Do not hide content most people need; and for switching between views of one object, use tabs.

## Single

One section open at a time (the default). Opening another closes the first.

```tsx
<Accordion defaultValue={['billing']}>
  <AccordionItem value="billing">
    <AccordionTrigger>How is usage billed?</AccordionTrigger>
    <AccordionPanel>Per message, at the end of each month.</AccordionPanel>
  </AccordionItem>
  <AccordionItem value="data">
    <AccordionTrigger>Where is my data stored?</AccordionTrigger>
    <AccordionPanel>In the region you pick when you create the workspace.</AccordionPanel>
  </AccordionItem>
</Accordion>
```

## Multiple and disabled

`multiple` lets several sections stay open. A `disabled` item stays visible but does not open.

```tsx
<Accordion multiple>
  <AccordionItem value="plan">…</AccordionItem>
  <AccordionItem value="usage">…</AccordionItem>
  <AccordionItem value="audit" disabled>
    <AccordionTrigger>Audit log (Enterprise)</AccordionTrigger>
    <AccordionPanel>Every change in your workspace.</AccordionPanel>
  </AccordionItem>
</Accordion>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `multiple` | `boolean` | `false` | Accordion: allow several sections open at once |
| `defaultValue / value` | `any[]` | – | Accordion: open item values, uncontrolled or controlled |
| `onValueChange` | `(value: any[]) => void` | – | Accordion: called when a section opens or closes |
| `disabled` | `boolean` | `false` | Accordion or AccordionItem: ignore interaction |
| `value` | `any` | `auto id` | AccordionItem: identifies the section |
| `hiddenUntilFound` | `boolean` | `false` | AccordionPanel: closed content stays findable with the browser’s find-in-page |

`AccordionTrigger` renders an `h3` heading with the toggle button and a chevron. `AccordionPanel` animates its height.

## Accessibility

- Each trigger is a button inside a heading, so screen reader users can jump between sections by heading.
- Enter or Space toggles a section; Tab moves between triggers. The button reports `aria-expanded`, and the panel is a region named by its trigger.
- Disabled sections stay in the reading order so people know they exist.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type AccordionProps = Omit<BaseUI.Accordion.Root.Props, 'className'> & {
  className?: string;
};
type AccordionItemProps = Omit<BaseUI.Accordion.Item.Props, 'className'> & {
  className?: string;
};
type AccordionPanelProps = Omit<BaseUI.Accordion.Panel.Props, 'className'> & {
  className?: string;
};
type AccordionTriggerProps = Omit<BaseUI.Accordion.Trigger.Props, 'className'> & {
  className?: string;
};
```
