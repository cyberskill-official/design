/** First-class theme axes. Density is not a product axis. */
export const THEME_AXES = Object.freeze({
  colorScheme: Object.freeze(["light", "dark", "system"]),
  contrast: Object.freeze(["standard", "high"]),
  direction: Object.freeze(["ltr", "rtl"]),
  motion: Object.freeze(["no-preference", "reduce"]),
  brand: "brand-packs",
  highContrast: "./high-contrast.css",
  rtl: "./rtl.css",
  reducedMotion: "./reduced-motion.css",
});
