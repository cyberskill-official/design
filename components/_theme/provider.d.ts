import type { ReactElement, ReactNode } from "react";

export type ThemeName = "light" | "dark" | "system";
export type ContrastName = "normal" | "high";

export type ThemeContextValue = {
  theme: ThemeName;
  resolvedTheme: "light" | "dark";
  contrast: ContrastName;
  dir: "ltr" | "rtl";
  setTheme: (theme: ThemeName) => void;
  setContrast: (contrast: ContrastName) => void;
};

export function getThemeInitScript(opts?: {
  storageKey?: string;
  contrastKey?: string;
  defaultTheme?: ThemeName;
  defaultContrast?: ContrastName;
}): string;

export function resolveTheme(theme: ThemeName | string): "light" | "dark";

export function useTheme(): ThemeContextValue;

export function ThemeProvider(props: {
  children?: ReactNode;
  theme?: ThemeName;
  defaultTheme?: ThemeName;
  contrast?: ContrastName;
  defaultContrast?: ContrastName;
  dir?: "ltr" | "rtl";
  storageKey?: string;
  contrastKey?: string;
  className?: string;
}): ReactElement;
