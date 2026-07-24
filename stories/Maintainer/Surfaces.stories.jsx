import React from 'react';
import { IframeSurface } from './IframeSurface.jsx';

/**
 * Maintainer-only portable surfaces iframed into Storybook.
 * Atomic View stays for gates / clone-and-open — not a public product entry.
 * Portable HTML remains in-tree; Storybook at `/` is the product surface.
 */
export default {
  title: 'Maintainer/Surfaces',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Maintainer surfaces (Motion, Identity Lab, Status Hub, Website, Deck, templates, kitchen-sink, AI cluster, RTL, Atomic View). Atomic View is buried here for gates — not a public top-level Docs entry.',
      },
    },
  },
};

export const Motion = {
  render: () => <IframeSurface src="/guidelines/motion.html" title="Motion" />,
};

export const IdentityLab = {
  name: 'Identity Lab',
  render: () => <IframeSurface src="/ui_kits/status-hub/identity-lab.html" title="Identity Lab" />,
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

/** Gate / portable consumer surface — last in the Maintainer list on purpose. */
export const AtomicView = {
  name: 'Atomic View (gates)',
  render: () => <IframeSurface src="/guidelines/atomic-view.html" title="Atomic View" />,
};
