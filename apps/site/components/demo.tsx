'use client';
import { ThemeScope } from '@cyberskill/design';
import { useState, type ReactNode } from 'react';

type Layout = 'row' | 'stack' | 'center' | 'block';

/**
 * Live example frame. The stage carries its own data-theme, so any component
 * can be checked in light and dark without switching the whole site.
 */
export function Demo({ children, title = 'Example', layout = 'row' }: { children: ReactNode; title?: string; layout?: Layout }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <figure className="demo not-prose">
      <figcaption className="demo-bar">
        <span>{title}</span>
        <span className="demo-theme" role="group" aria-label="Example theme">
          {(['light', 'dark'] as const).map((t) => (
            <button key={t} type="button" aria-pressed={theme === t} onClick={() => setTheme(t)}>
              {t === 'light' ? 'Light' : 'Dark'}
            </button>
          ))}
        </span>
      </figcaption>
      {/* ThemeScope also themes the menus, selects and dialogs opened from the example */}
      <ThemeScope theme={theme} className="demo-stage" data-layout={layout}>
        {children}
      </ThemeScope>
    </figure>
  );
}
