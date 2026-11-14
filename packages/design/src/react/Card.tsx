import type { useRender } from '@base-ui/react/use-render';
import { cloneElement, createElement, isValidElement, type ComponentProps, type CSSProperties, type ReactElement } from 'react';
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

type Props = Record<string, unknown> & { className?: string; style?: CSSProperties; children?: unknown };

/**
 * Base UI's `useRender` without the hook, so Card and CardTitle render in Server Components with no JavaScript.
 * Props merge the way Base UI merges them: classes and styles combine, the render element's own props win, and when
 * both sides handle an event, the element's handler runs first.
 */
function renderAs(tag: 'div' | 'h3', render: useRender.RenderProp<Record<string, never>> | undefined, props: Props) {
  if (typeof render === 'function') return render(props as ComponentProps<'div'>, {});
  if (!isValidElement<Props>(render)) return createElement(tag, props);
  const own = render.props;
  const merged: Props = { ...props, ...own, className: cx(props.className, own.className), style: props.style || own.style ? { ...props.style, ...own.style } : undefined };
  for (const key of Object.keys(own)) {
    const outer = props[key], inner = own[key];
    if (/^on[A-Z]/.test(key) && typeof outer === 'function' && typeof inner === 'function') merged[key] = (...args: unknown[]) => { inner(...args); outer(...args); };
  }
  if (own.children === undefined) merged.children = props.children;
  return cloneElement(render as ReactElement<Props>, merged);
}

/** Surface that groups related content. Compose with CardHeader, CardTitle, CardDescription, CardContent and CardFooter. */
export function Card({ interactive, tone, surface, render, className, ...props }: CardProps) {
  return renderAs('div', render, {
      ...props,
      'data-interactive': interactive || undefined,
      // only set when the prop is given, so an app's own data-tone / data-surface passes through
      ...(tone && !surface && { 'data-tone': tone }),
      ...(surface && { 'data-surface': surface }),
      ...(surface === 'ink' && { 'data-theme': 'dark' }),
      className: cx('cs-card', className),
  });
}

export type CardHeaderProps = ComponentProps<'div'>;
export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div {...props} className={cx('cs-card-header', className)} />;
}

export type CardTitleProps = useRender.ComponentProps<'h3'>;
/** An `h3` by default. Pick the level that fits the page outline with `render={<h2 />}`. */
export function CardTitle({ render, className, ...props }: CardTitleProps) {
  return renderAs('h3', render, { ...props, className: cx('cs-card-title', className) });
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
