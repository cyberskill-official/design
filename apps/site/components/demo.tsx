'use client';
import { ThemeScope } from '@cyberskill/design';
import { useEffect, useState, type ReactNode } from 'react';

type Layout = 'row' | 'stack' | 'center' | 'block';
type Theme = 'light' | 'dark';

/** The site's current theme, kept in sync with the theme toggle. `null` until mounted. */
function useSiteTheme(): Theme | null {
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    const html = document.documentElement;
    const read = () => setTheme(html.classList.contains('dark') || html.dataset.theme === 'dark' ? 'dark' : 'light');
    read();
    const watch = new MutationObserver(read);
    watch.observe(html, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => watch.disconnect();
  }, []);
  return theme;
}

/**
 * Live example frame. It follows the site theme until the reader picks Light or Dark for this example;
 * then the stage carries its own theme, popups included.
 */
export function Demo({ children, title = 'Example', layout = 'row' }: { children: ReactNode; title?: string; layout?: Layout }) {
  const [override, setOverride] = useState<Theme | null>(null);
  const site = useSiteTheme();
  const shown = override ?? site;
  return (
    <figure className="demo not-prose">
      <figcaption className="demo-bar">
        <span>{title}</span>
        <span className="demo-theme" role="group" aria-label="Example theme">
          {(['light', 'dark'] as const).map((t) => (
            <button key={t} type="button" aria-pressed={shown === t} onClick={() => setOverride(t)}>
              {t === 'light' ? 'Light' : 'Dark'}
            </button>
          ))}
        </span>
      </figcaption>
      {override ? (
        // ThemeScope also themes the menus, selects and dialogs opened from the example
        <ThemeScope theme={override} className="demo-stage" data-layout={layout}>
          {children}
        </ThemeScope>
      ) : (
        // no theme of its own: inherits the site's, and popups in <body> do too, so nothing flashes on load
        <div className="demo-stage" data-layout={layout}>
          {children}
        </div>
      )}
    </figure>
  );
}
