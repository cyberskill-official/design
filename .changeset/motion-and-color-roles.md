---
"@cyberskill/design": minor
---

Motion and color that every app inherits.

**Motion**
- Springs defined the way Apple defines them (a duration and a bounce) and shipped as tokens: `--spring-smooth`, `--spring-snappy`, `--spring-bouncy`. In CSS they are `linear()` curves; `tokens.spring` has the same springs as stiffness and damping for JavaScript.
- Recipes are the only motion a component or an app chooses: `--motion-state`, `--motion-fade`, `--motion-press`, `--motion-release`, `--motion-move`, `--motion-pop-in`, `--motion-pop-out`, `--motion-modal-in`, `--motion-modal-out`, `--motion-sheet-in`, `--motion-sheet-out`, `--motion-reveal` and `--motion-celebrate`. Use one per property: `transition: transform var(--motion-move)`.
- Every component now moves through them: buttons answer on pointer-down and spring back, the switch thumb, tab line and segmented selection travel on a spring, menus and popovers grow from their trigger, dialogs scale in and leave faster than they arrive, drawers use a sheet curve, toasts land instead of travelling.
- Reduced motion keeps the fade and drops the movement, for every component and for app code that uses the recipes. It ships with the tokens, so `tokens.css` on its own has it too.
- New durations `--duration-instant` (80ms) and `--duration-slower` (500ms); new curves `--ease-enter` and `--ease-sheet`. The existing three durations are unchanged.
- `Reveal` and `Stagger`: a first-load fade and rise in plain CSS. They need no JavaScript, work in Server Components and never restart on hydration.
- New optional entry `@cyberskill/design/motion` (peer `motion`, install it only if you use the entry) for what CSS cannot do: `MotionProvider`, `AnimatedNumber`, and the tokens as Motion transitions (`transitions`, `springs`).

**Color**
- Color roles for every tone, derived by the token build and checked for contrast: `--<tone>-soft`, `--<tone>-soft-hover`, `--<tone>-line` and `--<tone>-text` for success, warning, destructive and info, plus the accent and primary equivalents.
- Five category tones for icon tiles, avatars and tags, matching the chart palette: `blue`, `amber`, `teal`, `magenta`, `violet`.
- `Button` `variant="soft"` with `tone`; new `IconTile`; `tone` on `Avatar`, `Stat`, `Card`, `Tag` and `Badge`; `Stat` `icon`; `Card` `surface="ink"` (the one inverse surface on a view) and `surface="aurora"`; `toneFor()` picks a stable category tone from a name.
- Four gradient tokens, and no others: `--gradient-ink`, `--gradient-wash`, `--gradient-gold`, `--gradient-aurora`.
- The selection in `SegmentedControl` is one thumb that slides.

**For app repositories**
- `npx @cyberskill/design check` fails on raw colors, raw durations or curves, and a second animation library. Add it to CI.
- `npx @cyberskill/design ai-setup` now also points AI tools at `ai/motion.md` and `ai/color.md`.

**Changed look: check these when upgrading from 3.1.0**
- **The `secondary` button is a soft ink fill**, not a grey outline. Use `variant="ghost"` where you need a button with no fill.
- **Checked controls are gold.** Switch, Checkbox, Radio, the Slider range, Progress and Meter fill with `--accent` and carry an ink mark. `Progress` and `Meter` take `tone="primary"` for the previous ink fill.
- **Retiming components.** Recipes are resolved on `:root`, so overriding `--duration-*` or `--ease-*` no longer changes a component, and neither does an override on `body` or a subtree. Override the `--motion-*` recipe on `:root`, inside `@media (prefers-reduced-motion: no-preference)` so reduced motion still wins.
- **`--primary-soft` is also the resting fill of the `secondary` button** (with a `--primary-line` hairline). An app that recolors `--primary-soft` for selected rows recolors those buttons too.
- **Everything built on the secondary button changes with it:** `IconButton`, `ButtonGroup` (buttons sit 1px apart and the pressed one is a panel with an ink edge), the toast action, the alert dialog's cancel and the avatar upload trigger.
- **`Stat` deltas are tinted chips**, the `SideNav` badge is solid gold whatever it holds, and an interactive `Card` lifts 2px on hover.
- **`SegmentedControl` has a new first child**, the sliding thumb (`aria-hidden`). App CSS that picks segments with `:first-child` or `:nth-child` must use `.cs-segmented-control-item`; a custom `[data-pressed]` background now paints over the thumb.
- The `CommandMenu` opens on the short pop recipe instead of the dialog one.
