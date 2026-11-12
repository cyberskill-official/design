import { useRender } from '@base-ui/react/use-render';
import type { ComponentProps } from 'react';
import type { Tone } from './tone';
import { cx } from '../utils/cx';

export type CardProps = useRender.ComponentProps<'div'> & {
  /** Hover and focus styles for a card that is itself a link. Pair with `render={<a href="…" />}` (or a Next.js `Link`). */
  interactive?: boolean;
  /** A soft tinted card in this tone, e.g. `accent` for an AI suggestion or `warning` for a notice. */
  tone?: Tone;
  /**
   * A brand surface for one moment per view. `ink` paints the ink gradient and renders its content in the dark theme;
   * `aurora` paints a soft multi-color wash. Overrides `tone`.
   */
  surface?: 'ink' | 'aurora';
};

/** Surface that groups related content. Compose with CardHeader, CardTitle, CardDescription, CardContent and CardFooter. */
export function Card({ interactive, tone, surface, render, className, ...props }: CardProps) {
  return useRender({
    defaultTagName: 'div',
    render,
    props: {
      ...props,
      'data-interactive': interactive || undefined,
      'data-tone': surface ? undefined : tone,
      'data-surface': surface,
      ...(surface === 'ink' && { 'data-theme': 'dark' }),
      className: cx('cs-card', className),
    },
  });
}

export type CardHeaderProps = ComponentProps<'div'>;
export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div {...props} className={cx('cs-card-header', className)} />;
}

export type CardTitleProps = useRender.ComponentProps<'h3'>;
/** An `h3` by default. Pick the level that fits the page outline with `render={<h2 />}`. */
export function CardTitle({ render, className, ...props }: CardTitleProps) {
  return useRender({ defaultTagName: 'h3', render, props: { ...props, className: cx('cs-card-title', className) } });
}

export type CardDescriptionProps = ComponentProps<'p'>;
export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p {...props} className={cx('cs-card-description', className)} />;
}

export type CardContentProps = ComponentProps<'div'>;
export function CardContent({ className, ...props }: CardContentProps) {
  return <div {...props} className={cx('cs-card-content', className)} />;
}

export type CardFooterProps = ComponentProps<'div'>;
/** Action row pinned to the bottom of the card. */
export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div {...props} className={cx('cs-card-footer', className)} />;
}
