import React from 'react';
import { Icon } from '../../components/icon/Icon.jsx';

/**
 * Shared helpers for the Foundations / A11y / Status docs pages.
 *
 * Pages import token NAMES (from tokens/tokens.js or enumerated groups) and
 * render VALUES read from the current CSS cascade via getComputedStyle.
 * Reads are taken from a node INSIDE the story tree so the toolbar axes
 * (data-theme / data-cs-element / data-cs-variant on the preview wrapper)
 * are honoured.
 */

/**
 * Read live computed values for a list of --cs-* custom properties.
 * Attach the returned ref to any element inside the scope you want to read.
 * Re-reads after renders, ancestor attribute changes, relevant OS preferences
 * and window resizes. This is a preview readout, not a CSS/visual certification.
 * Third tuple item reports the computed color scheme and a revision for consumers
 * that measure their own descendants (including callers with no token names).
 */
export function useLiveTokenValues(names) {
  const ref = React.useRef(null);
  const [values, setValues] = React.useState({});
  const [scope, setScope] = React.useState({ dark: false, revision: 0 });
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const read = (external = false) => {
      const cs = getComputedStyle(node);
      const next = {};
      for (const n of names) next[n] = cs.getPropertyValue(n).trim();
      setValues((prev) => Object.keys(prev).length === Object.keys(next).length &&
        names.every((n) => prev[n] === next[n]) ? prev : next);
      // color-scheme follows the actual nearest explicit/system CSS scope.
      const dark = cs.colorScheme === 'dark';
      setScope((prev) => !external && prev.dark === dark ? prev :
        { dark, revision: prev.revision + (external ? 1 : 0) });
    };
    read();
    let frame = null;
    const schedule = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => { frame = null; read(true); });
    };
    const observer = new MutationObserver(schedule);
    for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) {
      observer.observe(ancestor, { attributes: true, attributeFilter: [
        'data-theme', 'data-cs-element', 'data-cs-variant', 'data-cs-style',
        'data-cs-density', 'data-cs-contrast', 'style', 'class', 'lang', 'dir',
      ] });
    }
    const preferences = ['(prefers-color-scheme: dark)', '(prefers-contrast: more)',
      '(prefers-reduced-motion: reduce)'].map((query) => matchMedia(query));
    for (const preference of preferences) preference.addEventListener('change', schedule);
    window.addEventListener('resize', schedule);
    return () => {
      observer.disconnect();
      for (const preference of preferences) preference.removeEventListener('change', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  });
  return [ref, values, scope];
}

let sharedCanvasCtx = null;

/**
 * Resolve ANY computed CSS color string (hex, rgb(), oklab(), color-mix
 * results, …) to [r,g,b] by letting the browser paint it on a 1x1 canvas.
 * Returns null for non-opaque or unparseable values.
 */
export function resolveColorToRgb(colorStr) {
  if (!colorStr) return null;
  if (!sharedCanvasCtx) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    sharedCanvasCtx = canvas.getContext('2d', { willReadFrequently: true });
  }
  const ctx = sharedCanvasCtx;
  const SENTINEL = '#010203';
  ctx.fillStyle = SENTINEL;
  ctx.fillStyle = colorStr; // invalid values keep the sentinel
  if (ctx.fillStyle === SENTINEL && colorStr.trim().toLowerCase() !== SENTINEL) return null;
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  if (d[3] !== 255) return null;
  return [d[0], d[1], d[2]];
}

export function rgbToHex(rgb) {
  if (!rgb) return '';
  return (
    '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0').toUpperCase()).join('')
  );
}

/** Normalize a duration to ms for display ('.12s' → '120ms'); a faithful unit conversion. */
export function prettyDuration(v) {
  const m = /^(\d*\.?\d+(?:e[+-]?\d+)?)s$/i.exec(String(v || '').trim());
  if (m) {
    const ms = parseFloat(m[1]) * 1000;
    return `${Math.round(ms * 100) / 100}ms`;
  }
  return v;
}

