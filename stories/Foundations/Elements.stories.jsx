import React from 'react';
import { tokens } from '../../tokens/tokens.js';
import {
  useLiveTokenValues,
  TokenTable,
  Swatch,
  PageTitle,
  Lede,
  SectionTitle,
  LiveNote,
  Mono,
} from '../lib/live-tokens.jsx';

/**
 * Foundations/Elements — the 15 Ngũ Hành element×variant packs. Pack keys and the
 * 10 accent role NAMES come from tokens/tokens.js; every VALUE is read live from a
 * node inside its own data-cs-element/data-cs-variant scope, so this page shows
 * exactly what tokens/elements.css ships.
 */

const ROLE_NAMES = Object.keys(tokens.root.accent);
const PACK_KEYS = Object.keys(tokens.elements);

const ELEMENT_META = {
  tho: { label: 'Thổ · Earth', defaultVariant: 'studio' },
  hoa: { label: 'Hỏa · Fire', defaultVariant: 'ember' },
  thuy: { label: 'Thủy · Water', defaultVariant: 'river' },
  moc: { label: 'Mộc · Wood', defaultVariant: 'leaf' },
  kim: { label: 'Kim · Metal', defaultVariant: 'champagne' },
};

function packParts(key) {
  const [element, variant] = key.split('.');
  const meta = ELEMENT_META[element] || { label: element, defaultVariant: 'default' };
  return {
    element,
    variant: variant || undefined,
    title: `${meta.label} — ${variant || meta.defaultVariant}`,
  };
}

function PackCard({ packKey }) {
  const { element, variant, title } = packParts(packKey);
  const [ref, values, scope] = useLiveTokenValues(ROLE_NAMES);
  return (
    <div
      ref={ref}
      data-cs-element={element}
      data-cs-variant={variant}
      style={{
        background: 'var(--cs-color-surface-panel)',
        border: '1px solid var(--cs-color-border-default)',
        borderRadius: 'var(--cs-radius-lg)',
        padding: 16,
        display: 'grid',
        gap: 10,
        alignContent: 'start',
      }}
    >
      <div>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div className="cs-caption" style={{ fontFamily: 'var(--cs-font-family-mono)' }}>
          data-cs-element="{element}"{variant ? ` data-cs-variant="${variant}"` : ''}
        </div>
      </div>
      <div
        aria-hidden="true"
        style={{
          height: 10,
          borderRadius: 5,
          background: 'linear-gradient(90deg, var(--cs-accent-grad-a), var(--cs-accent-grad-b))',
        }}
      />
      <div style={{ display: 'grid', gap: 4 }}>
        {ROLE_NAMES.map((n) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Swatch value={values[n]} size={18} radius={4} />
            <span style={{ fontFamily: 'var(--cs-font-family-mono)', fontSize: 'var(--cs-font-size-xs)', width: 168, flex: 'none' }}>
              {n.replace('--cs-', '')}
            </span>
            <span className="cs-caption" style={{ fontFamily: 'var(--cs-font-family-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {values[n]}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <span
          style={{
            background: scope.dark ? 'var(--cs-accent-strong)' : 'var(--cs-accent-bright)',
            color: 'var(--cs-accent-on)',
            borderRadius: 'var(--cs-radius-md)',
            padding: '6px 12px',
            fontWeight: 600,
            fontSize: 'var(--cs-font-size-sm)',
          }}
        >
          {scope.dark ? 'on / strong' : 'on / bright'}
        </span>
        <span
          style={{
            background: 'var(--cs-accent-tint)',
            color: 'var(--cs-accent-ink)',
            borderRadius: 'var(--cs-radius-md)',
            padding: '6px 12px',
            fontWeight: 600,
            fontSize: 'var(--cs-font-size-sm)',
          }}
        >
          ink / tint
        </span>
      </div>
    </div>
  );
}

function ElementsPage() {
  const [ref, values] = useLiveTokenValues(ROLE_NAMES);
  return (
    <div style={{ maxWidth: 1080 }}>
      <PageTitle>Elements — Ngũ Hành</PageTitle>
      <Lede>
        The studio itself is Thổ (Umber + Ochre). Each CyberSkill product may take one
        element via data-cs-element (+ data-cs-variant); inside that scope the pack sets
        the ten accent role tokens. Semantic
        statuses and the composite focus indicator are never elemental.
      </Lede>
      <LiveNote />

      <SectionTitle>The 10 accent roles (your current toolbar scope)</SectionTitle>
      <p className="cs-caption" style={{ margin: '0 0 10px' }}>
        This table reads from the page’s ambient scope — switch the Element toolbar item
        and the same ten names re-resolve. CTA text sits on bright (light), strong (dark), or tint, never on the
        mid-tone accent.
      </p>
      <div ref={ref}>
        <TokenTable
          previewHeader="Swatch"
          rows={ROLE_NAMES.map((n) => ({
            name: n,
            value: values[n],
            preview: <Swatch value={values[n]} />,
          }))}
        />
      </div>

      <SectionTitle>All 15 element × variant packs (pinned scopes)</SectionTitle>
      <p className="cs-caption" style={{ margin: '0 0 10px' }}>
        Each card pins its own data-cs-element/data-cs-variant, so all fifteen packs are
        shown at once regardless of the toolbar (theme still applies — in dark the
        APCA-derived dark packs take over). The gradient bar runs grad-a → grad-b
        (secondary elements only along Tương sinh). Chips demonstrate the legal CTA-ink
        pairings: accent-on on accent-bright in light (on accent-strong in dark), and
        accent-ink on accent-tint.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {PACK_KEYS.map((k) => (
          <PackCard key={k} packKey={k} />
        ))}
      </div>

      <SectionTitle>Rules</SectionTitle>
      <ul className="cs-body" style={{ maxWidth: '72ch', paddingLeft: 20, display: 'grid', gap: 6 }}>
        <li>Anything element-aware consumes <Mono>--cs-accent-*</Mono>, never raw hex.</li>
        <li>Mixing follows Tương sinh (Mộc → Hỏa → Thổ → Kim → Thủy → Mộc) as gradient endpoints only; Tương khắc pairs never mix.</li>
        <li>Lumi stays golden in every element — only the environment re-tints.</li>
        <li>Product → element mapping lives in docs/products.md.</li>
      </ul>
    </div>
  );
}

export default {
  title: 'Foundations/Elements',
  parameters: {
    docs: {
      description: {
        component:
          'The 15 Ngũ Hành element×variant packs with the 10 accent roles resolving live inside pinned data-cs-element/data-cs-variant scopes.',
      },
    },
  },
};

export const NguHanhPacks = {
  name: 'Ngũ Hành packs',
  render: () => <ElementsPage />,
};
