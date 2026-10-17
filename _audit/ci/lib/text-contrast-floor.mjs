// Body text retains Lc75. Only large, bold text uses the existing CTA Lc60 floor.
export function textContrastFloor(size, weight) {
  if (!Number.isFinite(size) || size <= 0 || !Number.isFinite(weight) || weight <= 0)
    throw new Error('Invalid computed text metrics');
  return size >= 24 && weight >= 700 ? 60 : 75;
}
