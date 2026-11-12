# Motion

> Opt-in helpers on Motion for what CSS cannot do. MotionProvider, AnimatedNumber, and the motion tokens as Motion transitions.

```tsx
import { Button, Stat } from '@cyberskill/design';
import { AnimatedNumber, MotionProvider } from '@cyberskill/design/motion';
```

**CSS first.** Every component already animates with the CSS recipes (`--motion-state`, `--motion-pop-in`, `--motion-move` …), reduced motion included, and needs no JavaScript for it. Your own hover, press, popup and panel styles should use the same recipes: `transition: transform var(--motion-move)`. A first-load reveal is plain CSS too: use [Reveal and Stagger](/docs/components/reveal) from the core entry.

This entry is for the few things CSS cannot do:

- drag and swipe that keep the gesture's speed when you let go,
- an element moving from one place to another (shared-element moves with `layoutId`),
- exit animation of your app's own list items (`AnimatePresence`),
- a number that counts to its new value.

It is built on [Motion](https://motion.dev), an optional peer like Recharts, so apps that never import it never load it:

```bash
npm install motion
```

```tsx
import { MotionProvider, AnimatedNumber, springs, transitions } from '@cyberskill/design/motion';
```

## Setup

Wrap the app (or the part that animates) once. `MotionProvider` is Motion's `MotionConfig` with two defaults: `reducedMotion="user"`, so every `motion.*` element follows the reader's reduced-motion setting, and the `move` spring as the default transition. Other `MotionConfig` props pass through.

```tsx
'use client';
import { MotionProvider } from '@cyberskill/design/motion';

export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}
```

## AnimatedNumber

Renders `value` as is, and counts from the number on screen to a new `value` with an ease-out when it changes. The digits are tabular, so the width holds while it counts, and each frame keeps the final value's precision. Formatting is `Intl.NumberFormat`: pass `locale` and `format`. `locale` defaults to `'en-US'`, not the runtime's locale, so the server and the browser render the same digits; Vietnamese apps pass `locale="vi-VN"`.

```tsx
const [learners, setLearners] = useState(1284);

<Stat label="Active learners" value={<AnimatedNumber value={learners} locale="en-US" />} hint="this month" />
<Button variant="secondary" size="sm" onClick={() => setLearners((n) => n + 120)}>Add 120</Button>
```

`from` counts up when it mounts. The first render, server HTML included, shows `from` in the visible digits and `value` to screen readers, so hydration does not jump. Trade-off: without JavaScript the visible digits stay at `from`.

```tsx
<Stat label="Course completions" value={<AnimatedNumber value={8420} from={0} locale="en-US" />} hint="since launch" />
```

```tsx
<Stat
  label="Doanh thu tháng"
  value={<AnimatedNumber value={revenue} locale="vi-VN" format={{ style: 'currency', currency: 'VND' }} />}
/>
```

## Your own animations, on the same tokens

`transitions` holds every CSS recipe as a Motion transition, with camelCase names (`state`, `fade`, `press`, `release`, `move`, `popIn`, `popOut`, `modalIn`, `modalOut`, `sheetIn`, `sheetOut`, `reveal`, `celebrate`). Timed recipes are `{ duration, ease }` in seconds; spring recipes are springs. `springs` holds the three springs (`smooth`, `snappy`, `bouncy`) as `{ type: 'spring', stiffness, damping, mass }`. Both are plain data read from the token files, so a Server Component can import them too.

Use them with Motion's own `motion.*` elements, `AnimatePresence` and `layoutId`:

```tsx
'use client';
import { AnimatePresence, motion } from 'motion/react';
import { springs, transitions } from '@cyberskill/design/motion';

// Exit animation of the app's own list
<ul>
  <AnimatePresence initial={false}>
    {items.map((item) => (
      <motion.li
        key={item.id}
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: transitions.fade }}
        exit={{ opacity: 0, transition: transitions.popOut }}
      >
        {item.name}
      </motion.li>
    ))}
  </AnimatePresence>
</ul>

// A highlight that moves between tabs of your own
{tabs.map((tab) => (
  <button key={tab.id} type="button" aria-pressed={tab.id === active} onClick={() => setActive(tab.id)}>
    {tab.id === active && <motion.span layoutId="highlight" transition={springs.snappy} className="highlight" />}
    {tab.label}
  </button>
))}

// A handle dragged and let go: it springs back on the snappy spring, carrying the gesture's speed
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragTransition={{ bounceStiffness: springs.snappy.stiffness, bounceDamping: springs.snappy.damping }}
/>
```

Under `MotionProvider`, these follow reduced motion on their own: Motion skips movement (transforms and layout) and keeps fades.

## Props

### MotionProvider

| Prop | Type | Default | Description |
|---|---|---|---|
| `reducedMotion` | `'user' \| 'always' \| 'never'` | `'user'` | 'user' follows the reader's setting; 'always' reduces everywhere, AnimatedNumber included |
| `transition` | `Transition` | `transitions.move` | Default transition for every motion.* element inside |
| `…` | `MotionConfigProps` | – | Every other MotionConfig prop (nonce, skipAnimations …) |

### AnimatedNumber

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `number` | – | The number to show (required). A new value counts from the one on screen |
| `from` | `number` | – | Count up from this number on mount. Without JavaScript the visible digits stay at from; screen readers always get value |
| `locale` | `Intl.LocalesArgument` | `'en-US'` | Locale for Intl.NumberFormat, e.g. 'vi-VN'. Fixed, not the runtime's, so server and browser agree |
| `format` | `Intl.NumberFormatOptions` | – | Currency, percent, compact notation, fraction digits |
| `…` | `span props` | – | className, style, ref, aria-*, data-* pass through |

## Accessibility

- **Reduced motion.** `AnimatedNumber` shows the final value at once when the reader asks for reduced motion, or under `MotionProvider reducedMotion="always"`. Nothing loops.
- **Screen readers get the final number.** `AnimatedNumber` hides the visible digits (`aria-hidden`) and keeps the final value in visually hidden text, so the number is read once, as it ends, and never as `from`. It is not a live region: if a change should be announced, put it inside one, e.g. `<p aria-live="polite">`.
- **Keyboard.** Nothing here takes focus or changes the focus order.

## Exact types

```ts
// BaseUI.<Part>.Props = all props of that @base-ui/react part (render, aria-*, data-*, events).
export type ButtonProps = Omit<BaseUI.Button.Props, 'className'> & {
  className?: string;
  /** Visual style. `accent` (gold) is for one key action or AI moment per view. `secondary` is a soft ink fill; `soft` is the same fill in any `tone`. */
  variant?: ButtonVariant;
  /** Tint of a `soft` button, e.g. `success` for Approve or `danger` for a quiet Remove. Ignored by other variants. */
  tone?: 'primary' | 'accent' | StatusTone;
  size?: ButtonSize;
  /** Shows a spinner, keeps the button focusable and announces it as busy. */
  loading?: boolean;
  /** Icon before the label (decorative). */
  iconStart?: ReactNode;
  /** Icon after the label (decorative). */
  iconEnd?: ReactNode;
  /** Stretch to the container width. */
  fullWidth?: boolean;
};
export type StatProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** What is measured, e.g. "Monthly revenue". */
  label: ReactNode;
  /** The figure, formatted: "$48,210", "1,284", "99.98%". */
  value: ReactNode;
  /** Change since the comparison period. Shown as an arrow and text, colored by sentiment. */
  delta?: StatDelta;
  /** Context for the delta or value, e.g. "vs. last month". */
  hint?: ReactNode;
  /** Slot under the figures, e.g. a sparkline. */
  children?: ReactNode;
  /** Decorative icon in a tinted tile beside the label and value. */
  icon?: ReactNode;
  /** Tint of the icon tile. Defaults to `primary` (ink). */
  tone?: Tone;
  /** Screen-reader text after a good-news delta, since its color alone carries the meaning. */
  positiveLabel?: string;
  /** Screen-reader text after a bad-news delta. */
  negativeLabel?: string;
};
export type AnimatedNumberProps = Omit<ComponentProps<'span'>, 'children'> & {
  value: number;
  /**
   * Count up from this number when it mounts. The first render (server HTML included) shows `from` in the visible
   * digits and `value` to screen readers, so hydration does not jump; without JavaScript the visible digits stay at `from`.
   */
  from?: number;
  /** Locale for `Intl.NumberFormat`, e.g. `'vi-VN'`. Defaults to `'en-US'`, not the runtime's locale, so server and browser render the same digits. */
  locale?: Intl.LocalesArgument;
  /** `Intl.NumberFormat` options: currency, percent, compact notation, fraction digits. */
  format?: Intl.NumberFormatOptions;
};
export type MotionProviderProps = MotionConfigProps;
```
