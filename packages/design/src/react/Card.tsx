import { useRender } from '@base-ui/react/use-render';
import type { ComponentProps } from 'react';
import { cx } from '../utils/cx';

export type CardProps = useRender.ComponentProps<'div'> & {
  /** Hover and focus styles for a card that is itself a link. Pair with `render={<a href="…" />}` (or a Next.js `Link`). */
  interactive?: boolean;
};

/** Surface that groups related content. Compose with CardHeader, CardTitle, CardDescription, CardContent and CardFooter. */
export function Card({ interactive, render, className, ...props }: CardProps) {
  return useRender({ defaultTagName: 'div', render, props: { ...props, 'data-interactive': interactive || undefined, className: cx('cs-card', className) } });
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
