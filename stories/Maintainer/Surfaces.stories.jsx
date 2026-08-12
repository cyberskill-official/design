import React from 'react';
import { IframeSurface } from './IframeSurface.jsx';

/**
 * Maintainer-only portable surfaces iframed into Storybook.
 * Public Templates (incl. HR Suite) and Pages live in top-level sidebar groups;
 * Atomic View remains here for gates / clone-and-open as well as Templates/Gallery.
 * Portable HTML remains in-tree; Storybook at `/` is the product surface.
 */
export default {
  title: 'Maintainer/Surfaces',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Maintainer surfaces (Motion, Status Hub, Website, Deck, template demos, AI cluster, RTL, Atomic View). Operators browse Templates and Pages from the public sidebar; Atomic View stays available here for gates.',
      },
    },
  },
};

export const Motion = {
  render: () => <IframeSurface src="/guidelines/motion.html" title="Motion" />,
};

export const StatusHub = {
  name: 'Status Hub',
  render: () => <IframeSurface src="/ui_kits/status-hub/index.html" title="Status Hub" />,
};

export const Website = {
  name: 'Website',
  render: () => <IframeSurface src="/ui_kits/website/index.html" title="Website" />,
};

export const Deck = {
  name: 'Deck',
  render: () => <IframeSurface src="/ui_kits/deck/index.html" title="Deck" />,
};

export const TemplatePlayground = {
  name: 'Template Playground',
  render: () => <IframeSurface src="/templates/playground.html" title="Template playground" />,
};

export const KitchenSink = {
  name: 'Kitchen Sink',
  render: () => <IframeSurface src="/templates/kitchen-sink.html" title="Kitchen sink" />,
};

export const ImageSlots = {
  name: 'Image Slots',
  render: () => <IframeSurface src="/templates/image-slots-demo.html" title="Image slots" />,
};

export const AICluster = {
  name: 'AI Cluster',
  render: () => <IframeSurface src="/templates/ai-cluster-demo.html" title="AI cluster" />,
};

export const RTL = {
  render: () => <IframeSurface src="/guidelines/rtl-preview.html" title="RTL" />,
};

/** Gate / portable consumer surface — also linked from Templates/Gallery. */
export const AtomicView = {
  name: 'Atomic View (gates)',
  render: () => <IframeSurface src="/guidelines/atomic-view.html" title="Atomic View" />,
};
