import React from 'react';
import { CommandPalette } from '../components/navigation/CommandPalette.jsx';
import { Button } from '../components/button/Button.jsx';

export default {
  title: 'Components/Navigation/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
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
};

export const Default = { render: function C(args) { const [open, setOpen] = React.useState(true); return (<><Button onClick={() => setOpen(true)}>Open palette</Button><CommandPalette open={open} onClose={() => setOpen(false)} groups={[{ label: 'Navigate', items: [{ label: 'Go to Live', onSelect: () => setOpen(false) }, { label: 'Tokens', onSelect: () => setOpen(false) }] }]}  {...args}/></>); } };

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

// BEGIN GENERATED COMPONENT SCENARIO STORIES
import {renderComponentScenario, playComponentScenario} from "./_scenarios/renderer.jsx";
export const ScenarioCommandPaletteEmpty = {
  name: "CommandPalette: Empty collection",
  args: {
  "open": true,
  "groups": []
},
  render: args => renderComponentScenario("CommandPalette--empty",args),
  play: ({canvasElement}) => playComponentScenario("CommandPalette--empty",canvasElement),
};
// END GENERATED COMPONENT SCENARIO STORIES
