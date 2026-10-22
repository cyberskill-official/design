import { Accordion } from '../components/data/Accordion.jsx';

export default {
  title: 'Components/Data/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "items": {
    "control": "object"
  },
  "defaultOpen": {
    "control": "number"
  },
  "allowMultiple": {
    "control": "boolean"
  }
},
  args: { items: [{ title: 'What is a wish?', content: 'A clear outcome.' }, { title: 'Languages', content: 'EN · VI.' }], defaultOpen: 0 },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Multi',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Accordion {...args} items={[{ title: 'One', content: 'A' }]} defaultOpen={0} />
      <Accordion {...args} allowMultiple items={[{ title: 'One', content: 'A' }, { title: 'Two', content: 'B' }]} defaultOpen={[0]} />
    </div>
  ),
};
