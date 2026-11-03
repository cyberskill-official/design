import React, { useEffect, useRef } from 'react';

function syncIframeAxes(iframe) {
  if (!iframe || typeof document === 'undefined') return;
  try {
    const hostRoot = document.documentElement;
    const doc = iframe.contentDocument;
    const root = doc && doc.documentElement;
    if (!root) return;
    const theme = hostRoot.getAttribute('data-theme') || 'light';
    const element = hostRoot.getAttribute('data-cs-element') || 'tho';
    const variant = hostRoot.getAttribute('data-cs-variant') || '';
    const style = hostRoot.getAttribute('data-cs-style') || 'liquid-glass';
    const density = hostRoot.getAttribute('data-cs-density') || 'comfortable';
    const contrast = hostRoot.getAttribute('data-cs-contrast') || 'standard';
    const lang = hostRoot.getAttribute('lang') || 'vi';
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-cs-element', element);
    if (variant) root.setAttribute('data-cs-variant', variant);
    else root.removeAttribute('data-cs-variant');
    root.setAttribute('data-cs-style', style);
    root.setAttribute('data-cs-density', density);
    root.setAttribute('data-cs-contrast', contrast);
    root.setAttribute('lang', lang);
    const w = iframe.contentWindow;
    if (w && w.__dcSetProps && w.__dcRootName) {
      const r = w.__dcRootName();
      if (r) {
        const language = lang === 'vi' ? 'Tiếng Việt' : lang === 'ja' ? '日本語' : 'English';
        w.__dcSetProps(r, { theme, element, language });
      }
    }
  } catch (e) {
    /* cross-origin or unmounted iframe */
  }
}

/**
 * Host helper: iframe a portable HTML surface from the repo tree.
 * Paths are site-root absolute so they work when Storybook is served at `/`
 * (production + `build:site`) and via staticDirs during `npm run storybook`.
 */
export function IframeSurface({ src, title, fullBleed }) {
  const ref = useRef(null);
  const height = fullBleed ? '100vh' : 'calc(100vh - 2rem)';
  useEffect(() => {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return undefined;
    syncIframeAxes(ref.current);
    const observer = new MutationObserver(() => syncIframeAxes(ref.current));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [
        'data-theme',
        'data-cs-element',
        'data-cs-variant',
        'data-cs-style',
        'data-cs-density',
        'data-cs-contrast',
        'lang',
      ],
    });
    return () => observer.disconnect();
  }, [src]);
  return (
    <iframe
      ref={ref}
      src={src}
      title={title || src}
      onLoad={(e) => syncIframeAxes(e.currentTarget)}
      style={{
        width: '100%',
        height,
        minHeight: fullBleed ? '100vh' : 640,
        border: 0,
        borderRadius: fullBleed ? 0 : 8,
        display: 'block',
        background: 'var(--cs-color-surface-page, #fffdf8)',
      }}
    />
  );
}
