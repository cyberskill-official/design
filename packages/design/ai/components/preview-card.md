# Preview Card

> A hover card that previews a person, project or link while the pointer rests on it or the link has keyboard focus.

```tsx
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from '@cyberskill/design';
```

Use a preview card to give a glance of what is behind a link: who a person is, what a file contains. It is a progressive enhancement: touch and screen reader users never see it, so it must only repeat what the linked page shows. For details users need, use a [popover](/docs/components/popover) opened by a button.

## Person

```tsx
<PreviewCard>
  <PreviewCardTrigger href="/people/lan">Nguyễn Thị Lan</PreviewCardTrigger>
  <PreviewCardContent>
    <strong>Nguyễn Thị Lan</strong>
    <span>Support lead, Hà Nội</span>
  </PreviewCardContent>
</PreviewCard>
```

## Delays

```tsx
<PreviewCardTrigger href="/sources/refunds" delay={200} closeDelay={100}>refund-policy.pdf</PreviewCardTrigger>
<PreviewCardContent side="top">…</PreviewCardContent>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `href (Trigger)` | `string` | – | Where the link goes; keep it a real page |
| `delay (Trigger)` | `number` | `600` | Milliseconds of hover or focus before the card opens |
| `closeDelay (Trigger)` | `number` | `300` | Milliseconds after leaving before it closes |
| `side / align (Content)` | `Side / 'start' \| 'center' \| 'end'` | `'bottom' / 'center'` | Placement against the link |
| `sideOffset (Content)` | `number` | `8` | Gap from the link in px |

`PreviewCard` takes `open`, `defaultOpen` and `onOpenChange`.

## Accessibility

- The trigger is an ordinary link; its name is all a screen reader hears.
- The card opens on hover and on keyboard focus, and Escape closes it. Focus stays on the link; the card is not in the tab order, so keep links and buttons out of it.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type PreviewCardProps = BaseUI.PreviewCard.Root.Props;
type PreviewCardContentProps = Omit<BaseUI.PreviewCard.Popup.Props, 'className'> & Pick<BaseUI.PreviewCard.Positioner.Props, 'side' | 'align' | 'sideOffset'> & {
  className?: string;
};
type PreviewCardTriggerProps = Omit<BaseUI.PreviewCard.Trigger.Props, 'className'> & {
  className?: string;
};
```
