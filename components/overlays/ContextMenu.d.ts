import type { ReactNode } from "react";

/** Right-click menu scoped to its children (reuses Menu styling). */
export type ContextMenuItem = { label: ReactNode; onSelect?: () => void; danger?: boolean } | "-";
export interface ContextMenuProps {
  items: ContextMenuItem[];
  children?: ReactNode;
  /** "en" | "vi" — else resolved from the nearest [lang] ancestor (vi default). */
  lang?: string;
  className?: string;
  /** Zone tab stop; defaults to 0. Use -1 only with a caller-provided keyboard route. */
  tabIndex?: number;
}
export function ContextMenu(props: ContextMenuProps): React.ReactElement;
