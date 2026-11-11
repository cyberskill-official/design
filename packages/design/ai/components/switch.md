# Switch

> Turn a setting on or off, effective immediately.

```tsx
import { Switch } from '@cyberskill/design';
```

Use a switch for a setting that takes effect the moment it is flipped, like on a settings page. If the choice is only saved when a form is submitted, use a checkbox instead. Label the switch with what it turns on, not with "On/Off".

## Settings

```tsx
<Switch label="Auto-deploy main" description="Every push to main deploys to production." checked={autoDeploy} onCheckedChange={setAutoDeploy} />
<Switch label="Two-factor authentication" description="Ask for a code from your authenticator app at sign-in." defaultChecked />
<Switch label="Single sign-on" description="Available on the Business plan." disabled />
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `ReactNode` | – | Visible label beside the switch (required). Clicking it toggles the switch |
| `description` | `ReactNode` | – | Help text under the label, announced with it |
| `checked / defaultChecked` | `boolean` | – | Controlled or initial state |
| `onCheckedChange` | `(checked, details) => void` | – | Called when the user toggles it |
| `disabled / readOnly` | `boolean` | `false` | Blocks changes |
| `name / value` | `string` | – | Form field name and the value submitted when on |

`className` goes on the row; `ref` and the rest go to the switch.

## Accessibility

- It is a switch named by its label and described by its help text; screen readers announce on or off.
- Tab focuses it; Space toggles it.
- The 36×20 track has a 44px touch area. On and off differ by the thumb position as well as color.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
type SwitchProps = Omit<BaseUI.Switch.Root.Props, 'className' | 'children'> & {
  /** Class for the row (track + label + description). */
  className?: string;
  /** Visible label beside the switch. Clicking it toggles the switch. */
  label: ReactNode;
  /** Help text under the label, announced with it. */
  description?: ReactNode;
};
```
