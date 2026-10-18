import React from 'react';
import { tokens } from '../../tokens/tokens.js';
import {
  useLiveTokenValues,
  TokenTable,
  PageTitle,
  Lede,
  SectionTitle,
  LiveNote,
  Mono,
} from '../lib/live-tokens.jsx';

const SHADOW_NAMES = Object.keys(tokens.root.shadow);
const DEPTH_NAMES = Object.keys(tokens.root.depth);
const GLASS_NAMES = Object.keys(tokens.root.glass);

const ALL_NAMES = [...SHADOW_NAMES, ...DEPTH_NAMES, ...GLASS_NAMES];

const GLASS_TIERS = [
  { id: 'whisper', className: 'cs-surface-whisper', use: 'hero washes' },
  { id: 'light', className: 'cs-surface-light', use: 'nav / sidebar' },
  { id: 'standard', className: 'cs-surface-standard', use: 'cards over imagery' },
  { id: 'heavy', className: 'cs-surface-heavy', use: 'modals / popovers' },
  { id: 'solid', className: 'cs-surface-solid', use: 'dense content, tables' },
];

function ElevationPage() {
  const [ref, values] = useLiveTokenValues(ALL_NAMES);
  return (
    <div ref={ref} style={{ maxWidth: 920 }}>
      <PageTitle>Elevation</PageTitle>
      <Lede>
        Shadows are warm and umber-tinted — never grey, never harsh. Depth is an explicit
        z-scale mapped to the Liquid Glass tiers. Glass is opt-in and additive: apply a
        cs-surface-* class after checking contrast against the backdrop.
      </Lede>
      <LiveNote />

      <SectionTitle>Shadow scale</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, padding: '20px 8px 28px' }}>
        {SHADOW_NAMES.map((n) => (
          <div key={n} style={{ display: 'grid', gap: 10, justifyItems: 'center' }}>
            <div
              aria-hidden="true"
              style={{
                width: '100%',
                height: 72,
                borderRadius: 'var(--cs-radius-lg)',
                background: 'var(--cs-color-surface-panel)',
                border: '1px solid var(--cs-color-border-default)',
                boxShadow: values[n],
              }}
            />
            <Mono>{n.replace('--cs-shadow-', 'shadow-')}</Mono>
          </div>
        ))}
      </div>
      <TokenTable rows={SHADOW_NAMES.map((n) => ({ name: n, value: values[n] }))} />

      <SectionTitle>Z-depth scale</SectionTitle>
      <p className="cs-caption" style={{ margin: '0 0 10px' }}>
        bg 0 → section 5 → card 10 → nav 50 → dropdown 60 → overlay 80 → modal 100 → toast 200 — every layered
        surface takes its z-index from this ladder.
      </p>
      <TokenTable
        previewHeader="Ladder"
        rows={DEPTH_NAMES.map((n) => ({
          name: n,
          value: values[n],
          preview: (
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: Math.max(6, Math.min(64, (parseFloat(values[n]) || 0) / 3.2 + 6)),
                height: 12,
                borderRadius: 3,
                background: 'var(--cs-accent-strong)',
              }}
            />
          ),
        }))}
      />

      <SectionTitle>Liquid Glass tiers</SectionTitle>
      <p className="cs-caption" style={{ margin: '0 0 10px' }}>
        Five materials composed from the blur / saturate / opacity tokens below, rendered
        here over the element aurora wash. Glass collapses to solid under
        prefers-reduced-transparency, forced-colors, print, and unsupported browsers.
      </p>
      <div style={{ position: 'relative', borderRadius: 'var(--cs-radius-lg)', overflow: 'hidden', border: '1px solid var(--cs-color-border-default)', marginBottom: 12 }}>
        <div className="cs-aurora-wash" aria-hidden="true" style={{ position: 'absolute', inset: 0 }} />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(120deg, var(--cs-color-brand-umber), transparent 70%)',
            opacity: 0.5,
          }}
        />
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, padding: 24 }}>
          {GLASS_TIERS.map((t) => (
            <div key={t.id} className={t.className} style={{ borderRadius: 'var(--cs-radius-lg)', padding: '18px 14px', minHeight: 96 }}>
              <div style={{ fontWeight: 700, textTransform: 'capitalize' }}>{t.id}</div>
              <div className="cs-caption">{t.use}</div>
            </div>
          ))}
        </div>
      </div>
      <TokenTable rows={GLASS_NAMES.map((n) => ({ name: n, value: values[n] }))} />
    </div>
  );
}

export default {
  title: 'Foundations/Elevation',
  parameters: {
    docs: {
      description: {
        component: 'Warm umber-tinted shadow scale, z-depth ladder, and the five Liquid Glass tiers — live values.',
      },
    },
  },
};

export const DepthAndGlass = {
  name: 'Depth & glass',
  render: () => <ElevationPage />,
};
