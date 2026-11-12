import { tokens } from '@cyberskill/design/tokens';
import { usedBy } from './motion-math';
import './foundations.css';

type Mode = 'light' | 'dark';
const USES: Record<string, string> = {
  background: 'Page canvas', panel: 'Cards, panels, popovers', raised: 'Nested sections, hover rows, skeletons', border: 'Dividers, card edges',
  input: 'Form control borders', foreground: 'Headings and body text', muted: 'Secondary text, labels', primary: 'Ink: main actions, links, focus',
  'primary-foreground': 'Text on primary', accent: 'Gold: highlights, key action, AI', 'accent-foreground': 'Text on gold', 'accent-text': 'Gold as text',
  success: 'Success text and icons', warning: 'Warning text and icons', destructive: 'Errors, destructive actions', info: 'Information',
  'primary-soft': 'Selected rows, active nav', 'destructive-foreground': 'Text on destructive', 'success-foreground': 'Text on filled success',
  'warning-foreground': 'Text on filled warning', 'info-foreground': 'Text on filled info', ring: 'Focus ring',
  wash: 'Top of the page wash', 'accent-deep': 'End of the gold gradient', 'ink-lit': 'End of the ink gradient', 'on-ink': 'Text on ink', 'on-ink-muted': 'Secondary text on ink',
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
  // the soft, line, text and icon roles have their own table on the page
  const names = (Object.keys(tokens.color.light) as (keyof typeof tokens.color.light)[]).filter((n) => n in USES);
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
  type Check = { label: string; fg: string; bg: string; ratio: number; need: number };
  const light: Check[] = tokens.checks.light, dark: Check[] = tokens.checks.dark;
  // Pair by what is checked, not by position: dark has extra rows for the ink surface.
  const key = (c: Check) => `${c.label}|${c.fg}|${c.bg}`;
  const inDark = new Map(dark.map((c) => [key(c), c]));
  const inLight = new Set(light.map(key));
  const rows: [Check, Check | undefined, Check | undefined][] = [
    ...light.map((c): [Check, Check, Check | undefined] => [c, c, inDark.get(key(c))]),
    ...dark.filter((c) => !inLight.has(key(c))).map((c): [Check, undefined, Check] => [c, undefined, c]),
  ];
  return (
    <div className="fd-table not-prose">
      <table>
        <thead><tr><th>Pairing</th><th>Needs</th><th>Light</th><th>Dark</th></tr></thead>
        <tbody>
          {rows.map(([c, l, d]) => (
            <tr key={key(c)}>
              <td>{c.label}</td>
              <td className="fd-mono">{c.need}:1</td>
              <td className="fd-mono">{l ? `${l.ratio.toFixed(2)}:1` : '–'}</td>
              <td className="fd-mono">{d ? `${d.ratio.toFixed(2)}:1` : '–'}</td>
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

const Uses = ({ k }: { k: string }) => { const r = usedBy(k); return r.length ? <>{r.join(', ')}</> : <span className="fd-muted">No recipe</span>; };
const VALUE_USES: Record<string, string> = { 'press-scale': 'Scale while pressed', 'pop-scale': 'Where a popup grows from', 'modal-scale': 'Where a dialog grows from', rise: 'How far a revealed block rises', stagger: 'Gap between revealed blocks' };

/** Every motion token with the recipes that use it, read from the token build. */
export function MotionTokens() {
  return (
    <div className="fd-table not-prose">
      <table>
        <thead><tr><th>Token</th><th>Value</th><th>Used by</th></tr></thead>
        <tbody>
          {Object.entries(tokens.duration).map(([k, v]) => <tr key={k}><td className="fd-mono">--duration-{k}</td><td className="fd-mono">{v}</td><td><Uses k={k} /></td></tr>)}
          {Object.entries(tokens.ease).map(([k, v]) => <tr key={k}><td className="fd-mono">--ease-{k}</td><td className="fd-mono">{v}</td><td><Uses k={k} /></td></tr>)}
          {Object.entries(tokens.spring).map(([k, s]) => (
            <tr key={k}><td className="fd-mono">--spring-{k}</td><td className="fd-mono">{s.duration}s, bounce {s.bounce} · settles in {s.settle}ms</td><td><Uses k={k} /></td></tr>
          ))}
          {Object.entries(tokens.motionValue).map(([k, v]) => <tr key={k}><td className="fd-mono">--motion-{k}</td><td className="fd-mono">{v}</td><td>{VALUE_USES[k] ?? ''}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

const BUDGET = [['Neutrals', 76, '--raised'], ['Ink', 9, '--brand-ink'], ['Tints', 9, '--blue-line'], ['Gold', 4, '--accent'], ['Status', 2, '--success']] as const;

/** Share of each color family on a product screen: the target, drawn to scale. */
export function ColorBudget() {
  return (
    <figure className="fd-budget not-prose">
      <div className="fd-budget-bar" role="img" aria-label={`Color budget on a product screen: ${BUDGET.map(([n, v]) => `${n.toLowerCase()} ${v}%`).join(', ')}.`}>
        {BUDGET.map(([n, v, c]) => <i key={n} style={{ flex: v, background: `var(${c})` }} />)}
      </div>
      <figcaption className="fd-legend">
        {BUDGET.map(([n, v, c]) => <span key={n}><i style={{ background: `var(${c})` }} />{n} ~{v}%</span>)}
      </figcaption>
    </figure>
  );
}

// [label, token prefix, solid fill, text on the solid (none for categories), text role]
const ROLES: [string, string, string, string | null, string][] = [
  ['Ink', 'primary', 'primary', 'primary-foreground', 'primary'],
  ['Gold', 'accent', 'accent', 'accent-foreground', 'accent-text'],
  ...(['success', 'warning', 'destructive', 'info'] as const).map((k): [string, string, string, string, string] => [k === 'destructive' ? 'Danger' : k[0]!.toUpperCase() + k.slice(1), k, k, `${k}-foreground`, `${k}-text`]),
  ...tokens.category.map((k, i): [string, string, string, null, string] => [k[0]!.toUpperCase() + k.slice(1), k, `chart-${i + 1}`, null, `${k}-text`]),
];
const Swatch = ({ bg, fg, edge }: { bg: string; fg?: string | null; edge?: string }) => (
  <span className="fd-swt" style={{ background: `var(--${bg})`, color: fg ? `var(--${fg})` : undefined, border: edge ? `1.5px solid var(--${edge})` : undefined }}>{fg ? 'Aa' : ''}</span>
);

/** The five roles of every color, painted with the live tokens (they follow the site theme). */
export function ColorRoles() {
  return (
    <div className="fd-table fd-roles not-prose">
      <table>
        <thead><tr><th>Color</th><th>soft</th><th>soft-hover</th><th>line</th><th>solid</th><th>text</th></tr></thead>
        <tbody>
          {ROLES.map(([name, p, solid, on, text]) => (
            <tr key={name}>
              <td><b>{name}</b><br /><span className="fd-mono fd-muted">--{p}-*</span></td>
              <td><Swatch bg={`${p}-soft`} fg={text} /></td>
              <td><Swatch bg={`${p}-soft-hover`} fg={text} /></td>
              <td><Swatch bg="panel" edge={`${p}-line`} /></td>
              <td><Swatch bg={solid} fg={on} /></td>
              <td><Swatch bg="panel" fg={text} edge="border" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const GRADIENTS = [['ink', '42 of 50 seats'], ['wash', 'Overview'], ['gold', 'Start practice'], ['aurora', 'This week, in short']] as const;

/** The four gradient tokens, each painted. */
export function Gradients() {
  return (
    <div className="fd-grads not-prose">
      {GRADIENTS.map(([k, text]) => (
        <figure key={k} className="fd-grad">
          <div className="fd-grad-s" data-g={k} style={{ background: `var(--gradient-${k})` }}>{text}</div>
          <figcaption><code>--gradient-{k}</code></figcaption>
        </figure>
      ))}
    </div>
  );
}
