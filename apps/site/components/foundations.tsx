import { tokens } from '@cyberskill/design/tokens';

type Mode = 'light' | 'dark';
const USES: Record<string, string> = {
  background: 'Page canvas', panel: 'Cards, panels, popovers', raised: 'Nested sections, hover rows, skeletons', border: 'Dividers, card edges',
  input: 'Form control borders', foreground: 'Headings and body text', muted: 'Secondary text, labels', primary: 'Ink: main actions, links, focus',
  'primary-foreground': 'Text on primary', accent: 'Gold: highlights, key action, AI', 'accent-foreground': 'Text on gold', 'accent-text': 'Gold as text',
  success: 'Success text and icons', warning: 'Warning text and icons', destructive: 'Errors, destructive actions', info: 'Information',
  'primary-soft': 'Selected rows, active nav', 'destructive-foreground': 'Text on destructive', 'success-foreground': 'Text on filled success',
  'warning-foreground': 'Text on filled warning', 'info-foreground': 'Text on filled info', ring: 'Focus ring',
};

function lum(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}
// label color for a swatch: whichever of white or ink contrasts more (a fixed luminance cut-off left mid blues and golds below 4.5:1)
const ink = (hex: string) => {
  const l = lum(hex), ratio = (c: string) => { const m = lum(c); return (Math.max(l, m) + 0.05) / (Math.min(l, m) + 0.05); };
  // ink first, then white; black only for mid tones (chart blue, gold 500) where neither reaches 4.5:1
  return ['#0F1B2D', '#FFFFFF', '#000000'].find((c) => ratio(c) >= 4.5) ?? '#000000';
};

function Chip({ hex }: { hex: string }) {
  return (
    <span className="fd-chip">
      <i style={{ background: hex }} />
      {hex}
    </span>
  );
}

