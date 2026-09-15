import type { ReactElement, ReactNode } from "react";

export type ThemeName = "light" | "dark" | "system";
export type ContrastName = "standard" | "high";
export type DensityName = "comfortable" | "compact";

export type ThemeContextValue = {
  theme: ThemeName;
  resolvedTheme: "light" | "dark";
  contrast: ContrastName;
  density: DensityName;
  dir: "ltr" | "rtl";
  element: string;
  variant: string;
  setTheme: (theme: ThemeName) => void;
  setContrast: (contrast: ContrastName) => void;
  setDensity: (density: DensityName) => void;
};

export const THEME_VALUES: readonly ThemeName[];
export const CONTRAST_VALUES: readonly ContrastName[];
export const DENSITY_VALUES: readonly DensityName[];

export function getThemeInitScript(opts?: {
  storageKey?: string;
  contrastKey?: string;
  densityKey?: string;
  defaultTheme?: ThemeName;
  defaultContrast?: ContrastName;
  defaultDensity?: DensityName;
  defaultElement?: string;
  defaultVariant?: string;
}): string;

export function resolveTheme(theme: ThemeName | string): "light" | "dark";

export function useTheme(): ThemeContextValue;

export function ThemeProvider(props: {
  children?: ReactNode;
  theme?: ThemeName;
  defaultTheme?: ThemeName;
  contrast?: ContrastName;
  defaultContrast?: ContrastName;
  density?: DensityName;
  defaultDensity?: DensityName;
  dir?: "ltr" | "rtl";
  element?: string;
  variant?: string;
  storageKey?: string;
  contrastKey?: string;
  densityKey?: string;
  className?: string;
}): ReactElement;
