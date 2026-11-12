// Color math shared by the token build and the quality benchmark: sRGB, WCAG contrast, OKLab/OKLCH, Machado 2009 CVD.
// Colors are #RRGGBB strings.
export const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
export const lin = c => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
export const lum = h => { const [r, g, b] = rgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
export const oklabLin = ([r, g, b]) => {
  const l = Math.cbrt(Math.max(0, 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b));
  const m = Math.cbrt(Math.max(0, 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b));
  const s = Math.cbrt(Math.max(0, 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b));
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
};
export const oklch = h => { const [L, a, b] = oklabLin(rgb(h).map(lin)); return [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360]; };
export const MC = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
};
export const sim = (h, k) => { const v = rgb(h).map(lin); return k ? MC[k].map(r => Math.min(1, Math.max(0, r[0] * v[0] + r[1] * v[1] + r[2] * v[2]))) : v; };
export const deltaE = (a, b, k) => { const p = oklabLin(sim(a, k)), q = oklabLin(sim(b, k)); return 100 * Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
export const cvd = (a, b) => Math.min(deltaE(a, b, 'protan'), deltaE(a, b, 'deutan'));
