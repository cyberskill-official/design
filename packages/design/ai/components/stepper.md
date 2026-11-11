# Stepper

> Shows progress through a fixed sequence of steps, such as onboarding or a setup wizard.

```tsx
import { Stepper } from '@cyberskill/design';
```

Use a stepper above a multi-step flow to show how many steps there are, which are done and which is next. Keep it to three to six steps. It is a progress display, not navigation: put Back and Continue buttons in the flow itself.

## Horizontal

```tsx
<Stepper
  aria-label="Agent setup"
  steps={[
    { title: 'Connect sources', description: '14 documents synced', status: 'complete' },
    { title: 'Train agent', description: 'About 5 minutes', status: 'current' },
    { title: 'Test answers', status: 'upcoming' },
    { title: 'Go live', status: 'upcoming' },
  ]}
/>
```

Completed steps get a primary bar and a check, the current step a gold bar and bold title, upcoming steps a neutral bar.

## Vertical

```tsx
<Stepper steps={steps} orientation="vertical" aria-label="Agent setup" />
```

Use vertical in narrow side panels or when descriptions are long.

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `steps` | `{ title: ReactNode; description?: ReactNode; status: 'complete' \| 'current' \| 'upcoming' }[]` | – | The steps in order (required) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Row of steps or a column |
| `statusLabels` | `Record<status, string>` | `Completed / Current step / Not started` | Status read after each title; pass Vietnamese strings in Vietnamese UIs |

## Accessibility

- An ordered list, so screen readers announce the number of steps and each position. Name it with `aria-label`.
- The current step has `aria-current="step"`.
- Each step's status is read as text after its title ("Train agent, Current step"), so it never rests on color alone.

## Exact types

```ts
export type StepperProps = HTMLAttributes<HTMLOListElement> & {
  className?: string;
  steps: StepperStep[];
  orientation?: 'horizontal' | 'vertical';
  /** Status read by screen readers after each title. Pass Vietnamese strings in Vietnamese UIs. */
  statusLabels?: Record<StepStatus, string>;
};
```
