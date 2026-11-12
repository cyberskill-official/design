import { render, screen } from '@testing-library/react';
import { MotionConfigContext, type MotionConfigContext as Config } from 'motion/react';
import { act, useContext } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import foundations from '../../tokens/foundations.json';
import { AnimatedNumber, MotionProvider, springs, transitions } from './index';
import { expectAccessibleInThemes } from '../test/a11y';

// The test browser asks for reduced motion (vitest.config.ts). For the full animation, pretend the reader did not.
const fullMotion = () => vi.spyOn(window, 'matchMedia').mockImplementation(media =>
  ({ matches: false, media, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false }) as MediaQueryList);
afterEach(() => vi.restoreAllMocks());

const group = <T,>(g: object) => Object.entries(g).filter(([k]) => !k.startsWith('$')) as [string, T][];
const camel = (k: string) => k.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
const digitsOf = (el: Element) => el.querySelector('[aria-hidden="true"]')!;
/** Every text the visible digits show, in order. */
const recordFrames = (digits: Element) => {
  const frames: string[] = [];
  new MutationObserver(() => frames.push(digits.textContent!)).observe(digits, { childList: true, characterData: true, subtree: true });
  return frames;
};

describe('springs and transitions', () => {
  it('turn each token spring into a Motion spring with the same period and bounce', () => {
    const tokens = group<{ duration: number; bounce: number }>(foundations.spring);
    expect(Object.keys(springs).sort()).toEqual(tokens.map(([name]) => name).sort());
    for (const [name, { duration, bounce }] of tokens) {
      const s = springs[name as keyof typeof springs];
      expect(s).toMatchObject({ type: 'spring', mass: 1 });
      expect(s.stiffness).toBeCloseTo(((2 * Math.PI) / duration) ** 2, 9);
      expect(s.damping).toBeCloseTo((4 * Math.PI * (1 - bounce)) / duration, 9);
      // what those formulas mean: the undamped period is the token duration, the damping ratio is 1 - bounce
      expect((2 * Math.PI) / Math.sqrt(s.stiffness / s.mass)).toBeCloseTo(duration, 9);
      expect(s.damping / (2 * Math.sqrt(s.stiffness * s.mass))).toBeCloseTo(1 - bounce, 9);
    }
  });

  it('have one camelCase transition per recipe: timed pairs in seconds on the token curve, spring names as springs', () => {
    const recipes = group<string | [string, string]>(foundations.motion);
    const durations: Record<string, string> = foundations.duration, eases: Record<string, string> = foundations.ease;
    expect(Object.keys(transitions).sort()).toEqual(recipes.map(([k]) => camel(k)).sort());
    expect(transitions.popIn).toBeDefined();
    for (const [name, value] of recipes) {
      const t = transitions[camel(name) as keyof typeof transitions];
      if (typeof value === 'string') { expect(t).toBe(springs[value as keyof typeof springs]); continue; }
      expect(t).toEqual({ duration: parseFloat(durations[value[0]]!) / 1000, ease: eases[value[1]]!.match(/[\d.]+/g)!.map(Number) });
      expect(`cubic-bezier(${(t as { ease: number[] }).ease.join(', ')})`).toBe(eases[value[1]]);
    }
  });
});

describe('MotionProvider', () => {
  let seen: Config | undefined;
  const Probe = () => { seen = useContext(MotionConfigContext); return null; };

  it("follows the reader's reduced-motion setting and moves on the move spring by default", () => {
    render(<MotionProvider><Probe /></MotionProvider>);
    expect(seen).toMatchObject({ reducedMotion: 'user', transition: transitions.move });
  });

  it('passes other MotionConfig props through and lets them override the defaults', () => {
    render(<MotionProvider reducedMotion="always" transition={transitions.fade} nonce="abc"><Probe /></MotionProvider>);
    expect(seen).toMatchObject({ reducedMotion: 'always', transition: transitions.fade, nonce: 'abc' });
  });
});

