import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Global keymap manager. "mod" = Cmd/Ctrl. "?" toggles a bilingual cheat-sheet
 *  (disable with help={false}). Ignores native form fields, contenteditable regions, composition and already-handled events. */
/** Case-insensitive KeyboardEvent.key with + separated mod/ctrl/meta/shift/alt.
 * Unlisted modifiers do not match; mod accepts Ctrl or Meta. */
export interface HotKeyBinding { keys: string; description?: ReactNode; onTrigger?: () => void; }
export interface HotKeysProps {
  /** Attributes for the existing div root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLDivElement>;
  bindings: HotKeyBinding[];
  help?: boolean;
  children?: ReactNode;
  lang?: string;
  className?: string;
}
export const HotKeys: React.ForwardRefExoticComponent<React.PropsWithoutRef<HotKeysProps> & React.RefAttributes<HTMLDivElement>>;
