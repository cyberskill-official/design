import type * as React from "react";
import type { ReactNode } from "react";

export interface CommandItem { label: string; icon?: ReactNode; shortcut?: ReactNode; onSelect?: () => void; }
export interface CommandGroup { label?: ReactNode; items: CommandItem[]; }

/**
 * ⌘K command palette: scrim + search box + grouped, filterable actions. The
 * brand's "command palette (Heavy Glass)" surface. Controlled via open/onClose;
 * Escape and scrim-click close it.
 */
export interface CommandPaletteProps {
  open: boolean;
  onClose?: () => void;
  placeholder?: string;
  groups: CommandGroup[];
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
}
export function CommandPalette(props: CommandPaletteProps): React.ReactElement | null;
