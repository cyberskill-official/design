/** Parse "#rrggbb", "#rgb", or "rgb()/rgba()" into [r,g,b]; null if unknown. */
export function parseColorToRgb(str) {
  const s = String(str || '').trim();
  const hex6 = /^#([0-9a-f]{6})$/i.exec(s);
  if (hex6) {
    const n = parseInt(hex6[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const hex3 = /^#([0-9a-f]{3})$/i.exec(s);
  if (hex3) return hex3[1].split('').map((c) => parseInt(c + c, 16));
  const rgb = /^rgba?\(([^)]+)\)$/i.exec(s);
  if (rgb) {
    const p = rgb[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (p.length >= 3 && p.slice(0, 3).every((v) => !Number.isNaN(v))) return [p[0], p[1], p[2]];
  }
  return null;
}

/**
 * APCA-W3 (SAPC-4g) lightness contrast — same math as _audit/apca-dark-preview.html:
 * Y with 2.4 TRC, black-soften 0.022/1.414, polarity exponents 0.56/0.57 normal
 * and 0.65/0.62 reverse, x1.14 scale, 0.1 clamp, 0.027 offset.
 */
export function apcaLc(fgColor, bgColor) {
  const fg = Array.isArray(fgColor) ? fgColor : parseColorToRgb(fgColor);
  const bg = Array.isArray(bgColor) ? bgColor : parseColorToRgb(bgColor);
  if (!fg || !bg) return null;
  const y = ([r, g, b]) => {
    const f = (c) => Math.pow(c / 255, 2.4);
    return 0.2126729 * f(r) + 0.7151522 * f(g) + 0.072175 * f(b);
  };
  const soften = (Y) => (Y < 0.022 ? Y + Math.pow(0.022 - Y, 1.414) : Y);
  const Yt = soften(y(fg));
  const Yb = soften(y(bg));
  const S =
    Yb > Yt
      ? (Math.pow(Yb, 0.56) - Math.pow(Yt, 0.57)) * 1.14
      : (Math.pow(Yb, 0.65) - Math.pow(Yt, 0.62)) * 1.14;
  const a = Math.abs(S);
  if (a < 0.1) return 0;
  return Math.round((a - 0.027) * 1000) / 10;
}

