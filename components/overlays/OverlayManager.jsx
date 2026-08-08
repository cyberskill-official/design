import React from "react";

/** Shared focusable selector for modal traps (Dialog / AlertDialog / Drawer / CommandPalette). */
export const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "audio[controls]",
  "video[controls]",
  "summary",
  "iframe",
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Attach Tab wrap + Escape (optional) to a panel. Returns cleanup.
 * Prefer registering Escape via the overlay manager so nested modals stack correctly.
 */
export function attachFocusTrap(panelEl, { handleEscape = false, onEscape } = {}) {
  if (!panelEl) return () => {};
  const focusables = () => [...panelEl.querySelectorAll(focusableSelector)];
  const k = (e) => {
    if (handleEscape && e.key === "Escape") {
      onEscape && onEscape();
      return;
    }
    if (e.key !== "Tab") return;
    const f = focusables();
    if (!f.length) {
      e.preventDefault();
      panelEl.focus();
      return;
    }
    const a = f[0];
    const z = f[f.length - 1];
    const active = document.activeElement;
    const inside = panelEl.contains(active);
    if (e.shiftKey && (!inside || active === a)) {
      e.preventDefault();
      z.focus();
    } else if (!e.shiftKey && (!inside || active === z)) {
      e.preventDefault();
      a.focus();
    }
  };
  document.addEventListener("keydown", k);
  return () => document.removeEventListener("keydown", k);
}

function createOverlayManager() {
  const layers = [];
  let prevOverflow = "";
  let locked = false;
  let escapeBound = false;

  /** Innermost panel last — React child effects run before parents, so push-order alone is wrong. */
  const resort = () => {
    layers.sort((a, b) => {
      const pa = a.panelEl;
      const pb = b.panelEl;
      if (pa && pb && pa !== pb) {
        if (pa.contains(pb)) return -1; // a outer → below
        if (pb.contains(pa)) return 1;
      }
      return (a.seq || 0) - (b.seq || 0);
    });
  };

  const applyScroll = () => {
    const need = layers.some((l) => l.kind === "modal" && l.lockScroll !== false);
    if (need && !locked) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      locked = true;
    } else if (!need && locked) {
      document.body.style.overflow = prevOverflow;
      locked = false;
    }
  };

  const onDocEscape = (e) => {
    if (e.key !== "Escape") return;
    if (!layers.length) return;
    resort();
    const top = layers[layers.length - 1];
    if (!top || typeof top.onEscape !== "function") return;
    // Registered overlays (modals) always own Escape while on the stack.
    // Menu/Popover/etc. are not registered here — they keep their own listeners.
    e.preventDefault();
    e.stopPropagation();
    top.onEscape();
  };

  const ensureEscape = () => {
    if (escapeBound) return;
    escapeBound = true;
    document.addEventListener("keydown", onDocEscape, true);
  };

  let seq = 0;
  return {
    register(layer) {
      ensureEscape();
      const id = layer.id || `cs-ov-${++seq}`;
      const entry = { ...layer, id, seq: ++seq };
      layers.push(entry);
      resort();
      applyScroll();
      return () => {
        resort();
        const i = layers.findIndex((l) => l.id === id);
        const wasTop = i === layers.length - 1;
        if (i >= 0) layers.splice(i, 1);
        applyScroll();
        if (wasTop && entry.restoreEl && typeof entry.restoreEl.focus === "function") {
          try {
            entry.restoreEl.focus();
          } catch {
            /* ignore */
          }
        }
      };
    },
    top() {
      resort();
      return layers[layers.length - 1] || null;
    },
    get scrollLocked() {
      return locked;
    },
    get depth() {
      return layers.length;
    },
  };
}

const defaultManager = createOverlayManager();
const OverlayContext = React.createContext(null);

/** Return the active manager (context or module singleton). */
export function getOverlayManager() {
  return defaultManager;
}

/**
 * Optional provider — mounts `#cs-overlay-root` for portals and supplies a
 * dedicated manager instance. When omitted, components use the module singleton.
 */
export function OverlayProvider({ children }) {
  const api = React.useMemo(() => createOverlayManager(), []);
  return (
    <OverlayContext.Provider value={api}>
      <div id="cs-overlay-root" data-cs-overlay-root="" />
      {children}
    </OverlayContext.Provider>
  );
}

/**
 * Register an overlay layer while `open` is true. Owns Escape (topmost only)
 * and modal scroll-lock refcount. Tab trap is attached when `trapFocus` + `panelRef`.
 */
export function useOverlayLayer({
  open,
  kind = "modal",
  trapFocus = false,
  lockScroll,
  onEscape,
  panelRef,
  preferFocusSelector,
}) {
  const ctx = React.useContext(OverlayContext);
  const mgr = ctx || defaultManager;
  const escapeRef = React.useRef(onEscape);
  escapeRef.current = onEscape;

  React.useLayoutEffect(() => {
    if (!open) return undefined;
    const restoreEl = typeof document !== "undefined" ? document.activeElement : null;
    const panel = panelRef && panelRef.current;
    const unregister = mgr.register({
      kind,
      lockScroll: lockScroll != null ? lockScroll : kind === "modal",
      onEscape: () => escapeRef.current && escapeRef.current(),
      restoreEl,
      panelEl: panel || null,
    });

    // Only the innermost (top) layer should move focus / trap Tab — outer parents
    // run layout effects after children and must not steal focus from nested alerts.
    let detachTrap = () => {};
    const top = mgr.top();
    const isTop = top && top.panelEl === panel;
    if (trapFocus && panel && isTop) {
      const preferred =
        (preferFocusSelector && panel.querySelector(preferFocusSelector)) ||
        panel.querySelector(focusableSelector) ||
        panel;
      preferred && preferred.focus && preferred.focus();
      detachTrap = attachFocusTrap(panel, { handleEscape: false });
    }

    return () => {
      detachTrap();
      unregister();
    };
  }, [open, kind, trapFocus, lockScroll, mgr, panelRef, preferFocusSelector]);

  return { manager: mgr };
}