export function ColorTokens() {
  const names = Object.keys(tokens.color.light) as (keyof typeof tokens.color.light)[];
  return (
    <div className="fd-table not-prose">
      <table>
        <thead><tr><th>Token</th><th>Light</th><th>Dark</th><th>Use</th></tr></thead>
        <tbody>
          {names.map((n) => (
            <tr key={n}>
              <td className="fd-mono">--{n}</td>
              <td><Chip hex={tokens.color.light[n]} /></td>
              <td><Chip hex={tokens.color.dark[n]} /></td>
              <td>{USES[n] ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ColorSwatches({ mode = 'light' }: { mode?: Mode }) {
  const t = tokens.color[mode];
  const cards: [string, string, string][] = [
    ['Ink', t.primary, t['primary-foreground']], ['Gold', t.accent, t['accent-foreground']], ['Text', t.foreground, t.background],
    ['Muted', t.muted, t.background], ['Background', t.background, t.foreground], ['Panel', t.panel, t.foreground],
  ];
  return (
    <div className="fd-swatches not-prose" data-theme={mode}>
      {cards.map(([n, bg, fg]) => (
        <div key={n} className="fd-swatch">
          <div className="fd-swatch-fill" style={{ background: bg, color: fg }}>Aa</div>
          <div className="fd-swatch-meta"><b>{n}</b><span className="fd-mono">{bg}</span></div>
        </div>
      ))}
    </div>
  );
}

export function StatusColors() {
  return (
    <div className="fd-table not-prose">
      <table>
        <thead><tr><th>Status</th><th>Light</th><th>Dark</th><th>Always paired with</th></tr></thead>
        <tbody>
          {([['success', 'Check icon + text'], ['warning', 'Warning triangle + text'], ['destructive', 'X icon + text'], ['info', 'Info icon + text']] as const).map(([k, pair]) => (
            <tr key={k}>
              <td className="fd-mono">--{k}</td>
              <td><Chip hex={tokens.color.light[k]} /></td>
              <td><Chip hex={tokens.color.dark[k]} /></td>
              <td>{pair}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChartPalette() {
  return (
    <div className="fd-chart not-prose">
      {(['light', 'dark'] as const).map((m) => (
        <div key={m} className="fd-chart-panel" data-theme={m}>
          <span className="fd-mono fd-muted">{m === 'light' ? 'Light' : 'Dark'} · on {tokens.color[m].panel}</span>
          <div className="fd-chart-slots">
            {tokens.chart[m].map((h, i) => (
              <div key={h}>
                <div className="fd-chart-slot" style={{ background: h, color: ink(h) }}>{i + 1}</div>
                <span className="fd-mono fd-muted">{tokens.chart.names[i]}<br />{h}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Ramps() {
  return (
    <div className="fd-ramps not-prose">
      {(Object.entries(tokens.ramps) as [string, { step: number; hex: string; base?: boolean }[]][]).map(([name, steps]) => (
        <div key={name} className="fd-ramp-row">
          <b>{name}</b>
          <div className="fd-ramp">
            {steps.map((s) => (
              <div key={s.step} className="fd-ramp-step" data-base={s.base || undefined} style={{ background: s.hex, color: ink(s.hex) }}>
                <span>{s.step}</span><span>{s.hex.slice(1)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContrastChecks() {
  const light = tokens.checks.light, dark = tokens.checks.dark;
  return (
    <div className="fd-table not-prose">
      <table>
        <thead><tr><th>Pairing</th><th>Needs</th><th>Light</th><th>Dark</th></tr></thead>
        <tbody>
          {light.map((c, i) => (
            <tr key={c.label}>
              <td>{c.label}</td>
              <td className="fd-mono">{c.need}:1</td>
              <td className="fd-mono">{c.ratio.toFixed(2)}:1</td>
              <td className="fd-mono">{dark[i]!.ratio.toFixed(2)}:1</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const SAMPLE: Record<string, string> = {
  display: 'Software you can rely on', h1: 'Run AI in production', h2: 'Customer support copilot', h3: 'Deployment history', h4: 'Billing contact',
  'body-lg': 'We design, build and run SaaS and AI systems.', body: 'Every agent logs the sources it used to answer.', ui: 'Save changes · Invite people · Export CSV',
  caption: 'Last updated 2 minutes ago', overline: 'Workspace · Agents', code: 'POST /v1/agents',
};
export function TypeScale() {
  return (
    <div className="fd-table not-prose">
      <table>
        <thead><tr><th>Class</th><th>Sample</th><th>Spec</th></tr></thead>
        <tbody>
          {Object.entries(tokens.text).map(([k, t]) => (
            <tr key={k}>
              <td className="fd-mono">.cs-{k}</td>
              <td style={{ maxWidth: 520 }}><div className={`cs-${k}`} style={{ color: k === 'caption' || k === 'overline' ? undefined : 'var(--foreground)' }}>{SAMPLE[k]}</div></td>
              <td className="fd-mono fd-muted" style={{ whiteSpace: 'nowrap' }}>{t.family} · {t.size}/{t.line} · {t.weight}{t.tracking !== '0' ? ` · ${t.tracking}` : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SpaceScale() {
  return (
    <div className="fd-table not-prose">
      <table>
        <thead><tr><th>Token</th><th>Value</th><th>Size</th></tr></thead>
        <tbody>
          {Object.entries(tokens.space).filter(([k]) => k !== '0').map(([k, v]) => (
            <tr key={k}><td className="fd-mono">--space-{k}</td><td className="fd-mono">{v}px</td><td><span style={{ display: 'block', width: v, height: 12, borderRadius: 3, background: 'var(--accent)' }} /></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RadiusAndShadow() {
  return (
    <div className="fd-grid not-prose">
      {Object.entries(tokens.radius).map(([k, v]) => (
        <div key={k} className="fd-tile" style={{ borderRadius: Math.min(v, 40) }}><b className="fd-mono">--radius-{k}</b><span className="fd-muted">{v === 9999 ? 'pill' : `${v}px`}</span></div>
      ))}
      {Object.keys(tokens.shadow.light).map((k) => (
        <div key={k} className="fd-tile" style={{ boxShadow: `var(--shadow-${k})`, border: 0 }}><b className="fd-mono">--shadow-{k}</b><span className="fd-muted">{k === 'overlay' ? 'Dialogs, popovers' : k === 'lg' ? 'Dropdowns' : k === 'md' ? 'Raised cards' : 'Subtle lift'}</span></div>
      ))}
    </div>
  );
}

export function MotionTokens() {
  return (
    <div className="fd-table not-prose">
      <table>
        <thead><tr><th>Token</th><th>Value</th><th>Use</th></tr></thead>
        <tbody>
          {Object.entries(tokens.duration).map(([k, v]) => <tr key={k}><td className="fd-mono">--duration-{k}</td><td className="fd-mono">{v}</td><td>{k === 'fast' ? 'Hover, press, color changes' : k === 'base' ? 'Popovers, dialogs, toasts' : 'Large panels, page transitions'}</td></tr>)}
          {Object.entries(tokens.ease).map(([k, v]) => <tr key={k}><td className="fd-mono">--ease-{k}</td><td className="fd-mono">{v}</td><td>{k === 'standard' ? 'Most transitions' : k === 'emphasized' ? 'Entering elements that need attention' : 'Leaving elements'}</td></tr>)}
          {Object.entries(tokens.z).map(([k, v]) => <tr key={k}><td className="fd-mono">--z-{k}</td><td className="fd-mono">{v}</td><td>Stacking layer</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
