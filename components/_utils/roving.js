/** Shared collection helpers for APG widgets (Rating, Carousel, Combobox). */
export function nextRovingIndex(from, delta, max) {
  if (!max) return 0;
  return Math.max(0, Math.min(max - 1, from + delta));
}

export function wrapIndex(from, delta, max) {
  if (!max) return 0;
  return ((from + delta) % max + max) % max;
}

export function reduceListbox(state, action) {
  const activeIndex = state && state.activeIndex != null ? state.activeIndex : 0;
  if (action.type === "open") return { open: true, activeIndex: action.index != null ? action.index : 0 };
  if (action.type === "close") return { open: false, activeIndex };
  if (action.type === "move") return { open: true, activeIndex: nextRovingIndex(activeIndex, action.delta, action.max || 0) };
  return { open: !!(state && state.open), activeIndex };
}
