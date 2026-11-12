import { useLayoutEffect, useRef, useState, type ComponentProps } from 'react';
import { cx } from '../utils/cx';

export type TableProps = ComponentProps<'table'> & {
  /** Row height: `comfortable` (default) or `compact` for dense data. */
  density?: 'comfortable' | 'compact';
  /** Alternate row backgrounds. */
  striped?: boolean;
  /** Keep the header row visible while the body scrolls. Needs `maxHeight`. */
  stickyHeader?: boolean;
  /** Max height of the scroll container, e.g. `360` or `'50vh'`. */
  maxHeight?: number | string;
};

/** Static, styled data table inside a scroll container (wide tables scroll sideways on narrow screens). */
export function Table({ density = 'comfortable', striped, stickyHeader, maxHeight, className, ...props }: TableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);
  // Only an overflowing container joins the Tab order, so keyboard users can scroll it.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setScrollable(el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight);
    check(); // before paint, so the first frame is already reachable
    const observer = new ResizeObserver(check);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={scrollRef} className="cs-table-scroll" style={maxHeight != null ? { maxHeight } : undefined} tabIndex={scrollable ? 0 : undefined}>
      <table {...props} data-density={density} data-striped={striped || undefined} data-sticky-header={stickyHeader || undefined} className={cx('cs-table', className)} />
    </div>
  );
}

export type TableCaptionProps = ComponentProps<'caption'>;
/** Names the table for screen readers. Hide it visually with `className="cs-visually-hidden"` if a heading already shows. */
export function TableCaption({ className, ...props }: TableCaptionProps) {
  return <caption {...props} className={cx('cs-table-caption', className)} />;
}

export type TableHeaderProps = ComponentProps<'thead'>;
export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead {...props} className={cx('cs-table-header', className)} />;
}

export type TableBodyProps = ComponentProps<'tbody'>;
export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody {...props} className={cx('cs-table-body', className)} />;
}

export type TableRowProps = ComponentProps<'tr'> & {
  /** Highlights the row. Also show selection in text or a checkbox: the highlight alone is not announced. */
  selected?: boolean;
};
export function TableRow({ selected, className, ...props }: TableRowProps) {
  return <tr {...props} data-selected={selected || undefined} className={cx('cs-table-row', className)} />;
}

type CellAlign = { align?: 'start' | 'center' | 'end'; numeric?: boolean };

export type TableHeadProps = Omit<ComponentProps<'th'>, 'align'> & CellAlign;
/** Header cell. `scope="col"` by default; pass `scope="row"` for row headers in the body. */
export function TableHead({ align, numeric, scope = 'col', className, ...props }: TableHeadProps) {
  return <th {...props} scope={scope} data-align={align ?? (numeric ? 'end' : undefined)} data-numeric={numeric || undefined} className={cx('cs-table-head', className)} />;
}

export type TableCellProps = Omit<ComponentProps<'td'>, 'align'> & CellAlign;
/** Body cell. `numeric` right-aligns with tabular mono figures so columns line up. */
export function TableCell({ align, numeric, className, ...props }: TableCellProps) {
  return <td {...props} data-align={align ?? (numeric ? 'end' : undefined)} data-numeric={numeric || undefined} className={cx('cs-table-cell', className)} />;
}
