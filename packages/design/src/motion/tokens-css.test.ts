// The test browser forces reduced motion, so computed styles only ever show the reduced recipes. This reads the built
// tokens instead and checks that what ships for normal motion is valid CSS: an invalid curve would drop the whole transition.
import { describe, expect, it } from 'vitest';
import tokensCss from '../../dist/tokens.css?raw';
import tokensJson from '../../dist/tokens.json?raw';
import { springs } from './tokens';

type Built = { duration: Record<string, string>; ease: Record<string, string>; spring: Record<string, { css: string; settle: number; stiffness: number; damping: number }>; motion: Record<string, unknown> };
const built = JSON.parse(tokensJson) as Built;

// The first :root block holds the normal-motion values; reduced motion redefines them later, inside @media.
const start = tokensCss.indexOf(':root {');
const root = tokensCss.slice(start, tokensCss.indexOf('\n}', start));
const defined = new Map([...root.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m => [m[1]!, m[2]!.trim()]));
const resolve = (value: string): string => value.replace(/var\((--[\w-]+)\)/g, (_, name: string) => resolve(defined.get(name) ?? `var(${name})`));

describe('motion tokens as built for normal motion', () => {
  it('every easing is a valid timing function', () => {
    expect(Object.keys(built.ease).length).toBeGreaterThan(0);
    for (const [name, curve] of Object.entries(built.ease)) {
      expect(CSS.supports('transition-timing-function', curve), `ease ${name}: ${curve}`).toBe(true);
      expect(defined.get(`--ease-${name}`)).toBe(curve);
    }
  });

  it('every spring curve is a valid linear() from 0 to 1 with a settle time, and matches the JavaScript spring', () => {
    expect(Object.keys(built.spring).length).toBeGreaterThan(0);
    for (const [name, s] of Object.entries(built.spring)) {
      expect(CSS.supports('transition-timing-function', s.css), `spring ${name}: ${s.css}`).toBe(true);
      const points = s.css.slice('linear('.length, -1).split(',').map(Number);
      expect([points[0], points.at(-1)], `spring ${name} starts at 0 and settles at 1`).toEqual([0, 1]);
      expect(s.settle).toBeGreaterThan(0);
      expect(defined.get(`--spring-${name}`)).toBe(s.css);
      expect(springs[name as keyof typeof springs].stiffness).toBeCloseTo(s.stiffness, 1);
      expect(springs[name as keyof typeof springs].damping).toBeCloseTo(s.damping, 2);
    }
  });

  it('every recipe resolves to a valid transition and animation timing', () => {
    expect(Object.keys(built.motion).length).toBeGreaterThan(0);
    for (const name of Object.keys(built.motion)) {
      const raw = defined.get(`--motion-${name}`);
      expect(raw, `--motion-${name} is defined in :root`).toBeDefined();
      const recipe = resolve(raw!);
      expect(recipe, `--motion-${name} resolves every var()`).not.toMatch(/var\(/);
      expect(CSS.supports('transition', `opacity ${recipe}`), `--motion-${name}: ${recipe}`).toBe(true);
      expect(CSS.supports('animation', `cs-check ${recipe}`), `--motion-${name}: ${recipe}`).toBe(true);
      expect(recipe, `--motion-${name} is the normal recipe, not the reduced 1ms one`).not.toMatch(/^1ms\b/);
    }
  });
});
