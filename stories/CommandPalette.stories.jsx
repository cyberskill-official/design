import React from 'react';
import { CommandPalette } from '../components/navigation/CommandPalette.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Navigation/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

  "open": {
    "control": "boolean"
  },
  "placeholder": {
    "control": "text"
  },
  "groups": {
    "control": "object"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting CommandPalette. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
};

export const Default = { render: function C() { const [open, setOpen] = React.useState(true); return (<><Button onClick={() => setOpen(true)}>Open palette</Button><CommandPalette open={open} onClose={() => setOpen(false)} groups={[{ label: 'Navigate', items: [{ label: 'Go to Live', onSelect: () => setOpen(false) }, { label: 'Tokens', onSelect: () => setOpen(false) }] }]} /></>); } };

export const Matrix = {
  name: 'Matrix / Groups',
  render: function C() {
    const [open, setOpen] = React.useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <CommandPalette
          open={open}
          onClose={() => setOpen(false)}
          groups={[
            { label: 'Navigate', items: [{ label: 'Live hub', onSelect: () => setOpen(false) }] },
            { label: 'Tools', items: [{ label: 'Tokens', onSelect: () => setOpen(false) }, { label: 'Health', onSelect: () => setOpen(false) }] },
          ]}
        />
      </>
    );
  },
};
