import { MotionConfig, MotionConfigContext, type MotionConfigProps } from 'motion/react';
import { useContext } from 'react';
import { transitions } from './tokens';

export type MotionProviderProps = MotionConfigProps;

/**
 * Motion's `MotionConfig` with the house defaults: it follows the reader's reduced-motion setting and moves on the
 * `move` spring unless a `motion.*` element sets its own transition. Wrap the app, or the part that animates, once.
 */
export function MotionProvider({ reducedMotion = 'user', transition = transitions.move, ...props }: MotionProviderProps) {
  return <MotionConfig reducedMotion={reducedMotion} transition={transition} {...props} />;
}

/**
 * A check to run when an animation starts: true when the reader asks for reduced motion, or a MotionProvider says
 * `reducedMotion="always"`. Read at that moment, not cached, so a change of setting applies to the next animation.
 */
export function useReducedMotionCheck(): () => boolean {
  const always = useContext(MotionConfigContext).reducedMotion === 'always';
  return () => always || matchMedia('(prefers-reduced-motion: reduce)').matches;
}
