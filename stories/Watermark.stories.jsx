import { Watermark } from '../components/data/Watermark.jsx';

export default {
  title: 'Components/Data/Watermark',
  component: Watermark,
  tags: ['autodocs'],
  args: { className: '' },
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "text": {
    "control": "text"
  },
  "opacity": {
    "control": "number"
  },
  "gap": {
    "control": "number"
  },
  "rotate": {
    "control": "number"
  }
},
};

export const Default = { render: (args) => (<Watermark text="CyberSkill" {...args}><div style={{ minHeight: 120, padding: 24 }}>Content under watermark</div></Watermark>) };

export const Matrix = {
  name: 'Matrix / Text',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Watermark text="CyberSkill"><div style={{ minHeight: 80, padding: 16 }}>A</div></Watermark>
      <Watermark text="DRAFT"><div style={{ minHeight: 80, padding: 16 }}>B</div></Watermark>
    </div>
  ),
};
