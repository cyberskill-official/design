// Motion helpers on the design tokens (optional peer dependency `motion`). Import from '@cyberskill/design/motion'.
// For what CSS cannot do: gestures with velocity, shared-element moves, exit animation of an app's own lists, count-up.
// First-load reveal is plain CSS in the core entry (Reveal, Stagger).
export { springs, transitions } from './tokens'; // pure: callable in Server Components
export type { RecipeName, SpringName, SpringTransition, TweenTransition } from './tokens';
export { MotionProvider } from './MotionProvider';
export type { MotionProviderProps } from './MotionProvider';
export { AnimatedNumber } from './AnimatedNumber';
export type { AnimatedNumberProps } from './AnimatedNumber';
