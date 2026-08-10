import { Steps } from '../components/navigation/Steps.jsx';

export default {
  title: 'Components/Navigation/Steps',
  component: Steps,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

  "steps": {
    "control": "object"
  },
  "current": {
    "control": "number"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting Steps. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { lang: 'vi', current: 1, steps: [{ title: 'Capture' }, { title: 'Build' }, { title: 'Ship' }] },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Current',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Steps {...args} current={0} steps={[{ title: 'Capture' }, { title: 'Build' }, { title: 'Ship' }]} />
      <Steps {...args} current={2} steps={[{ title: 'Capture' }, { title: 'Build' }, { title: 'Ship' }]} />
    </div>
  ),
};
