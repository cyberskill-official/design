import type * as React from "react";
import type { RootTargetProps } from "../_utils/target-props";
import type { ReactNode } from "react";

/** Reorderable list item. */
export interface SortableItem { key: string; label: ReactNode; }
export interface SortableProps {
  /** Attributes for the existing ul root. Owned semantics/state stay controlled; internal handlers run first. */
  rootProps?: RootTargetProps<HTMLUListElement>;
  items: SortableItem[];
  onChange?: (items: SortableItem[]) => void;
  lang?: string;
  className?: string;
}
/** Pure reorder helper shared by drag and move-button paths. */
export function reorderItems<T>(items: T[], from: number, to: number): T[];
/** Reorderable list — move-up/down buttons (WCAG 2.5.7) plus HTML5 DnD enhancement.
 * A completed drop emits a reorder; a cancelled drag only clears drag state. */
export const Sortable: React.ForwardRefExoticComponent<React.PropsWithoutRef<SortableProps> & React.RefAttributes<HTMLUListElement>>;
