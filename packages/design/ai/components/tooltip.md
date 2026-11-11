# Tooltip

> A short label that appears on hover and keyboard focus, for icon buttons and dense toolbars.

```tsx
import { ButtonGroup, IconButton, Tooltip, TooltipProvider } from '@cyberskill/design';
```

Use a tooltip to name or briefly explain a control, mostly icon-only buttons. A tooltip is **never the only way to get essential information**: touch devices never show it and screen readers read the trigger's own name, not the tooltip. If the text matters, show it on the page, or use a [Popover](/docs/components/popover) behind an info button.

## Icon buttons

```tsx
<TooltipProvider delay={300}>
  <ButtonGroup label="Agent tools">
    <Tooltip content="Edit"><IconButton label="Edit" icon={<PencilSimple />} /></Tooltip>
    <Tooltip content="Retrain"><IconButton label="Retrain" icon={<ArrowClockwise />} /></Tooltip>
  </ButtonGroup>
</TooltipProvider>
```

Wrap a toolbar in `TooltipProvider`: once one tooltip is open, moving to the next shows it at once.

## Placement

```tsx
<Tooltip content="Copies the key once." side="bottom">
  <IconButton label="Copy API key" icon={<Copy />} />
</Tooltip>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `content` | `ReactNode` | – | The tooltip text (required). Keep it to a few words |
| `children` | `ReactElement` | – | The trigger: one element that forwards ref and props, with its own accessible name |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred side; flips when there is no room |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment along that side |
| `delay / closeDelay` | `number` | `600 / 0` | Hover delays in ms. TooltipProvider sets a shared delay |
| `disabled` | `boolean` | `false` | Never show the tooltip |

`Tooltip` also takes `open`, `defaultOpen` and `onOpenChange`.

## Accessibility

- Opens on hover and on keyboard focus; Escape closes it without moving focus.
- The tooltip is visual only. Give the trigger an accessible name that matches the tooltip (`IconButton` does this with `label`).
- It stays open while the pointer moves onto it, so it can be read when magnified.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  label?: string;
};
export type IconButtonProps = Omit<ButtonProps, 'children' | 'iconStart' | 'iconEnd' | 'fullWidth'> & {
  /** Accessible name, read by screen readers and shown as the tooltip-free label. Required. */
  label: string;
  icon: ReactNode;
};
export type TooltipProps = Omit<BaseUI.Tooltip.Root.Props, 'children' | 'handle'> & Pick<BaseUI.Tooltip.Positioner.Props, 'side' | 'align'> & Pick<BaseUI.Tooltip.Trigger.Props, 'delay' | 'closeDelay'> & {
  /** Short supplementary text. Never the only place essential information lives. */
  content: ReactNode;
  /** The trigger: one element that forwards `ref` and props, e.g. `<IconButton label="Copy" … />`. It needs its own accessible name. */
  children: ReactElement;
  className?: string;
};
export type TooltipProviderProps = BaseUI.Tooltip.Provider.Props;
```
