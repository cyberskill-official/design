import { Splitter } from '../components/data/Splitter.jsx';

export default {
  title: 'Components/Data/Splitter',
  component: Splitter,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "start": {
    "control": "object"
  },
  "end": {
    "control": "object"
  },
  "initial": {
    "control": "number"
  },
  "min": {
    "control": "number"
  },
  "max": {
    "control": "number"
  },
  "height": {
    "control": "number"
  },
  "lang": {
    "control": "text"
  }
},
};

export const Default = { render: (args) => (<Splitter {...args}><div style={{ padding: 12 }}>Left</div><div style={{ padding: 12 }}>Right</div></Splitter>) };

export const Matrix = {
  name: 'Matrix / Panes',
  render: () => (
    <div style={{ height: 160 }}>
      <Splitter>
        <div style={{ padding: 12 }}>Left</div>
        <div style={{ padding: 12 }}>Right</div>
      </Splitter>
    </div>
  ),
};
