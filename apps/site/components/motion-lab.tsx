'use client';
import { Play } from '@phosphor-icons/react';
import { Button, CodeBlock, SegmentedControl, Slider } from '@cyberskill/design';
import { tokens } from '@cyberskill/design/tokens';
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { curvePoints, polyline, recipe, scaledRecipes, spring, usedBy } from './motion-math';
import './foundations.css';

/* ---------- ¼× slow: one switch state shared by every toggle on the page ---------- */
const SLOW: [string, string][] = [...scaledRecipes(4), ['--fd-speed', '4']];
const REDUCE = '(prefers-reduced-motion: reduce)';
let slow = false;
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => (listeners.add(fn), () => void listeners.delete(fn));
function setSlow(on: boolean) {
  if (slow === on) return;
  slow = on;
  // Recipes resolve on :root, so slowing them there slows every component on the page, popups included.
  const style = document.documentElement.style;
  for (const [k, v] of SLOW) on ? style.setProperty(k, v) : style.removeProperty(k);
  listeners.forEach((fn) => fn());
}
const watchReduce = (fn: () => void) => { const m = matchMedia(REDUCE); m.addEventListener('change', fn); return () => m.removeEventListener('change', fn); };

/** 1× / ¼× switch. Off while the reader asks for reduced motion, since the inline recipes would override that. */
export function SpeedToggle() {
  const on = useSyncExternalStore(subscribe, () => slow, () => false);
  const reduced = useSyncExternalStore(watchReduce, () => matchMedia(REDUCE).matches, () => false);
  useEffect(() => { if (reduced) setSlow(false); }, [reduced]);
  useEffect(() => () => setSlow(false), []);
  return (
    <SegmentedControl
      size="sm"
      label="Playback speed"
      disabled={reduced}
      value={on ? 'slow' : 'normal'}
      onValueChange={(v) => setSlow(v === 'slow')}
      items={[{ value: 'normal', label: '1×' }, { value: 'slow', label: '¼× slow' }]}
    />
  );
}

/* ---------- the eight lanes ---------- */
type Lane = { name: string; token: string; ms: number; css: string; kind: 'linear' | 'curve' | 'spring' };
const SLOW_MS = parseFloat(tokens.duration.slow);
// A curve runs at the duration of the first recipe that uses it; a spring for its settling time.
const curve = (name: string, key: keyof typeof tokens.ease): Lane => {
  const r = usedBy(key)[0];
  return { name, token: `--ease-${key}`, ms: r ? recipe(r)[0] : SLOW_MS, css: tokens.ease[key], kind: 'curve' };
};
const springLane = (name: string, key: keyof typeof tokens.spring): Lane => ({ name, token: `--spring-${key}`, ms: tokens.spring[key].settle, css: tokens.spring[key].css, kind: 'spring' });
const LANES: Lane[] = [
  { name: 'Linear', token: 'loading loops only', ms: SLOW_MS, css: 'linear', kind: 'linear' },
  curve('Standard', 'standard'),
  curve('Ease out', 'out'),
  curve('Ease in-out', 'in-out'),
  curve('Sheet', 'sheet'),
  springLane('Spring smooth', 'smooth'),
  springLane('Spring snappy', 'snappy'),
  springLane('Spring bouncy', 'bouncy'),
];
const timing = (ms: number, css: string) => ({ '--fd-ms': ms, '--fd-ease': css }) as CSSProperties;

/** The same distance on every curve and spring token. Play again halfway to see each one reverse. */
export function CurveLab({ speedToggle = true }: { speedToggle?: boolean }) {
  const [go, setGo] = useState(false);
  return (
    <div className="fd-panel not-prose">
      <div className="fd-panel-head">
        <h3 className="fd-panel-title">Same distance, eight ways</h3>
        <div className="fd-panel-actions">
          {speedToggle && <SpeedToggle />}
          <Button size="sm" iconStart={<Play />} onClick={() => setGo(!go)}>{go ? 'Reverse' : 'Play'}</Button>
        </div>
      </div>
      <p className="fd-note">Press Play, then Reverse halfway: every lane turns back from where it is. Gold lanes are springs.</p>
      <div className="fd-lanes" data-go={go || undefined}>
        {LANES.map((l) => (
          <div key={l.name} className="fd-lane" data-kind={l.kind}>
            <div className="fd-lane-label">
              <b>{l.name}</b>
              <code>{l.kind === 'linear' ? l.token : `${l.ms}ms · ${l.token}`}</code>
            </div>
            <div className="fd-track"><i className="fd-ball" style={timing(l.ms, l.css)} /></div>
            <svg className="fd-curve" viewBox="0 0 64 40" preserveAspectRatio="none" aria-hidden="true">
              <line x1="0" y1="34" x2="64" y2="34" />
              <polyline points={polyline(curvePoints(l.css), 64, 40, 6)} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- spring tuner ---------- */
const SNAPPY = tokens.spring.snappy;

/** Duration and bounce in, the CSS linear() curve and the same spring as stiffness and damping out. */
export function SpringTuner() {
  const [ms, setMs] = useState(SNAPPY.duration * 1000);
  const [bounce, setBounce] = useState<number>(SNAPPY.bounce);
  const [go, setGo] = useState(false);
  const s = spring(ms / 1000, bounce);
  const token = (Object.entries(tokens.spring) as [string, { duration: number; bounce: number }][]).find(([, t]) => t.duration * 1000 === ms && Math.round(t.bounce * 100) === Math.round(bounce * 100))?.[0];
  const code = [
    `/* CSS: settles in ${s.settle}ms${token ? `, the same as --spring-${token}` : ''} */`,
    `transition: transform ${s.settle}ms ${s.css};`,
    '',
    '/* Motion (JavaScript) */',
    `{ type: 'spring', stiffness: ${s.stiffness}, damping: ${s.damping}, mass: 1 }`,
  ].join('\n');
  return (
    <div className="fd-panel not-prose">
      <div className="fd-panel-head">
        <h3 className="fd-panel-title">Spring tuner</h3>
        <Button size="sm" variant="secondary" iconStart={<Play />} onClick={() => setGo(!go)}>{go ? 'Reverse' : 'Play'}</Button>
      </div>
      <svg className="fd-big-curve" viewBox="0 0 100 60" preserveAspectRatio="none" role="img" aria-label={`Spring curve: ${ms}ms, bounce ${bounce.toFixed(2)}, settles in ${s.settle}ms`}>
        <line x1="0" y1="50" x2="100" y2="50" />
        <line x1="0" y1="10" x2="100" y2="10" />
        <polyline points={polyline(s.pts, 100, 60, 10)} />
      </svg>
      <div className="fd-tuner-track" data-go={go || undefined}><i className="fd-tuner-box" style={timing(s.settle, s.css)} /></div>
      <div className="fd-sliders">
        <Slider label="Duration" min={150} max={800} step={10} value={ms} onValueChange={(v) => setMs(v as number)} format={{ style: 'unit', unit: 'millisecond', unitDisplay: 'short' }} />
        <Slider label="Bounce" min={0} max={0.5} step={0.05} value={bounce} onValueChange={(v) => setBounce(v as number)} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} />
      </div>
      <CodeBlock code={code} title="Same spring, two forms" wrap />
      <p className="fd-note">Duration is how long the move feels, bounce is how far it overshoots. The token build turns each spring token into both forms, so CSS and the animation library move the same way.</p>
    </div>
  );
}
