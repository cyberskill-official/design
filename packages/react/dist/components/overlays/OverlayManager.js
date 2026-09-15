import { jsx, jsxs } from "react/jsx-runtime";
import React from "react";
import { ThemeProvider as ThemeProviderImpl } from "../_theme/provider.js";
import { useTheme as useThemeImpl } from "../_theme/provider.js";
import { getThemeInitScript as getThemeInitScriptImpl } from "../_theme/provider.js";
const focusableSelector = [
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
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function attachFocusTrap(panelEl, { handleEscape = false, onEscape } = {}) {
  if (!panelEl) return () => {
  };
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
function applySiblingInert(panel) {
  const marked = [];
  if (!panel) return () => {
  };
  const mark = (el) => {
    if (!el || el === panel || el.contains(panel) || el.hasAttribute("data-cs-inert")) return;
    el.setAttribute("inert", "");
    el.setAttribute("data-cs-inert", "");
    marked.push(el);
  };
  if (typeof document !== "undefined" && document.body) {
    for (const el of document.body.children) mark(el);
  }
  if (panel.parentElement) {
    for (const sib of panel.parentElement.children) mark(sib);
  }
  return () => {
    for (const el of marked) {
      if (!el.hasAttribute("data-cs-inert")) continue;
      el.removeAttribute("inert");
      el.removeAttribute("data-cs-inert");
    }
  };
}
function createOverlayManager() {
  const layers = [];
  let prevOverflow = "";
  let locked = false;
  let escapeBound = false;
  const resort = () => {
    layers.sort((a, b) => {
      const pa = a.panelEl;
      const pb = b.panelEl;
      if (pa && pb && pa !== pb) {
        if (pa.contains(pb)) return -1;
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
    }
  };
}
const defaultManager = createOverlayManager();
const OverlayContext = React.createContext(null);
function getOverlayManager() {
  return defaultManager;
}
function OverlayProvider({ children }) {
  const api = React.useMemo(() => createOverlayManager(), []);
  return /* @__PURE__ */ jsxs(OverlayContext.Provider, { value: api, children: [
    /* @__PURE__ */ jsx("div", { id: "cs-overlay-root", "data-cs-overlay-root": "" }),
    children
  ] });
}
function useOverlayLayer({
  open,
  kind = "modal",
  trapFocus = false,
  lockScroll,
  onEscape,
  panelRef,
  preferFocusSelector
}) {
  const ctx = React.useContext(OverlayContext);
  const mgr = ctx || defaultManager;
  const escapeRef = React.useRef(onEscape);
  escapeRef.current = onEscape;
  React.useLayoutEffect(() => {
    if (!open) return void 0;
    const restoreEl = typeof document !== "undefined" ? document.activeElement : null;
    const panel = panelRef && panelRef.current;
    const unregister = mgr.register({
      kind,
      lockScroll: lockScroll != null ? lockScroll : kind === "modal",
      onEscape: () => escapeRef.current && escapeRef.current(),
      restoreEl,
      panelEl: panel || null
    });
    let detachTrap = () => {
    };
    let clearInert = () => {
    };
    const top = mgr.top();
    const isTop = top && top.panelEl === panel;
    if (trapFocus && panel && isTop) {
      const preferred = preferFocusSelector && panel.querySelector(preferFocusSelector) || panel.querySelector(focusableSelector) || panel;
      preferred && preferred.focus && preferred.focus();
      detachTrap = attachFocusTrap(panel, { handleEscape: false });
      clearInert = applySiblingInert(panel);
    }
    return () => {
      clearInert();
      detachTrap();
      unregister();
    };
  }, [open, kind, trapFocus, lockScroll, mgr, panelRef, preferFocusSelector]);
  return { manager: mgr };
}
function ThemeProvider(props) {
  return ThemeProviderImpl(props);
}
function useTheme() {
  return useThemeImpl();
}
function getThemeInitScript(opts) {
  return getThemeInitScriptImpl(opts);
}
export {
  OverlayProvider,
  ThemeProvider,
  applySiblingInert,
  attachFocusTrap,
  focusableSelector,
  getOverlayManager,
  getThemeInitScript,
  useOverlayLayer,
  useTheme
};
