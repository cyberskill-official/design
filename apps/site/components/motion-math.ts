// Pure motion helpers shared by the Motion page's server tables and its client lab. Every number comes from the tokens.
import { tokens } from '@cyberskill/design/tokens';

type Pair = readonly [keyof typeof tokens.duration, keyof typeof tokens.ease];
type SpringName = keyof typeof tokens.spring;
const RECIPES = tokens.motion as unknown as Record<string, SpringName | Pair>;

/** Recipe names that use a duration, curve or spring token, in token order. */
export const usedBy = (key: string) => Object.entries(RECIPES).filter(([, v]) => (typeof v === 'string' ? v === key : (v as readonly string[]).includes(key))).map(([r]) => r);

/** A recipe as [milliseconds, CSS timing function]; a spring recipe runs for its settling time. */
export function recipe(name: string): [number, string] {
  const v = RECIPES[name]!;
  if (typeof v === 'string') return [tokens.spring[v].settle, tokens.spring[v].css];
  return [parseFloat(tokens.duration[v[0]]), tokens.ease[v[1]]];
}

/** The recipe variables at `factor` × their durations, for the page's slow-motion switch. */
export const scaledRecipes = (factor: number): [string, string][] => [
  ...Object.keys(RECIPES).map((k): [string, string] => { const [ms, ease] = recipe(k); return [`--motion-${k}`, `${ms * factor}ms ${ease}`]; }),
  ['--motion-stagger', `${parseFloat(tokens.motionValue.stagger) * factor}ms`],
];

/** Apple's spring (perceptual duration in seconds, bounce), sampled exactly as scripts/build-tokens.mjs samples the spring tokens. */
export function spring(duration: number, bounce: number) {
  const w = (2 * Math.PI) / duration, z = 1 - bounce, wd = w * Math.sqrt(1 - z * z);
  const x = (t: number) => (z >= 1 ? 1 - Math.exp(-w * t) * (1 + w * t) : 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t)));
  let T = duration;
  for (let t = duration * 8; t > 0; t -= 0.002) if (Math.abs(x(t) - 1) > 0.002) { T = t + 0.002; break; }
  const n = Math.min(40, Math.max(16, Math.round(T / 0.014)));
  const pts = Array.from({ length: n + 1 }, (_, i) => +x((T * i) / n).toFixed(3));
  pts[n] = 1;
  return { pts, settle: Math.round(T * 1000), css: `linear(${pts.join(', ')})`, stiffness: +(w * w).toFixed(1), damping: +(2 * z * w).toFixed(2) };
}

// The tuner promises it writes what the token build writes: fail loudly in the console if the two ever drift.
for (const [k, s] of Object.entries(tokens.spring)) console.assert(spring(s.duration, s.bounce).css === s.css, `spring ${k}: the tuner and the token build disagree`);

/** Samples of a CSS timing function from 0 to 1: a cubic-bezier(), a linear() list, or `linear`. */
export function curvePoints(css: string, n = 40): number[] {
  const nums = (css.match(/-?[\d.]+/g) ?? []).map(Number);
  if (css.startsWith('linear(')) return nums;
  if (nums.length !== 4) return [0, 1];
  const [x1, y1, x2, y2] = nums as [number, number, number, number];
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t: number) => ((ax * t + bx) * t + cx) * t, Y = (t: number) => ((ay * t + by) * t + cy) * t;
  return Array.from({ length: n + 1 }, (_, i) => {
    let lo = 0, hi = 1, t = i / n;
    for (let k = 0; k < 24; k++) { t = (lo + hi) / 2; if (X(t) < i / n) lo = t; else hi = t; }
    return Y(t);
  });
}

/** SVG polyline points for curve samples in a w × h box, the start at the bottom and the target `pad` from the top. */
export const polyline = (pts: number[], w: number, h: number, pad: number) =>
  pts.map((v, i) => `${((w * i) / (pts.length - 1)).toFixed(1)},${(h - pad - v * (h - 2 * pad)).toFixed(1)}`).join(' ');
