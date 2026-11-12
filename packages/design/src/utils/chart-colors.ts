/** Slot in the fixed categorical palette: 1 Blue, 2 Gold, 3 Teal, 4 Magenta, 5 Violet. */
export type ChartColor = 1 | 2 | 3 | 4 | 5;

/** Color of a series: its pinned slot, else its position. Past five series the rest read as "Other" in muted gray; never cycled. */
export function chartColor(slot: number): string {
  return slot >= 1 && slot <= 5 ? `var(--chart-${slot})` : 'var(--muted)';
}

/** A series' color: its pinned `color` slot, else its position (`index` 0 → slot 1). */
export const seriesColor = (s: { color?: ChartColor }, index: number) => chartColor(s.color ?? index + 1);
