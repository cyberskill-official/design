import React from "react";

const ThemeContext = React.createContext(null);

export const THEME_VALUES = Object.freeze(["light", "dark", "system"]);
export const CONTRAST_VALUES = Object.freeze(["standard", "high"]);
export const DENSITY_VALUES = Object.freeze(["comfortable", "compact"]);

function prefersDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(theme) {
  if (theme === "dark" || theme === "light") return theme;
  return prefersDark() ? "dark" : "light";
}

/**
 * Inline script for the document <head>. Prevents a light-theme flash on SSR
 * by applying data-theme / data-cs-contrast / data-cs-density before first paint.
 * Density and contrast are Theme attributes (TASK-IMP-027), not product axes.
 */
export function getThemeInitScript({
  storageKey = "cs-theme",
  contrastKey = "cs-contrast",
  densityKey = "cs-density",
  defaultTheme = "system",
  defaultContrast = "standard",
  defaultDensity = "comfortable",
  defaultElement = "",
  defaultVariant = "",
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

export function useTheme() {
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
      setTheme() {},
      setContrast() {},
      setDensity() {},
    };
  }
  return ctx;
}

/**
 * Typed SSR-safe theme provider. Controlled (`theme`) or uncontrolled
 * (`defaultTheme` + localStorage). Density/contrast are Theme attributes,
 * not product identity axes.
 */
export function ThemeProvider({
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
  className,
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
      /* private mode */
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
      /* ignore */
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
    [theme, resolvedTheme, contrast, density, dir, element, variant, setTheme, setContrast, setDensity],
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
        "data-cs-element": element || undefined,
        "data-cs-variant": variant || undefined,
        dir,
      },
      children,
    ),
  );
}
