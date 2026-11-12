# Motion (@cyberskill/design)

> Durations, curves and springs as tokens, combined into the recipes every component animates with. Movement becomes a fade under reduced motion.

Motion says what changed and where it went. It never decorates. Every transition in the package picks a **recipe**: a `--motion-*` token that holds a duration and a curve. An app that installs the package moves the same way without writing any of it.

## Principles

- **Answer on touch-down.** Feedback starts when the pointer goes down, inside 80ms. The action still fires on release.
- **Springs move, curves fade.** Anything that changes position uses a spring set by duration and bounce. Color and opacity use a curve.
- **Arrive gently, leave quickly.** Entering decelerates. Leaving takes about 60% of the time, so the interface never holds you up.
- **Come from the trigger.** A menu grows from its button, a sheet rises from its edge, and each leaves the way it came.
- **Always interruptible.** Every transition can reverse halfway and follow a finger. Nothing blocks input while it plays.
- **Seen often, moves less.** Keyboard actions and things done a hundred times a day do not animate. Rare moments get the spring.

## Curves and springs

Five durations, three curves (standard, enter and sheet) and three springs. A spring is set the way Apple sets one: a duration and a bounce. Bounce 0 is the default, 0.15 is for things that move, and 0.3 is kept for one success moment.

The token build samples each spring into a CSS `linear()` curve that runs for the spring's settling time, and writes the same spring as stiffness and damping for JavaScript, so CSS and the animation library move alike.

## Components in motion

Every component animates through the recipes below, so none of them sets its own timing and an app inherits all of it with `styles.css`.

## Recipes

Apps and components never write milliseconds or curves. They pick a recipe, one per property: `transition: background-color var(--motion-state), transform var(--motion-release);`.

| Recipe | Use it for | In | Out | What moves |
|---|---|---|---|---|
| `--motion-state` | Hover, focus and checked: color, background, border, shadow, outline | 120ms standard | same | Color only |
| `--motion-fade` | Opacity of anything that enters, backdrops included | 180ms enter | the popup's or dialog's out recipe | Opacity |
| `--motion-press` / `--motion-release` | Anything tappable | 80ms enter | snappy spring | Scale to `--motion-press-scale` (0.97) |
| `--motion-move` | Switch thumb, tab indicator, segment thumb, slider thumb, progress fill | snappy spring | same | Position |
| `--motion-pop-in` / `--motion-pop-out` | Menu, select, combobox, command menu, popover, tooltip, preview card, pickers; accordion and collapsible height | 180ms enter | 120ms enter | Scale from `--motion-pop-scale` (0.96) at the trigger, fade |
| `--motion-modal-in` / `--motion-modal-out` | Dialog, alert dialog | smooth spring | 180ms enter | Scale from `--motion-modal-scale` (0.96), fade, no slide |
| `--motion-sheet-in` / `--motion-sheet-out` | Drawer, bottom sheet, side panel | 500ms sheet curve | 280ms sheet curve | Slide from its edge |
| `--motion-reveal` | First load of a page or panel | 500ms enter, `--motion-stagger` (40ms) apart | none | Fade and rise `--motion-rise` (8px), six blocks at most |
| `--motion-celebrate` | One success: an exam passed, set-up finished | bouncy spring | none | One element, once |
| none | Spinner, skeleton, indeterminate progress | linear loop | none | The only place `linear` is allowed |

The springs: smooth is 0.3s with bounce 0 and settles in 406ms, snappy is 0.3s with bounce 0.15 and settles in 386ms, bouncy is 0.4s with bounce 0.3 and settles in 584ms. The durations: instant 80ms, fast 120ms, base 180ms, slow 280ms, slower 500ms. The curves: `--ease-standard` for color, `--ease-enter` (fast start, gentle stop) for anything that arrives or answers a press, `--ease-sheet` for sheets. `--ease-emphasized` and `--ease-exit` stay for older code; no recipe uses them.

A popup, written the way every component writes it:

```css
.my-popover {
  transform-origin: var(--transform-origin);
  transition: opacity var(--motion-fade), transform var(--motion-pop-in);
  &[data-starting-style],
  &[data-ending-style] { opacity: 0; transform: scale(var(--motion-pop-scale)); }
  &[data-ending-style] { transition: opacity var(--motion-pop-out), transform var(--motion-pop-out); }
}
```

Base UI removes `[data-starting-style]` on the first frame, so the base rule's transition is the enter and the one under `[data-ending-style]` is the exit.

## What runs it

CSS first. Springs work in plain CSS through `linear()`, which every current browser supports, so the default costs no JavaScript and works in Server Components. A library is added only for what CSS cannot do.

| Layer | Covers | Cost to an app |
|---|---|---|
| Tokens and component CSS | Every recipe above, in every component, springs included, with enter and exit through Base UI's state attributes. First-load reveal too: `Reveal` and `Stagger` are plain CSS in the core entry | None: it arrives with `styles.css` |
| `@cyberskill/design/motion` | Drag and swipe with velocity, shared-element moves, exit animation for an app's own lists, a number that counts up. Built on Motion and reading the same tokens | An opt-in import. `motion` is an optional peer, like `recharts` for charts |
| Page transitions | React's `<ViewTransition>` with the Next.js App Router | None: there is no wrapper to install |

