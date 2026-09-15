/** Shared roving-index helper for APG collections (Rating, Tree, Toolbar). */
export function nextRovingIndex(from, delta, max) {
  if (!max) return 0;
  return Math.max(0, Math.min(max - 1, from + delta));
}
