import React from "react";
import { useClientLayoutEffect } from "../_utils/use-client-layout-effect.js";

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

function visibleFocusables(roots) {
  return [...new Set(roots.flatMap((root) => [...root.querySelectorAll(focusableSelector)]))].filter((el) =>
    el.tabIndex >= 0 && !el.disabled && !el.closest('[inert], [hidden], [aria-hidden="true"]') &&
    el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden");
}

/** Tab wrapping and focus containment for an active modal and its registered portals. */
export function attachFocusTrap(panelEl, { handleEscape = false, onEscape, isActive = () => true, scopeElements = () => [panelEl] } = {}) {
  if (!panelEl) return () => {};
  const inside = (el) => scopeElements().some((root) => root?.contains(el));
  const focusables = () => visibleFocusables(scopeElements());
  const focusFirst = () => (focusables()[0] || panelEl).focus();
  const onFocus = (e) => { if (isActive() && !inside(e.target)) focusFirst(); };
  const k = (e) => {
    if (!isActive() || e.isComposing || e.keyCode === 229) return;
    if (handleEscape && e.key === "Escape" && !e.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      onEscape && onEscape();
      return;
    }
    if (e.key !== "Tab") return;
    const f = focusables();
    if (!f.length) { e.preventDefault(); panelEl.focus(); return; }
    const active = document.activeElement;
    // Own intermediate movement too: WebKit can leave focus on body when
    // reverse-tabbing from a link to a button under its native tab preference.
    if (e.defaultPrevented) return;
    const index = f.indexOf(active);
    const next = index < 0 ? (e.shiftKey ? f.length - 1 : 0)
      : (index + (e.shiftKey ? -1 : 1) + f.length) % f.length;
    e.preventDefault();
    f[next].focus();
  };
  document.addEventListener("keydown", k);
  document.addEventListener("focusin", onFocus);
  return () => { document.removeEventListener("keydown", k); document.removeEventListener("focusin", onFocus); };
}

function createOverlayManager() {
  const layers = [];
  let prevOverflow = "";
  let locked = false;
  let escapeBound = false;
  const inertBefore = new Map();
  const ownedScopes = new Set();
  let observer = null;

  const isBelow = (a, b, visited = new Set()) => {
    if (!a.panelEl || !b.panelEl || a === b || visited.has(b)) return false;
    if (a.panelEl.contains(b.panelEl)) return true;
    visited.add(b);
    const parentEl = b.parentRef?.current || b.parentEl;
    if (parentEl && a.panelEl.contains(parentEl)) return true;
    const parent = layers.find((layer) => layer.panelEl === parentEl);
    return parent ? isBelow(a, parent, visited) : false;
  };

  /** Innermost panel last — React child effects run before parents, so push-order alone is wrong. */
  const resort = () => {
    layers.sort((a, b) => {
      if (isBelow(a, b)) return -1;
      if (isBelow(b, a)) return 1;
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

  const activeModal = () => {
    resort();
    return [...layers].reverse().find((layer) => layer.kind === "modal" && layer.panelEl?.isConnected) || null;
  };
  const focusScope = () => {
    const modal = activeModal();
    if (!modal) return [];
    const roots = [...new Set([...layers.slice(layers.indexOf(modal)), ...layers.filter((layer) => layer.kind === "toast")].map((layer) => layer.panelEl).filter((el) => el?.isConnected))];
    // Closed portal triggers still belong to their modal even when no dismissible layer is open.
    let added = true;
    while (added) {
      added = false;
      for (const scope of ownedScopes) {
        if (scope.panelEl?.isConnected && !roots.includes(scope.panelEl) && roots.some((root) => root.contains(scope.parentEl))) {
          roots.push(scope.panelEl); added = true;
        }
      }
    }
    return roots;
  };
  const applyInert = () => {
    const modal = activeModal();
    const blocked = new Set();
    if (modal) {
      const allowed = [...focusScope(), modal.backdropEl].filter((el) => el?.isConnected);
      const walk = (parent) => {
        for (const el of parent.children) {
          if (allowed.includes(el)) continue;
          if (allowed.some((root) => el.contains(root))) walk(el);
          else blocked.add(el);
        }
      };
      walk(document.body);
    }
    for (const [el, prior] of inertBefore) {
      if (!blocked.has(el)) { el.inert = prior; inertBefore.delete(el); }
    }
    for (const el of blocked) {
      if (!inertBefore.has(el)) inertBefore.set(el, el.inert);
      el.inert = true;
    }
    if (modal && !observer) {
      observer = new MutationObserver(applyInert);
      observer.observe(document.body, { childList: true, subtree: true });
    } else if (!modal && observer) { observer.disconnect(); observer = null; }
  };

  const onDocEscape = (e) => {
    if (e.key !== "Escape" || e.isComposing || e.keyCode === 229) return;
    if (!layers.length) return;
    resort();
    const top = [...layers].reverse().find((layer) => layer.kind !== "toast");
    if (!top || typeof top.onEscape !== "function") return;
    // One stack owns dismissal across modal and registered nonmodal layers.
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
    registerScope(scope) {
      ownedScopes.add(scope); applyInert();
      return () => { ownedScopes.delete(scope); applyInert(); };
    },
    register(layer) {
      ensureEscape();
      const id = layer.id || `cs-ov-${++seq}`;
      const entry = { ...layer, id, seq: ++seq };
      layers.push(entry);
      resort();
      applyScroll();
      applyInert();
      return () => {
        resort();
        const i = layers.findIndex((l) => l.id === id);
        // Toasts neither own dismissal nor suppress returning focus from it.
        const wasTop = [...layers].reverse().find((layer) => layer.kind !== "toast")?.id === id;
        if (i >= 0) layers.splice(i, 1);
        applyScroll();
        applyInert();
        if (!layers.length && escapeBound) {
          document.removeEventListener("keydown", onDocEscape, true);
          escapeBound = false;
        }
        const active = document.activeElement;
        const ownedFocus = active === document.body || active === entry.restoreEl || entry.panelEl?.contains(active);
        if (wasTop && ownedFocus && entry.restoreEl?.isConnected && !entry.restoreEl.closest('[inert], [hidden]') && typeof entry.restoreEl.focus === "function") {
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
    topDismissible() {
      resort();
      return [...layers].reverse().find((layer) => layer.kind !== "toast") || null;
    },
    activeModal,
    focusScope,
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
/** Internal React ownership crosses portals; lowercase export stays out of the browser API. */
export const overlayScopeContext = React.createContext(null);

/** Return the active manager (context or module singleton). */
export function getOverlayManager() {
  return defaultManager;
}

/**
 * Optional provider — mounts `#cs-overlay-root` for portals and supplies a
 * shared document manager. Providers share ordering, Escape and scroll ownership.
 */
export function OverlayProvider({ children }) {
  const api = defaultManager;
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
  backdropRef,
  preferFocusSelector,
  restoreFocus = true,
}) {
  const ctx = React.useContext(OverlayContext);
  const parentScope = React.useContext(overlayScopeContext);
  const mgr = ctx || defaultManager;
  const escapeRef = React.useRef(onEscape);
  escapeRef.current = onEscape;

  const scopeBinding = React.useRef(null);
  // Preserve ownership while an always-mounted portal trigger opens/closes. Rebinding
  // during close would briefly inert that trigger before focus restoration.
  useClientLayoutEffect(() => {
    const panelEl = panelRef?.current;
    const previous = scopeBinding.current;
    if (previous?.panelEl === panelEl && previous?.parentScope === parentScope) return;
    previous?.cleanup();
    scopeBinding.current = panelEl && parentScope
      ? { panelEl, parentScope, cleanup: mgr.registerScope({ panelEl, get parentEl() { return parentScope.current; } }) }
      : null;
  });
  useClientLayoutEffect(() => () => { scopeBinding.current?.cleanup(); scopeBinding.current = null; }, []);

  useClientLayoutEffect(() => {
    if (!open) return undefined;
    const restoreEl = typeof document !== "undefined" ? document.activeElement : null;
    const panel = panelRef && panelRef.current;
    const unregister = mgr.register({
      kind,
      lockScroll: lockScroll != null ? lockScroll : kind === "modal",
      onEscape: () => escapeRef.current && escapeRef.current(),
      restoreEl: restoreFocus ? restoreEl : null,
      panelEl: panel || null,
      backdropEl: backdropRef?.current || null,
      parentRef: parentScope,
    });

    // Only the innermost (top) layer should move focus / trap Tab — outer parents
    // run layout effects after children and must not steal focus from nested alerts.
    let detachTrap = () => {};
    const ownsModalFocus = mgr.activeModal()?.panelEl === panel;
    if (trapFocus && panel && ownsModalFocus && !mgr.focusScope().some((root) => root.contains(document.activeElement))) {
      const preferred =
        (preferFocusSelector && panel.querySelector(preferFocusSelector)) ||
        visibleFocusables([panel])[0] ||
        panel;
      preferred && preferred.focus && preferred.focus();
    }

    if (trapFocus && panel) {
      detachTrap = attachFocusTrap(panel, { isActive: () => mgr.activeModal()?.panelEl === panel, scopeElements: () => mgr.focusScope() });
    }
    return () => {
      detachTrap();
      unregister();
    };
  }, [open, kind, trapFocus, lockScroll, mgr, panelRef, backdropRef, parentScope, preferFocusSelector, restoreFocus]);

  return { manager: mgr, scope: open && panelRef ? panelRef : parentScope };
}
