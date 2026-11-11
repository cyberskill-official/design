import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  /** CSS width; numbers are px. Default fills the container. */
  width?: CSSProperties['width'];
  /** CSS height; numbers are px. Default 16px. */
  height?: CSSProperties['height'];
  /** Corner radius token. Use `full` for avatars and pills. */
  radius?: 'sm' | 'md' | 'lg' | 'full';
};

/**
 * Placeholder block shaped like the content that is loading. Hidden from screen readers:
 * put one visually hidden status message (e.g. "Loading projects") on the container instead.
 */
export function Skeleton({ width, height, radius = 'md', className, style, ...props }: SkeletonProps) {
  return <div aria-hidden="true" {...props} data-radius={radius} style={{ width, height, ...style }} className={cx('cs-skeleton', className)} />;
}

export type SkeletonTextProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  /** Number of lines; the last one is shorter, like a paragraph. */
  lines?: number;
};

/** Paragraph placeholder: `lines` bars at body-text rhythm. Hidden from screen readers like `Skeleton`. */
export function SkeletonText({ lines = 3, className, ...props }: SkeletonTextProps) {
  return (
    <div aria-hidden="true" {...props} className={cx('cs-skeleton-text', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="cs-skeleton" data-radius="sm" />
      ))}
    </div>
  );
}
