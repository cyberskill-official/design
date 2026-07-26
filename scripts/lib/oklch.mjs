/** Shared OKLCH / APCA helpers for element-pack generation and geometry gates. */

export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

export function hex2rgb(h) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(h).trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
}

export function rgb2hex(r, g, b) {
  return '#' + [r, g, b].map((x) => clamp(Math.round(x), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}

const s2l = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const l2s = (c) => 255 * (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

export function rgb2oklab([r, g, b]) {
  r = s2l(r); g = s2l(g); b = s2l(b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

export function oklab2rgb([L, a, bb]) {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * bb, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * bb, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.2914855480 * bb, 3);
  return [
    l2s(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    l2s(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    l2s(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ];
}

/** @returns {[L, C, Hrad]} */
export function toLCH(lab) {
  return [lab[0], Math.hypot(lab[1], lab[2]), Math.atan2(lab[2], lab[1])];
}

export function fromLCH([L, C, H]) {
  return [L, C * Math.cos(H), C * Math.sin(H)];
}

export function hexToLCH(hex) {
  const rgb = hex2rgb(hex);
  if (!rgb) return null;
  const [L, C, H] = toLCH(rgb2oklab(rgb));
  return { L, C, H, Hdeg: ((H * 180) / Math.PI + 360) % 360 };
}

export function inGamut(rgb) {
  return rgb.every((v) => v >= -0.5 && v <= 255.5);
}

export function lchToHex(L, C, H) {
  let c = C;
  for (let i = 0; i < 24; i++) {
    const rgb = oklab2rgb(fromLCH([L, c, H]));
    if (inGamut(rgb)) return rgb2hex(...rgb);
    c *= 0.92;
  }
  return rgb2hex(...oklab2rgb(fromLCH([L, 0, H])));
}

export function lchDegToHex(L, C, Hdeg) {
  return lchToHex(L, C, (Hdeg * Math.PI) / 180);
}

export function deltaHueDeg(a, b) {
  let d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** CIEDE2000-ish lightweight ΔE in OKLab (Euclidean). */
export function deltaEok(hexA, hexB) {
  const a = rgb2oklab(hex2rgb(hexA));
  const b = rgb2oklab(hex2rgb(hexB));
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function apcaY([r, g, b]) {
  const f = (c) => Math.pow(c / 255, 2.4);
  return 0.2126729 * f(r) + 0.7151522 * f(g) + 0.0721750 * f(b);
}
function softY(Y) {
  return Y < 0.022 ? Y + Math.pow(0.022 - Y, 1.414) : Y;
}

/** APCA-W3 SAPC-4g Lc (absolute). */
export function apca(txtHex, bgHex) {
  const t = hex2rgb(txtHex);
  const g = hex2rgb(bgHex);
  if (!t || !g) return 0;
  const Yt = softY(apcaY(t));
  const Yb = softY(apcaY(g));
  let S;
  if (Yb > Yt) S = (Math.pow(Yb, 0.56) - Math.pow(Yt, 0.57)) * 1.14;
  else S = (Math.pow(Yb, 0.65) - Math.pow(Yt, 0.62)) * 1.14;
  const a = Math.abs(S);
  if (a < 0.1) return 0;
  return Math.round((a - 0.027) * 1000) / 10;
}

export function solveL(hex, bg, target) {
  const lab = rgb2oklab(hex2rgb(hex));
  let [L, C, H] = toLCH(lab);
  let out = lchToHex(L, C, H);
  for (let i = 0; i < 60 && apca(out, bg) < target; i++) {
    L = clamp(L + 0.01, 0, 0.98);
    out = lchToHex(L, C, H);
  }
  return out;
}

export function hexToRgba(hex, alpha) {
  const rgb = hex2rgb(hex);
  if (!rgb) return `rgba(0,0,0,${alpha})`;
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}
