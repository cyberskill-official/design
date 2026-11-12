import { createContext, useContext, useEffect, useState, type ElementType, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export type Theme = 'light' | 'dark' | 'system';

// undefined: no ThemeScope above (portal to body). null: inside one, host not created yet (Base UI waits, so no flash in the wrong theme).
const PortalHost = createContext<HTMLElement | null | undefined>(undefined);

export type ThemeScopeProps = React.HTMLAttributes<HTMLDivElement> & {
  /** `light`, `dark`, or `system` (follows the operating system). */
  theme: Theme;
  className?: string;
};

/**
 * Applies a theme to one part of the page, including every menu, select, tooltip, popover and dialog
 * opened from inside it (they render outside the DOM tree, so `data-theme` alone can't reach them).
 * Not needed for a page-wide theme: put `data-theme` on `<html>` instead.
 */
export function ThemeScope({ theme, className, children, ...props }: ThemeScopeProps) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'cs-portal-host';
    document.body.appendChild(el);
    setHost(el);
    return () => el.remove();
  }, []);
  useEffect(() => {
    host?.setAttribute('data-theme', theme);
  }, [host, theme]);
  return (
    <PortalHost.Provider value={host}>
      <div {...props} data-theme={theme} className={cx('cs-theme-scope', className)}>
        {children}
      </div>
    </PortalHost.Provider>
  );
}

/** The element popups should render into: the nearest ThemeScope's host, `null` while it is being created, or `undefined` outside any ThemeScope (document.body). */
export function usePortalContainer(): HTMLElement | null | undefined {
  return useContext(PortalHost);
}

/** Internal: renders a Base UI `*.Portal` part into the nearest ThemeScope host when there is one. */
export function ThemedPortal({ part: Part, ...props }: { part: ElementType; children?: ReactNode; [prop: string]: unknown }) {
  const container = usePortalContainer();
  return <Part {...props} {...(container === undefined ? {} : { container })} />;
}
