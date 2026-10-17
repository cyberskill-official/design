import React from "react";
import { useClientLayoutEffect } from "./use-client-layout-effect.js";

/** Internal material backing; content keeps its original DOM language/token scope. */
export function overlaySurfaceClass(className) {
  const classes = new Set(String(className || "").split(/\s+/));
  // Match stylesheet precedence, including opaque overrides of filtered materials.
  return ["cs-surface-matte", "cs-surface-solid", "cs-surface-heavy", "cs-surface-standard", "cs-glass-card", "cs-surface-light", "cs-surface-whisper"]
    .find(name => classes.has(name)) || "";
}

/** Keep backdrop filters outside modal content, including throughout entrance/scroll. */
export function useOverlaySurface(open, panelRef, material) {
  const surfaceRef = React.useRef(null);
  useClientLayoutEffect(() => {
    const panel = panelRef.current, surface = surfaceRef.current;
    if (!open || !material || !panel || !surface) return undefined;
    // SSR and the pre-hydration first paint keep the ordinary material fallback.
    panel.setAttribute("data-cs-overlay-surface-ready", "");
    let frame = 0, disposed = false;
    const update = () => {
      if (disposed) return;
      const css = getComputedStyle(panel), rect = panel.getBoundingClientRect();
      // Copy resolved inherited tokens, including overrides placed on the panel.
      for (const name of css) if (name.startsWith("--cs-")) surface.style.setProperty(name, css.getPropertyValue(name));
      surface.style.position = css.position === "fixed" ? "fixed" : "absolute";
      const parent = surface.offsetParent;
      const origin = surface.style.position === "absolute" && parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };
      surface.style.left = `${rect.left - origin.left - (parent?.clientLeft || 0) + (parent?.scrollLeft || 0)}px`;
      surface.style.top = `${rect.top - origin.top - (parent?.clientTop || 0) + (parent?.scrollTop || 0)}px`;
      surface.style.width = `${rect.width}px`;
      surface.style.height = `${rect.height}px`;
      surface.style.borderRadius = css.borderRadius;
      surface.style.zIndex = css.zIndex;
      surface.style.opacity = css.opacity;
      if (panel.getAnimations().some(animation => animation.playState === "running") && !frame)
        frame = requestAnimationFrame(() => { frame = 0; update(); });
    };
    update();
    const resize = new ResizeObserver(update);
    resize.observe(panel);
    const mutation = new MutationObserver(update);
    for (let ancestor = panel; ancestor; ancestor = ancestor.parentElement)
      mutation.observe(ancestor, { attributes: true });
    const preferences = ["prefers-color-scheme: dark", "prefers-reduced-transparency: reduce", "forced-colors: active", "prefers-contrast: more"]
      .map(query => matchMedia(`(${query})`));
    for (const preference of preferences) preference.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect(); mutation.disconnect();
      for (const preference of preferences) preference.removeEventListener("change", update);
      window.removeEventListener("resize", update);
      panel.removeAttribute("data-cs-overlay-surface-ready");
    };
  }, [open, panelRef, material]);
  return surfaceRef;
}
