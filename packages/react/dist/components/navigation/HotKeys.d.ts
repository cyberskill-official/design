import type { ReactNode } from "react";

/** Global keymap manager. "mod" = Cmd/Ctrl. "?" toggles a bilingual cheat-sheet
 *  (disable with help={false}). Ignores keystrokes inside inputs. */
export interface HotKeyBinding { keys: string; description?: ReactNode; onTrigger?: () => void; }
export interface HotKeysProps {
  bindings: HotKeyBinding[];
  help?: boolean;
  children?: ReactNode;
  lang?: string;
  className?: string;
}
export const HotKeys: React.ForwardRefExoticComponent<
  HotKeysProps & React.RefAttributes<HTMLElement>
>;
