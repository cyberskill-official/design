import { Tour } from '../components/overlays/Tour.jsx';

export default {
  title: 'Components/Overlays/Tour',
  component: Tour,
  tags: ['autodocs'],
  argTypes: {
  "rootProps": {"control":"object","description":"Optional attributes for the documented existing DOM target; owned semantics and handlers remain protected.","table":{"category":"DOM targets"}},
  "steps": {
    "control": "object"
  },
  "open": {
    "control": "boolean"
  },
  "lang": {
    "control": "text"
  }
},
  args: { steps: [{ title: 'Welcome', content: 'Host Live hub.' }, { title: 'Axes', content: 'Theme × Element × Language × Style.' }], open: true },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Steps',
  render: (args) => (
    <Tour {...args} open steps={[{ title: 'One', content: 'First' }, { title: 'Two', content: 'Second' }]} />
  ),
};
