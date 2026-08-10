import { TypingIndicator } from '../components/ai/TypingIndicator.jsx';

export default {
  title: 'Components/AI/TypingIndicator',
  component: TypingIndicator,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

  "label": {
    "control": "text"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting TypingIndicator. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { lang: 'vi',},
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Instances',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <TypingIndicator />
      <TypingIndicator />
    </div>
  ),
};
