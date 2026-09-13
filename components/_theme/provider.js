import React from "react";

const ThemeContext = React.createContext(null);

export const THEME_VALUES = Object.freeze(["light", "dark", "system"]);
export const CONTRAST_VALUES = Object.freeze(["normal", "high"]);

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
 * by applying data-theme / data-cs-contrast before first paint.
 */
export function getThemeInitScript({
  storageKey = "cs-theme",
  contrastKey = "cs-contrast",
  defaultTheme = "system",
  defaultContrast = "normal",
} = {}) {
  return `(function(){try{var t=localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(defaultTheme)};var c=localStorage.getItem(${JSON.stringify(contrastKey)})||${JSON.stringify(defaultContrast)};var r=document.documentElement;var resolved=t;if(t==="system"){resolved=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}r.setAttribute("data-theme",t==="system"?"system":resolved);if(t==="system"){r.setAttribute("data-theme","system");}else{r.setAttribute("data-theme",resolved);}r.setAttribute("data-cs-contrast",c==="high"?"high":"normal");}catch(e){}})();`;
}

function applyDom(theme, contrast, dir) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", theme === "dark" || theme === "light" || theme === "system" ? theme : "system");
  root.setAttribute("data-cs-contrast", contrast === "high" ? "high" : "normal");
  if (dir === "rtl" || dir === "ltr") root.setAttribute("dir", dir);
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "system",
      resolvedTheme: "light",
      contrast: "normal",
      dir: "ltr",
      setTheme() {},
      setContrast() {},
    };
  }
  return ctx;
}

/**
 * Typed SSR-safe theme provider. Controlled (`theme`) or uncontrolled
 * (`defaultTheme` + localStorage). Does not invent a Density product axis.
 */
export function ThemeProvider({
  children,
  theme: themeProp,
  defaultTheme = "system",
  contrast: contrastProp,
  defaultContrast = "normal",
  dir = "ltr",
  storageKey = "cs-theme",
  contrastKey = "cs-contrast",
  className,
}) {
  const [themeState, setThemeState] = React.useState(defaultTheme);
  const [contrastState, setContrastState] = React.useState(defaultContrast);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey);
      const storedContrast = localStorage.getItem(contrastKey);
      if (themeProp == null && storedTheme && THEME_VALUES.includes(storedTheme)) {
        setThemeState(storedTheme);
      }
      if (contrastProp == null && storedContrast && CONTRAST_VALUES.includes(storedContrast)) {
        setContrastState(storedContrast);
      }
    } catch {
      /* private mode */
    }
    setHydrated(true);
  }, [storageKey, contrastKey, themeProp, contrastProp]);

  const theme = themeProp != null ? themeProp : themeState;
  const contrast = contrastProp != null ? contrastProp : contrastState;
  const resolvedTheme = resolveTheme(theme);

  React.useEffect(() => {
    applyDom(theme, contrast, dir);
    if (!hydrated) return;
    try {
      if (themeProp == null) localStorage.setItem(storageKey, theme);
      if (contrastProp == null) localStorage.setItem(contrastKey, contrast);
    } catch {
      /* ignore */
    }
  }, [theme, contrast, dir, hydrated, storageKey, contrastKey, themeProp, contrastProp]);

  const setTheme = React.useCallback((next) => {
    if (!THEME_VALUES.includes(next)) return;
    setThemeState(next);
  }, []);
  const setContrast = React.useCallback((next) => {
    if (!CONTRAST_VALUES.includes(next)) return;
    setContrastState(next);
  }, []);

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, contrast, dir, setTheme, setContrast }),
    [theme, resolvedTheme, contrast, dir, setTheme, setContrast],
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
        dir,
      },
      children,
    ),
  );
}
