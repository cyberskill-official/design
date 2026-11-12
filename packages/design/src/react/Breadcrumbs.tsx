import { CaretRight } from '@phosphor-icons/react';
import { Children, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export type BreadcrumbItem = { label: ReactNode; href?: string };

export type BreadcrumbsProps = HTMLAttributes<HTMLElement> & {
  className?: string;
  /** The trail from the top level to the current page. The last item is the current page. */
  items?: BreadcrumbItem[];
  /** Instead of `items`: your own links (e.g. Next.js `Link`), one per crumb. Put `aria-current="page"` on the last. */
  children?: ReactNode;
  /** Accessible name of the landmark. Pass "Đường dẫn" in Vietnamese UIs. */
  label?: string;
};

/** Shows where the current page sits in the hierarchy. Each crumb links up; the last one is the current page. */
export function Breadcrumbs({ items, children, label = 'Breadcrumb', className, ...props }: BreadcrumbsProps) {
  const crumbs = items
    ? items.map((item, i) => {
        const current = i === items.length - 1;
        return item.href
          ? <a href={item.href} aria-current={current ? 'page' : undefined}>{item.label}</a>
          : <span aria-current={current ? 'page' : undefined}>{item.label}</span>;
      })
    : Children.toArray(children);
  return (
    <nav aria-label={label} {...props} className={cx('cs-breadcrumbs', className)}>
      <ol className="cs-breadcrumbs-list">
        {crumbs.map((crumb, i) => (
          <li key={i} className="cs-breadcrumbs-item">
            {i > 0 && <CaretRight className="cs-breadcrumbs-separator" aria-hidden="true" />}
            {crumb}
          </li>
        ))}
      </ol>
    </nav>
  );
}
