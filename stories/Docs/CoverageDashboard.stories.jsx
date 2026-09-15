import React from 'react';

const REQUIRED = [
  'Anatomy',
  'Usage',
  'States',
  'Keyboard / AT',
  'Tokens',
  'Code',
  'SSR',
  'Migration',
  'Design status',
];

export default {
  title: 'Docs/Start',
  parameters: { layout: 'padded' },
};

export const CoverageDashboard = {
  name: 'Coverage dashboard',
  render: () => (
    <article>
      <h1>Stable component docs coverage</h1>
      <p>
        Machine source: <code>docs/export-registry.json</code>. Live table:{' '}
        <a href="/_audit/docs-coverage.html">/_audit/docs-coverage.html</a>. Required
        headings: {REQUIRED.join(', ')}.
      </p>
      <p>Every Stable export has a Docs/Stable contracts story generated from the same template.</p>
    </article>
  ),
};
