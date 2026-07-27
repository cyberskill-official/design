import React from 'react';
import { IframeSurface } from '../Maintainer/IframeSurface.jsx';

/**
 * Status — embeds the polished gate board (`/_audit/run.html`) full-bleed.
 * Behavior (documented for operators):
 * - First load of the iframe auto-runs every fast gate in sequence.
 * - Storybook navigation that keeps the iframe cached does not silently re-run;
 *   use the board's **Re-run** control for a fresh pass.
 * - Doctrine: VERSION pinned 1.1.0; no CHANGELOG.md — see Release Notes for product prose.
 */
export default {
  title: 'Status/Gate board',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-bleed embed of _audit/run.html. Auto-runs on first iframe load; Re-run on demand. Hard gates fail the aggregate; advisory rows are labelled and do not flip the board pass.',
      },
    },
  },
};

export const Overview = {
  name: 'Overview',
  render: () => (
    <IframeSurface
      src="/_audit/run.html"
      title="CyberSkill gate board"
      fullBleed
    />
  ),
};
