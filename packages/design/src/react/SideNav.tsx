import { useRender } from '@base-ui/react/use-render';
import { mergeProps } from '@base-ui/react/merge-props';
import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export type SideNavProps = HTMLAttributes<HTMLElement> & {
  className?: string;
  /** Accessible name of the landmark, e.g. "Main" / "Chính". */
  label: string;
};

/** Vertical app navigation. Holds `SideNavItem`s and `SideNavGroup`s. */
export function SideNav({ label, className, children, ...props }: SideNavProps) {
  return (
    <nav aria-label={label} {...props} className={cx('cs-side-nav', className)}>
      <ul className="cs-side-nav-list">{children}</ul>
    </nav>
  );
}

export type SideNavGroupProps = HTMLAttributes<HTMLLIElement> & {
  className?: string;
  /** Visible heading of the section; also names its list for screen readers. */
  label: ReactNode;
};

export function SideNavGroup({ label, className, children, ...props }: SideNavGroupProps) {
  const id = useId();
  return (
    <li {...props} className={cx('cs-side-nav-group', className)}>
      <span id={id} className="cs-side-nav-group-label">{label}</span>
      <ul className="cs-side-nav-list" aria-labelledby={id}>{children}</ul>
    </li>
  );
}

export type SideNavItemProps = useRender.ComponentProps<'a'> & {
  className?: string;
  /** Icon before the label (decorative). */
  icon?: ReactNode;
  /** The current page: sets `aria-current="page"` and the highlighted style. */
  active?: boolean;
  /**
   * Plain text after the label, e.g. `12` or "New". It renders inside the link, so it is read as part of the
   * link's accessible name ("Conversations 12"): pass text, not a `Badge`, icon or anything interactive.
   */
  badge?: ReactNode;
};

/** A link in the side nav. Renders an `<a>`; pass `render={<Link href="/agents" />}` for a router link. */
export function SideNavItem({ icon, active, badge, render, ref, className, children, ...props }: SideNavItemProps) {
  const element = useRender({
    defaultTagName: 'a',
    render,
    ref,
    props: mergeProps<'a'>(
      {
        className: cx('cs-side-nav-item', className),
        'aria-current': active ? 'page' : undefined,
        children: (
          <>
            {icon && <span className="cs-side-nav-icon" aria-hidden="true">{icon}</span>}
            <span className="cs-side-nav-label">{children}</span>
            {badge != null && <span className="cs-side-nav-badge">{badge}</span>}
          </>
        ),
      },
      props,
    ),
  });
  return <li>{element}</li>;
}
