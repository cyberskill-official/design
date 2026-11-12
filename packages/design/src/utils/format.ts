/**
 * File size in binary units (1 kB = 1024 bytes, 1 MB = 1024² bytes, like Windows and most upload limits), in the given locale:
 * `formatFileSize(10 * 1024 * 1024)` → `"10 MB"`, `formatFileSize(1536)` → `"1.5 kB"`. At most one decimal.
 */
export function formatFileSize(bytes: number, locale?: Intl.LocalesArgument): string {
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'] as const;
  let i = 0;
  let n = bytes;
  // Pick the unit after rounding, so 1,048,570 bytes reads "1 MB" and never "1,024 kB".
  while (i < units.length - 1 && Math.round(n * 10) / 10 >= 1024) {
    n /= 1024;
    i++;
  }
  return new Intl.NumberFormat(locale, { style: 'unit', unit: units[i], unitDisplay: 'short', maximumFractionDigits: i === 0 ? 0 : 1 }).format(n);
}
