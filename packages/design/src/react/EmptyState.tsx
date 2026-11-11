import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../utils/cx';

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  className?: string;
  /** Phosphor icon shown in a tile above the title (decorative). */
  icon?: ReactNode;
  /** What is empty, e.g. "No projects yet". */
  title: ReactNode;
  /** Why, and what to do next. */
  description?: ReactNode;
  /** Next step, usually one Button (add a secondary one if needed). */
  action?: ReactNode;
  /** `sm` inside cards and tables, `md` in a section, `lg` for a whole page. */
  size?: 'sm' | 'md' | 'lg';
  /** Heading level of the title so it fits the page outline. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

/** Fills a list, table or page that has nothing to show yet, and points to the next step. */
export function EmptyState({ icon, title, description, action, size = 'md', headingLevel = 3, className, ...props }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <div {...props} data-size={size} className={cx('cs-empty-state', className)}>
      {icon && <span className="cs-empty-state-icon" aria-hidden="true">{icon}</span>}
      <Heading className="cs-empty-state-title">{title}</Heading>
      {description != null && <p className="cs-empty-state-description">{description}</p>}
      {action != null && <div className="cs-empty-state-actions">{action}</div>}
    </div>
  );
}
