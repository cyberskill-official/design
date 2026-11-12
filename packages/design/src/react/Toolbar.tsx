import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ReactNode } from 'react';
import { cx } from '../utils/cx';

export type ToolbarProps = Omit<BaseToolbar.Root.Props, 'className'> & { className?: string };
/** A row (or column) of related controls that is one Tab stop; arrow keys move between items. Name it with `aria-label`. */
export function Toolbar({ className, ...props }: ToolbarProps) {
  return <BaseToolbar.Root {...props} className={cx('cs-toolbar', className)} />;
}

export type ToolbarButtonProps = Omit<BaseToolbar.Button.Props, 'className'> & {
  className?: string;
  /** Icon before the text, or the only content when the button has no children (decorative). */
  icon?: ReactNode;
  /** Accessible name. Required for icon-only buttons, e.g. "Bold" / "In đậm". */
  label?: string;
};

/** A toolbar button. Pass `icon` + `label` for icon-only, `aria-pressed` for toggles, or `render` to make it a menu or dialog trigger. */
export function ToolbarButton({ icon, label, className, children, ...props }: ToolbarButtonProps) {
  return (
    <BaseToolbar.Button aria-label={label} {...props} data-icon-only={children == null || undefined} className={cx('cs-toolbar-button', className)}>
      {icon && <span className="cs-toolbar-icon" aria-hidden="true">{icon}</span>}
      {children}
    </BaseToolbar.Button>
  );
}

export type ToolbarLinkProps = Omit<BaseToolbar.Link.Props, 'className'> & { className?: string };
/** A link inside the toolbar that joins its arrow-key navigation. */
export function ToolbarLink({ className, ...props }: ToolbarLinkProps) {
  return <BaseToolbar.Link {...props} className={cx('cs-toolbar-link', className)} />;
}

export type ToolbarGroupProps = Omit<BaseToolbar.Group.Props, 'className'> & { className?: string };
/** Groups related items (e.g. text styles). `disabled` disables the whole group. */
export function ToolbarGroup({ className, ...props }: ToolbarGroupProps) {
  return <BaseToolbar.Group {...props} className={cx('cs-toolbar-group', className)} />;
}

export type ToolbarSeparatorProps = Omit<BaseToolbar.Separator.Props, 'className'> & { className?: string };
/** A line between groups, perpendicular to the toolbar. */
export function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  return <BaseToolbar.Separator {...props} className={cx('cs-toolbar-separator', className)} />;
}
