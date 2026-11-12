import type { ComponentProps } from 'react';
import { cx } from '../utils/cx';

export type ProseProps = ComponentProps<'div'> & {
  /** `md` (default) for docs and long answers, `sm` for chat bubbles and side panels. */
  size?: 'sm' | 'md';
};

/**
 * Styles raw HTML or rendered Markdown (headings, lists, quotes, code, tables, images) with the house type and tokens.
 * No hooks, so it renders in Server Components. Pass trusted or sanitised HTML only.
 */
export function Prose({ size = 'md', className, ...props }: ProseProps) {
  return <div {...props} data-size={size} className={cx('cs-prose', className)} />;
}
