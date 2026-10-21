import React from 'react';
import { OverlayProvider } from '../components/overlays/OverlayManager.jsx';
import { Dialog } from '../components/dialog/Dialog.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Overlays/OverlayProvider',
  component: OverlayProvider,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
    children: {
      control: 'object',
    },
  },
};

export const Default = {
  render: function D(args) {
    const [open, setOpen] = React.useState(false);
    return (
      <OverlayProvider {...args}>
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
