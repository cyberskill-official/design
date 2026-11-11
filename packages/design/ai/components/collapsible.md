# Collapsible

> A button that shows and hides one region, such as advanced settings.

```tsx
import { Collapsible, CollapsiblePanel, CollapsibleTrigger, TextField } from '@cyberskill/design';
```

Use a collapsible to tuck away one block of secondary content: advanced options, extra details, a long list. For several headed sections, use an accordion.

## Example

```tsx
<Collapsible>
  <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
  <CollapsiblePanel>
    <TextField label="Temperature" type="number" defaultValue="0.2" />
    <TextField label="Max tokens" type="number" defaultValue="800" />
  </CollapsiblePanel>
</Collapsible>
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `defaultOpen / open` | `boolean` | `false` | Collapsible: open state, uncontrolled or controlled |
| `onOpenChange` | `(open: boolean) => void` | – | Collapsible: called when it opens or closes |
| `disabled` | `boolean` | `false` | Collapsible: ignore interaction |
| `keepMounted` | `boolean` | `false` | CollapsiblePanel: keep the content in the DOM while closed |
| `hiddenUntilFound` | `boolean` | `false` | CollapsiblePanel: closed content stays findable with find-in-page |

`CollapsibleTrigger` shows a caret that turns when open. Pass `render={<Button variant="ghost" />}` to use a design-system button instead.

## Accessibility

- The trigger is a button with `aria-expanded` and `aria-controls` pointing at the panel.
- Enter or Space toggles it. It has a 44px touch area.
- The height animation respects reduced motion.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type CollapsibleProps = Omit<BaseUI.Collapsible.Root.Props, 'className'> & {
  className?: string;
};
type CollapsiblePanelProps = Omit<BaseUI.Collapsible.Panel.Props, 'className'> & {
  className?: string;
};
type CollapsibleTriggerProps = Omit<BaseUI.Collapsible.Trigger.Props, 'className'> & {
  className?: string;
};
type TextFieldProps, Textarea, type TextareaProps, type Theme, type ThemeScopeProps, type ToastOptions, type ToastProviderProps, type ToastTone, type ToggleProps, type ToolbarButtonProps, type ToolbarGroupProps, type ToolbarLinkProps, type ToolbarProps, type ToolbarSeparatorProps, type TooltipProps, type TooltipProviderProps };
```
