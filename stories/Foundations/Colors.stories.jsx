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
} from '../lib/live-tokens.jsx';

/**
 * Foundations/Colors — token NAMES enumerated from tokens/tokens.js, VALUES read
 * live from the cascade so theme/element toolbar switches are reflected and the
 * page reports the current preview scope.
 */

const COLOR_NAMES = Object.keys(tokens.root.color);

const GROUPS = [
  { id: 'brand', title: 'Brand anchors', match: (n) => n.includes('-brand-') || n === '--cs-color-accent-ochre', note: 'Umber and Ochre are brand anchors. Semantic text roles follow the theme; element scopes may replace accent roles. The focus halo keeps Ochre.' },
  { id: 'surface', title: 'Surfaces', match: (n) => n.includes('-surface-'), note: 'Warm paper, never cold: page, panel, raised.' },
  { id: 'text', title: 'Text', match: (n) => n.includes('-text-'), note: 'Primary is Umber in light theme; every neutral is warmed toward umber.' },
  { id: 'semantic', title: 'Semantic status', match: (n) => n.includes('-semantic-'), note: 'Used sparingly and never as the only signal — meaning is always carried in words too.' },
  { id: 'link', title: 'Links', match: (n) => n.includes('-link'), note: 'Follows the element accent inside a data-cs-element scope.' },
  { id: 'border', title: 'Borders', match: (n) => n.includes('-border-'), note: 'Warm hairline.' },
];

function groupNames() {
  const used = new Set();
  const out = GROUPS.map((g) => {
    const names = COLOR_NAMES.filter((n) => !used.has(n) && g.match(n));
    names.forEach((n) => used.add(n));
    return { ...g, names };
  });
  const rest = COLOR_NAMES.filter((n) => !used.has(n));
  if (rest.length) out.push({ id: 'other', title: 'Other', note: '', names: rest });
  return out;
}

function ColorsPage() {
  const groups = groupNames();
  const [ref, values] = useLiveTokenValues(COLOR_NAMES);
  return (
    <div ref={ref} style={{ maxWidth: 920 }}>
      <PageTitle>Colors</PageTitle>
      <Lede>
        Warm earth, never cold. Umber #45210E and Ochre #F4BA17 are the immutable anchors;
        surfaces are warm paper; semantic colours are quiet. Max one accent per surface.
        Token names are the API — copy the name, never hardcode the hex.
      </Lede>
      <LiveNote />
      {groups.map((g) => (
        <section key={g.id}>
          <SectionTitle>{g.title}</SectionTitle>
          {g.note ? <p className="cs-caption" style={{ margin: '0 0 10px' }}>{g.note}</p> : null}
          <TokenTable
            previewHeader="Swatch"
            rows={g.names.map((n) => ({
              name: n,
              value: values[n],
              preview: <Swatch value={values[n]} />,
            }))}
          />
        </section>
      ))}
      <SectionTitle>Rules that ride on these tokens</SectionTitle>
      <ul className="cs-body" style={{ maxWidth: '72ch', paddingLeft: 20, display: 'grid', gap: 6 }}>
        <li>Dark theme overrides live in the same token names — flip the Theme toolbar above to watch every value re-resolve.</li>
        <li>Inside a product scope (<code>data-cs-element</code>) the element pack takes the accent roles — see Foundations/Elements.</li>
        <li>Text never sits on the mid-tone accent; body text holds APCA Lc ≥ 75 — see A11y/Contrast (APCA).</li>
      </ul>
    </div>
  );
}

export default {
  title: 'Foundations/Colors',
  parameters: {
    docs: {
      description: {
        component:
          'Brand anchors, surfaces, text, semantic and link colours — names from tokens.js, values read live from the cascade (live computed values).',
      },
    },
  },
};

export const Palette = {
  render: () => <ColorsPage />,
};
