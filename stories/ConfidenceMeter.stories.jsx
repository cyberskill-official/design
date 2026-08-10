import { ConfidenceMeter } from '../components/ai/ConfidenceMeter.jsx';

export default {
  title: 'Components/AI/ConfidenceMeter',
  component: ConfidenceMeter,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en', 'vi'] },

  "value": {
    "control": "number"
  },
  "level": {
    "control": "select",
    "options": [
      "low",
      "medium",
      "high"
    ]
  },
  "segments": {
    "control": "number"
  },
  "label": {
    "control": "object"
  }
},
  parameters: {
    docs: {
      description: {
        component: 'Host Live CSF — Default plus honest control matrix mounting ConfidenceMeter. Portable consumers use styles.css + bundle, not Storybook.',
      },
    },
  },
  args: { lang: 'vi', value: 0.82, label: 'Confidence' },
};

export const Default = {};

export const Matrix = {
  name: 'Matrix / Values',
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      <ConfidenceMeter {...args} value={0.3} label="Low" />
      <ConfidenceMeter {...args} value={0.9} label="High" />
    </div>
  ),
};
