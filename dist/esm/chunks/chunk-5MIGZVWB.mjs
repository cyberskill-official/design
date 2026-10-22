"use client";

// components/_utils/renderCount.js
function renderCount(value, fallback, minimum = 0) {
  if (!Number.isFinite(value) || value >= 2 ** 32) return fallback;
  return Math.max(minimum, Math.trunc(value));
}

export {
  renderCount
};
//# sourceMappingURL=chunk-5MIGZVWB.mjs.map