/** Live prefers-reduced-motion readout (updates when the OS setting changes). */
export function useReducedMotionPref() {
  const [reduced, setReduced] = React.useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

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

const MONO = 'var(--cs-font-family-mono)';

/** Copy a token name to the clipboard (token names are the API). */
export function CopyButton({ text }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef(null);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable (e.g. insecure context) — leave the label as Copy */
    }
  };
  return (
    <button
      type="button"
      className="cs-button cs-button--ghost cs-button--xs"
      onClick={copy}
      aria-label={'Copy token name ' + text}
      style={{ gap: 6 }}
    >
      <Icon name={copied ? 'check' : 'copy'} size="sm" />
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function PageTitle({ children }) {
  return <h1 className="cs-h2" style={{ margin: '0 0 8px' }}>{children}</h1>;
}

export function Lede({ children }) {
  return (
    <p className="cs-body" style={{ margin: '0 0 20px', maxWidth: '72ch', color: 'var(--cs-color-text-muted)' }}>
      {children}
    </p>
  );
}

export function SectionTitle({ children }) {
  return <h2 className="cs-h4" style={{ margin: '28px 0 10px' }}>{children}</h2>;
}

export function LiveNote() {
  return (
    <p className="cs-caption" style={{ margin: '0 0 16px' }}>
      Values on this page are read live from the CSS cascade (getComputedStyle) inside the
      preview scope. Theme / Element toolbar changes and supported OS preference
      changes refresh these readings; inspect the rendered product separately.
    </p>
  );
}

export function Mono({ children, muted }) {
  return (
    <code
      style={{
        fontFamily: MONO,
        fontSize: 'var(--cs-font-size-xs)',
        color: muted ? 'var(--cs-color-text-muted)' : 'inherit',
        wordBreak: 'break-word',
      }}
    >
      {children}
    </code>
  );
}

/** Color swatch box; label/value always sit beside it, never on it. */
export function Swatch({ value, size = 40, radius = 8 }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        flex: 'none',
        display: 'inline-block',
        borderRadius: radius,
        background: value || 'transparent',
        border: '1px solid var(--cs-color-border-default)',
      }}
    />
  );
}

/**
 * Generic token table: optional preview cell, token name (+ copy), live value.
 * rows: [{ name, value, preview?, note? }]
 */
export function TokenTable({ rows, previewHeader = 'Preview' }) {
  const hasPreview = rows.some((r) => r.preview !== undefined);
  const th = {
    textAlign: 'left',
    padding: '8px 12px',
    fontSize: 'var(--cs-font-size-xs)',
    textTransform: 'uppercase',
    letterSpacing: 'var(--cs-letter-spacing-caps)',
    color: 'var(--cs-color-text-muted)',
    borderBottom: '1px solid var(--cs-color-border-default)',
  };
  const td = {
    padding: '8px 12px',
    borderBottom: '1px solid var(--cs-color-border-default)',
    verticalAlign: 'middle',
  };
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--cs-color-surface-panel)', borderRadius: 'var(--cs-radius-lg)', overflow: 'hidden', border: '1px solid var(--cs-color-border-default)' }}>
      <thead>
        <tr>
          {hasPreview ? <th style={th}>{previewHeader}</th> : null}
          <th style={th}>Token</th>
          <th style={th}>Live value</th>
          <th style={{ ...th, width: 96 }}>Copy</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            {hasPreview ? <td style={{ ...td, width: 72 }}>{r.preview ?? null}</td> : null}
            <td style={td}>
              <Mono>{r.name}</Mono>
              {r.note ? (
                <div className="cs-caption" style={{ marginTop: 2 }}>{r.note}</div>
              ) : null}
            </td>
            <td style={td}>
              <Mono muted>{r.value || '—'}</Mono>
            </td>
            <td style={{ ...td, textAlign: 'right' }}>
              <CopyButton text={r.name} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
