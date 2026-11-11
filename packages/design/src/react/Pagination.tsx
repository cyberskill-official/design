import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import type { HTMLAttributes } from 'react';
import { cx } from '../utils/cx';

export type PaginationProps = Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
  className?: string;
  /** Current page, starting at 1. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one before an ellipsis. */
  siblings?: number;
  /** Accessible name of the landmark. */
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
  /** Accessible name of each page button, e.g. `(n) => \`Trang ${n}\``. */
  pageLabel?: (page: number) => string;
};

/** First and last page, the current page with `siblings` on each side, ellipses for the rest. Same length on every page, so nothing jumps. */
export function pageItems(page: number, count: number, siblings = 1): (number | 'ellipsis')[] {
  const range = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i);
  if (count <= siblings * 2 + 5) return range(1, count);
  const start = Math.max(Math.min(page - siblings, count - siblings * 2 - 2), 3);
  const end = Math.min(Math.max(page + siblings, siblings * 2 + 3), count - 2);
  return [1, start > 3 ? 'ellipsis' : 2, ...range(start, end), end < count - 2 ? 'ellipsis' : count - 1, count];
}

/** Moves through pages of a list or table. Page buttons are 32px with a 44px tall touch area. */
export function Pagination({ page, pageCount, onPageChange, siblings = 1, label = 'Pagination', previousLabel = 'Previous page', nextLabel = 'Next page', pageLabel = n => `Page ${n}`, className, ...props }: PaginationProps) {
  return (
    <nav aria-label={label} {...props} className={cx('cs-pagination', className)}>
      <ul className="cs-pagination-list">
        <li>
          <button type="button" className="cs-pagination-button" aria-label={previousLabel} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <CaretLeft aria-hidden="true" />
          </button>
        </li>
        {pageItems(page, pageCount, siblings).map((item, i) => (
          <li key={item === 'ellipsis' ? `e${i}` : item}>
            {item === 'ellipsis' ? (
              <span className="cs-pagination-ellipsis" aria-hidden="true">…</span>
            ) : (
              <button type="button" className="cs-pagination-button" aria-label={pageLabel(item)} aria-current={item === page ? 'page' : undefined} onClick={() => onPageChange(item)}>
                {item}
              </button>
            )}
          </li>
        ))}
        <li>
          <button type="button" className="cs-pagination-button" aria-label={nextLabel} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
            <CaretRight aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
