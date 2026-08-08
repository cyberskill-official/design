import React from 'react';
import { OverlayProvider } from '../components/overlays/OverlayManager.jsx';
import { Dialog } from '../components/dialog/Dialog.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Overlays/OverlayProvider',
  component: OverlayProvider,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'object',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Host Live CSF — Default plus honest control matrix mounting OverlayProvider. Portable consumers use styles.css + bundle, not Storybook. Provider mounts `#cs-overlay-root` and stacks Escape/scroll-lock for nested modals.',
      },
    },
  },
};

export const Default = {
  render: function D() {
    const [open, setOpen] = React.useState(false);
    return (
      <OverlayProvider>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} title="Managed dialog" onClose={() => setOpen(false)}>
          Nested overlays register with the provider stack.
        </Dialog>
      </OverlayProvider>
    );
  },
};

export const Matrix = {
  name: 'Matrix / Nested-safe',
  render: function M() {
    const [open, setOpen] = React.useState(true);
    return (
      <OverlayProvider>
        <Dialog open={open} title="Matrix" onClose={() => setOpen(false)} actions={<Button onClick={() => setOpen(false)}>Close</Button>}>
          Provider + dialog matrix mount.
        </Dialog>
      </OverlayProvider>
    );
  },
};
