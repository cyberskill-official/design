import { cloneElement, type ComponentProps, type CSSProperties, type ReactElement } from 'react';
import { cx } from '../utils/cx';

type RenderElement = ReactElement<{ className?: string; style?: CSSProperties }>;

/** `render` without a hook (this file stays a Server Component): the element keeps its own props, ours are merged in. */
function renderAs(render: RenderElement | undefined, props: ComponentProps<'div'>) {
  if (!render) return <div {...props} />;
  const own = render.props;
  return cloneElement(render, { ...props, className: cx(own.className, props.className), style: { ...own.style, ...props.style } });
}

export type RevealProps = ComponentProps<'div'> & {
  /** Extra wait before it starts, in milliseconds. Added to its Stagger step. */
  delay?: number;
  /** Another element instead of the `div`, e.g. `<li />` inside a Stagger list or `<section />`. */
  render?: RenderElement;
};

/**
 * Fades its content in and lifts it 8px, once, when it first appears (the `reveal` recipe). Plain CSS: it works in
 * Server Components and without JavaScript, and hydration never restarts it. With reduced motion it appears at once.
 */
export function Reveal({ delay, render, className, style, ...props }: RevealProps) {
  const timing = delay ? ({ '--_reveal-delay': `${delay}ms` } as CSSProperties) : undefined;
  return renderAs(render, { ...props, className: cx('cs-reveal', className), style: { ...timing, ...style } });
}

export type StaggerProps = ComponentProps<'div'> & {
  /** Another element instead of the `div`, e.g. `<ul />` with `<Reveal render={<li />}>` items. */
  render?: RenderElement;
};

/**
 * Reveals its `Reveal` children one after another, 40ms apart. From the seventh on they appear with the sixth, so a
 * long list never keeps the reader waiting. With reduced motion they appear together, at once.
 */
export function Stagger({ render, className, ...props }: StaggerProps) {
  return renderAs(render, { ...props, className: cx('cs-stagger', className) });
}
