import type * as React from "react";
import type { ReactNode } from "react";

export interface SelectOption { value: string; label: string; }

/**
 * Labelled native select in the CyberSkill field frame, with a custom chevron
 * and the same description/error wiring as TextField. Diacritic-safe.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  /** Options as data; alternatively pass <option> children. */
  options?: SelectOption[];
  children?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
}

export function Select(props: SelectProps): React.ReactElement;
