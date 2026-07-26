import { Tour } from '../components/overlays/Tour.jsx';

export default {
  title: 'Components/Overlays/Tour',
  component: Tour,
  tags: ['autodocs'],
  argTypes: {
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
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Tour. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
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
