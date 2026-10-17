import { useClientLayoutEffect } from './use-client-layout-effect.js';

// Constrain an anchored panel without transforms, which retain the original
// layout overflow even when their painted contents move into the viewport.
export function useViewportPanel(panelRef, enabled, identity = enabled) {
  useClientLayoutEffect(() => {
    if (!enabled || !panelRef.current) return;
    const panel = panelRef.current;
    const position = () => {
      const width = document.documentElement.clientWidth;
      panel.style.setProperty('--_cs-panel-max-inline-size', Math.max(0, width - 16) + 'px');
      panel.style.setProperty('--_cs-panel-inline-offset', '0px');
      const box = panel.getBoundingClientRect();
      const left = Math.max(8, Math.min(box.left, width - 8 - box.width));
      const sign = getComputedStyle(panel).direction === 'rtl' ? -1 : 1;
      panel.style.setProperty('--_cs-panel-inline-offset', sign * (left - box.left) + 'px');
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(panel);
    if (panel.parentElement) observer.observe(panel.parentElement);
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    };
  }, [panelRef, enabled, identity]);
}
