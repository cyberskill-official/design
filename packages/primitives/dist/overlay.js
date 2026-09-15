// components/overlays/OverlayManager.jsx
import React2 from "react";

// components/_theme/provider.js
import React from "react";
var ThemeContext = React.createContext(null);
var THEME_VALUES = Object.freeze(["light", "dark", "system"]);
var CONTRAST_VALUES = Object.freeze(["standard", "high"]);
var DENSITY_VALUES = Object.freeze(["comfortable", "compact"]);
function prefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function resolveTheme(theme) {
  if (theme === "dark" || theme === "light") return theme;
  return prefersDark() ? "dark" : "light";
}
function getThemeInitScript({
  storageKey = "cs-theme",
  contrastKey = "cs-contrast",
  densityKey = "cs-density",
  defaultTheme = "system",
  defaultContrast = "standard",
  defaultDensity = "comfortable",
  defaultElement = "",
  defaultVariant = ""
} = {}) {
  return `(function(){try{var t=localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(defaultTheme)};var c=localStorage.getItem(${JSON.stringify(contrastKey)})||${JSON.stringify(defaultContrast)};var d=localStorage.getItem(${JSON.stringify(densityKey)})||${JSON.stringify(defaultDensity)};var r=document.documentElement;var resolved=t;if(t==="system"){resolved=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="system"){r.setAttribute("data-theme","system");}else{r.setAttribute("data-theme",resolved);}r.setAttribute("data-cs-contrast",c==="high"?"high":"standard");r.setAttribute("data-cs-density",d==="compact"?"compact":"comfortable");var el=${JSON.stringify(defaultElement || "")};var va=${JSON.stringify(defaultVariant || "")};if(el){r.setAttribute("data-cs-element",el);if(va){r.setAttribute("data-cs-variant",va);}else{r.removeAttribute("data-cs-variant");}}}catch(e){}})();`;
}
function applyDom(theme, contrast, density, dir, element, variant) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme === "dark" || theme === "light" || theme === "system" ? theme : "system");
  root.setAttribute("data-cs-contrast", contrast === "high" ? "high" : "standard");
  root.setAttribute("data-cs-density", density === "compact" ? "compact" : "comfortable");
  if (dir === "rtl" || dir === "ltr") root.setAttribute("dir", dir);
  if (element) {
    root.setAttribute("data-cs-element", element);
    if (variant) root.setAttribute("data-cs-variant", variant);
    else root.removeAttribute("data-cs-variant");
  }
}
function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "system",
      resolvedTheme: "light",
      contrast: "standard",
      density: "comfortable",
      dir: "ltr",
      element: "",
      variant: "",
      setTheme() {
      },
      setContrast() {
      },
      setDensity() {
      }
    };
  }
  return ctx;
}
function ThemeProvider({
  children,
  theme: themeProp,
  defaultTheme = "system",
  contrast: contrastProp,
  defaultContrast = "standard",
  density: densityProp,
  defaultDensity = "comfortable",
  dir = "ltr",
  element = "",
  variant = "",
  storageKey = "cs-theme",
  contrastKey = "cs-contrast",
  densityKey = "cs-density",
  className
}) {
  const [themeState, setThemeState] = React.useState(defaultTheme);
  const [contrastState, setContrastState] = React.useState(defaultContrast);
  const [densityState, setDensityState] = React.useState(defaultDensity);
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey);
      const storedContrast = localStorage.getItem(contrastKey);
      const storedDensity = localStorage.getItem(densityKey);
      if (themeProp == null && storedTheme && THEME_VALUES.includes(storedTheme)) {
        setThemeState(storedTheme);
      }
      if (contrastProp == null && storedContrast && CONTRAST_VALUES.includes(storedContrast)) {
        setContrastState(storedContrast);
      }
      if (densityProp == null && storedDensity && DENSITY_VALUES.includes(storedDensity)) {
        setDensityState(storedDensity);
      }
    } catch {
    }
    setHydrated(true);
  }, [storageKey, contrastKey, densityKey, themeProp, contrastProp, densityProp]);
  const theme = themeProp != null ? themeProp : themeState;
  const contrast = contrastProp != null ? contrastProp : contrastState;
  const density = densityProp != null ? densityProp : densityState;
  const resolvedTheme = resolveTheme(theme);
  React.useEffect(() => {
    applyDom(theme, contrast, density, dir, element, variant);
    if (!hydrated) return;
    try {
      if (themeProp == null) localStorage.setItem(storageKey, theme);
      if (contrastProp == null) localStorage.setItem(contrastKey, contrast);
      if (densityProp == null) localStorage.setItem(densityKey, density);
    } catch {
    }
  }, [theme, contrast, density, dir, element, variant, hydrated, storageKey, contrastKey, densityKey, themeProp, contrastProp, densityProp]);
  const setTheme = React.useCallback((next) => {
    if (!THEME_VALUES.includes(next)) return;
    setThemeState(next);
  }, []);
  const setContrast = React.useCallback((next) => {
    if (!CONTRAST_VALUES.includes(next)) return;
    setContrastState(next);
  }, []);
  const setDensity = React.useCallback((next) => {
    if (!DENSITY_VALUES.includes(next)) return;
    setDensityState(next);
  }, []);
  const value = React.useMemo(
    () => ({ theme, resolvedTheme, contrast, density, dir, element, variant, setTheme, setContrast, setDensity }),
    [theme, resolvedTheme, contrast, density, dir, element, variant, setTheme, setContrast, setDensity]
  );
  return React.createElement(
    ThemeContext.Provider,
    { value },
    React.createElement(
      "div",
      {
        className: ["cs-root", "cs-theme-provider", className].filter(Boolean).join(" "),
        "data-theme": theme,
        "data-cs-contrast": contrast,
        "data-cs-density": density,
        "data-cs-element": element || void 0,
        "data-cs-variant": variant || void 0,
        dir
      },
      children
    )
  );
}

// components/overlays/OverlayManager.jsx
import { jsx, jsxs } from "react/jsx-runtime";
var focusableSelector = [
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
var defaultManager = createOverlayManager();
var OverlayContext = React2.createContext(null);
function getOverlayManager() {
  return defaultManager;
}
function OverlayProvider({ children }) {
  const api = React2.useMemo(() => createOverlayManager(), []);
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
  const ctx = React2.useContext(OverlayContext);
  const mgr = ctx || defaultManager;
  const escapeRef = React2.useRef(onEscape);
  escapeRef.current = onEscape;
  React2.useLayoutEffect(() => {
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
    const top = mgr.top();
    const isTop = top && top.panelEl === panel;
    if (trapFocus && panel && isTop) {
      const preferred = preferFocusSelector && panel.querySelector(preferFocusSelector) || panel.querySelector(focusableSelector) || panel;
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
function ThemeProvider2(props) {
  return ThemeProvider(props);
}
function useTheme2() {
  return useTheme();
}
function getThemeInitScript2(opts) {
  return getThemeInitScript(opts);
}
export {
  OverlayProvider,
  ThemeProvider2 as ThemeProvider,
  attachFocusTrap,
  focusableSelector,
  getOverlayManager,
  getThemeInitScript2 as getThemeInitScript,
  useOverlayLayer,
  useTheme2 as useTheme
};
