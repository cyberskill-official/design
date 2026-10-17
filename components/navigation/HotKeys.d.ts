import type { ReactNode } from "react";

/** Global keymap manager. "mod" = Cmd/Ctrl. "?" toggles a bilingual cheat-sheet
 *  (disable with help={false}). Ignores native form fields, contenteditable regions, composition and already-handled events. */
/** Case-insensitive KeyboardEvent.key with + separated mod/ctrl/meta/shift/alt.
 * Unlisted modifiers do not match; mod accepts Ctrl or Meta. */
export interface HotKeyBinding { keys: string; description?: ReactNode; onTrigger?: () => void; }
export interface HotKeysProps {
  bindings: HotKeyBinding[];
  help?: boolean;
  children?: ReactNode;
  lang?: string;
  className?: string;
}
export function HotKeys(props: HotKeysProps): React.ReactElement;
