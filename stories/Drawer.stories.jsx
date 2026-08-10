import React from 'react';
import { Drawer } from '../components/overlays/Drawer.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

  "open": {
    "control": "boolean"
  },
  "title": {
    "control": "object"
  },
  "side": {
    "control": "select",
    "options": [
      "right",
      "left"
    ]
  },
  "actions": {
    "control": "object"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Drawer. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: function D() { const [open, setOpen] = React.useState(true); return (<><Button onClick={() => setOpen(true)}>Open drawer</Button><Drawer open={open} onClose={() => setOpen(false)} title="Filters"><p>Drawer body</p></Drawer></>); } };

export const Matrix = {
  name: 'Matrix / Open',
  render: function D() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer open={open} onClose={() => setOpen(false)} title="Matrix"><p>Body</p></Drawer>
      </>
    );
  },
};
