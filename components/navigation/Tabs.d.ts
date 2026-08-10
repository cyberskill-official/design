import type * as React from "react";
import type { ReactNode } from "react";

export interface TabItem { value: string; label: ReactNode; count?: number; }

/**
 * Underlined tablist (Ochre indicator on the active tab), controlled by
 * value/onChange. Pair with your own panels (aria-controls) in app code.
 */
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
}
export function Tabs(props: TabsProps): React.ReactElement;

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  count?: number;
}
export function Tab(props: TabProps): React.ReactElement;