describe('AnimatedNumber', () => {
  it('formats with Intl.NumberFormat in tabular digits', () => {
    render(<AnimatedNumber value={1284000} locale="vi-VN" format={{ style: 'currency', currency: 'VND' }} data-testid="n" className="mine" />);
    const n = screen.getByTestId('n');
    expect(n).toHaveClass('cs-animated-number', 'mine');
    expect(getComputedStyle(n).fontVariantNumeric).toBe('tabular-nums');
    expect(n.querySelector('.cs-visually-hidden')!.textContent).toBe(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1284000));
  });

  it('without a locale prop, a server and a browser in different locales render the same digits', async () => {
    const ui = <p><AnimatedNumber value={1284.5} /></p>;
    const host = document.body.appendChild(document.createElement('div'));
    host.innerHTML = renderToString(ui); // the server, in this runtime's locale
    expect(host.textContent).toBe('1,284.51,284.5'); // en-US: visible digits, then the screen-reader copy

    // the browser in Vietnamese: any Intl.NumberFormat without an explicit locale would format as vi-VN
    const Real = Intl.NumberFormat;
    vi.spyOn(Intl, 'NumberFormat').mockImplementation(function (locale?: Intl.LocalesArgument, options?: Intl.NumberFormatOptions) {
      return new Real(locale ?? 'vi-VN', options);
    } as typeof Intl.NumberFormat);
    const errors = vi.spyOn(console, 'error');
    const root = await act(async () => hydrateRoot(host, ui, { onRecoverableError: e => console.error(e) }));
    expect(errors).not.toHaveBeenCalled(); // no hydration mismatch
    expect(host.textContent).toBe('1,284.51,284.5');
    act(() => root.unmount());
  });

  it('renders its value on mount without counting', async () => {
    fullMotion();
    render(<h2>Learners <AnimatedNumber value={1284} locale="en-US" /></h2>);
    const digits = digitsOf(screen.getByRole('heading'));
    const frames = recordFrames(digits);
    expect(digits.textContent).toBe('1,284');
    await new Promise(r => setTimeout(r, 100));
    expect(frames).toEqual([]);
  });

  it('counts to a new value on screen while assistive tech reads only the final value', async () => {
    fullMotion();
    const { rerender } = render(<h2>Learners <AnimatedNumber value={0} locale="en-US" /></h2>);
    const digits = digitsOf(screen.getByRole('heading'));
    const frames = recordFrames(digits);

    rerender(<h2>Learners <AnimatedNumber value={1284} locale="en-US" /></h2>);
    expect(screen.getByRole('heading', { name: 'Learners 1,284' })).toBeInTheDocument();
    expect(digits.textContent).toBe('0');
    await expect.poll(() => digits.textContent, { timeout: 2000 }).toBe('1,284');
    expect(screen.getByRole('heading', { name: 'Learners 1,284' })).toBeInTheDocument();
    // whole numbers only on the way, and never backwards
    const values = frames.map(f => Number(f.replace(/,/g, '')));
    expect(frames.every(f => /^[\d,]+$/.test(f))).toBe(true);
    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(values.length).toBeGreaterThan(2);
  });

  it('with from, server HTML shows from in the digits and the value to screen readers, and hydrates into a count', async () => {
    fullMotion();
    const ui = <h2>Learners <AnimatedNumber value={1284} from={0} locale="en-US" /></h2>;
    const host = document.body.appendChild(document.createElement('div'));
    host.innerHTML = renderToString(ui);
    const digits = digitsOf(host);
    expect(digits.textContent).toBe('0');
    expect(host.querySelector('.cs-visually-hidden')!.textContent).toBe('1,284');
    expect(screen.getByRole('heading', { name: 'Learners 1,284' })).toBeInTheDocument();

    const errors = vi.spyOn(console, 'error');
    const root = await act(async () => hydrateRoot(host, ui, { onRecoverableError: e => console.error(e) }));
    expect(errors).not.toHaveBeenCalled(); // no hydration mismatch
    expect(digitsOf(host)).toBe(digits); // the server's nodes are kept, not replaced
    await expect.poll(() => digits.textContent, { timeout: 2000 }).toBe('1,284');
    act(() => root.unmount());
  });

  it('with reduced motion shows the final value at once: with from, and on change', () => {
    const { rerender } = render(<h2>Learners <AnimatedNumber value={1284} from={0} locale="en-US" /></h2>);
    const digits = digitsOf(screen.getByRole('heading'));
    expect(digits.textContent).toBe('1,284');
    rerender(<h2>Learners <AnimatedNumber value={1300} from={0} locale="en-US" /></h2>);
    expect(digits.textContent).toBe('1,300');
    expect(screen.getByRole('heading', { name: 'Learners 1,300' })).toBeInTheDocument();
  });

  it('also shows the final value at once under MotionProvider reducedMotion="always"', () => {
    fullMotion();
    const { rerender } = render(<MotionProvider reducedMotion="always"><p><AnimatedNumber value={5} locale="en-US" /></p></MotionProvider>);
    rerender(<MotionProvider reducedMotion="always"><p><AnimatedNumber value={9} locale="en-US" /></p></MotionProvider>);
    expect(digitsOf(document.body).textContent).toBe('9');
  });

  it('has no axe violations in light and dark', async () => {
    await expectAccessibleInThemes(<p>Active learners: <AnimatedNumber value={1284} /></p>);
  });
});
