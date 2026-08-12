import React from 'react';
import { IframeSurface } from '../Maintainer/IframeSurface.jsx';

/**
 * Public Templates entry — Atomic View (Templates tier) plus authoring demos.
 * Individual starting points live under Templates/{Category} (manifest-generated).
 */
export default {
  title: 'Templates/Gallery',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Browse all 84 starting points (including HR Suite) via Atomic View, or open Kitchen Sink / Playground demos. Category stories under Templates/* iframe each .dc.html from the manifest.',
      },
    },
  },
};

/** Full atomic browser scrolled to the Templates tier (Foundations→…→Templates→Pages). */
export const AtomicGallery = {
  name: 'Atomic gallery',
  render: () => (
    <IframeSurface
      src="/guidelines/atomic-view.html#tier-templates"
      title="Templates — Atomic gallery"
    />
  ),
};

export const KitchenSink = {
  name: 'Kitchen sink',
  render: () => (
    <IframeSurface src="/templates/kitchen-sink.html" title="Template kitchen sink" />
  ),
};

export const Playground = {
  name: 'Playground',
  render: () => (
    <IframeSurface src="/templates/playground.html" title="Template playground" />
  ),
};
