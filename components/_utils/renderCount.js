/** Whole rendered count, with the component's existing minimum/default.
 * Array lengths cannot reach 2^32; this is not a resource or UI budget. */
export function renderCount(value, fallback, minimum = 0) {
  if (!Number.isFinite(value) || value >= 2 ** 32) return fallback;
  return Math.max(minimum, Math.trunc(value));
}
