import type { ReactNode } from "react";

/** Reorderable list item. */
export interface SortableItem { key: string; label: ReactNode; }
export interface SortableProps {
  items: SortableItem[];
  onChange?: (items: SortableItem[]) => void;
  lang?: string;
  className?: string;
}
/** Pure reorder helper shared by drag and move-button paths. */
export function reorderItems<T>(items: T[], from: number, to: number): T[];
/** Reorderable list — move-up/down buttons (WCAG 2.5.7) plus HTML5 DnD enhancement. */
export function Sortable(props: SortableProps): React.ReactElement;
