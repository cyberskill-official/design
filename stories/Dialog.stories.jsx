import React from 'react';
import { Dialog } from '../components/dialog/Dialog.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    actions: { control: 'object' },
    closeLabel: { control: 'text' },
    lang: { control: 'select', options: ['en', 'vi'] },
    onClose: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Dialog. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: function OpenDialog() { const [open, setOpen] = React.useState(true); return (<><Button onClick={() => setOpen(true)}>Open</Button><Dialog open={open} title="Confirm" onClose={() => setOpen(false)} actions={<Button onClick={() => setOpen(false)}>OK</Button>}><p style={{ margin: 0 }}>Host Live matrix.</p></Dialog></>); } };

export const Matrix = {
  name: 'Matrix / Open states',
  render: function D() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} title="Matrix" onClose={() => setOpen(false)} actions={<Button onClick={() => setOpen(false)}>Close</Button>}>
          <p>Mounted dialog body</p>
        </Dialog>
      </>
    );
  },
};
