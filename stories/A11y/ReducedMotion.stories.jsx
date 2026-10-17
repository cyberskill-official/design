import React from 'react';
import { Button } from '../../components/button/Button.jsx';
import {
  useLiveTokenValues,
  useReducedMotionPref,
  prettyDuration,
  PageTitle,
  Lede,
  SectionTitle,
  Mono,
} from '../lib/live-tokens.jsx';

function DemoTile({ title, note, duration, children }) {
  return (
    <div style={{ background: 'var(--cs-color-surface-panel)', border: '1px solid var(--cs-color-border-default)', borderRadius: 'var(--cs-radius-lg)', padding: 16, display: 'grid', gap: 10, alignContent: 'start' }}>
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div className="cs-caption">{note}</div>
      <div className="cs-caption" style={{ fontFamily: 'var(--cs-font-family-mono)' }}>duration in effect: {duration}</div>
      {children}
    </div>
  );
}

function Track({ on, transition, trackRef }) {
  return (
    <div style={{ position: 'relative', height: 24, borderRadius: 12, background: 'var(--cs-color-surface-raised)' }}>
      <span
        aria-hidden="true"
        ref={trackRef}
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 'calc(100% - 21px)' : '3px',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'var(--cs-accent-strong)',
          transition,
        }}
      />
    </div>
  );
}

function ReducedMotionPage() {
  const reduced = useReducedMotionPref();
  const [ref, values, scope] = useLiveTokenValues(['--cs-duration-base', '--cs-ease-standard']);
  const tokenTrack = React.useRef(null);
  const forcedTrack = React.useRef(null);
  const [durations, setDurations] = React.useState(['', '']);
  React.useEffect(() => {
    const next = [tokenTrack, forcedTrack].map((track) => prettyDuration(getComputedStyle(track.current).transitionDuration));
    setDurations((prev) => prev.every((value, i) => value === next[i]) ? prev : next);
  }, [reduced, scope.revision, values]);
  const [on, setOn] = React.useState(false);
  const liveDuration = prettyDuration(values['--cs-duration-base'] || '');
  return (
    <div ref={ref} style={{ maxWidth: 920 }}>
      <PageTitle>Reduced motion</PageTitle>
      <Lede>
        Motion is opt-out by construction: durations are tokens, and the tokens themselves
        become 0ms under prefers-reduced-motion. The global CSS safety net sets animation
        and transition durations to 0.01ms, with one animation iteration and automatic
        scrolling. CSS effects settle almost immediately; JavaScript-driven motion must
        also respect the preference.
      </Lede>
      <p className="cs-caption" style={{ margin: '0 0 16px' }}>
        Your OS setting right now: {reduced ? 'reduce motion — CSS transitions settle almost immediately' : 'full motion — flip “reduce motion” in OS accessibility settings and the computed durations refresh'}.
      </p>

      <SectionTitle>Side by side</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
        <DemoTile
          title="Token-driven (what ships)"
          note="transition uses var(--cs-duration-base) var(--cs-ease-standard); the token becomes 0ms under reduced motion; the global rule sets the computed duration to 0.01ms."
          duration={durations[0] + ' (token: ' + liveDuration + ')'}
        >
          <Track trackRef={tokenTrack} on={on} transition="left var(--cs-duration-base) var(--cs-ease-standard)" />
        </DemoTile>
        <DemoTile
          title="Simulated reduce-motion"
          note="an inline 0ms comparison; the global reduced-motion rule takes precedence under that OS preference."
          duration={durations[1]}
        >
          <Track trackRef={forcedTrack} on={on} transition="left 0ms linear" />
        </DemoTile>
      </div>
      <Button variant="secondary" size="sm" onClick={() => setOn((v) => !v)}>
        {on ? 'Return' : 'Play both'}
      </Button>

      <SectionTitle>How it is enforced</SectionTitle>
      <ul className="cs-body" style={{ maxWidth: '72ch', paddingLeft: 20, display: 'grid', gap: 6 }}>
        <li>
          <Mono>tokens/motion.css</Mono> — all four <Mono>--cs-duration-*</Mono> tokens
          become 0ms inside <Mono>@media (prefers-reduced-motion: reduce)</Mono>.
        </li>
        <li>
          <Mono>base/a11y.css</Mono> — global safety net: every animation/transition is
          set to 0.01ms under the same media query, covering hand-written CSS too.
        </li>
        <li>
          Content is never motion-dependent: a transition landing instantly must leave the
          UI fully usable (this page included).
        </li>
      </ul>
    </div>
  );
}

export default {
  title: 'A11y/Reduced motion',
  parameters: {
    docs: {
      description: {
        component:
          'Side-by-side CSS motion comparisons with computed transition durations and the live OS preference.',
      },
    },
  },
};

export const SideBySide = {
  name: 'Side by side',
  render: () => <ReducedMotionPage />,
};
