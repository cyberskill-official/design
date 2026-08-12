import React from 'react';
import { IframeSurface } from '../Maintainer/IframeSurface.jsx';

/**
 * Public Pages tier — full product UI kits (Atomic View “Pages”).
 * Matches guidelines/atomic-view.html PAGES list.
 */
export default {
  title: 'Pages',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full product recreations (UI kits). Same Theme × Element × Language × Style axes as templates; portable HTML under ui_kits/.',
      },
    },
  },
};

export const StatusHub = {
  name: 'Status Hub (product)',
  render: () => (
    <IframeSurface src="/ui_kits/status-hub/index.html" title="Status Hub" />
  ),
};

export const MarketingSite = {
  name: 'Marketing site',
  render: () => (
    <IframeSurface src="/ui_kits/website/index.html" title="Marketing site" />
  ),
};

export const SlideDeck = {
  name: 'Slide deck',
  render: () => <IframeSurface src="/ui_kits/deck/index.html" title="Slide deck" />,
};
