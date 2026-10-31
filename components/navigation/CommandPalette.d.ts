import type { RootTargetProps } from "../_utils/target-props";
/** Group label, item icon and item shortcut preserve numeric zero; null, false and empty strings omit those slots. */
import type * as React from "react";
import type { ReactNode } from "react";

export interface CommandItem { label: string; icon?: ReactNode; shortcut?: ReactNode; onSelect?: () => void; }
export interface CommandGroup { label?: ReactNode; items: CommandItem[]; }

/**
 * ⌘K command palette: scrim + search box + grouped, filterable actions. The
 * brand's "command palette (Heavy Glass)" surface. Controlled via open/onOpenChange;
 * Escape and scrim-click close it. A visible EN/VI result count or empty message
 * is exposed as a polite, atomic status without moving search focus.
 * The overlay manager focuses search on open and restores the invoking control
 * after selection or Escape when that control is still connected and available.
 */
export interface CommandPaletteProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: Omit<RootTargetProps<HTMLDivElement>, "role" | "aria-modal" | "aria-label">;
  open: boolean;
  /** Called with `false` when the palette asks to close. Preferred open-state callback. */
  onOpenChange?: (open: boolean) => void;
  /** @deprecated Still supported. Called after `onOpenChange(false)` when the palette closes. */
  onClose?: () => void;
  placeholder?: string;
  groups: CommandGroup[];
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
  /** Native input control; only while open. Separate from ref's primary target. */
  controlRef?: React.Ref<HTMLInputElement>;
}
export const CommandPalette: React.ForwardRefExoticComponent<React.PropsWithoutRef<CommandPaletteProps> & React.RefAttributes<HTMLDivElement>>;
