import { DECLARED_DOMAINS } from './declared-domains.mjs';
import React from 'react';
import { Drawer } from '../components/overlays/Drawer.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
    lang: { control: 'select', options: ['en', 'vi'] },

  "open": {
    "control": "boolean"
  },
  "title": {
    "control": "object"
  },
  "side": {
    "control": "select",
    "options": DECLARED_DOMAINS.Drawer["side"]
  },
  "actions": {
    "control": "object"
  }
},
};

export const Default = { render: function D(args) { const [open, setOpen] = React.useState(true); return (<><Button onClick={() => setOpen(true)}>Open drawer</Button><Drawer open={open} onClose={() => setOpen(false)} title="Filters" {...args}><p>Drawer body</p></Drawer></>); } };

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