A first-load reveal needs no JavaScript: `Stagger` and `Reveal` come from the core entry and work in Server Components. `Reveal` plays again whenever its container is hidden and shown, so put it on content that mounts once, never inside a tab panel or a collapsible. The headline number counts up with `AnimatedNumber` from the `/motion` entry:

```tsx
import { Reveal, Stagger, Stat } from '@cyberskill/design';
import { AnimatedNumber } from '@cyberskill/design/motion';

export function Overview() {
  return (
    <Stagger>
      <Reveal><Stat label="Active learners" value={<AnimatedNumber value={1284} from={0} />} /></Reveal>
      <Reveal><Stat label="Pass rate" value="86.4%" /></Reveal>
    </Stagger>
  );
}
```

`AnimatedNumber` counts when its `value` changes, or from `from` when it mounts. For an app's own `motion` elements, `transitions` holds the recipes as Motion transition objects (`transitions.move`, `transitions.popIn`, `transitions.modalIn`…) and `springs` the three springs, so a drag or a shared-element move runs on the same physics as the CSS: `<motion.div layout transition={transitions.move} />`.

Page transitions need no package code. Wrap the part of the layout that changes between routes:

```tsx
import { ViewTransition } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ViewTransition>{children}</ViewTransition>;
}
```

## Rules

### Do

- Pick a recipe token, one per property. Never write raw milliseconds or a `cubic-bezier()` in app code.
- Animate `transform` and `opacity`. Size or position only for an indicator that follows its target or a panel that opens, and then only on `--motion-move` or `--motion-pop-in`: both end at once under reduced motion.
- Open from the trigger and leave the same way, faster.
- Use CSS transitions, so a second click reverses the first.
- Build start and end states from the value tokens (`--motion-press-scale`, `--motion-pop-scale`, `--motion-modal-scale`, `--motion-rise`), so reduced motion works with no extra rule.
- Put hover effects behind `@media (hover: hover) and (pointer: fine)`.

### Don't

- No `linear` or `ease-in` on interface motion. `linear` is for loading loops only.
- Nothing longer than 500ms, and most things under 300ms. A spring counts by its duration, not its settling tail.
- No `transition: all`, and no `var(--duration-*)`, `var(--ease-*)`, raw times or raw curves inside a `transition`. The CSS check rejects them in the package.
- No scaling from zero.
- No motion on keyboard shortcuts, typing, row selection or anything done all day.
- No reveal on scroll and no decorative loops.
- No second animation library in an app. Use the `/motion` entry.

## Reduced motion

When the reader's system asks for reduced motion, movement becomes a fade. It ships with the tokens: `tokens.css` redefines the recipes and the values under `prefers-reduced-motion: reduce`, so an app that imports only `tokens.css` gets it too.

- `--motion-press`, `--motion-release`, `--motion-move`, `--motion-pop-in`, `--motion-sheet-in`, `--motion-sheet-out` and `--motion-celebrate` end at once: anything that moves or changes size.
- `--motion-modal-in` and `--motion-reveal` become a 180ms fade.
- `--motion-state`, `--motion-fade`, `--motion-pop-out` and `--motion-modal-out` stay as they are: color and opacity, all 180ms or less.
- `--motion-press-scale`, `--motion-pop-scale` and `--motion-modal-scale` become 1, and `--motion-rise` and `--motion-stagger` become 0, so popups, dialogs and reveals fade in place.
- Keyframe animations in the package's stylesheet run once, at once, with no delay.

A component gets this right only if it animates through the recipes and builds its start and end transforms from the value tokens. Drawers and sheets slide in from off-screen, so they add their own `@media (prefers-reduced-motion: reduce)` rule that fades instead. `Reveal` and `Stagger` show their content at once, and `AnimatedNumber` shows its final value without counting.

To retime a component, override its recipe on `:root`, inside `prefers-reduced-motion: no-preference` so reduced motion still wins:

```css
@media (prefers-reduced-motion: no-preference) {
  :root { --motion-pop-in: var(--duration-slow) var(--ease-enter); }
}
```

The recipes are resolved on `:root`, so overriding `--duration-*` or `--ease-*` changes nothing, and a recipe set on a subtree does not reach the components (popups render at the end of the page, outside it).

## Layers

Things that float stack in a fixed order. Use the `--z-*` tokens, never raw numbers.

| Token | Value | For |
|---|---|---|
| `--z-sticky` | 1100 | Sticky headers and toolbars |
| `--z-overlay` | 1200 | Backdrops |
| `--z-modal` | 1300 | Dialogs and drawers |
| `--z-dropdown` | 1400 | Menus, selects and popovers, so one opened inside a dialog shows above it |
| `--z-toast` | 1500 | Toasts |
| `--z-tooltip` | 1600 | Tooltips, always on top |
